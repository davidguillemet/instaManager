import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
  } from 'react-native';

import PropTypes from 'prop-types';
import Flag from './Flag';
import CommonStyles from '../styles/common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Tag from './Tag';

  
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
        onPressTag: PropTypes.func,             // callback when a tag is pressed
        onAdd: PropTypes.func,                  // callback when selecting a new tag
        readOnly: PropTypes.bool,               // true if the display is readonly, what means we cannot remove the tag
        addSharp: PropTypes.bool,               // true pour ajouter le prefix #
        itemType: PropTypes.string,             // type of the displayed item (global.CATEGORY_ITEM or global.TAG_ITEM)
        hideIfEmpty: PropTypes.bool,            // true to hide the contaner when the tag list is empty
        iconName: PropTypes.string,             // name of the icon to use for each tag
        asObject: PropTypes.bool,               // true if tag objects are passed as input parameters instead of identifiers
        categoryId: PropTypes.string,           // Optional category identifier
        onNavigateToCategory: PropTypes.func    // Callback function to navigate to category...
    };

    static defaultProps = {
        tags: [],
        errors: new Set(),
        onPressTag: null,
        onAdd: null,
        readOnly: false,
        addSharp: true,
        itemType: global.TAG_ITEM,
        hideIfEmpty: false,
        iconName: 'ios-close-circle-outline',
        asObject: false
    };

    constructor(props) {
        super(props);
        this.navigateToCategory = this.navigateToCategory.bind(this);
    }

    navigateToCategory() {
        if (this.props.categoryId && this.props.onNavigateToCategory) {
            this.props.onNavigateToCategory(this.props.categoryId);
        }
    }
    
    render() {

        let tagList =
            this.props.asObject ?
            this.props.tags :
            this.props.tags.map(id => global.hashtagUtil.getTagFromId(id) );

        if (tagList.length == 0 && this.props.hideIfEmpty) {
            return null;
        }

        let tagContainerStyle = StyleSheet.flatten(styles.tagContainer);

        if (this.props.label == null) {
            tagContainerStyle = { borderTopLeftRadius: CommonStyles.BORDER_RADIUS, ...tagContainerStyle };
        }

        return (
            <View style={this.props.style}>
                {
                    this.props.label || !this.props.readOnly ?
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
                        {
                            this.props.label ?
                            <View style={styles.tagContainerLabel}>
                                <Text style={[CommonStyles.styles.smallLabel, {fontWeight: 'bold', fontStyle: 'italic'}]}>{this.props.label}</Text>
                                <Flag caption={this.props.count} style={{marginLeft: 5}}/>
                            </View>
                            :
                            null
                        }
                        {
                            this.props.readOnly || this.props.onAdd == null ?
                            null
                            :
                            <View style={styles.addTagButton}>
                                <TouchableOpacity onPress={this.props.onAdd}>
                                    <Ionicons style={{color: CommonStyles.MEDIUM_GREEN}} name={'ios-add-circle'} size={30} />
                                </TouchableOpacity>
                            </View>
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
                <View style={tagContainerStyle}>
                    {
                        tagList.sort((t1, t2) => t1.name.localeCompare(t2.name)).map(tag => {
                            const tagColorStyle = this.props.errors.has(tag.id) ? styles.tagErrColor : styles.tagStdColor;
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
                    }
                </View>
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
    tagContainerLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: CommonStyles.SEPARATOR_COLOR,
        borderWidth: 1,
        borderTopLeftRadius: CommonStyles.BORDER_RADIUS,
        borderTopRightRadius: CommonStyles.BORDER_RADIUS,
        borderBottomWidth: 0,
        paddingHorizontal: CommonStyles.GLOBAL_PADDING
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: CommonStyles.GLOBAL_PADDING,
        paddingHorizontal: CommonStyles.GLOBAL_PADDING,
        borderTopRightRadius: CommonStyles.BORDER_RADIUS,
        borderBottomLeftRadius: CommonStyles.BORDER_RADIUS,
        borderBottomRightRadius: CommonStyles.BORDER_RADIUS,
        borderColor: CommonStyles.SEPARATOR_COLOR,
        borderWidth: 1,
        minHeight: 53
    },
    addTagButton: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});