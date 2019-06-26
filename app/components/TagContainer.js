import React, { PureComponent } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    View,
    Text,
    TouchableOpacity
  } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Flag from './Flag';
import CommonStyles from '../styles/common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from './CustomButton';
import Tag from './Tag';
import ListItemSeparator from './ListItemSeparator';

import { createUpdateTagAction } from '../actions';

const DisplayType = {
    TAG_CLOUD: 0,
    MEDIA_COUNT: 1
};
  
function formatMediaCount(mediaCount) {
    if (mediaCount >= 0) {
        return mediaCount.toLocaleString();
    }
    return 'error';
}

class MediaCountItemUi extends React.PureComponent {
    constructor(props) {
        super(props);

        this.onDelete = this.onDelete.bind(this);

        this.state = {
            mediaCount: this.props.mediaCount
        }

        if (this.props.mediaCount == null) {
            global.hashtagUtil.getMediaCount(this.props.tagName)
            .then(mediaCount => {
                if (this.props.tagId) {
                    this.props.onMediaCountUpdated(this.props.tagId, mediaCount);
                } else {
                    // update the tag instance itself and the component state
                    this.updateMediaCountState(mediaCount);
                }
            })
            .catch(e => {
                if (this.props.tagId) {
                    this.props.onMediaCountUpdated(this.props.tagId, -1);
                } else {
                    // update the tag instance itself and the component state
                    this.updateMediaCountState(-1);
                }
            });
        }
    }

    updateMediaCountState(mediaCount) {
        this.props.tag.mediaCount = { count: mediaCount, timestamp: new Date() };
        this.setState({ mediaCount: formatMediaCount(mediaCount) });
    }

    onDelete() {

        if (this.props.onDelete) {
            this.props.onDelete(this.props.tagId);
        }
    }

    render() {

        const mediaCount = this.props.mediaCount || this.state.mediaCount;

        return (
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', padding: 5}}>
                <Text style={[
                    CommonStyles.styles.singleListItem,
                    CommonStyles.styles.smallLabel,
                    {paddingHorizontal: 0, flex: 1}]}
                    numberOfLines={1}>
                    {this.props.tagName}
                </Text>
                {
                    mediaCount == null ? <ActivityIndicator style={{marginRight: CommonStyles.GLOBAL_PADDING}} /> :
                    mediaCount == 'error' ? <Ionicons style={{color: CommonStyles.DARK_ORANGE, marginRight: CommonStyles.GLOBAL_PADDING }} name={'ios-warning'} size={24} /> :
                    <Text style={[CommonStyles.styles.singleListItem, CommonStyles.styles.smallLabel]} numberOfLines={1}>
                        {mediaCount}
                    </Text>
                }
                {
                    this.props.onDelete != null ?
                    <TouchableOpacity onPress={this.onDelete} disabled={this.props.onDelete == null}>
                        <Ionicons style={{color: CommonStyles.LIGHT_RED}} name={'ios-trash'} size={24} />
                    </TouchableOpacity>
                    :
                    null
                }
            </View>
        );
    }
}

const mapStateToProps = (state, ownProps) => {

    // Get tag from redux store if identifier is specified
    let tag = 
        ownProps.tag.id ?
        global.hashtagUtil.getTagFromId(ownProps.tag.id) :
        ownProps.tag ;
    
    let tagId = null;
    if (tag == undefined) {
        // If the tag does not exist in the redux store,
        // we have a new tag which does not exist yet, like during import summary
        tag = ownProps.tag;
    } else {
        tagId = tag.id;
    }

    return {
        tagId: tagId,
        tagName: tag.name,
        mediaCount: tag.mediaCount ? formatMediaCount(tag.mediaCount.count) : null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onMediaCountUpdated: (tagId, mediaCount) => {
            const tag = global.hashtagUtil.getTagFromId(tagId);
            const tagUpdated = {
                id: tag.id,
                name: tag.name,
                categories: tag.categories,
                mediaCount: {
                    count: mediaCount,
                    timestamp: new Date()
                }
            };
            global.hashtagPersistenceManager.updateTagMediaCount(tagUpdated.id, tagUpdated.mediaCount);
            dispatch(createUpdateTagAction(tagUpdated));
        }
    }
}

const MediaCountItem = connect(mapStateToProps, mapDispatchToProps)(MediaCountItemUi);

class TagDetailList extends React.PureComponent {
    
    constructor(props) {
        super(props);
        this.renderMediaCountItem = this.renderMediaCountItem.bind(this);
    }

    mediaCountKeyExtractor(item, index) {
        return item.id;
    }

    mustRefreshMediaCount(mediaCount) {

        if (mediaCount == null) {
            return true;
        }

        const refreshPeriod = global.settingsManager.getMediaCountRefreshPeriod();
        const refreshDate = global.hashtagPersistenceManager._getFirstDate(refreshPeriod);
        return mediaCount.timestamp <= refreshDate;
    }

