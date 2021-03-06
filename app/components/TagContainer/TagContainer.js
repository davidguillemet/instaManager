import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
  } from 'react-native';
import PropTypes from 'prop-types';
import Flag from '../Flag';
import CommonStyles from '../../styles/common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../CustomButton';
import Tag from '../Tag';
import TagDetailList from './TagDetailList';

import TabBar from '../TabBar';

const DisplayType = {
    TAG_CLOUD: 0,
    MEDIA_COUNT: 1
};

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

    renderTagList(tagList) {

        if (tagList.length == 0) {
            return (
                <View style={{flex: 1, alignItems: 'center', padding: CommonStyles.GLOBAL_PADDING}}>
                    <Text style={CommonStyles.styles.mediumLabel}>This category is empty</Text>
                </View>
            );
        }

        tagList.sort((t1, t2) => t1.name.localeCompare(t2.name));

        return (
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
                        <TabBar selectedIndex={0} tabBarItems={[{ icon: 'ios-keypad' }, { icon: 'md-list' }]} animationDuration={300}>
                            <View style={styles.tagContainer}>
                                { this.renderTagList(tagList) }
                            </View>
                            <View style={styles.tagContainer}>
                                <TagDetailList
                                    tags={tagList}
                                    errors={this.props.errors}
                                    onDelete={this.props.readOnly ? null : this.props.onPressTag}
                                />
                            </View>
                        </TabBar>
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
        //paddingHorizontal: CommonStyles.GLOBAL_PADDING,
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