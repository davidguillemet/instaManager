import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { createMultiUpdateAction } from '../../actions';
import HashTagListScreenUi from './HashTagListScreenUi';

function _buildSections(immutableSortedHashtags) {

    const sortedHashtags = immutableSortedHashtags.values();

    let sections = [];
    let previousSectionTitle = null;
    let currentSectionData;

    for (let hashtag of sortedHashtags) {

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

    return sections;
}

const tagsSelector = state => state.get('tags');
const sectionsSelector = createSelector(tagsSelector, _buildSections);

const mapStateToProps = state => {
    const tags = state.get('tags');
    return {
        tags: tags,
        sections: sectionsSelector(state)
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

const HashTagListScreen = connect(
    mapStateToProps,
    mapDispatchToProps
)(HashTagListScreenUi);

export default HashTagListScreen;