class InstaFacadeClass {
    
    constructor() {
        this.instaConfig = {
            clientId: '9617d6b1d9ec403db0d97aa848fa81d5',
            clientSecret:'2802dfc11bbb4065982ab888913ddaec',
            redirectUri: 'http://localhost/callback',
            authorizationUrlPattern: 'https://api.instagram.com/oauth/authorize/?client_id={CLIENT-ID}&redirect_uri={REDIRECT-URI}&response_type=code',
            accessTokenUri: 'https://api.instagram.com/oauth/access_token'
        }
    }
    
    getAuthorizationUrl() {
        return this.instaConfig.authorizationUrlPattern
            .replace('{CLIENT-ID}', this.instaConfig.clientId)
            .replace('{REDIRECT-URI}', this.instaConfig.redirectUri);
    }
}

export default InstaFacade = new InstaFacadeClass();


