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
    }

    onDeleteTag(tagId) {

        let newSelection = this.state.tags.filter(id => id != tagId);
        this.setState( {
            tags: newSelection
        });

        this.props.onDeleteTag(tagId);
    }

    onSelectTags() {

        const unavailableTags = this.ancestors.reduce((set, cat) => { cat.hashtags.forEach(tagId => set.add(tagId)); return set; }, new Set());

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

    getAncestorsTagCount() {
        return  this.ancestors != null && this.ancestors.length > 0 ?
                this.ancestors.reduce((count, cat) => count + cat.hashtags.length, 0) :
                0;
    }

    renderTagContainers() {

        if (this.state.tagsDisplayMode == TAGS_DISPLAY_SELF) {

            let tagsCount = this.state.tags.length;
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
                />
            );
        }

        if (this.ancestors.length == 0) {
            // no parent...
            return null;
        }

        return (
            this.ancestors.map(cat => {
                return (
                    <TagContainer
                        style={{ marginTop: 10 }}
                        label={cat.hashtags.length + ' tag(s) in ' + cat.name}
                        key={cat.id}
                        tags={cat.hashtags}
                        itemType={global.TAG_ITEM}
                        readOnly={true}
                        addSharp={true} />
                );
            })
        );
    }

    renderSegmentControl() {

        const ancestorCategoriesTagCount = this.getAncestorsTagCount();

        if (this.props.showSegmentControl === false) {
            return null;
        }

        return (
            <View>
                <View style={[CommonStyles.styles.standardTile, styles.tagSegmentTitle]}>
                    <Text style={CommonStyles.styles.mediumLabel}>{ancestorCategoriesTagCount + this.state.tags.length} Tag(s) in total</Text>
                </View>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <CustomButton
                        onPress={this.setTagsDisplaySelf}
                        title={this.state.tags.length + ' in this ' + global.hashtagUtil.getItemTypeCaption(this.props.itemType)}
                        style={[
                            CommonStyles.styles.standardButtonCentered,
                            styles.leftSegment,
                            this.state.tagsDisplayMode == TAGS_DISPLAY_SELF ? styles.selectedSegment : styles.unselectedSegment]}
                    />
                    <CustomButton
                        onPress={this.setTagsDisplayAncestors}
                        deactivated={ancestorCategoriesTagCount == 0}
                        title={ancestorCategoriesTagCount + ' from ' + (this.props.itemType == global.CATEGORY_ITEM ? 'ancestors' : 'the category')}
                        style={[
                            CommonStyles.styles.standardButtonCentered,
                            styles.rightSegment,
                            this.state.tagsDisplayMode == TAGS_DISPLAY_ANCESTORS ? styles.selectedSegment : styles.unselectedSegment ]}
                    />
                </View>
            </View>
        );
    }
    
    render() {

        // In case of a category item, get the count of tags from ancestor categories
        this.ancestors = this.props.parentCategory != null ? global.hashtagUtil.getAncestorCategories(this.props.parentCategory) : [];
        
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
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
    },
    rightSegment: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
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
        marginTop: 15,
        marginBottom: 0,
        justifyContent: 'center',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    }
});
    

export default withNavigation(CategorieTagsDisplay);