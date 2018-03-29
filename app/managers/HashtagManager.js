import {
    TagCategorySchema,
    HashtagSchema
} from '../model/realmSchemas';

const categorySchema = 'TagCategory';
const hashtagSchema = 'Hashtag';

export default class HashtagManagerClass {

    constructor() {
        this.realm = null;
    }

    open() {
        
        if (this.relalm == null) {

            return Realm.open({
                schema: [
                    TagCategorySchema,
                    HashtagSchema
                ],
                path: 'hashTagInfo.realm'
            }).then(realm => {
                this.realm = realm;
            });
    
        } else {

            // The realm is already open, just return a promise which does nothing...
            return new Promise(
                function(resolve, reject) {
                    resolve();
                }
            );
        }

    }

    getHashtags() {
        return this.realm.objects(hashtagSchema).sorted('name');
    }


}