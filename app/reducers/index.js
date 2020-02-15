import { Map, List, Record } from 'immutable';
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
    MULTI_UPDATE,
    CONTROLS_STARTED,
    CONTROLS_COMPLETED,
    PUBLICATIONS_LOADED,
    PUBLICATIONS_LOADING,
    ADD_PUBLICATION,
    DELETE_PUBLICATION,
    SET_TAG_FILTER,
    SET_PUBLICATION_FILTER,
    SET_DISPLAY_ERRORS,
    PROFILES_LOADED,
    UPDATE_PROFILE,
    DELETE_PROFILE,
    TagFilters,
} from './../actions';

/**
 * {
 *      categoriesLoaded: false|true,
 *      tagsLoaded: false|true,
 *      categories: Map(),
 *      tags: Map()
 * }
 */

/**
 * state is an immutable Map containing all the categories by Id 
 */
function categoriesReducer(state = Map(), action) {

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
 * state is an immutable Map containing all the tags by Id 
 */
function tagReducer(state = Map(), action) {

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

function tagFilterReducer(state = TagFilters.SHOW_ALL, action) {
    switch (action.type) {
        case SET_TAG_FILTER:
            return action.filter;

        default:
            return state;
    }
}

function profiesLoadingReducer(state = false, action) {
    switch (action.type) {
        case PROFILES_LOADED:
            return true;
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

function publicationsLoadingReducer(state = false, action) {
    switch (action.type) {
        case PUBLICATIONS_LOADED:
            return true;
        case PUBLICATIONS_LOADING:
            return false;
        default:
            return state;
    }
}

function controlsReducer(state = Map({ running: false, errors: null }), action ) {
    switch (action.type) {
        case CONTROLS_STARTED:
            return state.set('running', true);

        case CONTROLS_COMPLETED:
            return state.withMutations(map => {
                map.set('running', false);
                map.set('errors', action.errors);
            });

        default:
            return state;
    }
}

function publicationReducer(state = Map(), action) {
    switch (action.type) {
        case PUBLICATIONS_LOADED:
            return action.publications;
        
        case ADD_PUBLICATION:
            return state.set(action.publication.id, action.publication); 

        case DELETE_PUBLICATION:
            return state.delete(action.publication); 
        
        case MULTI_UPDATE:
            // update possible categoryName
            
            if (action.updates.updatedPubs == null || action.updates.updatedPubs.length == 0) { 
                return state;
            }

            return state.withMutations(map => {

                action.updates.updatedPubs.forEach(pub => {
                    map.set(pub.id, pub);
                });
                
            });

        default:
            return state;
    }
}

function settingsReducer(state = Map(global.settingsManager.getSettings()), action) {
    switch (action.type) {
        case SET_PUBLICATION_FILTER:
            return state.set('publicationFilter', action.filter);

        case SET_DISPLAY_ERRORS:
            return state.set('displayErrors', action.value);

        default:
            return state;
    }
}

function profilesReducer(state = Map(), action) {

    switch (action.type) {
        case PROFILES_LOADED:
            return action.profiles;

        case UPDATE_PROFILE:
            return state.set(action.profile.id, action.profile);

        case DELETE_PROFILE:
            return state.delete(action.profileId);

        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    profilesLoaded: profiesLoadingReducer,
    tagsLoaded: tagsLoadingReducer,
    categoriesLoaded: categoriesLoadingReducer,
    publicationsLoaded: publicationsLoadingReducer,
    controls: controlsReducer,
    profiles: profilesReducer,
    categories: categoriesReducer,
    tags: tagReducer,
    tagFilter: tagFilterReducer,
    publications: publicationReducer,
    settings: settingsReducer
});
