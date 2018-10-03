import { connect } from 'react-redux';
import { compose } from 'redux';
import { createSelector } from 'reselect';

import {
    loadPublicationsIfNeeded,
    createDeletePublicationAction
} from '../../actions/publications';

import PublicationScreenUi from './PublicationScreenUi';
import withControlStatus from '../../components/WithControlStatus';

function sameDay(d1, d2) {
    if (d1 === d2) {
        return true;
    }

    return (d1.getYear() === d2.getYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate())      // Day of the month
}

function _buildSections(publicationsLoaded, immutablePublications) {

    if (publicationsLoaded == false) {
        return null;
    }

    const sortedPublications = immutablePublications.toList().sort((p1, p2) => {
        if (p1.creationDate < p2.creationDate) {
            return 1;
        }
        if (p1.creationDate > p2.creationDate) {
            return -1;
        }
        return 0;
    });

    let sections = [];
    let previousSectionDate = null;
    let currentSectionData;

    for (let publication of sortedPublications) {

        let currentDate = publication.creationDate;

        if (previousSectionDate === null || sameDay(currentDate, previousSectionDate) === false) {
            // New section
            previousSectionDate = currentDate;
            currentSectionData = [];
            const newSection = {
                title: currentDate.toLocaleDateString(global.locale, {year: "numeric", month: "long", day: "numeric"}),
                data: currentSectionData
            };
            sections.push(newSection);
        }
        
        currentSectionData.push(publication.id);
    }

    return sections;
}

const publicationsLoadedSelector = state => state.get('publicationsLoaded');
const publicationsSelector = state => state.get('publications');
const sectionsSelector = createSelector(publicationsLoadedSelector, publicationsSelector,  _buildSections);

const mapStateToProps = (state, ownProps) => {
    return {
        sections: sectionsSelector(state),
        publicationsLoaded: publicationsLoadedSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLoadPublications: () => dispatch(loadPublicationsIfNeeded()),
        onDeletePublication: (pubId) => {
            global.hashtagPersistenceManager.deletePublication(pubId);
            dispatch(createDeletePublicationAction(pubId));
        }
    }
}

const PublicationScreen = compose(
        connect(mapStateToProps, mapDispatchToProps),
        withControlStatus
    )(PublicationScreenUi);

export default PublicationScreen;
