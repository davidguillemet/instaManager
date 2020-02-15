import {
    PublicationSchema,
    TagCategorySchema,
    HashtagSchema,
    MediaCountSchema,
    ProfileSchema
} from '../model/hashtagSchemas';

import Utils from './Utils';

const Realm = require('realm');

const categorySchema = 'TagCategory';
const hashtagSchema = 'Hashtag';
const publicationSchema = 'Publication';
const profileSchema = 'Profile';

export default class HashtagPersistenceManagerClass {

    constructor() {
        this.realm = null;
    }

    open() {
        
        if (this.realm == null) {

            return Realm.open({
                schema: [
                    ProfileSchema,
                    TagCategorySchema,
                    HashtagSchema,
                    PublicationSchema,
                    MediaCountSchema
                ],
                path: 'hashTagInfo.realm',
                schemaVersion: 4,
                migration: (oldRealm, newRealm) => {
                    if (oldRealm.schemaVersion < 4) {
                    }
                }
            }).then(realm => {
                // Create main profile if it does not exist yet
                const mainProfile = realm.objectForPrimaryKey(profileSchema, global.MAIN_PROFILE_ID);
                if (mainProfile == null) {
                    realm.write(() => {
                        // We create the main profile and migrate all entities here since
                        // it seems crrating an entity (main profile) during migration fails...
                        const mainProfile = realm.create(profileSchema, {id: global.MAIN_PROFILE_ID, name: 'main', description: 'Main profile'});
                        // attach all objects to this main profile
                        // - Categories
                        const newCategories = realm.objects(categorySchema);
                        for (let i = 0; i < newCategories.length; i++) {
                            newCategories[i].profile = mainProfile;
                        }
                        // - Tags
                        const newTags = realm.objects(hashtagSchema);
                        for (let i = 0; i < newTags.length; i++) {
                            newTags[i].profile = mainProfile;
                        }
                        // - Publications
                        const newPublications = realm.objects(publicationSchema);
                        for (let i = 0; i < newPublications.length; i++) {
                            newPublications[i].profile = mainProfile;
                        }
                    });
                }
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

    getProfiles() {

        return this.open()
        .then(() => {

            let profiles = this.realm.objects(profileSchema);

            const activeProfile = this.realm.objectForPrimaryKey(profileSchema, global.settingsManager.getActiveProfile());
            if (activeProfile == null) {
                global.settingsManager.setActiveProfile(global.MAIN_PROFILE_ID);
            }

            return profiles.map((item, index, array) => {
                return this._getProfileProxyFromRealm(item);
            });
        });       
    }
    
    getActiveProfile() {
        return this._getProfileProxyFromRealm(this._getActiveProfileRealmItem());
    }

    getCategories() {
        
        const activeProfile = this._getActiveProfileRealmItem();
        const categories = activeProfile.categories;

        return categories.map((item, index, array) => {
            return this._getCatProxyFromRealm(item);
        });
    }

    getHashtags() {

        const activeProfile = this._getActiveProfileRealmItem();
        let tags = activeProfile.tags.sorted('name');

        return tags.map((item, index, array) => {
            return this._getTagProxyFromRealm(item);
        });
    }

    getPublications() {

        const publicationFilter = global.settingsManager.getPublicationFilter();

        const activeProfile = this._getActiveProfileRealmItem();

        let publications = activeProfile.publications;
        if (publicationFilter.type != 'all') {
            publications = publications.filtered('creationDate > $0', Utils.getPivotDate(publicationFilter));
        }

        return publications.map(item => {
            return this._getPubProxyFromRealm(item);
        });
    }

    getPublicationFromId(pubId) {
        return this.realm.objectForPrimaryKey(publicationSchema, pubId);
    }

    getTotalPublicationsCount() {
        return this._getActiveProfileRealmItem().publications.length;
    }

    saveProfile(profile, update) {

        let updatedProfile = null;

        this.realm.write(() => {
            updatedProfile = this.realm.create(profileSchema, { id: profile.id, name: profile.name, description: profile.description }, update);
        });

        return this._getProfileProxyFromRealm(updatedProfile);
    }

    saveTag(tag, update) {
    
        let updatedCats = [];
        let updatedTag = null;

        this.realm.write(() => {
            let prevCategories = null;
            let newCategories = null;
            if (update) {
                // updaten, then we might have previous categories
                const prevRealmTag = this.realm.objectForPrimaryKey(hashtagSchema, tag.id);
                const prevRealmCats = prevRealmTag.categories;
                prevCategories = new Set(prevRealmCats.map(item => item.id));
            }

            newCategories = new Set(tag.categories);
            
            // Create/Update the tag first
            const parentCategories = tag.categories.map(catId => this.realm.objectForPrimaryKey(categorySchema, catId));
            const realmTag = {
                id: tag.id,
                name: tag.name,
                profile: this._getActiveProfileRealmItem(),
                categories: parentCategories
            };
            updatedTag = this.realm.create(hashtagSchema, realmTag, update);

            // Categories to modify are catgories which are not in both prev and new sets
            let categoriesToUpdate = this._getSetDifferences(prevCategories, newCategories);
            updatedCats = categoriesToUpdate.
                map(catId => this.realm.objectForPrimaryKey(categorySchema, catId)).
                map(realmCat => this._getCatProxyFromRealm(realmCat));
        });

        return {
            updatedTags: [ this._getTagProxyFromRealm(updatedTag) ],
            updatedCats: [ ...updatedCats ]
        }

    }

    updateTagMediaCount(tagId, mediaCount) {

        this.realm.write(() => {
            const tag = this.realm.objectForPrimaryKey(hashtagSchema, tagId);
            tag.mediaCount = mediaCount;
        });
    }

    deleteProfile(profileId) {

        this.realm.write(() => {
            const profileDelete = this.realm.objectForPrimaryKey(profileSchema, profileId);
            if (profileDelete.categories.length == 0 &&
                profileDelete.tags.length == 0 &&
                profileDelete.publications.length == 0) {
                this.realm.delete(profileDelete);
            } else {
                throw Error(`The profile '${profileDelete.name}' is not empty and cannot be deleted`);
            }
        });
    }

    deleteTag(tagId) {

        let updatedCats = [];

        this.realm.write(() => {

            // Get the realm tag to delete
            const tagtoDelete = this.realm.objectForPrimaryKey(hashtagSchema, tagId);
            // and the parent categories before deleting it
            const parentCategories = tagtoDelete.categories.map(realmCat => realmCat.id);

            this.realm.delete(tagtoDelete);

            // once the tag has been deleted, parent have been updated and
            // we can build an array containing updated categories
            updatedCats = parentCategories.map(catId => this._getCatProxyFromRealm(this.realm.objectForPrimaryKey(categorySchema, catId)));
        });

        return {
            updatedCats: updatedCats,
            deletedTags: [ tagId ]
        }
    }
    
    saveCategory(categoryToSave, update) {

        // maintain a list of modified tags tp create the redux action with all updated objects (category + possible tags)
        let updatedTags = [];
        let updatedCats = [];
        let updatedPubs = [];

        this.realm.write(() => {
            let parent = null; 
            if (categoryToSave.parent) {
                parent = this.realm.objectForPrimaryKey(categorySchema, categoryToSave.parent);
            }

            const previousCategory = update ? this.realm.objectForPrimaryKey(categorySchema, categoryToSave.id) : null;
            const prevParentId = previousCategory && previousCategory.parent ? previousCategory.parent.id : null;

            // update publications if needed
            if (update && previousCategory.name !== categoryToSave.name) {
                const publicationsToUpdate = previousCategory.publications;
                for (let publication of publicationsToUpdate) {
                    publication.categoryName = categoryToSave.name;
                    updatedPubs.push(this._getPubProxyFromRealm(publication));
                }
            }

            const realmCategory = {
                id: categoryToSave.id,
                name: categoryToSave.name,
                parent: parent,
                profile: this._getActiveProfileRealmItem()
            }

            // We cannot update hashtags here since this property is of type LinkingObjects
            let updatedCategory = this.realm.create(categorySchema, realmCategory, update);

            // add previous parent and new parent in the updated cats if it has changed
            if (prevParentId != categoryToSave.parent) {
                if (prevParentId) {
                    const prevRealmParent = this.realm.objectForPrimaryKey(categorySchema, prevParentId);
                    updatedCats.push(this._getCatProxyFromRealm(prevRealmParent));
                }
                if (categoryToSave.parent) {
                    updatedCats.push(this._getCatProxyFromRealm(updatedCategory.parent));
                }
            }

            // Update hashtags (we cannot manipulate linkingObjects directly...)
            // 1. Get the previous hashtags directly from the category itself since LinkingObjects cannot be updated directly
            let prevHashTags = update ? updatedCategory.hashtags.map(tag => tag.id) : [];

            // 1. Make sure all tags from the updated category includes this category in the categories array property
            let newHashtags = new Set(categoryToSave.hashtags);
            for (let newHashtag of categoryToSave.hashtags) {
                let realmHashtag = this.realm.objectForPrimaryKey(hashtagSchema, newHashtag);
                let newHashtagCategories = realmHashtag.categories.reduce((set, cat) => { set.add(cat.id); return set; }, new Set());
                if (!newHashtagCategories.has(categoryToSave.id)) {
                    // add the updated category in the categories list for the current tag
                    const tagParentCategories = [...newHashtagCategories, categoryToSave.id].map(catId => this.realm.objectForPrimaryKey(categorySchema, catId));
                    const updatedTag = this.realm.create(hashtagSchema, { id: newHashtag, name: realmHashtag.name, categories: tagParentCategories }, true /* update */);
                    updatedTags.push(this._getTagProxyFromRealm(updatedTag));
                }
            }

            // 2. Make sure that previous tags of the updated category don't contain this category in the categories array property
            for (let prevHashtag of prevHashTags) {
                if (!newHashtags.has(prevHashtag)) {
                    // This hashtag has been removed from the updated category
                    let realmHashtag = this.realm.objectForPrimaryKey(hashtagSchema, prevHashtag);
                    let prevHashtagCategories = realmHashtag.categories.reduce((set, cat) => { set.add(cat.id); return set; }, new Set());
                    if (prevHashtagCategories.has(categoryToSave.id)) {
                        prevHashtagCategories.delete(categoryToSave.id);
                        const tagParentCategories = [...prevHashtagCategories].map(catId => this.realm.objectForPrimaryKey(categorySchema, catId));
                        const updatedTag = this.realm.create(hashtagSchema, { id: prevHashtag, name: realmHashtag.name, categories: tagParentCategories }, true /* update */);
                        updatedTags.push(this._getTagProxyFromRealm(updatedTag));
                    }
                }
            }
        });

        const updatedCategory = this.realm.objectForPrimaryKey(categorySchema, categoryToSave.id);
        updatedCats.push(this._getCatProxyFromRealm(updatedCategory));

        // In case we added a new category with a parent, we have to update the parent in the redux store to add a new child
        if (!update && updatedCategory.parent) {
            updatedCats.push(this._getCatProxyFromRealm(updatedCategory.parent));
        }

        return {
            updatedTags: [ ...updatedTags],
            updatedCats: updatedCats,
            updatedPubs: updatedPubs
        }
    }

    deleteCategory(category) {
        
        let updatedCats = [];
        let updatedTags = [];

        this.realm.write(() => {

            let categoryToDelete = this.realm.objectForPrimaryKey(categorySchema, category.id);
            this._internalDeleteCategory(categoryToDelete);
            
            // We must update hashtags since they don't belong to this category anymore
            if (category.hashtags.length > 0) {
                updatedTags = category.hashtags.map((tagId) => this._getTagProxyFromRealm(this.realm.objectForPrimaryKey(hashtagSchema, tagId)));
            }

            // We must update chidren categories sonce they are not a child of this category anymore
            if (category.children.length > 0) {
                category.children.forEach(childId => {
                    const child = this.realm.objectForPrimaryKey(categorySchema, childId);
                    updatedCats.push(this._getCatProxyFromRealm(child))
                });
            }

            // The possible parent has no this cat as child
            if (category.parent != null)
            {
                const parent = this.realm.objectForPrimaryKey(categorySchema, category.parent);
                updatedCats.push(this._getCatProxyFromRealm(parent));
            }

        });

        return {
            updatedTags: updatedTags,
            updatedCats: updatedCats,
            deletedCats: [ category.id ]
        }
        
    }

    removeTagFromCategory(categoryId, tagId) {

        let updatedCats = [];
        let updatedTags = [];

        this.realm.write(() => {

            const tagToUpdate = this.realm.objectForPrimaryKey(hashtagSchema, tagId);
            const tagCategories = tagToUpdate.categories;
            const catIndex = tagCategories.findIndex(cat => cat.id == categoryId);
            if (catIndex >= 0) {
                tagCategories.splice(catIndex, 1);
            }
        });

        updatedTags.push(this._getTagProxyFromRealm(this.realm.objectForPrimaryKey(hashtagSchema, tagId)));
        updatedCats.push(this._getCatProxyFromRealm(this.realm.objectForPrimaryKey(categorySchema, categoryId)))

        return {
            updatedTags: updatedTags,
            updatedCats: updatedCats
        }
    }

    searchItem(itemType, filter) {

        const activeProfileId = global.settingsManager.getActiveProfile();
        const searchResults = this.realm.objects(this._getRealmTypeFromItemType(itemType)).filtered('profile.id = $0 and name like[c] $1', activeProfileId, filter);
        
        return searchResults.map((item, index, array) => {
            return this._getItemProxyFromRealm(itemType, item);
        });    
    }
    
    searchProfile(filter) {

        const searchResults = this.realm.objects(profileSchema).filtered('name like[c] $0', filter);
        
        return searchResults.map((item, index, array) => {
            return this._getItemProxyFromRealm(global.PROFILE_ITEM, item);
        });    
    }

    savePublication(rawPublication, update) {

        return this.open()
        .then(() => {

            this.realm.write(() => {

                const realmPublication = {
                    id: rawPublication.id,
                    name: rawPublication.name,
                    profile: this._getActiveProfileRealmItem(),
                    description: rawPublication.description,
                    creationDate: rawPublication.creationDate,
                    tagNames: rawPublication.tagNames,
                    category: rawPublication.category ? this.realm.objectForPrimaryKey(categorySchema, rawPublication.category) : null,
                    categoryName: rawPublication.categoryName,
                    archived: rawPublication.archived
                };

                this.realm.create(publicationSchema, realmPublication, update);
            });
        });
    }

    deletePublication(pubId) {
        
        this.realm.write(() => {

            let publicationToDelete = this.realm.objectForPrimaryKey(publicationSchema, pubId);
            this.realm.delete(publicationToDelete);
            
        });
    }

    hasPublication(pubId) {

        const publication = this.realm.objectForPrimaryKey(publicationSchema, pubId);
        return publication != null;
    }

    _getActiveProfileRealmItem() {
        const activeProfileId = global.settingsManager.getActiveProfile();
        const activeProfile = this.realm.objectForPrimaryKey(profileSchema, activeProfileId);
        return activeProfile;
    }

    _getItemProxyFromRealm(itemType, item) {
        if (itemType == global.TAG_ITEM) {
            return this._getTagProxyFromRealm(item);
        } else if (itemType == global.CATEGORY_ITEM) {
            return this._getCatProxyFromRealm(item);
        } else if (itemType == global.PUBLICATION_ITEM) {
            return this._getPubProxyFromRealm(item);
        } else if (itemType == global.PROFILE_ITEM) {
            return this._getProfileProxyFromRealm(item);
        }
    }

    _getProfileProxyFromRealm(item) {

        return {
            id: item.id,
            name: item.name,
            description: item.description,
            tagsCount: item.tags.length,
            categoriesCount: item.categories.length,
            publicationsCount: item.publications.length
        }
    }

    _getPubProxyFromRealm(item) {

        // properties: {
        //      id: 'string',
        //      name: 'string?',
        //      description: 'string?',
        //      creationDate: 'date',
        //      tagNames: 'string[]', // contain the name of each tag (category + additional)
        //      category: 'TagCategory?', // base category; optional since it could have been removed
        //      categoryName: 'string',  // name of the referenced category (could have been removed)
        //      archived: {type: 'bool',  default: false}
        // }
    
        return {
            id: item.id,
            name: item.name,
            description: item.description,
            creationDate: item.creationDate,
            tagNames: [...item.tagNames],
            category: item.category ? item.category.id : null,
            categoryName: item.categoryName,
            archived: item.archived
        }
    }

    _getCatProxyFromRealm(item) {

        return {
            id: item.id,
            name: item.name,
            parent: item.parent ? item.parent.id : null,
            children: item.children.map((cat, index, array) => cat.id),
            hashtags: item.hashtags.map((tag, index, array) => tag.id)
        }
    }

    _getTagProxyFromRealm(item) {

        const mediaCount = item.mediaCount == null ? null : {
            count: item.mediaCount.count,
            timestamp: item.mediaCount.timestamp
        };
        return {
            id: item.id,
            name: item.name,
            categories: item.categories.map((cat, index, array) => cat.id),
            mediaCount : mediaCount
        }
    }

    _getRealmTypeFromItemType(itemType) {

        return  itemType === global.TAG_ITEM ? hashtagSchema :
                itemType === global.CATEGORY_ITEM ? categorySchema :
                itemType === global.PUBLICATION_ITEM ? publicationSchema :
                profileSchema;
    }

    _internalDeleteCategory(categoryToDelete) {
        // TODO : should we remove children categories ??
        // SO far, if we remove a category which contains children, these children
        // will move to hierarchy root... Why not?
        // -> or shouyld we introduce an option?
        this.realm.delete(categoryToDelete);
    }

    _getSetDifferences(set1, set2) {

        if ((set1 == null || set1.length == 0) &&
            (set2 == null || set2.length == 0)) {
            return [];
        }

        if (set1 == null || set1.length == 0) {
            return [ ...set2 ];
        }

        if (set2 == null || set2.length == 0) {
            return [ ...set1 ];
        }
        
        let differences = [];
        
        set1.forEach(element => {
            if (!set2.has(element)) {
                differences.push(element);
            }
        });
        set2.forEach(element => {
            if (!set1.has(element)) {
                differences.push(element);
            }
        });

        return differences;
    }

}