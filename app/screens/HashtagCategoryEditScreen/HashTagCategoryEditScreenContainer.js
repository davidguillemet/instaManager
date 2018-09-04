import { connect } from 'react-redux';
import { createMultiUpdateAction } from '../../actions';
import HashtagCategoryEditScreenUi from './HashtagCategoryEditScreenUi';

const mapDispatchToProps = dispatch => {
    return {
        onSaveTag: (tagToSave, isAnUpdate) => {
            const updates = global.hashtagManager.saveTag(tagToSave, isAnUpdate);
            dispatch(createMultiUpdateAction(updates));
        },
        onSaveCategory: (catToSave, isAnUpdate) => {
            const updates = global.hashtagManager.saveCategory(catToSave, isAnUpdate);   
            dispatch(createMultiUpdateAction(updates));
        }
    }
}

const HashtagCategoryEditScreen = connect(
    null,
    mapDispatchToProps
)(HashtagCategoryEditScreenUi);

export default HashtagCategoryEditScreen;