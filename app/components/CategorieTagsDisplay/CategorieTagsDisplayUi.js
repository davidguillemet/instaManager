import React from 'react';
import { withNavigation } from 'react-navigation';
import {
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
    Text
} from 'react-native';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';

import TagContainer from '../TagContainer';
import CustomButton from '../CustomButton';
import Flag from '../Flag';
import Message from '../Message';

import CommonStyles from '../../styles/common'; 

const TAGS_DISPLAY_ALL = 'all';
const TAGS_DISPLAY_SELF = 'self';
const TAGS_DISPLAY_ANCESTORS = 'ancestors';

class CategorieTagsDisplayUi extends React.PureComponent {

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
        initialDisplayMode: TAGS_DISPLAY_SELF
    };

    constructor(props) {
        super(props);
        
        this.state = {
            tags: this.props.tags,
            tagsDisplayMode: this.props.initialDisplayMode
        };

        // Callbacks for tag management
        this.onNavigateToCategory = this.onNavigateToCategory.bind(this);
        this.onSelectTags = this.onSelectTags.bind(this);
        this.onTagSelectionValidated = this.onTagSelectionValidated.bind(this);
        this.onDeleteTag = this.onDeleteTag.bind(this);
        this.removeAllDuplicated = this.removeAllDuplicated.bind(this);
        
        // Callbacks for display management
        this.getCategoryOwnTagsCount = this.getCategoryOwnTagsCount.bind(this);

        this.renderOverviewMenuItem = this.renderOverviewMenuItem.bind(this);
        
        this.getAncestorCategories = props => props.ancestorCategories;
        this.getAncestorsTags = props => props.ancestorTags;
        this.getAncestorsDuplicatedTags = props => props.ancestorsDuplicatedTags;
          
    
        // All selectors must have the same signature
        // since only categoryOwnTagsSelector needs the state, we define it as second parameter
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

    onNavigateToCategory(catId) {
        const params = {
            itemId: catId,
            itemType: global.CATEGORY_ITEM
        };
        this.props.navigation.navigate('HashtagCategoryEdit', params);
    }

    onTagSelectionValidated(selection) {

        this.setState( {
            tags: selection,
        });

        this.props.onTagSelectionValidated(selection);
    }

    renderTagContainers() {

        if (this.state.tagsDisplayMode == TAGS_DISPLAY_SELF) {

            // Create a new set to make sure the result from the memoized function getCategoryDuplicatedTags() is not modified
            const duplicatedTags = new Set(this.getCategoryDuplicatedTags(this.props, this.state));

            // Return tags from the edited category
            return (
                <View>
                    <CustomButton title={'Add a Tag...'} onPress={this.onSelectTags} style={CommonStyles.styles.standardButton}/>
                    <TagContainer
                        tags={this.state.tags}
                        itemType={global.TAG_ITEM}
                        onPressTag={this.onDeleteTag}
                        readOnly={false}
                        addSharp={true}
                        errors={duplicatedTags}
                        style={{ marginBottom: 10 }}
                    />
                </View>
            );
        }

        if (this.state.tagsDisplayMode == TAGS_DISPLAY_ALL) {

            const tagSet = new Set(global.hashtagUtil.getTagsFromCategoryHierarhchy(this.props.parentCategory));
            // Add tags from current category
            this.state.tags.forEach(tagId => {
                tagSet.add(tagId);
            });

            // Create a new set to make sure the result from the memoized function getCategoryDuplicatedTags() is not modified
            const duplicatedTags = new Set(this.getCategoryDuplicatedTags(this.props, this.state));
            // Add duplicated tags from ancestors
            const ancestorDuplicatedTags = this.props.onGetAncestorDuplicatedTags({ parentCategory: this.props.parentCategory });
            ancestorDuplicatedTags.forEach(tagId => {
                duplicatedTags.add(tagId);
            });

            return (
                <TagContainer
                    tags={[...tagSet]}
                    itemType={global.TAG_ITEM}
                    readOnly={true}
                    addSharp={true}
                    warnings={duplicatedTags}
                    style={{ marginBottom: 10 }}
                />
            );

        }

        const ancestors = this.props.ancestorCategories;
        if (ancestors.length == 0) {
            // no parent...
            return null;
        }

        const allDuplicatedTagsInHierarchy = new Set(this.props.onGetAncestorDuplicatedTags({ parentCategory: ancestors[ancestors.length - 1].id }));
        // We also consider all tags from the current category as warnings for ancestors
        this.state.tags.forEach(tagId => {
            allDuplicatedTagsInHierarchy.add(tagId);
        });

        return (
            ancestors.map(cat => {
                if (cat.hashtags.length == 0) {
                    return null;
                }
                
                const duplicatedTags = this.props.onGetAncestorDuplicatedTags({ parentCategory: cat.id });
                const countWithoutDuplicated = cat.hashtags.reduce((count, tagId) => { return duplicatedTags.has(tagId) ? count : count + 1; } , 0);
                
                return (
                    <TagContainer
                        style={{ marginBottom: 10 }}
                        label={cat.name}
                        count={countWithoutDuplicated}
                        key={cat.id}
                        tags={cat.hashtags}
                        itemType={global.TAG_ITEM}
                        readOnly={true}
                        addSharp={true}
                        warnings={allDuplicatedTagsInHierarchy}
                        errors={duplicatedTags}
                        categoryId={cat.id}
                        onNavigateToCategory={this.onNavigateToCategory}
                    />
                );
            })
        );
    }

    getCategoryOwnTagsCount() {

        const categoryDuplicatedTags = this.getCategoryDuplicatedTags(this.props, this.state);
        return this.state.tags.length - categoryDuplicatedTags.size;
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
            <Message message={'The category hierarchy contains duplicated tags.'} error />
        )        
    }

    renderAllDuplicatesError() {

        const duplicates = this.getCategoryDuplicatedTags(this.props, this.state);

        if (duplicates.size == 0) {
            // No duplicates in the current category, search in anbcestors
            const ancestorDuplicates = this.getAncestorsDuplicatedTags(this.props);
            if (ancestorDuplicates.size == 0) {
                return null;
            }
        }
        return (
            <Message message={'The category hierarchy contains duplicated tags.'} error />
        )        
    }

    getOwnTagsCountCaption() {

        const caption = 'This ' + global.hashtagUtil.getItemTypeCaption(this.props.itemType);
        return caption;
    }

    getAncestorTagsCountCaption() {

        const caption = (this.props.itemType == global.CATEGORY_ITEM ? 'Ancestors' : 'Category');

        return caption;
    }

    getErrorFlag() {
        return (
            <Flag caption={'!'} style={{
                ...styles.errorTitle,
                ...styles.errorText,                    
                fontWeight: 'bold',
                marginLeft: 5}}/>
        );
    }

    renderOverviewSeparator() {

        return (
            <View style={{ width: CommonStyles.GLOBAL_PADDING }}></View>
        );
    }

    renderOverview() {

        if (this.props.itemType === global.PUBLICATION_ITEM) {
            return null;
        }

        let data = [];
        data.push({ key: TAGS_DISPLAY_SELF });
        if (this.props.parentCategory != null) {
            data.push({ key: TAGS_DISPLAY_ANCESTORS });
            data.push({ key: TAGS_DISPLAY_ALL });
        }

        return (
            <FlatList style={{ marginVertical: CommonStyles.GLOBAL_PADDING }}
                data={data}
                renderItem={this.renderOverviewMenuItem}
                horizontal={true}
                ItemSeparatorComponent={this.renderOverviewSeparator}
                indicatorStyle={'white'}
            />
        )
    }

    switchDisplayMode(displayMode) {
        
        this.setState({
            tagsDisplayMode: displayMode
        });

    }

    getOverviewItemCaption(displayMode) {

        switch (displayMode) {

            case TAGS_DISPLAY_ALL:
                return 'Total';
            case TAGS_DISPLAY_SELF:
                return this.props.itemType === global.PUBLICATION_ITEM ? '' : 'This Category';
            case TAGS_DISPLAY_ANCESTORS:
                const ancestorsCount = global.hashtagUtil.getAncestorCategories(this.props.parentCategory).length;
                return `${ancestorsCount} Ancestor(s)`;
            default:
                throw `unknown display mode: ${displayMode}`;
        }
    }

    getOverviewItemData(displayMode) {

        const ancestorCategoriesTagCount = this.getAncestorTagsCount(this.props);
        const categoryOwnTagsCount = this.getCategoryOwnTagsCount();
        const categoryHasDuplicates = this.getCategoryDuplicatedTags(this.props, this.state).size > 0;
        const ancestorsHaveDuplicates = this.getAncestorsDuplicatedTags(this.props).size > 0;
        
        let error = false;
        let hasDuplicatesError = false;
        let data = null;
        
        switch (displayMode) {

            case TAGS_DISPLAY_SELF:
                if (this.props.parentCategory == null || categoryOwnTagsCount > this.props.maxTagsCount) {
                    data = `${categoryOwnTagsCount} / ${this.props.maxTagsCount}`;
                    error = categoryOwnTagsCount > this.props.maxTagsCount;
                } else {
                    data =  categoryOwnTagsCount;
                }
                hasDuplicatesError = categoryHasDuplicates;
                break;
            case TAGS_DISPLAY_ANCESTORS:
                if (ancestorCategoriesTagCount > this.props.maxTagsCount) {
                    data = `${ancestorCategoriesTagCount} / ${this.props.maxTagsCount}`;
                    error = true;
                } else {
                    data =  ancestorCategoriesTagCount;
                }
                hasDuplicatesError = ancestorsHaveDuplicates;
                break;
            case TAGS_DISPLAY_ALL:
                    const totalTags = ancestorCategoriesTagCount + categoryOwnTagsCount;
                    data = `${totalTags} / ${this.props.maxTagsCount}`;
                    error = totalTags > this.props.maxTagsCount;
                    hasDuplicatesError = categoryHasDuplicates || ancestorsHaveDuplicates;
                    break;
            default:
                throw `unknown display mode: ${displayMode}`;
        }

        let flagStyle = {
            marginLeft: 5
        };

        if (error) {
            flagStyle = {
                ...styles.errorTitle,
                ...styles.errorText,                    
                ...flagStyle
            }
        } else {
            flagStyle = {
                ...styles.successTitle,
                ...styles.successText,                    
                ...flagStyle
            }
        }
        
        return (
            <View style={{ flexDirection: 'row'}}>
                <Flag caption={data} style={flagStyle}/>
                {
                    hasDuplicatesError ?
                    this.getErrorFlag() :
                    null
                }
            </View>
        );
    }

    renderOverviewMenuItem({item}) {

        const disabled = item.key == this.state.tagsDisplayMode || (item.key == TAGS_DISPLAY_ANCESTORS && this.props.parentCategory == null);
        const selected = item.key == this.state.tagsDisplayMode;
        let containerViewStyle = {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: CommonStyles.SEPARATOR_COLOR,
            borderRadius: 22,
            paddingRight: CommonStyles.GLOBAL_PADDING,
            paddingVertical: CommonStyles.GLOBAL_PADDING
        };

        let textStyle = {
            paddingHorizontal: CommonStyles.GLOBAL_PADDING
        };
        if (selected) {
            textStyle = { ...textStyle, color: CommonStyles.SELECTED_TEXT_COLOR };
            containerViewStyle = {
                backgroundColor: CommonStyles.SEPARATOR_COLOR,
                ...containerViewStyle
            }
        }
        if (disabled && !selected) {
            textStyle = { color: CommonStyles.DEACTIVATED_TEXT_COLOR, ...textStyle };
        }

        return (
            <TouchableOpacity onPress={() => this.switchDisplayMode(item.key)} disabled={disabled} style={containerViewStyle}>
                <Text style={[CommonStyles.styles.mediumLabel, textStyle]}>{this.getOverviewItemCaption(item.key)}</Text>
                { this.getOverviewItemData(item.key) }
            </TouchableOpacity>
        );
    }

    render() {
        
        return (
            <View style={{paddingBottom: CommonStyles.GLOBAL_PADDING}}>
                { this.renderOverview() }
                { 
                    this.state.tagsDisplayMode == TAGS_DISPLAY_SELF ? this.renderDuplicatesError() :
                    this.state.tagsDisplayMode == TAGS_DISPLAY_ANCESTORS ? this.renderAncestorDuplicatesError() : 
                    this.renderAllDuplicatesError()
                }
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
    

export default withNavigation(CategorieTagsDisplayUi);