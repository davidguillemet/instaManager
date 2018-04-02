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
        this.currentSession = null;
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

    openSession(userId, accessToken) {
        this.currentSession = {
            userId: userId,
            accessToken: accessToken
        };
        this.storeUserInfo(accessToken);
    }

    closeCurrentSession() {
        this.currentSession = null;
        this.removeLastUserInfo();
    }

    isSessionOpen() {
        return this.currentSession != null;
    }

    getUserId() {
        return this.currentSession.userId;
    }

    getAccessToken() {
        return this.currentSession.accessToken;
    }
    
    restoreLastUserInfo = async () => {
        //const lastUserInfoSerialized = await AsyncStorage.getItem(this.lastUserInfo);
        try {
            let lastUserInfo = {
                userId: "17841404340538520",
                accessToken: "EAACFvZAOrOWUBAFrO9ugcSUZAZCZCdn7xMVuFIBQ3UWVzUD8rJKknGrUJELi4WXdNnWpXVYqdYEezlnRBUH5Itz3HyExrPcuihK2Biv7x9VNwzxLc4YdAH68fW3uZBvu1ZAKCC1CpgYbXWRGhvPd1rgsGfCqe8ZCkRp0K683dRnt13LGYIg9hgVSBjZAg7YJu9DXFZAoDkyMqZAZAN1WK8aS27q"
            };
            this.currentSession = lastUserInfo;
        } catch (e) {
            // invalid serialized info. we will just start as unconnected
        }
    };
    
    storeUserInfo = async () => {
        let userInfoSerialized = JSON.stringify(his.currentSession);
        await AsyncStorage.setItem(this.lastUserInfo, userInfoSerialized);
    }

    removeLastUserInfo = async () => {
        await AsyncStorage.removeItem(this.lastUserInfo);
    }
}


