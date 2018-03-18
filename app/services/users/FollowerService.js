import { GetWebServiceDelegate } from '../WebServiceDelegate';

export default class FollowerService extends GetWebServiceDelegate {
    
    constructor(userId, callback) {
        super();
        // UserId might be a real Id or 'self'
        this.userId = userId;
        this.callback = callback;
    }

    getUrl() {
        return "users/" + this.userId + "/followed-by";
    }

    onResponse(response) {
        // {
        //     "data": [{
        //         "username": "kevin",
        //         "profile_picture": "http://images.ak.instagram.com/profiles/profile_3_75sq_1325536697.jpg",
        //         "full_name": "Kevin Systrom",
        //         "id": "3"
        //     },
        //     {
        //         "username": "instagram",
        //         "profile_picture": "http://images.ak.instagram.com/profiles/profile_25025320_75sq_1340929272.jpg",
        //         "full_name": "Instagram",
        //         "id": "25025320"
        //     }]
        // }
        if (this.callback != null) {
            this.callback(response);
        }
    }
} 