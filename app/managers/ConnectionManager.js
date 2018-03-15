import { AsyncStorage } from 'react-native';

export default class ConnectionManagerClass {

    constructor() {

        this.authorizedUsersKeyName = 'authorizedUsers';
        this.lastUserIdKeyName = 'lastUserId';
    }
    
    getLastUserInfo = async () => {
        
        // Get the name of the user which was connected during last session
        const lastUserId = await this.getLastUserId();
        if (lastUserId && lastUserId.length > 0) {

            const authorizedUsers = await this.getAuthorizedUsers();

            // authorizedUsers is an array containint all authorized users
            // we should find the user which id is the current user 
            for (let userInfo of authorizedUsers) {

                if (userInfo.user.id == lastUserId) {
                    return userInfo;
                }
            }
        }

        return null;
    };
    
    updateAuthorizedUsersInfo = async (newUserInfo) => {

        // Set the current user id
        await this.setLastUserId(newUserInfo.user.id);

        var last = await this.getLastUserId();

        // Add the user info to the list or update it if it already exixts
        var prevAuthorizedUsers = await this.getAuthorizedUsers();
        var newAuthorizedUsers = null;

        if (prevAuthorizedUsers != null) {
            
            var newUser = true;
            newAuthorizedUsers = [];

            for (let userInfo of prevAuthorizedUsers) {

                if (newUser == true && userInfo.user.id == newUserInfo.user.id) {
                    newAuthorizedUsers.push(newUserInfo);
                    newUser = false;
                } else {
                    newAuthorizedUsers.push(userInfo);
                }
            }

            if (newUser) {
                newAuthorizedUsers.push(newUserInfo);
            }
        }

        if (newAuthorizedUsers == null) {
            // First user  
            newAuthorizedUsers = [ newUserInfo ];
        }
        
        await this.setAuthorizedUsers(newAuthorizedUsers);
    }

    getAuthorizedUsers = async () => {
        var json = await AsyncStorage.getItem(this.authorizedUsersKeyName);
        if (json) {
            try {
                return JSON.parse(json);
            } catch (e) {
                  // Invalid persisted json...
            }
        }
        return null;
    };

    setAuthorizedUsers = async (authorizedUsers) => {
        var serializedAuthorizedUsers = JSON.stringify(authorizedUsers);
        await AsyncStorage.setItem(this.authorizedUsersKeyName, serializedAuthorizedUsers);
    };

    setLastUserId = async (userId) => {
        await AsyncStorage.setItem(this.lastUserIdKeyName, userId);
    };

    getLastUserId = async () => {
        const lastUserId = await AsyncStorage.getItem(this.lastUserIdKeyName);
        return lastUserId;
    };
}