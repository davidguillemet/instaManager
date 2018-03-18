import { AsyncStorage } from 'react-native';

export default class InstaFacadeClass {
    
    constructor() {
        this.lastUserInfo = 'lastUserInfo';
        this.config = {
            clientId: '9617d6b1d9ec403db0d97aa848fa81d5',
            redirectUri: 'http://localhost/callback',
            authorizationUrlPattern: 'https://api.instagram.com/oauth/authorize/?client_id={CLIENT-ID}&redirect_uri={REDIRECT-URI}&response_type=token',
            rootApiUrl: 'https://api.instagram.com/v1/',
            scopes: [
                'public_content',
                'follower_list',
                'comments',
                'relationships',
                'likes'
            ]
        }
        this.currentAccessToken = null;
    }
    
    getAuthorizationUrl() {
        // Init client id and redirect url
        let authUrl = this.config.authorizationUrlPattern
            .replace('{CLIENT-ID}', this.config.clientId)
            .replace('{REDIRECT-URI}', this.config.redirectUri);
        // Add mandatory scopes
        authUrl += "&scope=" + this.config.scopes.join('+');
        return authUrl;
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
        const lastUserInfo = await AsyncStorage.getItem(this.lastUserInfo);
        try {
            return JSON.parse(lastUserInfo);
        } catch (e) {
            return null;
        }
    };
    
    setLastUserInfo = async (userId, accessToken) => {
        const userInfo = {
            userId: userId,
            accessToken: accessToken
        };
        await AsyncStorage.setItem(this.lastUserInfo, JSON.stringify(userInfo));
    };
}


