import { connect } from 'react-redux';
import PublicationFilterScreenUi from './PublicationFilterScreenUi';
import { createSetPublicationFilterAction, forceLoadPublications } from '../../actions';

const mapDispatchToProps = dispatch => {
    return {
        onUpdateFilter: filter => {
            global.settingsManager.setPublicationFilter(filter);
            dispatch(createSetPublicationFilterAction(filter));
            dispatch(forceLoadPublications());
        }
    }
}

const mapStateToProps = (state, props) => {
    return {
        publicationFilter: state.get('settings').get('publicationFilter')
    }
}

const PublicationFilterScreen = connect(
    mapStateToProps,
    mapDispatchToProps
)(PublicationFilterScreenUi);

export default PublicationFilterScreen;
