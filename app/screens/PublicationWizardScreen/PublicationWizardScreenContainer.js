import { connect } from 'react-redux';
import {
    createAddPublicationAction,
    createOpenEditorAction,
    createCloseEditorAction
} from '../../actions';


import PublicationWizardScreenUi from './PublicationWizardScreenUi';

const mapDispatchToProps = dispatch => {
    return {
        onOpen: (itemId) => {
            dispatch(createOpenEditorAction(itemId));
        },
        onClose: (itemId) => {
            dispatch(createCloseEditorAction(itemId));
        },
        onSavePublication: publication => {
            dispatch(createAddPublicationAction(publication));
        }
    }
}

const PublicationWizardScreen = connect(null, mapDispatchToProps)(PublicationWizardScreenUi);

export default PublicationWizardScreen;

