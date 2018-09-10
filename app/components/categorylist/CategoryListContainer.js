import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { createMultiUpdateAction } from '../../actions';
import CategorylistUi from './CategoryListUi';

/**
 * rawCategorie : categories from redux state
 * hiddenCategories : a list of deactivated items from props
 */
function _buildCategoryHierarchy(rawCategories, hiddenCategories) {

    // Build hiearchy a list with level property
    let hierarchy = [];

    // get sorted root categories
    let rootCategories = rawCategories.toList().filter(cat => cat.parent === null);
    rootCategories = rootCategories.sort((c1, c2) => c1.name.localeCompare(c2.name));

    for (let rootCat of rootCategories) {
        hierarchy.push(_getCatHierarchyNode(rootCat, 0));
        _getSubCategories(rootCat, 1, hierarchy, rawCategories);
    }

    if (hiddenCategories)
    {
        _deactivateHiddenCategoriesChildren(hierarchy, new Set(hiddenCategories));
    }

    return hierarchy;
}

function _getSubCategories(parentCategory, level, hierarchy, rawCategories) {

    if (parentCategory.children == null || parentCategory.children.length == 0) {
        return;
    }

    let children = parentCategory.children.map((id, index, array) => rawCategories.get(id));
    for (let subCategory of children) {
        
        hierarchy.push(_getCatHierarchyNode(subCategory, level));
        _getSubCategories(subCategory, level + 1, hierarchy, rawCategories);
    }
}

function _getCatHierarchyNode(cat, level) {
    return {
        ...cat,
        level: level
    };
}

function _deactivateHiddenCategoriesChildren(categories, hiddenSet) {

    let hidechildren = false;
    let hiddenRootLevel = 0;
    for (let category of categories) {
        
        if (hidechildren && category.level === hiddenRootLevel) {
            // current category is a sibling of the initial hidden category
            hidechildren = false;
        }
        
        if (hiddenSet.has(category.id)) {
            // The current category is initially hidden
            // -> update "deactivated" property
            // make sure to hidde children...
            hiddenRootLevel = category.level;
            category.deactivated = true;
            hidechildren = true;
        } else if (hidechildren && category.level > hiddenRootLevel) {
            // It seems the category is a children of a hidden category
            // -> we must deactivate it
            category.deactivated = true;
        }
    }
}

const categoriesSelector = (state, props) => state.get('categories');
const hiddenCategoriesSelector = (state, props) => props.hiddenCategories;
const hierarchicalCategoriesSelector = createSelector([categoriesSelector, hiddenCategoriesSelector], _buildCategoryHierarchy);

const mapStateToProps = (state, ownProps) => {
    const rawCategories = state.get('categories');
    return {
        categories: hierarchicalCategoriesSelector(state, ownProps),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onDeleteCategory: categoryId => {
            let updates = global.hashtagPersistenceManager.deleteCategory(global.hashtagUtil.getCatFromId(categoryId));
            dispatch(createMultiUpdateAction(updates));
        }
    }
}


const CategoryList = connect(mapStateToProps, mapDispatchToProps)(CategorylistUi);

export default CategoryList;