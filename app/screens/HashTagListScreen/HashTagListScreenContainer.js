import { connect } from 'react-redux';
import { createMultiUpdateAction } from '../../actions';
import HashTagListScreenUi from './HashTagListScreenUi';

function _buildSections(sortedHashtags) {

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

const mapStateToProps = state => {
    // TODO : use react-reselect
    const tags = state.get('tags');
    return {
        tags: tags,
        sections: _buildSections(tags.values())
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onDeleteTag: tagId => {
            const updates = global.hashtagManager.deleteTag(tagId);
            dispatch(createMultiUpdateAction(updates));
        }
    }
}

const HashTagListScreen = connect(
    mapStateToProps,
    mapDispatchToProps
)(HashTagListScreenUi);

export default HashTagListScreen;