import { Clipboard } from 'react-native';

export default class HashtagUtil {

    constructor(store) {

        this.reduxStore = store;
    }

    getHashtags(catId) {

        if (catId) {
            
            const category = this.getCatFromId(catId);
            return category.hashtags.map(tagId => this.getTagFromId(tagId));

        } else {
            
            return this._getTagsFromStore();
        }
    }

    getCategories() {

        return this._getCategoriesFromStore();
    }

    getTagFromId(tagId) {

        return this._getTagsFromStore().get(tagId);
    }

    hasTag(tagId) {

        return this._getTagsFromStore().has(tagId);
    }
    
    getTagsCount() {

        return this._getTagsFromStore().size;
    }

    getCatFromId(catId) {
        
        return this._getCategoriesFromStore().get(catId);
    }

    hasCat(catId) {
        
        return this._getCategoriesFromStore().has(catId);
    }

    getPubFromId(pubId) {

        return this._getPublicationsFromStore().get(pubId);
    }

    getTotalPublicationsCount() {

        return global.hashtagPersistenceManager.getTotalPublicationsCount();
    }

    hasPub(pubId) {
        
        return this._getPublicationsFromStore().has(pubId);
    }

    getAncestorCategories(catId) {

        let ancestors = [];

        let parentCategoryId = catId;

        while (parentCategoryId != null) {

            const parentCategory = this.getCatFromId(parentCategoryId);
            ancestors.push(parentCategory);
            parentCategoryId = parentCategory.parent;
        }

        return ancestors.reverse(); // From root to leaf
    }

    searchItem(itemType, filter) {

        return global.hashtagPersistenceManager.searchItem(itemType, filter);
    }

    getItemTypeCaption(itemType) {
        
        switch (itemType) {
            case global.TAG_ITEM:
                return 'Tag';
            case global.CATEGORY_ITEM:
                return 'Category';
            case global.PUBLICATION_ITEM:
                return 'Publication';
            default:
                return '<unkonwn item type';
        }
    }

    getTagsFromText(text) {
        
        const tags = new Set();
        const invalidTags = new Set();

        const regex = new RegExp("(#?([^#\\s]+))", "g");

        while ((m = regex.exec(text)) !== null) {
            
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            // The tag itself, without '#' is the second group
            const newTag = m[2].toLowerCase();

            if (this.tagNameIsValid(newTag)) {
                tags.add(newTag);
            } else {
                invalidTags.add(newTag);
            }
        }

        return {
            tags: [...tags],
            errors: [...invalidTags] 
        };
    }

    tagNameIsValid(tagName) {

        const tagNameRegex = new RegExp("^[a-zA-Z]+[a-zA-Z0-9_]*$", "g");

        return tagNameRegex.test(tagName);
    }

    getTagNameRule() {

        return 'A tag can only contain a letter, a number or an underscore and must start by a letter.'
    }

    runControls() {

        const that = this;

        return new Promise(
            function(resolve, reject) {

                const errors = {
                    duplicates: [],
                    overflow: [] 
                };

                const rootCategories = that._getCategoriesFromStore().toList().filter(cat => cat.parent === null).map(cat => cat.id);
                that._runCategoriesControl(rootCategories, new Set(), errors);
                resolve(errors);
            }
        );
    }

    getTagObjectsFromTagIdentifiers(tagIdentifiers) {

        const that = this;

        const promise = new Promise(
            function (resolve, reject) {
                const tagObjects = tagIdentifiers.map(id => that.getTagFromId(id));
                resolve(tagObjects);
            }
        );

        return promise;
    }

    copyToClipboard(tagObjects) {

        const promise = new Promise(
            function(resolve, reject) {

                let tagsValue = '';

                tagObjects.forEach((tag) => {
        
                    if (tagsValue.length > 0) {
                        tagsValue += ' ';
                    }
                    tagsValue += '#' + tag.name;
                });
        
                let tagStream = global.settingsManager.getHeader()
                tagStream += tagsValue;
                tagStream += global.settingsManager.getFooter();
                Clipboard.setString(tagStream);
                
                resolve();
            }
        );

        return promise;
    }    

    _runCategoriesControl(categories /* Array */, inheritedTags /* Set */, errors /* Array */) {

        if (categories == null || categories.length == 0) {
            return;
        }

        for (let catId of categories) {

            const cat = this.getCatFromId(catId);

            // Add an error if:
            // - one of the tags from the current categorie exist in the inherited tags
            const duplicates = [];
            cat.hashtags.forEach(tagId => {
                if (inheritedTags.has(tagId)) {
                    duplicates.push(tagId);
                }
            });
            if (duplicates.length > 0) {
                this._addDuplicatedTagError(cat.id, duplicates, errors);
            }

            // - the consolidated number of tags (cat.hashtags + inheritedT.ags) exceeds the maximum number of tags
            const categoryTagsCount = cat.hashtags.length - duplicates.length;
            const consolidatedTagsCount = (inheritedTags ? inheritedTags.size : 0) + categoryTagsCount;
            if (consolidatedTagsCount > global.settingsManager.getMaxNumberOfTags()) {
                this._addOverflowError(cat.id, consolidatedTagsCount, errors);
            }

            const catConsolidatedTags = new Set([...inheritedTags, ...cat.hashtags]);

            this._runCategoriesControl(cat.children, catConsolidatedTags, errors);
        }
    }

    _addDuplicatedTagError(catId, duplicates, errors) {
        errors.duplicates.push({
            category: catId,
            duplicates: duplicates
        });
    }

    _addOverflowError(catId, count, errors) {
        errors.overflow.push({
            category: catId,
            count: count
        });
    }

    _getTagsFromStore() {

        return this.reduxStore.getState().get('tags');
    }

    _getCategoriesFromStore() {

        return this.reduxStore.getState().get('categories');
    }

    _getPublicationsFromStore() {

        return this.reduxStore.getState().get('publications');
    } 
}