export default class UserManagerClass {

    constructor() {
        this._loadUsers();
        this.currentUserId = null;
    }

    setCurrentUser(userInfo, accessToken) {
        
        this.users.set(userInfo.id, userInfo);
        this.accessTokens.set(userInfo.id, accessToken);
        this.currentUserId = userInfo.id;
    }

    getCurrentUser() {
        return this.users.get(this.currentUserId);
    }

    getUserInfo(userId) {

        return this.users.get(userId);
    }

    getAccessToken(userId) {

        return this.accessTokens.get(userId);
    }

    _loadUsers() {
        this.users = new Map();
        this.accessTokens = new Map();
    }
}