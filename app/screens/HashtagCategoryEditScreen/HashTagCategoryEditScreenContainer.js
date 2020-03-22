import { connect } from 'react-redux';
import { compose } from 'redux';
import {
    createMultiUpdateAction,
    createOpenEditorAction,
    createCloseEditorAction
} from '../../actions';
import HashtagCategoryEditScreenUi from './HashtagCategoryEditScreenUi';
import withSaveButton from './../../components/WithSaveButton';

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
        itemId: itemId,
        itemName: item ? item.name : '',
        childrenTags: itemType == global.CATEGORY_ITEM && item ? [...item.hashtags] : [],
        parentCategories: parentCategoriesSelector(item, itemType),
        editorMode: itemId ? global.UPDATE_MODE : global.CREATE_MODE
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onOpen: (itemId) => {
            dispatch(createOpenEditorAction(itemId));
        },
        onClose: (itemId) => {
            dispatch(createCloseEditorAction(itemId));
        },
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

const HashtagCategoryEditScreen = compose(connect(mapStateToProps, mapDispatchToProps), withSaveButton)(HashtagCategoryEditScreenUi);

export default HashtagCategoryEditScreen;