    renderMediaCountItem({item}) {
        const mediaCount =
            this.mustRefreshMediaCount(item.mediaCount) ?
            null : item.mediaCount.count;

        return (
            <MediaCountItem
                tag={item}
                onDelete={this.props.onDelete}
                mediaCount={mediaCount}
            />
        );
    }

    render() {
        return (
            <FlatList
                data={this.props.tags}
                keyExtractor={this.mediaCountKeyExtractor}
                renderItem={this.renderMediaCountItem}
                ItemSeparatorComponent={ListItemSeparator}
            />
        );
    }
}

/**
 * - tags = tag collection
 * - onPressTag = callback when a tag is pressed
 * - onAdd = callback when selecting a new tag
 * - readOnly = true if the display is readonly, what means we cannot remove the tag
 * - addSharp = true pour ajouter le prefix #
 * - itemType = type of the displayed item (global.CATEGORY_ITEM or global.TAG_ITEM)
 * - hideIfEmpty = true to hide the contaner when the tag list is empty
 * - iconName = name of the icon to use
 */
export default class TagContainer extends React.PureComponent {

    static propTypes = {
        tags: PropTypes.array,                  // tag collection
        errors: PropTypes.object,               // set of tags which should be rendered as error
        warnings: PropTypes.object,             // set of tags which should be rendered as warningd (check error before)
        onPressTag: PropTypes.func,             // callback when a tag is pressed
        onAdd: PropTypes.func,                  // callback when selecting a new tag
        readOnly: PropTypes.bool,               // true if the display is readonly, what means we cannot remove the tag
        addSharp: PropTypes.bool,               // true pour ajouter le prefix #
        itemType: PropTypes.string,             // type of the displayed item (global.CATEGORY_ITEM or global.TAG_ITEM)
        hideIfEmpty: PropTypes.bool,            // true to hide the contaner when the tag list is empty
        iconName: PropTypes.string,             // name of the icon to use for each tag
        asObject: PropTypes.bool,               // true if tag objects are passed as input parameters instead of identifiers
        categoryId: PropTypes.string,           // Optional category identifier
        onNavigateToCategory: PropTypes.func,   // Callback function to navigate to category...
        expanded: PropTypes.bool ,              // true if tags are visible, false otherwise
        details: PropTypes.bool                 // true if the details view is available 
    };

    static defaultProps = {
        tags: [],
        errors: new Set(),
        warnings: new Set(),
        onPressTag: null,
        onAdd: null,
        readOnly: false,
        addSharp: true,
        itemType: global.TAG_ITEM,
        hideIfEmpty: false,
        iconName: 'ios-close-circle-outline',
        asObject: false,
        expanded: true,
        details: true
    };

    constructor(props) {
        super(props);
        this.navigateToCategory = this.navigateToCategory.bind(this);
        this.toggleExpanded = this.toggleExpanded.bind(this);
        this.toggleDisplayType = this.toggleDisplayType.bind(this);
        this.state = {
            expanded: this.props.expanded,
            displayType: DisplayType.TAG_CLOUD
        };
    }

    navigateToCategory() {
        if (this.props.categoryId && this.props.onNavigateToCategory) {
            this.props.onNavigateToCategory(this.props.categoryId);
        }
    }

    toggleExpanded() {
        this.setState({ expanded: !this.state.expanded });
    }

    toggleDisplayType() {
        const displayType = this.state.displayType == DisplayType.TAG_CLOUD ? DisplayType.MEDIA_COUNT : DisplayType.TAG_CLOUD;
        this.setState({ displayType: displayType });
    }

