import { GetWebServiceDelegate } from '../WebServiceDelegate';

export default class UserService extends GetWebServiceDelegate {
    
    constructor(userId, callback) {
        super();
        // UserId might be a real Id or 'self'
        this.userId = userId;
        this.callback = callback;
    }

    getUrl() {
        return "users/" + this.userId;
    }

    onResponse(response) {
        // {
        //     "id": "1574083",
        //     "username": "snoopdogg",
        //     "full_name": "Snoop Dogg",
        //     "profile_picture": "http://distillery.s3.amazonaws.com/profiles/profile_1574083_75sq_1295469061.jpg",
        //     "bio": "This is my bio",
        //     "website": "http://snoopdogg.com",
        //     "is_business": false,
        //     "counts": {
        //         "media": 1320,
        //         "follows": 420,
        //         "followed_by": 3410
        //     }
        // }
        if (this.callback != null) {
            this.callback(response);
        }
    }
} 