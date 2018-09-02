import { OrderedMap, List, Record } from 'immutable';
import { combineReducers } from 'redux-immutable';
import {
    CATEGORIES_LOADED,
    ADD_CATEGORY,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,
    TAGS_LOADED,
    ADD_TAG,
    UPDATE_TAG,
    DELETE_TAG,
    MULTI_UPDATE
} from './../actions';

/**
 * {
 *      categoriesLoaded: false|true,
 *      tagsLoaded: false|true,
 *      categories: OrderedMap(),
 *      tags: OrderedMap()
 * }
 */

/**
 * state is an immutable OrderedMap containing all the categories by Id 
 */
function categoriesReducer(state = OrderedMap(), action) {

    switch (action.type) {
        case CATEGORIES_LOADED:
            return action.categories

        case ADD_CATEGORY:
        case UPDATE_CATEGORY:
            return state.set(action.category.id, action.category);

        case MULTI_UPDATE:
            
            if ((action.updates.updatedCats == null || action.updates.updatedCats.length == 0) && 
                (action.updates.deletedCats == null || action.updates.deletedCats.length == 0)) {
                // No actions on categories...
                return state;
            }

            return state.withMutations(map => {

                if (action.updates.updatedCats && action.updates.updatedCats.length > 0) {
                    action.updates.updatedCats.forEach(cat => {
                        map.set(cat.id, cat);
                    });
                }

                if (action.updates.deletedCats && action.updates.deletedCats.length > 0) {
                    action.updates.deletedCats.forEach(catId => {
                        map.delete(catId);
                    });                        
                }
            });

        case DELETE_CATEGORY:
            return state.delete(action.categoryId);

        default:
            return state;
    }
}

/**
 * state is an immutable OrderedMap containing all the tags by Id 
 */
function tagReducers(state = OrderedMap(), action) {

    switch (action.type) {
        case TAGS_LOADED:
            return action.tags;

        case ADD_TAG:
        case UPDATE_TAG:
            return state.set(action.tag.id, action.tag);

        case MULTI_UPDATE:

            if ((action.updates.updatedTags == null || action.updates.updatedTags.length == 0) &&
                (action.updates.deletedTags == null || action.updates.deletedTags.length == 0)) {
                return state;
            }

            return state.withMutations(map => {

                if (action.updates.updatedTags && action.updates.updatedTags.length > 0) {
                    action.updates.updatedTags.forEach(tag => {
                        map.set(tag.id, tag);
                    });
                }

                if (action.updates.deletedTags && action.updates.deletedTags.length > 0) {
                    action.updates.deletedTags.forEach(tagId => {
                        map.delete(tagId);
                    });                        
                }
            });

        case DELETE_TAG:
            return state.delete(action.tagId);

        default:
            return state;
    }
}

function tagsLoadingReducer(state = false, action) {
    switch (action.type) {
        case TAGS_LOADED:
            return true;
        default:
            return state;
    }
}

function categoriesLoadingReducer(state = false, action) {
    switch (action.type) {
        case CATEGORIES_LOADED:
            return true;
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    tagsLoaded: tagsLoadingReducer,
    categoriesLoaded: categoriesLoadingReducer, 
    categories: categoriesReducer,
    tags: tagReducers
});
