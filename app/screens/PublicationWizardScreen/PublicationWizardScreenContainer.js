import { connect } from 'react-redux';
import { createAddPublicationAction } from '../../actions/publications';

import PublicationWizardScreenUi from './PublicationWizardScreenUi';

const mapDispatchToProps = dispatch => {
    return {
        onSavePublication: publication => {
            dispatch(createAddPublicationAction(publication));
        }
    }
}

const PublicationWizardScreen = connect(null, mapDispatchToProps)(PublicationWizardScreenUi);

export default PublicationWizardScreen;

