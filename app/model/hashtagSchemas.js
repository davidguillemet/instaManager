/**
 * Hashtag hierarchical categories
 */
export const TagCategorySchema = {
    name: 'TagCategory',
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: 'string',
        parent: 'TagCategory?',
        children: { type: 'linkingObjects', objectType: 'TagCategory', property: 'parent' },
        hashtags: { type: 'linkingObjects', objectType: 'Hashtag', property: 'categories' },
        archived: {type: 'bool',  default: false}
    }
}

/**
 * Contains all the user hashtags. The category migh be null in case the tag does not belong to any category
 */
export const HashtagSchema = {
    name: 'Hashtag',
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: 'string',
        categories: 'TagCategory[]',
        archived: {type: 'bool',  default: false}
    }
}
