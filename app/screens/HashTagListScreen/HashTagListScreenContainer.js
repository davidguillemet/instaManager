import { connect } from 'react-redux';
import { compose } from 'redux';
import { createSelector } from 'reselect';
import { createMultiUpdateAction, createSetTagFilterAction, TagFilters } from '../../actions';
import HashTagListScreenUi from './HashTagListScreenUi';
import { DISPLAY_ALL, DISPLAY_ORPHANS } from './HashTagListScreenUi';
import withControlStatus from './../../components/WithControlStatus';

function _buildSections(immutableHashtags, filterType, unavailableTags /* identifier set */) {

    const sortedHashtags = immutableHashtags.toList().sort((t1, t2) => t1.name.localeCompare(t2.name));
    const showOrphans = filterType == TagFilters.SHOW_ORPHANS;

    let sections = [];
    let rawTags = [];
    let previousSectionTitle = null;
    let currentSectionData;

    for (let hashtag of sortedHashtags) {

        if (unavailableTags && unavailableTags.has(hashtag.id)) {
            continue;
        }

        if (showOrphans && hashtag.categories != null && hashtag.categories.length > 0) {
            // Display only orphan tags
            continue;
        }

        rawTags.push(hashtag);

        let tagName = hashtag.name;
        let currentSectionTitle = tagName.charAt(0).toUpperCase();

        if (currentSectionTitle != previousSectionTitle) {
            // New section
            previousSectionTitle = currentSectionTitle;
            currentSectionData = [];
            const newSection = {
                title: currentSectionTitle,
                data: currentSectionData
            };
            sections.push(newSection);
        }
        currentSectionData.push(hashtag.id);
    }

    return {
        sections: sections,
        rawTags: rawTags
    };
}

function _getFilterIndexFromFilterType(filterType) {
    return filterType == TagFilters.SHOW_ALL ? DISPLAY_ALL : DISPLAY_ORPHANS;
}

const tagsSelector = (state, props) => state.get('tags');
const filterSelector = (state, props) => state.get('tagFilter');
const unavailableTagsSelector = (state, props) => props.navigation.state.params ? props.navigation.state.params.unavailableTags : null;

const sectionsSelector = createSelector([tagsSelector, filterSelector, unavailableTagsSelector],  _buildSections);
const filterIndexSelector = createSelector(filterSelector, _getFilterIndexFromFilterType);

const mapStateToProps = (state, ownProps) => {
    const { sections, rawTags } = sectionsSelector(state, ownProps);
    return {
        sections: sections,
        rawTags: rawTags,
        tagFilterIndex: filterIndexSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onDeleteTag: tagId => {
            const updates = global.hashtagPersistenceManager.deleteTag(tagId);
            dispatch(createMultiUpdateAction(updates));
        },
        onShowOrphanTags : () => {
            dispatch(createSetTagFilterAction(TagFilters.SHOW_ORPHANS));
        },
        onShowAllTags : () => {
            dispatch(createSetTagFilterAction(TagFilters.SHOW_ALL));
        }
    }
}

const HashTagListScreen = compose(
        connect(mapStateToProps, mapDispatchToProps),
        withControlStatus
    )
    (HashTagListScreenUi);

export default HashTagListScreen;