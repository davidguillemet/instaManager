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

    getCategories() {
        
        return this.open()
        .then(() => {

            let rootCategories = this._getRootCategories();
            let categories = [];

            for (let rootCategory of rootCategories) {

                let catProxy = this._getCatProxyFromRealm(rootCategory, null, 0);
                categories.push(catProxy);
                this._getSubCategories(rootCategory, 1, categories);
            }

            return categories;
        });       
    }

    _getSubCategories(parentCategory, level, categories) {
        
        let subCategories = parentCategory.children.sorted('name');
        if (subCategories.length == 0) {
            return;
        }

        for (let subCategory of subCategories) {
            
            let catProxy = this._getCatProxyFromRealm(subCategory, parentCategory.id, level);
            categories.push(catProxy);
            this._getSubCategories(subCategory, level + 1, categories);
        }
    }

    _getCatProxyFromRealm(realmCat, parentId, level)
    {
        return {
            id: realmCat.id,
            name: realmCat.name,
            parent: parentId,
            level: level,
            hashtags: realmCat.hashtags.map((tag, index, array) => tag.id)
        }
    }

    _getRootCategories() {
        return this.realm.objects(categorySchema).filtered('parent = null').sorted('name');
    }

    _getRealmTypeFromItemType(itemType) {
        return itemType === global.TAG_ITEM ? hashtagSchema : categorySchema;
    }

    searchItem(itemType, filter) {
        return this.realm.objects(this._getRealmTypeFromItemType(itemType)).filtered('name like[c] $0', filter);
    }

    getItemFromId(itemType, itemId) {
        return this.realm.objectForPrimaryKey(this._getRealmTypeFromItemType(itemType), itemId);
    }

    getItemsFromId(itemType, identifiers) {
        let items = [];
        const realmItemType = this._getRealmTypeFromItemType(itemType);
        for (itemId of identifiers) {
            items.push(this.realm.objectForPrimaryKey(realmItemType, itemId));
        }
        return items;
    }

    saveTag(tag, update) {
    
        this.realm.write(() => {
            const parentCategories = tag.categories.map(catId => this.realm.objectForPrimaryKey(categorySchema, catId));
            this.realm.create(hashtagSchema, { id: tag.id, name: tag.name, categories: parentCategories }, update);
        });
    }

    deleteTag(tagId) {

        this.realm.write(() => {
            this.realm.delete(this.realm.objectForPrimaryKey(hashtagSchema, tagId));
        });
    }
    
    saveCategory(category, update) {

        this.realm.write(() => {
            let parent = null; 
            if (category.parent) {
                parent = this.realm.objectForPrimaryKey(categorySchema, category.parent);
            }

            // We cannot update hashtags here since this property is of type LinkingObjects
            let updatedCategory = this.realm.create(categorySchema, { id: category.id, name: category.name, parent: parent }, update);
        });
    }

    deleteCategory(categoryId) {
        
        this.realm.write(() => {
            let categoryToDelete = this.realm.objectForPrimaryKey(categorySchema, categoryId);
            this._internalDeleteCategory(categoryToDelete);
        });
        
    }

    _internalDeleteCategory(categoryToDelete) {
        // TODO : should we remove children categories ??
        // SO far, if we remove a category which contains children, these children
        // will move to hierarchy root... Why not?
        // -> or shouyld we introduce an option?
        this.realm.delete(categoryToDelete);
    }

    getHashtags(categoryId) {

        let tags =
            categoryId ?
            this.realm.objectForPrimaryKey(categorySchema, categoryId).hashtags :
            this.realm.objects(hashtagSchema).sorted('name');

        return tags.map((item, index, array) => {
            return {
                id: item.id,
                name: item.name,
                categories: item.categories.map((cat, index, array) => cat.id)
            }
        });
        /*return [
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
        ];*/
    }

    getAncestorCategoriesTagCount(catId) {

        let tagCount = 0;
        let parentCategory = this.realm.objectForPrimaryKey(categorySchema, catId);

        while (parentCategory != null) {
            
            tagCount += parentCategory.hashtags.length;
            parentCategory = parentCategory.parent;
        }

        return tagCount;
    }


}