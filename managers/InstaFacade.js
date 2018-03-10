import {
    Alert
  } from 'react-native';

class InstaFacadeClass {
    
    constructor() {
        this.config = {
            clientId: '9617d6b1d9ec403db0d97aa848fa81d5',
            clientSecret:'2802dfc11bbb4065982ab888913ddaec',
            redirectUri: 'http://localhost/callback',
            authorizationUrlPattern: 'https://api.instagram.com/oauth/authorize/?client_id={CLIENT-ID}&redirect_uri={REDIRECT-URI}&response_type=code',
            accessTokenUri: 'https://api.instagram.com/oauth/access_token'
        }
        // {
        //   "access_token": "fb2e77d.47a0479900504cb3ab4a1f626d174d2d",
        //   "user": {
        //       "id": "1574083",
        //       "username": "snoopdogg",
        //       "full_name": "Snoop Dogg",
        //       "profile_picture": "...
        //       "bio": "....",
        //       "website": "....",
        //       "is_business": true|false
        //   }
        // }
        this.authToken = null;
    }
    
    getAuthorizationUrl() {
        return this.config.authorizationUrlPattern
            .replace('{CLIENT-ID}', this.config.clientId)
            .replace('{REDIRECT-URI}', this.config.redirectUri);
    }

    openSession(authToken) {
        this.authToken = authToken;
    }

    isSessionOpen() {
        return this.authToken != null;
    }

    getUserName() {
        if (!this.isSessionOpen()) {
            return '';
        }
        return this.authToken.user.full_name;
    }
}

export default InstaFacade = new InstaFacadeClass();


