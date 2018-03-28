import { GetWebServiceDelegate } from '../WebServiceDelegate';

export default class UserService extends GetWebServiceDelegate {
    
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

    // Graph API
    // {
    //     "followers_count": 908,
    //     "follows_count": 545,
    //     "media_count": 109,
    //     "username": "david.guillemet",
    //     "name": "David Guillemet",
    //     "profile_picture_url": "https://scontent.xx.fbcdn.net/v/t51.2885-9/15875659_158933067928808_3072234512495673344_a.jpg?_nc_cat=0&oh=92f4b715ff930673f525045e16eb3954&oe=5B7194DB",
    //     "biography": "my bio",
    //     "website": "http://www.davidphotosub.com/",
    //     "id": "17841404340538520"
    //   }

    constructor(userId) {
        super();
        this.userId = userId;
    }

    getUrl() {
        return this.userId;
    }

    getParameters() {
        let parameters = new Map();
        parameters.set("fields", "followers_count,follows_count,media_count,username,name,profile_picture_url,biography,website");
        return parameters;
    }

} 