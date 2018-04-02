import {
    TagCategorySchema,
    HashtagSchema
} from '../model/realmSchemas';

const Realm = require('realm');

const categorySchema = 'TagCategory';
const hashtagSchema = 'Hashtag';

export default class HashtagManagerClass {

    constructor() {
        this.realm = null;
    }

    open() {
        
        if (this.realm == null) {

            return Realm.open({
                schema: [
                    TagCategorySchema,
                    HashtagSchema
                ],
                path: 'hashTagInfo.realm',
                schemaVersion: 1
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
        //return this.realm.objects(hashtagSchema).sorted('name');
        return [
            { name: 'aquaticadigital' },
            { name: 'biganimals' },
            { name: 'camouflage' },
            { name: 'coral' },
            { name: 'coralreef' },
            { name: 'diving' },
            { name: 'dolphins' },
            { name: 'fish' },
            { name: 'macro' },
            { name: 'macrophotography' },
            { name: 'marinebiology' },
            { name: 'marinelife' },
            { name: 'mimetism' },
            { name: 'muckdive' },
            { name: 'muckdiving' },
            { name: 'naturephotography' },
            { name: 'nudibranch' },
            { name: 'nudibranchs' },
            { name: 'ocean' },
            { name: 'photooftheday' },
            { name: 'photosousmarine' },
            { name: 'picoftheday' },
            { name: 'plongée' },
            { name: 'scuba' },
            { name: 'scubadiving' },
            { name: 'sea' },
            { name: 'sealife' },
            { name: 'seaslug' },
            { name: 'seasnail' },
            { name: 'sharks' },
            { name: 'southafrica' },
            { name: 'supermacro' },
            { name: 'underwater' },
            { name: 'underwaterbeauty' },
            { name: 'underwatercritters' },
            { name: 'underwaterlandscape' },
            { name: 'underwaterlife' },
            { name: 'underwatermacro' },
            { name: 'underwaterphoto' },
            { name: 'underwaterphotography' },
            { name: 'underwaterwildlife' },
            { name: 'underwaterworld' },
            { name: 'uwcritters' },
            { name: 'uwmacrophotography' },
            { name: 'uwphoto' },
            { name: 'uwphotography' },
            { name: 'viesousmarine' },
            { name: 'wildlife' },
            { name: 'wildlifephotography' },
        ];
    }


}