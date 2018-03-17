import { AsyncStorage } from 'react-native';

export default class InstaFacadeClass {
    
    constructor() {
        this.lastUserInfo = 'lastUserInfo';
        this.config = {
            clientId: '9617d6b1d9ec403db0d97aa848fa81d5',
            redirectUri: 'http://localhost/callback',
            authorizationUrlPattern: 'https://api.instagram.com/oauth/authorize/?client_id={CLIENT-ID}&redirect_uri={REDIRECT-URI}&response_type=token&scope=public_content+follower_list',
            rootApiUrl: 'https://api.instagram.com/v1/'
        }
        this.currentAccessToken = null;
    }
    
    getAuthorizationUrl() {
        return this.config.authorizationUrlPattern
            .replace('{CLIENT-ID}', this.config.clientId)
            .replace('{REDIRECT-URI}', this.config.redirectUri);
    }

    openSession(accessToken) {
        this.currentAccessToken = accessToken;
    }

    isSessionOpen() {
        return this.currentAccessToken != null;
    }

    getCurrentSession() {
        return this.currentAccessToken;
    }
    
    getLastUserInfo = async () => {
        var lastUserInfo = await AsyncStorage.getItem(this.lastUserInfo);
        try {
            return JSON.parse(lastUserInfo);
        } catch (e) {
            return null;
        }
    };
    
    setLastUserInfo = async (userId, accessToken) => {
        var userInfo = {
            userId: userId,
            accessToken: accessToken
        };
        await AsyncStorage.setItem(this.lastUserInfo, JSON.stringify(userInfo));
    };
}


