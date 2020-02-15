import { connect } from 'react-redux';
import { compose } from 'redux';
import { createSelector } from 'reselect';

import {
    loadPublicationsIfNeeded,
    createDeletePublicationAction
} from '../../actions/publications';

import PublicationScreenUi from './PublicationScreenUi';
import withControlStatus from '../../components/WithControlStatus';

function sameMonth(d1, d2) {
    if (d1 === d2) {
        return true;
    }

    return (d1.getYear() === d2.getYear() &&
            d1.getMonth() === d2.getMonth());
}

function getSectionTitle(date) {

    const now = new Date();

    if (now.getYear() == date.getYear()) {
        if (now.getMonth() == date.getMonth()) {
            return "Ce mois-ci";
        } else if (now.getMonth() == date.getMonth() + 1) {
            return "Le mois dernier";
        }
    }

    return date.toLocaleDateString(global.locale, {year: "numeric", month: "long"});
}

function _buildSections(publicationsLoaded, immutablePublications) {

    const sections = [];
    const rawPublications = [];
    const returnValue = {
        sections,
        rawPublications
    }

    if (publicationsLoaded == false) {
        return returnValue;
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

    let previousSectionDate = null;
    let currentSectionData;

    for (let publication of sortedPublications) {

        let currentDate = publication.creationDate;

        if (previousSectionDate === null || sameMonth(currentDate, previousSectionDate) === false) {
            // New section
            previousSectionDate = currentDate;
            currentSectionData = [];
            const newSection = {
                title: getSectionTitle(currentDate),
                data: currentSectionData
            };
            sections.push(newSection);
        }
        
        currentSectionData.push(publication);
        rawPublications.push(publication);
    }

    return returnValue;
}

const publicationsLoadedSelector = state => state.get('publicationsLoaded');
const publicationsSelector = state => state.get('publications');
const sectionsSelector = createSelector(publicationsLoadedSelector, publicationsSelector,  _buildSections);

const mapStateToProps = (state, ownProps) => {
    const publicationTotalCount = global.hashtagUtil.getTotalPublicationsCount();
    const { sections, rawPublications } = sectionsSelector(state);
    return {
        sections: sections,
        rawPublications: rawPublications,
        publicationsLoaded: publicationsLoadedSelector(state),
        publicationCount: publicationsSelector(state).size,
        publicationTotalCount: publicationTotalCount
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
