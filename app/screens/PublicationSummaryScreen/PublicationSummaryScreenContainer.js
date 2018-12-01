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

const mapStateToPros = state => {
    return {
        maxTagsCount: global.settingsManager.getMaxNumberOfTags()
    }
}

const PublicationSummaryScreen = connect(mapStateToPros, mapDispatchToProps)(PublicationSummaryScreenUi);

export default PublicationSummaryScreen;

