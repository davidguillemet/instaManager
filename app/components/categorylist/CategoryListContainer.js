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
    const hierarchy = [];
    const categoryMap= new Map();

    // get sorted root categories
    let rootCategories = rawCategories.toList().filter(cat => cat.parent === null);
    rootCategories = rootCategories.sort((c1, c2) => c1.name.localeCompare(c2.name));

    for (let rootCat of rootCategories) {
        const tagSet = new Set(rootCat.hashtags);
        const catNode = _getCatHierarchyNode(rootCat, 0, tagSet);
        categoryMap.set(catNode.id, catNode);
        hierarchy.push(catNode);
        _getSubCategories(rootCat, 1, hierarchy, rawCategories, tagSet, categoryMap);
    }

    if (hiddenCategories)
    {
        _deactivateHiddenCategoriesChildren(hierarchy, new Set(hiddenCategories));
    }

    return {
        hierarchy: hierarchy,
        map: categoryMap
    }
}

function _getSubCategories(parentCategory, level, hierarchy, rawCategories, parentTags, categoryMap) {

    if (parentCategory.children == null || parentCategory.children.length == 0) {
        return;
    }

    let children = parentCategory.children.map((id, index, array) => rawCategories.get(id));
    for (let subCategory of children) {
        
        const tagSet = new Set([...subCategory.hashtags, ...parentTags]);
        const catNode = _getCatHierarchyNode(subCategory, level, tagSet);
        categoryMap.set(catNode.id, catNode);
        hierarchy.push(catNode);
        _getSubCategories(subCategory, level + 1, hierarchy, rawCategories, tagSet, categoryMap);
    }
}

function _getCatHierarchyNode(cat, level, tagSet) {
    return {
        ...cat,
        level: level,
        tagCount: tagSet.size
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
    const { hierarchy, map } = hierarchicalCategoriesSelector(state, ownProps);
    return {
        categories: hierarchy,
        categoriesMap: map
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