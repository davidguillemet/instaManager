import { connect } from 'react-redux';
import { createAddPublicationAction } from '../../actions/publications';

import PublicationSummaryScreenUi from './PublicationSummaryScreenUi';

const mapDispatchToProps = dispatch => {
    return {
        onSavePublication: publication => {
            dispatch(createAddPublicationAction(publication));
        }
    }
}

const PublicationSummaryScreen = connect(null, mapDispatchToProps)(PublicationSummaryScreenUi);

export default PublicationSummaryScreen;

