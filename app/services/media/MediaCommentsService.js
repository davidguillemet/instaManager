import { GetWebServiceDelegate } from '../WebServiceDelegate';

export default class MediaCommentsService extends GetWebServiceDelegate {
    
    // Graph API
    // {
    //     "comments": {
    //       "data": [
    //         {
    //           "text": "Wow, very nice capture ❤",
    //           "user": {
    //             "id": "17841404355985230"
    //           },
    //           "id": "17875581952203196"
    //         },
    //         {
    //           "text": ".
    //   .
    //   .
    //   .
    //   .
    //   #picoftheday #diving #scubadiving #plongée #ocean #sea #aquaticadigital #underwater #underwaterlife #underwaterworld #underwaterphoto #uwphotography #underwaterphotography #uwphoto #sealife #marinelife #marinebiology
    //   #naturephotography #photosousmarine #viesousmarine #underwaterbeauty #uwcritters #underwatercritters
    //   #macro #uwmacrophotography #macrophotography #underwatermacro
    //   #supermacro #eggs #jawfish",
    //           "user": {
    //             "id": "17841404340538520"
    //           },
    //           "id": "17934603532060885"
    //         }
    //       ]
    //     },
    //     "caption": "Yellowbarred Jawfish (Opistognathus randalli). ..... Tulamben, Bali, October 2015",
    //     "id": "17921031358110297"
    //   }

      
    constructor(mediaId) {

        super();
        this.mediaId = mediaId;
    }

    getUrl() {

        return this.mediaId;
    }

    getParameters() {

        let parameters = new Map();
        parameters.set("fields", "comments{text,user},caption");
        return parameters;    
    }

} 