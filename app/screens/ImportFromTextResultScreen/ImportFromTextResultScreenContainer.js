import { connect } from 'react-redux';
import { createMultiUpdateAction } from '../../actions';
import ImportFromTextResultScreenUi from './ImportFromTextResultScreenUi';

const mapDispatchToProps = dispatch => {
    return {
        onAddTags: newTags => {
            newTags.forEach(newTag => {
                global.hashtagPersistenceManager.saveTag(newTag, false /* not an update */);
            });
            const updates = {
                updatedTags: newTags,
            };    
            dispatch(createMultiUpdateAction(updates));
        }
    }
}

const ImportFromTextResultScreen = connect(
    null,
    mapDispatchToProps
)(ImportFromTextResultScreenUi);

export default ImportFromTextResultScreen;