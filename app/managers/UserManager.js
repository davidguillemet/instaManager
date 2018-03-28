import {
    RelatedUsersInfoSchema,
    FollowersSchema,
    FollowingsSchema,
    FollowersHistorySchema,
    FollowingsHistorySchema
} from '../model/realmSchemas';

import { Alert } from 'react-native';

import FollowerService from '../services/users/FollowerService';
import FollowingService from '../services/users/FollowingService';

const userSchema = 'User';
const historySchema = 'History';
const monthValues = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

export default class UserManagerClass {

    constructor() {
        this.currentUserId = null;
        this.realm = null;
        this.relatedRealm = null;
    }

    setRealm(realm) {
        this.realm = realm;
    }

    setCurrentUser(newUserInfo) {
        
        // Check if the user already exists:
        this.realm.write(() => {
            
            // newUserInfo is fresh from instgram Graph API
            // Graph API
            // {
            //     "followers_count": 908,
            //     "follows_count": 545,
            //     "media_count": 109,
            //     "username": "david.guillemet",
            //     "name": "David Guillemet",
            //     "profile_picture_url": "https://scontent.xx.fbcdn.net/v/t51.2885-9/15875659_158933067928808_3072234512495673344_a.jpg?_nc_cat=0&oh=92f4b715ff930673f525045e16eb3954&oe=5B7194DB",
            //     "biography": "my bio",
            //     "website": "http://www.davidphotosub.com/",
            //     "id": "17841404340538520"
            //   }

            // -> create/update realm object from this user info ref
            // -> field name are the same, except counts which arenot embedded in count object for realm
            let newUser = {
                id: newUserInfo.id,
                accessToken: global.instaFacade.getAccessToken(),
                username: newUserInfo.username,
                full_name: newUserInfo.name,
                profile_picture: newUserInfo.profile_picture_url,
                bio: newUserInfo.biography,
                website: newUserInfo.website,
                is_business: true, // so far, only business accounts are accessible
                media: newUserInfo.media_count,
                follows: newUserInfo.follows_count,
                followed_by: newUserInfo.followers_count
            };

            // Get the user from realm if it already exists
            let prevUser = this.realm.objectForPrimaryKey(userSchema, newUserInfo.id);
            if (prevUser) {
                // The user already exists
                // -> update previous counts
                newUser.prev_media = prevUser.media;
                newUser.prev_follows = prevUser.follows;
                newUser.prev_followed_by = prevUser.followed_by;
            }

            this.realm.create(userSchema, newUser, true /* update if needed */);

            this.updateHistory(newUserInfo);
        });

        this.currentUserId = newUserInfo.id;
    }

    updateHistory(userInfo) {

        const today = this.getToday();
        
        let historyEntriesForToday = this.realm.objects(historySchema)
        .filtered('userId = $0 and date = $1', userInfo.id, today);

        if (historyEntriesForToday.length == 0) {

            // History for today does not exist yet, create a new one from scratch
            const historyEntryForToday = {
                userId: userInfo.id,
                date: today,
                media: userInfo.media_count,
                follows: userInfo.follows_count,
                followed_by: userInfo.followers_count
            };

            this.realm.create(historySchema, historyEntryForToday);

        } else {

            // just Update the history for today
            // -> we shall have only one entry in the list (one entry per day)
            historyEntryForToday = historyEntriesForToday[0];
            historyEntryForToday.media = userInfo.media_count;
            historyEntryForToday.follows = userInfo.follows_count;
            historyEntryForToday.followed_by = userInfo.followers_count;
        }            
    }

    getToday() {
        let today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        return today;
    }

    openRelatedRealm() {

        return Realm.open({
            schema: [
                RelatedUsersInfoSchema,
                FollowersSchema,
                FollowingsSchema,
                FollowersHistorySchema,
                FollowingsHistorySchema
            ],
            path: 'relatedUsersInfo.realm'
        }).then(realm => {
            this.relatedRealm = realm;
        });
    }

    /**
     * Asynchronous method to update followers, including lost and new
     * Returns a Promise
     */
    updateFollowers() {

        const followerService = new FollowerService('self');
        return global.serviceManager.invoke(followerService)
        .then((actualFollowers) => {
            
            // We have now our actual followers
            // Get previous followers from realm
            const prevFollowers = this.relatedRealm.objectForPrimaryKey('Followers', this.currentUserId);

            // And extract the difference:
            this.extractAndUpdateRelatedDifference(actualFollowers, prevFollowers, 'Followers', 'FollowersHistory');
        });
    }

    updateFollowings() {

        const followingService = new FollowingService('self');
        return global.serviceManager.invoke(followingService)
        .then((actualFollowings) => {
            
            // We have now our actual followings
            // Get previous followings from realm
            const prevFollowings = this.relatedRealm.objectForPrimaryKey('Followings', this.currentUserId);

            // And extract the difference:
            this.extractAndUpdateRelatedDifference(actualFollowings, prevFollowings, 'Followings', 'FollowingsHistory');
        });
    }
    
