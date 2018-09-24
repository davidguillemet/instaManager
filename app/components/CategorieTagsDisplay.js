import React, { PureComponent } from 'react';
import { withNavigation } from 'react-navigation';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import Ionicons from 'react-native-vector-icons/Ionicons';

import TagContainer from './TagContainer';
import CustomButton from './CustomButton';

import CommonStyles from '../styles/common'; 

const TAGS_DISPLAY_SELF = 0;
const TAGS_DISPLAY_ANCESTORS = 1;

class CategorieTagsDisplay extends React.PureComponent {

    static propTypes = {
        tags: PropTypes.array,                              // Tags from the current category/publication - might be null or empty
        onDeleteTag: PropTypes.func.isRequired,             // callback when deleting a tag
        onTagSelectionValidated: PropTypes.func.isRequired, // callback when the button is pressed if not deactivated
        parentCategory: PropTypes.string,                   // identifier of the parent category - optional
        itemType: PropTypes.string.isRequired,              // item type - optional
        showSegmentControl: PropTypes.bool                  // true to display the segment control - optional - default is true
    };

    static defaultProps = {
        tags: [],
        showSegmentControl: true
    };

    constructor(props) {
        super(props);
        
        this.state = {
            tags: this.props.tags,
            tagsDisplayMode: this.props.itemType == global.CATEGORY_ITEM || this.props.showSegmentControl == false ? TAGS_DISPLAY_SELF : TAGS_DISPLAY_ANCESTORS /* publication */,
        };

        // Callbacks for tag management
        this.onSelectTags = this.onSelectTags.bind(this);
        this.onTagSelectionValidated = this.onTagSelectionValidated.bind(this);
        this.onDeleteTag = this.onDeleteTag.bind(this);
        
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
                
        this.getCategoryDuplicatedTags = createSelector(
            this.getAncestorsTags,
            ancestorTags => {
                const duplicates = new Set();
                this.state.tags.forEach(tagId => {
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
                <TagContainer style={{ marginTop: 10 }}
                    tags={tags}
                    label={tagsCount + ' tag(s) in this ' + global.hashtagUtil.getItemTypeCaption(this.props.itemType)}
                    itemType={global.TAG_ITEM}
                    onPressTag={this.onDeleteTag}
                    onAdd={this.onSelectTags}
                    readOnly={false}
                    addSharp={true}
                    errors={this.getCategoryDuplicatedTags(this.props)}
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
                return (
                    cat.hashtags.length > 0 ?
                    <TagContainer
                        style={{ marginTop: 10 }}
                        label={cat.hashtags.length + ' tag(s) in ' + cat.name}
                        key={cat.id}
                        tags={cat.hashtags}
                        itemType={global.TAG_ITEM}
                        readOnly={true}
                        addSharp={true}
                        errors={this.getAncestorsDuplicatedTags(this.props)}
                    />
                    :
                    null
                );
            })
        );
    }

    getCategoryOwnTagsCount() {

        return this.state.tags.length - this.getCategoryDuplicatedTags(this.props).size;
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

        const duplicates = this.getCategoryDuplicatedTags(this.props);

        if (duplicates.size == 0) {
            return null;
        }

        return (
            <CustomButton
                onPress={this.setTagsDisplaySelf}
                title={'Some tags in this category that already belong to the parent category are ignored.'}
                style={[CommonStyles.styles.standardButtonCentered, CommonStyles.styles.smallLabel, styles.errorTitle, styles.errorText]}
            />
        );
    }

    renderAncestorDuplicatesError() {

        const ancestorDuplicates = this.getAncestorsDuplicatedTags(this.props);

        if (ancestorDuplicates.size == 0) {
            return null;
        }
        
        return (
            <CustomButton
                onPress={this.setTagsDisplayAncestors}
                title={'The category hierarchy contains duplicated tags'}
                style={[CommonStyles.styles.standardButtonCentered, CommonStyles.styles.smallLabel, styles.errorTitle, styles.errorText]}
            />
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

        return (
            <View>
                { this.renderTagsCountCaption() }
                { this.renderAncestorDuplicatesError() }
                { this.renderDuplicatesError() }
                {
                    this.props.showSegmentControl === true ?
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <CustomButton
                            onPress={this.setTagsDisplaySelf}
                            title={this.getOwnTagsCountCaption()}
                            style={[
                                CommonStyles.styles.standardButtonCentered,
                                styles.leftSegment,
                                this.state.tagsDisplayMode == TAGS_DISPLAY_SELF ? styles.selectedSegment : styles.unselectedSegment]}
                        />
                        <CustomButton
                            onPress={this.setTagsDisplayAncestors}
                            deactivated={ancestorCategoriesTagCount == 0}
                            title={this.getAncestorTagsCountCaption()}
                            style={[
                                CommonStyles.styles.standardButtonCentered,
                                styles.rightSegment,
                                this.state.tagsDisplayMode == TAGS_DISPLAY_ANCESTORS ? styles.selectedSegment : styles.unselectedSegment ]}
                        />
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