    renderDisplaySelector() {

        const tabStyle = {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center'
        };

        const selectedStyle = {
            ...tabStyle,
            borderBottomColor: CommonStyles.SELECTED_TEXT_COLOR,
            borderBottomWidth: 2,
            padding: 5
        };

        const notSelectedStyle = {
            ...tabStyle,
            borderBottomColor: CommonStyles.SEPARATOR_COLOR,
            borderBottomWidth: 1,
            padding: 5
        };

        const selectedTextStyle = {
            color: CommonStyles.SELECTED_TEXT_COLOR,
            fontWeight: 'bold'
        };

        const notSelectedTextStyle = {
            color: CommonStyles.TEXT_COLOR,
            fontWeight: 'normal'
        };

        const notAvailableIconStyle = {
            color: CommonStyles.DEACTIVATED_TEXT_COLOR
        }

        const mediaCountActive = this.state.displayType == DisplayType.MEDIA_COUNT;

        const tagCloudIconStyle = mediaCountActive ? selectedTextStyle : notSelectedTextStyle;
        const detailsIconStyle =
            this.props.details == false ? notAvailableIconStyle :
            mediaCountActive ? selectedTextStyle : notSelectedTextStyle;

        return (
            <View style={{flexDirection: 'row', flex: 1, backgroundColor: CommonStyles.SEPARATOR_COLOR}}>
                <TouchableOpacity
                    onPress={this.toggleDisplayType}
                    disabled={!mediaCountActive}
                    style={mediaCountActive ? notSelectedStyle : selectedStyle}>
                    <Ionicons style={tagCloudIconStyle} name={'ios-keypad'} size={25} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.toggleDisplayType}
                    disabled={this.state.displayType == DisplayType.MEDIA_COUNT || this.props.details == false}
                    style={mediaCountActive ? selectedStyle : notSelectedStyle}>
                    <Ionicons style={detailsIconStyle} name={'md-list'} size={25} />
                </TouchableOpacity>
            </View>
        );
    }
    
    render() {

        let tagList =
            this.props.asObject ?
            this.props.tags :
            this.props.tags.map(id => global.hashtagUtil.getTagFromId(id) );

        if (tagList.length == 0 && this.props.hideIfEmpty) {
            return null;
        }

        tagList.sort((t1, t2) => t1.name.localeCompare(t2.name));

        let tagContainerBordersStyle = StyleSheet.flatten(styles.tagContainerBorders);

        if (this.props.label == null) {
            tagContainerBordersStyle = { borderTopLeftRadius: CommonStyles.BORDER_RADIUS, ...tagContainerBordersStyle };
        }

        return (
            <View style={this.props.style}>
                {
                    this.props.label || !this.props.readOnly ?
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: this.props.label ? 'space-between' : 'center'}}>
                        {
                            this.props.label ?
                            <TouchableOpacity onPress={this.toggleExpanded} style={styles.tagContainerLabel}>
                                <Text style={[CommonStyles.styles.mediumLabel, {fontWeight: 'bold'}]}>{this.props.label}</Text>
                                <Flag caption={this.props.count} style={[
                                    this.props.count > global.settingsManager.getMaxNumberOfTags() ? styles.countFlagError : styles.countFlag,
                                    {marginLeft: 5}
                                ]}/>
                            </TouchableOpacity>
                            :
                            null
                        }
                        {
                            this.props.readOnly || this.props.onAdd == null ?
                            null
                            :
                            <CustomButton title={'Add a Tag...'} onPress={this.props.onAdd} style={CommonStyles.styles.standardButton}/>
                        }
                        {
                            this.props.categoryId && this.props.onNavigateToCategory ?
                            <View style={styles.addTagButton}>
                                <TouchableOpacity onPress={this.navigateToCategory}>
                                    <Ionicons style={{color: CommonStyles.MEDIUM_GREEN}} name={'ios-eye'} size={30} />
                                </TouchableOpacity>
                            </View>
                            :
                            null
                        }
                    </View>
                    :
                    null
                }
                {
                    this.state.expanded ?
                    <View style={tagContainerBordersStyle}>
                        { this.renderDisplaySelector() }
                        <View style={styles.tagContainer}>
                        {
                            this.state.displayType == DisplayType.TAG_CLOUD ?
                            tagList.map(tag => {
                                const tagColorStyle =
                                    this.props.errors.has(tag.id) ? styles.tagErrColor :
                                    this.props.warnings.has(tag.id) ? styles.tagWarnColor :
                                    styles.tagStdColor;
                                return (
                                    <Tag
                                        style={tagColorStyle}
                                        key={tag.id}
                                        id={tag.id}
                                        name={(this.props.addSharp ? '#' : '') + tag.name}
                                        onPress={this.props.readOnly ? null : this.props.onPressTag}
                                        iconName={this.props.iconName}
                                    />
                                );
                            })
                            :
                            <TagDetailList
                                tags={tagList}
                                onDelete={this.props.readOnly ? null : this.props.onPressTag}
                            />
                        }
                        </View>
                    </View> :
                    null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create(
{
    tagStdColor: {
        backgroundColor: CommonStyles.GLOBAL_FOREGROUND,
    },
    tagErrColor: {
        backgroundColor: CommonStyles.DARK_RED,
    },
    tagWarnColor: {
        backgroundColor: CommonStyles.DARK_ORANGE,
    },
    tagContainerLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: CommonStyles.SEPARATOR_COLOR,
        borderWidth: 1,
        borderTopLeftRadius: CommonStyles.BORDER_RADIUS,
        borderTopRightRadius: CommonStyles.BORDER_RADIUS,
        borderBottomWidth: 0,
        paddingHorizontal: CommonStyles.GLOBAL_PADDING,
        backgroundColor: CommonStyles.SEPARATOR_COLOR
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: CommonStyles.GLOBAL_PADDING,
        paddingHorizontal: CommonStyles.GLOBAL_PADDING,
        minHeight: 53
    },
    tagContainerBorders: {
        borderTopRightRadius: CommonStyles.BORDER_RADIUS,
        borderBottomLeftRadius: CommonStyles.BORDER_RADIUS,
        borderBottomRightRadius: CommonStyles.BORDER_RADIUS,
        borderColor: CommonStyles.SEPARATOR_COLOR,
        borderWidth: 1
    },
    addTagButton: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    countFlagError: {
        color: CommonStyles.DARK_RED,
        backgroundColor: CommonStyles.LIGHT_RED
    },
    countFlag: {
        color: CommonStyles.DARK_GREEN,
        backgroundColor: CommonStyles.LIGHT_GREEN
    }
});