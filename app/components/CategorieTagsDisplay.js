import React, { PureComponent } from 'react';
import { withNavigation } from 'react-navigation';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import TagContainer from './TagContainer';
import CustomButton from './CustomButton';

import CommonStyles from '../styles/common'; 

const TAGS_DISPLAY_SELF = 0;
const TAGS_DISPLAY_ANCESTORS = 1;

class CategorieTagsDisplay extends React.PureComponent {
    
    constructor(props) {
        super(props);

        this.state = {
            tags: this.props.tags || [],
            tagsDisplayMode: TAGS_DISPLAY_SELF,
        };

        // Callbacks for tag management
        this.onSelectCategoryTags = this.onSelectCategoryTags.bind(this);
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

    onSelectCategoryTags() {

        const params = {
            mode: global.LIST_SELECTION_MODE,
            selection: this.state.tags,
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
            // Return tags from the edited category
            return (
                <TagContainer style={{ marginTop: 10 }}
                    tags={this.state.tags}
                    label={ this.state.tags.length + ' tag(s) in this category'}
                    itemType={global.TAG_ITEM}
                    onDelete={this.onDeleteTag}
                    onAdd={this.onSelectCategoryTags}
                    readOnly={false}
                    addSharp={true}
                />
            );
        }

        // Return tags from ancestor
        const parentId = this.props.parentCategory;
        if (parentId == null) {
            // no parent...
            return null;
        }

        const ancestors = global.hashtagManager.getAncestorCategories(parentId);

        return (
            ancestors.map(cat => {
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
    
    render() {

        // In case of a category item, get the count of tags from ancestor categories
        const parentId = this.props.parentCategory;
        const ancestorCategoriesTagCount = parentId != null ? global.hashtagManager.getAncestorCategoriesTagCount(parentId) : 0;

        return (
            <View>
                <View style={[CommonStyles.styles.standardTile, styles.tagSegmentTitle]}>
                    <Text style={CommonStyles.styles.mediumLabel}>{ancestorCategoriesTagCount + this.state.tags.length} Tag(s) in total</Text>
                </View>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <CustomButton
                        onPress={this.setTagsDisplaySelf}
                        title={this.state.tags.length + ' in this category'}
                        style={[
                            CommonStyles.styles.standardButton,
                            styles.leftSegment,
                            this.state.tagsDisplayMode == TAGS_DISPLAY_SELF ? styles.selectedSegment : styles.unselectedSegment]}
                    />
                    <CustomButton
                        onPress={this.setTagsDisplayAncestors}
                        deactivated={ancestorCategoriesTagCount == 0}
                        title={ancestorCategoriesTagCount + ' from ancestors'}
                        style={[
                            CommonStyles.styles.standardButton,
                            styles.rightSegment,
                            this.state.tagsDisplayMode == TAGS_DISPLAY_ANCESTORS ? styles.selectedSegment : styles.unselectedSegment ]}
                    />
                </View>
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
        justifyContent: 'center',
        fontSize: CommonStyles.SMALL_FONT_SIZE,
        borderColor: CommonStyles.SEPARATOR_COLOR,
        borderTopWidth: 0,
        backgroundColor: CommonStyles.TEXT_COLOR,
        color: CommonStyles.GLOBAL_FOREGROUND
    },
    unselectedSegment:
    {
        flex: 0.5,
        justifyContent: 'center',
        fontSize: CommonStyles.SMALL_FONT_SIZE,
        borderColor: CommonStyles.SEPARATOR_COLOR,
        borderTopWidth: 1,
        backgroundColor: CommonStyles.GLOBAL_FOREGROUND,
        color: CommonStyles.TEXT_COLOR
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