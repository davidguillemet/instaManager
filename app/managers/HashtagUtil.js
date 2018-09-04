export default class HashtagUtil {

    constructor(store) {

        this.reduxStore = store;
    }

    getHashtags(catId) {

        if (catId) {
            
            const category = this.getCatFromId(catId);
            return category.hashtags.map(tagId => this.getTagFromId(tagId));

        } else {
            
            return this.reduxStore.getState().get('tags');
        }
    }

    getCategories() {

        return this.reduxStore.getState().get('categories');
    }

    getTagFromId(tagId) {

        return this.reduxStore.getState().get('tags').get(tagId);
    }

    getCatFromId(catId) {
        
        return this.reduxStore.getState().get('categories').get(catId);
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

}