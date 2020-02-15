import { connect } from 'react-redux';
import { Alert } from 'react-native';
import { createMultiUpdateAction } from '../../actions';
import HashtagCategoryEditScreenUi from './HashtagCategoryEditScreenUi';

const itemTypeSelector = (props) => props.navigation.getParam('itemType', null);
const itemIdSelector = (props) => props.navigation.getParam('itemId', null);

const itemSelector = (itemId, itemType) => {

    if (itemId == null) {
        return null;
    }

    let item = null;
    if (itemType == global.TAG_ITEM) {
        item = global.hashtagUtil.getTagFromId(itemId);
    } else {
        item = global.hashtagUtil.getCatFromId(itemId);
    }

    return item;
}

const parentCategoriesSelector = (item, itemType) => {
    if (item == null) {
        return [];
    }

    if (itemType == global.TAG_ITEM) {
        // Tag
        return [...item.categories];
    }

    // Category
    if (item.parent == null) {
        return [];
    }

    return [item.parent];
}

const mapStateToProps = (state, props) => {

    const itemType = itemTypeSelector(props);
    const itemId = itemIdSelector(props);
    const item = itemSelector(itemId, itemType);

    return {
        itemType: itemType,
        itemId: itemId || global.uniqueID(),
        itemName: item ? item.name : '',
        childrenTags: itemType == global.CATEGORY_ITEM && item ? [...item.hashtags] : [],
        parentCategories: parentCategoriesSelector(item, itemType),
        editorMode: itemId ? global.UPDATE_MODE : global.CREATE_MODE
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onSaveTag: (tagToSave, isAnUpdate) => {
            const updates = global.hashtagPersistenceManager.saveTag(tagToSave, isAnUpdate);
            dispatch(createMultiUpdateAction(updates));
        },
        onSaveCategory: (catToSave, isAnUpdate) => {
            const updates = global.hashtagPersistenceManager.saveCategory(catToSave, isAnUpdate);   
            dispatch(createMultiUpdateAction(updates));
        }
    }
}

const HashtagCategoryEditScreen = connect(
    mapStateToProps,
    mapDispatchToProps
)(HashtagCategoryEditScreenUi);

export default HashtagCategoryEditScreen;