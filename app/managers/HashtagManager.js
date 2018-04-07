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
                schemaVersion: 6,
                migration: (oldRealm, newRealm) => {
                    // only apply this change if upgrading to schemaVersion 1
                    if (oldRealm.schemaVersion < 5) {
                        const newCategories = newRealm.objects(categorySchema);
                
                        // loop through all objects and set the name property in the new schema
                        for (let i = 0; i < newCategories.length; i++) {
                            newCategories[i].id = global.uniqueID();
                        }

                        const newTags = newRealm.objects(hashtagSchema);
                
                        // loop through all objects and set the name property in the new schema
                        for (let i = 0; i < newTags.length; i++) {
                            newTags[i].id = global.uniqueID();
                        }
                    }
                }
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

    getCategories() {
        
        return this.open()
        .then(() => {

            let rootCategories = this._getRootCategories();
            let level = 0;
            let categories = [];

            for (let rootCategory of rootCategories) {

                categories.push({
                    id: rootCategory.id,
                    name: rootCategory.name,
                    parent: rootCategory.parent,
                    level: level 
                });

                this._getSubCategories(rootCategory, level + 1, categories);
            }

            return categories;
        });       
    }

    _getSubCategories(parentCategory, level, categories) {
        
        let subCategories = this.realm.objects(categorySchema).filtered('parent = $0', parentCategory.id).sorted('name');
        if (subCategories.length == 0) {
            return;
        }

        for (let subCategory of subCategories) {
            
            categories.push({
                id: subCategory.id,
                name: subCategory.name,
                parent: subCategory.parent,
                level: level
            });

            this._getSubCategories(subCategory, level + 1, categories);
        }
    }

    _getRootCategories() {
        return this.realm.objects(categorySchema).filtered('parent = null').sorted('name');
    }

    _getRealmTypeFromItemType(itemType) {
        return itemType === global.TAG_ITEM ? hashtagSchema : categorySchema;
    }

    searchItem(itemType, filter) {
        return this.realm.objects(this._getRealmTypeFromItemType(itemType)).filtered('name like $0', filter);
    }

    getItemFromId(itemType, itemId) {
        return this.realm.objectForPrimaryKey(this._getRealmTypeFromItemType(itemType), itemId);
    }

    saveCategory(category, update) {
        this.realm.write(() => {
            this.realm.create(categorySchema, { id: category.id, name: category.name, parent: category.parent }, update);
        });
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