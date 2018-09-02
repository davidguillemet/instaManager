import { OrderedMap } from 'immutable';

export const CATEGORIES_LOADED = 'CATEGORIES_LOADED';
export const ADD_CATEGORY = 'ADD_CATEGORY';
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';

export function loadCategoriesIfNeeded() {
    return (dispatch, getState) => {
        if (getState().get('categoriesLoaded') === false) {
          return dispatch(createLoadCategoriesAction())
        }
      }
}

export function createLoadCategoriesAction() {
    return dispatch => {
        return global.hashtagManager.getCategories()
        .then((categories) => {
            const immutableMap = OrderedMap(categories.map(item => [item.id, item]));
            dispatch(createCategoriesLoadedAction(immutableMap));
        })
    }
}

export function createCategoriesLoadedAction(map) {
    return {
        type: CATEGORIES_LOADED,
        categories: map
    }
}

export function createAddCategoryAction(category) {
    return {
        type: ADD_CATEGORY,
        category: category
    };
}

export function createUpdateCategoryAction(category) {
    return {
        type: UPDATE_CATEGORY,
        category: category
    };
}

export function createDeleteCategoryAction(categoryId) {
    return {
        type: DELETE_CATEGORY,
        categoryId: categoryId
    };
}