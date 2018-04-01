import { GetWebServiceDelegate } from '../WebServiceDelegate';

export default class MediaListService extends GetWebServiceDelegate {
    
    // Graph API
    // {
    //   "data": [
    //     {
    //       "id": "17921031358110297"
    //     },
    //     ...
    //     {
    //       "id": "17924313319062598"
    //     }
    //   ],
    //   "paging": {
    //     "cursors": {
    //       "before": "QVFIUmxyVkdaVVoyZAUQ0N0JzV3ZAfTk1KU3ZAlNGJYZAzJjdS1pdlRWWThfNVRGcG5jZAUFmd1k5OTRWZAU5hQ0w3bXJGRG83Nk9rZAFo3Mnhab1hHY0hEemlKQTJn",
    //       "after": "QVFIUlhxa3pUbVBUTm1iWjM5RWFTa0NZAS2x5aUVDaFc4cDlYMkNLbVpHdHVjWENXbUhPTkVWMWpyUXNyT2ljazdHdFhVdlVxSGVfTXBWcURWZAXJ1TmNfZAGZA3"
    //     },
    //     "next": "https://graph.facebook.com/v2.12/17841404340538520/media?access_token=EAACFvZAOrOWUBAEgYOnDmXQILl97UKDudf7x6TXZBkdUMZAJpPTwMj3zOQbfemUV4zI1IuBDLZAbtTz413ctfyvbam2ZA1Hplx7yo5fKPD0FaCBZBawxxknR27fmQXlL3aQ3zmKHMSFQQ7w0XCKVAt09SaUZBZCaZBWEe9qkbQnZASkFh5hSDd760XSWWPYDw5RiFgbx05ZAK3Ix3bNBwNjjeiZC&pretty=0&limit=25&after=QVFIUlhxa3pUbVBUTm1iWjM5RWFTa0NZAS2x5aUVDaFc4cDlYMkNLbVpHdHVjWENXbUhPTkVWMWpyUXNyT2ljazdHdFhVdlVxSGVfTXBWcURWZAXJ1TmNfZAGZA3"
    //   }
    // }

    constructor(userId, next) {
        super();
        this.userId = userId;
        this.next = next;
    }

    getUrl() {
        return this.userId + '/media';
    }

    getParameters() {

        let parameters = new Map();
        parameters.set("limit", "50");

        if (this.next) {
            parameters.set("after", this.next);
        }

        return parameters;    
    }

} 