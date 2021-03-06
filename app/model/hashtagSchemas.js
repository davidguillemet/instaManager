/**
 * Profiles
 */
export const ProfileSchema = {
    name: 'Profile',
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: 'string',
        description: 'string?',
        categories: { type: 'linkingObjects', objectType: 'TagCategory', property: 'profile' },
        tags: { type: 'linkingObjects', objectType: 'Hashtag', property: 'profile' },
        publications: { type: 'linkingObjects', objectType: 'Publication', property: 'profile' },
    }
};

/**
 * Hashtag hierarchical categories
 */
export const TagCategorySchema = {
    name: 'TagCategory',
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: 'string',
        profile: 'Profile',
        parent: 'TagCategory?',
        children: { type: 'linkingObjects', objectType: 'TagCategory', property: 'parent' },
        hashtags: { type: 'linkingObjects', objectType: 'Hashtag', property: 'categories' },
        publications: { type: 'linkingObjects', objectType: 'Publication', property: 'category' },
        archived: {type: 'bool',  default: false}
    }
};

export const MediaCountSchema = {
    name: 'MediaCount',
    properties: {
        count: { type: 'int' },
        timestamp: { type: 'date' }
    }
}

/**
 * Contains all the user hashtags. The category might be null in case the tag does not belong to any category
 */
export const HashtagSchema = {
    name: 'Hashtag',
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: 'string',
        profile: 'Profile',
        categories: 'TagCategory[]',
        archived: {type: 'bool',  default: false},
        mediaCount: { type: 'MediaCount', optional: true }
    }
};


/**
 * Pubications
 */
export const PublicationSchema = {
    name: 'Publication',
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: 'string?',
        profile: 'Profile',
        description: 'string?',
        creationDate: 'date',
        tagNames: 'string[]', // contain the name of each tag (category + additional)
        category: 'TagCategory?', // base category; optional since it could have been removed
        categoryName: 'string',  // name of the referenced category (could have been removed)
        archived: {type: 'bool',  default: false}
    }
};