    /**
     * 
     * @param {*} newRelated is alist of users from instagram api like { "username": "xx", "profile_picture": "xxx", "full_name": "xx", "id": "xx" }
     * @param {*} prevRelated is a realm object like { "id": "xxx", "users": [list of user identifiers] }
     */
    extractAndUpdateRelatedDifference(actualRelatedList, prevRelatedList, relatedSchemaName, relatedHistorySchemaName) {
        
        // Build a hash set from the list of previous related identifiers
        const prevRelatedSet = prevRelatedList ? new Set(prevRelatedList.users) : new Set();
        
        // Browse actual related to extract new related
        // -> and build a set containing actual related identifiers in the same time
        let actualRelatedSet = new Set();
        let newRelatedList = [];
        if (actualRelatedList) {
            for (let actualRelated of actualRelatedList) {

                // populate the hash set with the current actual related
                actualRelatedSet.add(actualRelated.id);

                // If the actual related is not part of the previous related, it is a new one !
                if (!prevRelatedSet.has(actualRelated.id)) {
                    newRelatedList.push(actualRelated);
                }
            }
        }
        
        // Browse previous related to extract lost related
        // -> prevRelatedList might be 
        let lostRelatedList = [];
        if (prevRelatedList) {
            for (let prevRelated of prevRelatedList.users) {

                // If the current former related is not part of the actual related, it has been lost !
                if (!actualRelatedSet.has(prevRelated)) {
                    lostRelatedList.push(prevRelated);
                }
            }
        }

        // Now we have two lists of user identifiers:
        // -> new related and lost related
        // -> update the related history schema
        // -> add new users if needed
        this.relatedRealm.write(() => {

            // Update the actual related schema
            const userRelatedEntry = {
                userId: this.currentUserId,
                users: [...actualRelatedSet]
            };
            
            // TODO
            //this.relatedRealm.create(relatedSchemaName, userRelatedEntry, true /* update */);

            // add/update a new history entry in the related history schema
            const today = this.formatDate(new Date());
            let historyEntryForToday = this.relatedRealm.objectForPrimaryKey(relatedHistorySchemaName, today);
            if (!historyEntryForToday) {

                // History for today does not exist yet, create a new one from scratch
                historyEntryForToday = {
                    userId: this.currentUserId,
                    lostUsers: lostRelatedList,
                    newUsers: newRelatedList,
                    date: today
                };

                // TODO
                //this.relatedRealm.create(relatedHistorySchemaName, historyEntryForToday);

            } else {

                // Update the lost and win lists...
                let updatedHistoryEntries = this.consolidateLostAndNewRelated(
                    historyEntryForToday.newUsers, historyEntryForToday.lostUsers, newRelatedList, lostRelatedList);
                
                historyEntryForToday.newUsers = updatedHistoryEntries.newUsers;
                historyEntryForToday.lostUsers = updatedHistoryEntries.lostUsers;
            }            

            // Make sure to add short info about new users in the related user info schema
            for (let newRelatedUser of actualRelatedList) {
                // The realm schema is the same as the object from the instagram API...
                // TODO
                //this.relatedRealm.create('RelatedUsersInfo', newRelatedUser, true /* Update possible */);
            }
        });
    }

    consolidateLostAndNewRelated(prevNewRelatedList, prevLostRelatedList, actualNewRelatedList, actualLostRelatedList) {

        // Build a set from former new and lost related from realm
        let prevNewRelatedSet = new Set(prevNewRelatedList);
        let prevLostRelatedSet = new Set(prevLostRelatedList);

        let actualLostRelatedSet = new Set(actualLostRelatedList);
        let actualNewRelatedSet = new Set(actualNewRelatedList);

        // Create two new lists:
        let consolidatedNewRelatedList = [];
        let consolidatedLostRelatedList = [];

        // 1. browse previous new related and consider only those which are not lost now
        for (let prevNewRelatedId of prevNewRelatedList) {
            if (!actualLostRelatedSet.has(prevNewRelatedId)){
                consolidatedNewRelatedList.push(prevNewRelatedId);
            }
        }
        // 2. browse actual new related and consider only those which were not previously lost
        for (let actuelNewRelated of actualNewRelatedList) {
            if (!prevLostRelatedSet.has(actuelNewRelated)) {
                consolidatedNewRelatedList.push(actuelNewRelated);
            }
        }

        // 3. browse previous lost related and consider only those which are not new now
        for (let prevLostRelatedId of prevLostRelatedList) {
            if (!actualNewRelatedSet.has(prevLostRelatedId)) {
                consolidatedLostRelatedList.push(prevLostRelatedId);
            }
        }

        // 4. browse actual lost related and consider only those which were not previously new
        for (let actualLostRelatedId of actualLostRelatedList) {
            if (!prevNewRelatedSet.has(actualLostRelatedId)) {
                consolidatedLostRelatedList.push(actualLostRelatedId);
            }
        }

        return {
            newUsers: consolidatedNewRelatedList,
            lostUsers: consolidatedLostRelatedList
        };
    }

    formatDate(date) {
      
        const dayOfMonth = date.getDate(); // Day of month
        const monthIndex = date.getMonth(); // index of month (0 is January)
        const year = date.getFullYear();
      
        let dayAsString = dayOfMonth < 10 ? '0' + dayOfMonth : '' + dayOfMonth;
        return dayAsString + monthValues[monthIndex] + year;
      }

    getCurrentUser() {

        return this.getUserInfo(this.currentUserId);
    }

    getUserInfo(userId) {

        return this.realm.objectForPrimaryKey(userSchema, userId);
    }

    getNewFollowersForToday() {

        const historyEntryForToday = this.relatedRealm.objectForPrimaryKey('FollowersHistory', this.formatDate(new Date()));
        if (historyEntryForToday) {
            return historyEntryForToday.newUsers.size;
        }

        return 0;
    }

    getNewFollowingsForToday() {

        const historyEntryForToday = this.relatedRealm.objectForPrimaryKey('FollowingsHistory', this.formatDate(new Date()));
        if (historyEntryForToday) {
            return historyEntryForToday.newUsers.size;
        }

        return 0;
    }
}