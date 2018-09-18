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

        this._getTagsFromStore().size;
    }

    getCatFromId(catId) {
        
        return this._getCategoriesFromStore().get(catId);
    }

    hasCat(catId) {
        
        return this._getCategoriesFromStore().has(catId);
    }

    getAncestorCategories(catId) {

        let ancestors = [];

        let parentCategoryId = catId;

        while (parentCategoryId != null) {

            const parentCategory = this.getCatFromId(parentCategoryId);
            ancestors.push(parentCategory);
            parentCategoryId = parentCategory.parent;
        }

        return ancestors;
    }

    searchItem(itemType, filter) {

        // TODO use the store instead of the persistence layer ?
        return global.hashtagPersistenceManager.searchItem(itemType, filter);
    }

    getItemTypeCaption(itemType) {
        
        switch (itemType) {
            case global.TAG_ITEM:
                return 'tag';
            case global.CATEGORY_ITEM:
                return 'category';
            case global.PUBLICATION_ITEM:
                return 'publication';
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

    _getTagsFromStore() {

        return this.reduxStore.getState().get('tags');
    }

    _getCategoriesFromStore() {

        return this.reduxStore.getState().get('categories');
    }
}