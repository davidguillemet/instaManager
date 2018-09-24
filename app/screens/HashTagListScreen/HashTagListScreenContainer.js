import { connect } from 'react-redux';
import { compose } from 'redux';
import { createSelector } from 'reselect';
import { createMultiUpdateAction } from '../../actions';
import HashTagListScreenUi from './HashTagListScreenUi';
import withControlStatus from './../../components/WithControlStatus';

function _buildSections(immutableHashtags, unavailableTags /* identifier set */) {

    const sortedHashtags = immutableHashtags.toList().sort((t1, t2) => t1.name.localeCompare(t2.name));

    let sections = [];
    let rawTags = [];
    let previousSectionTitle = null;
    let currentSectionData;

    for (let hashtag of sortedHashtags) {

        if (unavailableTags && unavailableTags.has(hashtag.id)) {
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

const tagsSelector = (state, props) => state.get('tags');
const unavailableTagsSelector = (state, props) => props.navigation.state.params ? props.navigation.state.params.unavailableTags : null;
const sectionsSelector = createSelector([tagsSelector, unavailableTagsSelector],  _buildSections);

const mapStateToProps = (state, ownProps) => {
    const { sections, rawTags } = sectionsSelector(state, ownProps);
    return {
        sections: sections,
        rawTags: rawTags
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onDeleteTag: tagId => {
            const updates = global.hashtagPersistenceManager.deleteTag(tagId);
            dispatch(createMultiUpdateAction(updates));
        }
    }
}

const HashTagListScreen = compose(
        connect(mapStateToProps, mapDispatchToProps),
        withControlStatus
    )
    (HashTagListScreenUi);

export default HashTagListScreen;