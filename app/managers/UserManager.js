const userType = 'User';

export default class UserManagerClass {

    constructor() {
        this.currentUserId = null;
        this.realm = null;
    }

    setRealm(realm) {
        this.realm = realm;
    }

    setCurrentUser(newUserInfo, accessToken) {
        
        // Check if the user already exists:
        this.realm.write(() => {
            
            // newUserInfo is fresh from instgram API
            // -> create/update realm object from this user info ref
            // -> field name are the same, except counts which arenot embedded in count object for realm
            let newUser = {
                id: newUserInfo.id,
                accessToken: accessToken,
                username: newUserInfo.username,
                full_name: newUserInfo.full_name,
                profile_picture: newUserInfo.profile_picture,
                bio: newUserInfo.bio,
                website: newUserInfo.website,
                is_business: newUserInfo.is_business,
                media: newUserInfo.counts.media,
                follows: newUserInfo.counts.follows,
                followed_by: newUserInfo.counts.followed_by
            };

            // Get the user from realm if it already exists
            let prevUser = this.realm.objectForPrimaryKey(userType, newUserInfo.id);
            if (prevUser) {
                // The user already exists
                // -> update previous counts
                newUser.prev_media = prevUser.media;
                newUser.prev_follows = prevUser.follows;
                newUser.prev_followed_by = prevUser.followed_by;
            }

            this.realm.create(userType, newUser, true /* update if needed */);
        });

        this.currentUserId = newUserInfo.id;
    }

    getCurrentUser() {
        return this.getUserInfo(this.currentUserId);
    }

    getUserInfo(userId) {

        return this.realm.objectForPrimaryKey(userType, userId);
    }
}