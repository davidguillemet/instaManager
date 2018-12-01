import { connect } from 'react-redux';
import CategorieTagsDisplayUi from './CategorieTagsDisplayUi';


function getParentCategory(props) {
    return props.parentCategory;
}

function getAncestorCategories(category) {
    return category != null ? global.hashtagUtil.getAncestorCategories(category) : [];
}

function getAncestorTags(ancestors) {
    return ancestors.reduce((set, cat) => { cat.hashtags.forEach(tagId => set.add(tagId)); return set; }, new Set());
}

function getAncestorDuplicatedTags(ancestors) {
    const allTags = new Set();
    return ancestors.reduce((set, cat) => {
        cat.hashtags.forEach(tagId => {
            if (allTags.has(tagId)) {
                set.add(tagId);
            }
            allTags.add(tagId);
        });
        return set;
    }, new Set());
}


const mapStateToProps = (state, props) => {

    const parentCategory = getParentCategory(props);
    const ancestorsCategories = getAncestorCategories(parentCategory);
    const ancestorTags = getAncestorTags(ancestorsCategories);

    return {
        maxTagsCount: global.settingsManager.getMaxNumberOfTags(),
        ancestorCategories: ancestorsCategories,
        ancestorTags: ancestorTags,
        ancestorsDuplicatedTags: getAncestorDuplicatedTags(ancestorsCategories),
        onGetAncestorDuplicatedTags: props => {
            return getAncestorDuplicatedTags(getAncestorCategories(getParentCategory(props)));
        }
    };
}

const CategorieTagsDisplay = connect(mapStateToProps)(CategorieTagsDisplayUi);

export default CategorieTagsDisplay;