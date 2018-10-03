import React from 'react';
import { withNavigation } from 'react-navigation';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';

import Ionicons from 'react-native-vector-icons/Ionicons';

import TagContainer from './TagContainer';
import CustomButton from './CustomButton';

import CommonStyles from '../styles/common'; 

const TAGS_DISPLAY_SELF = 'self';
const TAGS_DISPLAY_ANCESTORS = 'ancestors';

class CategorieTagsDisplay extends React.PureComponent {

    static propTypes = {
        tags: PropTypes.array,                              // Tags from the current category/publication - might be null or empty
        onDeleteTag: PropTypes.func.isRequired,             // callback when deleting a tag
        onTagSelectionValidated: PropTypes.func.isRequired, // callback when the button is pressed if not deactivated
        parentCategory: PropTypes.string,                   // identifier of the parent category - optional
        itemType: PropTypes.string.isRequired,              // item type
        initialDisplayMode: PropTypes.string.isRequired     // Initial display mode : 'self' or 'ancestors'
    };

    static defaultProps = {
        tags: [],
        initialDisplayMode: 'self'
    };

    constructor(props) {
        super(props);
        
        this.state = {
            tags: this.props.tags,
            tagsDisplayMode: this.props.initialDisplayMode
        };

        // Callbacks for tag management
        this.onSelectTags = this.onSelectTags.bind(this);
        this.onTagSelectionValidated = this.onTagSelectionValidated.bind(this);
        this.onDeleteTag = this.onDeleteTag.bind(this);
        this.removeAllDuplicated = this.removeAllDuplicated.bind(this);
        
        // Callbacks for display management
        this.toggleTagsDisplay = this.toggleTagsDisplay.bind(this);
        this.setTagsDisplayAncestors = this.setTagsDisplayAncestors.bind(this);
        this.setTagsDisplaySelf = this.setTagsDisplaySelf.bind(this);
        this.getCategoryOwnTagsCount = this.getCategoryOwnTagsCount.bind(this);
        
        this.parentCategorySelector = props => props.parentCategory;
        this.getAncestorCategories = createSelector(
            this.parentCategorySelector,
            parentCategory => parentCategory != null ? global.hashtagUtil.getAncestorCategories(parentCategory) : []
        );

        this.getAncestorsTags = createSelector(
            this.getAncestorCategories,
            ancestors => { 
                return ancestors.reduce((set, cat) => { cat.hashtags.forEach(tagId => set.add(tagId)); return set; }, new Set());
            }
        );

        this.getAncestorsDuplicatedTags = createSelector(
            this.getAncestorCategories,
            ancestors => {
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
        );
          
    
        // All selectors must have the same signature
        // since only categoryOwnTagsSelector needs the stae, we define it as second parameter
        // and here, we can ignore the first one, props:
        this.categoryOwnTagsSelector = (_, state) => state.tags;

        this.getCategoryDuplicatedTags = createSelector(
            this.getAncestorsTags,
            this.categoryOwnTagsSelector,
            (ancestorTags, categoryOwnTags) => {
                const duplicates = new Set();
                categoryOwnTags.forEach(tagId => {
                    if (ancestorTags.has(tagId)) {
                        duplicates.add(tagId);
                    }
                });
                return duplicates;
            }
        );

        this.getAncestorTagsCount = createSelector(
            this.getAncestorsTags,
            ancestors => { 
                return ancestors.size;
            }
        );
    }

    onDeleteTag(tagId) {

        let newSelection = this.state.tags.filter(id => id != tagId);
        this.setState( {
            tags: newSelection
        });

        this.props.onDeleteTag(tagId);
    }

    removeAllDuplicated() {

        const dupplicatedTags = this.getCategoryDuplicatedTags(this.props, this.state);
        let newSelection = this.state.tags.filter(id => !dupplicatedTags.has(id));
        this.setState( {
            tags: newSelection
        });

        dupplicatedTags.forEach(tagId => this.props.onDeleteTag(tagId));
    }

    onSelectTags() {

        const unavailableTags = this.getAncestorsTags(this.props);

        const params = {
            mode: global.LIST_SELECTION_MODE,
            selection: this.state.tags,
            unavailableTags: unavailableTags,
            onSelectionValidated: this.onTagSelectionValidated
        };

        this.props.navigation.navigate('HashTagList', params);
    }

    onTagSelectionValidated(selection) {

        this.setState( {
            tags: selection,
        });

        this.props.onTagSelectionValidated(selection);
    }

    toggleTagsDisplay(tagsDisplayMode) {

        this.setState( {
            tagsDisplayMode: tagsDisplayMode
        } );
    }

    setTagsDisplaySelf() {

        this.toggleTagsDisplay(TAGS_DISPLAY_SELF);
    }

    setTagsDisplayAncestors() {

        this.toggleTagsDisplay(TAGS_DISPLAY_ANCESTORS);
    }

    renderTagContainers() {

        if (this.state.tagsDisplayMode == TAGS_DISPLAY_SELF) {

            let tagsCount = this.getCategoryOwnTagsCount();
            let tags = this.state.tags;

            // Return tags from the edited category
            return (
                <TagContainer
                    tags={tags}
                    label={tagsCount + ' tag(s) in this ' + global.hashtagUtil.getItemTypeCaption(this.props.itemType)}
                    itemType={global.TAG_ITEM}
                    onPressTag={this.onDeleteTag}
                    onAdd={this.onSelectTags}
                    readOnly={false}
                    addSharp={true}
                    errors={this.getCategoryDuplicatedTags(this.props, this.state)}
                />
            );
        }

        const ancestors = this.getAncestorCategories(this.props);
        if (ancestors.length == 0) {
            // no parent...
            return null;
        }

        return (
            ancestors.map(cat => {
                if (cat.hashtags.length == 0) {
                    return null;
                }
                
                const duplicatedTags = this.getAncestorsDuplicatedTags({ parentCategory: cat.id });
                const countWithoutDuplicated = cat.hashtags.reduce((count, tagId) => { return duplicatedTags.has(tagId) ? count : count + 1; } , 0);
                
                return (
                    <TagContainer
                        style={{ marginBottom: 10 }}
                        label={countWithoutDuplicated + ' tag(s) in ' + cat.name}
                        key={cat.id}
                        tags={cat.hashtags}
                        itemType={global.TAG_ITEM}
                        readOnly={true}
                        addSharp={true}
                        errors={duplicatedTags}
                    />
                );
            })
        );
    }

    getCategoryOwnTagsCount() {

        return this.state.tags.length - this.getCategoryDuplicatedTags(this.props, this.state).size;
    }

    renderTagsCountCaption() {

        const ancestorCategoriesTagCount = this.getAncestorTagsCount(this.props);
        const categoryOwnTagsCount = this.getCategoryOwnTagsCount();

        const remainingTags = global.settingsManager.getMaxNumberOfTags() - ancestorCategoriesTagCount - categoryOwnTagsCount;
        const remainingError = remainingTags < 0;
        const titleStatusStyle = remainingError ? styles.errorTitle : styles.successTitle;
        const remainingStatusStyle = remainingError ? styles.errorText : styles.successText;
        const tagCount = (ancestorCategoriesTagCount + categoryOwnTagsCount) + ' Tag(s) in total - ';
        const remainingTip = remainingError ? `${-remainingTags} in excess` : `${remainingTags} remaining`;

        return (
            <View style={[CommonStyles.styles.standardTile, styles.tagSegmentTitle, titleStatusStyle]}>
                <Text style={[CommonStyles.styles.smallLabel, remainingStatusStyle]}>{tagCount + remainingTip}</Text>
            </View>
        );
    }

    renderDuplicatesError() {

        const duplicates = this.getCategoryDuplicatedTags(this.props, this.state);

        if (duplicates.size == 0) {
            return null;
        }

        return (
            <View style={[CommonStyles.styles.standardTile, styles.errorTitle, {flexDirection: 'column', paddingBottom: 0}]}>
                <Text style={[styles.errorText]}>{'Some tags in this category that already belong to the parent category are ignored.'}</Text>
                <CustomButton
                    style={[CommonStyles.standardButtonCentered, CommonStyles.styles.smallLabel, {marginTop: 5}]}
                    title={'Remove all duplicated tags'}
                    onPress={this.removeAllDuplicated}
                />
            </View>
        );
    }

    renderAncestorDuplicatesError() {

        const ancestorDuplicates = this.getAncestorsDuplicatedTags(this.props);

        if (ancestorDuplicates.size == 0) {
            return null;
        }
        
        return (
            <View style={[CommonStyles.styles.standardTile, styles.errorTitle]}>
                <Text style={[styles.errorText]}>{'The category hierarchy contains duplicated tags.'}</Text>
            </View>
        )        
    }

    getOwnTagsCountCaption() {

        const caption = this.getCategoryOwnTagsCount() + ' in this ' + global.hashtagUtil.getItemTypeCaption(this.props.itemType);
        return caption;
    }

    getAncestorTagsCountCaption() {

        const ancestorCategoriesTagCount = this.getAncestorTagsCount(this.props);
        const caption = ancestorCategoriesTagCount + ' from ' + (this.props.itemType == global.CATEGORY_ITEM ? 'ancestors' : 'the category');

        return caption;
    }

    renderSegmentControl() {

        const ancestorCategoriesTagCount = this.getAncestorTagsCount(this.props);
        const duplicates = this.getCategoryDuplicatedTags(this.props, this.state);
        const ancestorDuplicates = this.getAncestorsDuplicatedTags(this.props);

        return (
            <View>
                { this.renderTagsCountCaption() }
                {
                    this.props.itemType !== global.PUBLICATION_ITEM ?
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <CustomButton
                            onPress={this.setTagsDisplaySelf}
                            style={[
                                CommonStyles.styles.standardButtonCentered,
                                styles.leftSegment,
                                this.state.tagsDisplayMode == TAGS_DISPLAY_SELF ? styles.selectedSegment : styles.unselectedSegment]}
                        >
                            <Text key={'text'}>{this.getOwnTagsCountCaption()}</Text>
                            {
                                duplicates.size > 0 ?
                                <Ionicons key={'icon'} style={{color: CommonStyles.DARK_RED, marginLeft: 5}} name={'ios-alert'} size={20} /> :
                                null
                            }
                        </CustomButton>
                        <CustomButton
                            onPress={this.setTagsDisplayAncestors}
                            deactivated={ancestorCategoriesTagCount == 0}
                            style={[
                                CommonStyles.styles.standardButtonCentered,
                                styles.rightSegment,
                                this.state.tagsDisplayMode == TAGS_DISPLAY_ANCESTORS ? styles.selectedSegment : styles.unselectedSegment ]}
                        >
                            <Text key={'text'}>{this.getAncestorTagsCountCaption()}</Text>
                            {
                                ancestorDuplicates.size > 0 ?
                                <Ionicons key={'icon'} style={{color: CommonStyles.DARK_RED, marginLeft: 5}} name={'ios-alert'} size={20} /> :
                                null
                            }
                        </CustomButton>
                    </View>
                    :
                    null
                }
            </View>
        );
    }
    
    render() {
        
        return (
            <View>
                { this.renderSegmentControl() }
                { this.state.tagsDisplayMode == TAGS_DISPLAY_SELF ? this.renderDuplicatesError() : this.renderAncestorDuplicatesError() }
                { this.renderTagContainers() }
            </View>
        );
    }
}

const styles = StyleSheet.create(
{
    leftSegment: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
    },
    rightSegment: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
    },
    selectedSegment:
    {
        flex: 0.5,
        fontSize: CommonStyles.SMALL_FONT_SIZE,
        backgroundColor: CommonStyles.TEXT_COLOR,
        color: CommonStyles.GLOBAL_FOREGROUND
    },
    unselectedSegment:
    {
        flex: 0.5,
        fontSize: CommonStyles.SMALL_FONT_SIZE
    },
    tagSegmentTitle: {
        justifyContent: 'center'
    },
    errorText: {
        color: CommonStyles.DARK_RED
    },
    successText: {
        color: CommonStyles.DARK_GREEN
    },
    errorTitle: {
        backgroundColor: CommonStyles.LIGHT_RED
    },
    successTitle: {
        backgroundColor: CommonStyles.LIGHT_GREEN
    }
});
    

export default withNavigation(CategorieTagsDisplay);