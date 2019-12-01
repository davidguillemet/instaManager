import { connect } from 'react-redux';

import TagsCountUi from './TagsCountUi';

const mapStateToProps = (state, props) => {

    return {
        maxTagsCount: global.settingsManager.getMaxNumberOfTags()
    };
}
const TagsCount = connect(mapStateToProps, null)(TagsCountUi);

export default TagsCount;

