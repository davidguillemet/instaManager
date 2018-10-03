import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
  } from 'react-native';

import PropTypes from 'prop-types';

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
        tags: PropTypes.array,          // tag collection
        errors: PropTypes.object,       // set of tags which should be rendered as error
        onPressTag: PropTypes.func,     // callback when a tag is pressed
        onAdd: PropTypes.func,          // callback when selecting a new tag
        readOnly: PropTypes.bool,       // true if the display is readonly, what means we cannot remove the tag
        addSharp: PropTypes.bool,       // true pour ajouter le prefix #
        itemType: PropTypes.string,     // type of the displayed item (global.CATEGORY_ITEM or global.TAG_ITEM)
        hideIfEmpty: PropTypes.bool,    // true to hide the contaner when the tag list is empty
        iconName: PropTypes.string,     // name of the icon to use for each tag
        asObject: PropTypes.bool        // true if tag objects are passed as input parameters instead of identifiers
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
    }
    render() {

        let tagList =
            this.props.asObject ?
            this.props.tags :
            this.props.tags.reduce((arr, id) => { arr.push(global.hashtagUtil.getTagFromId(id)); return arr; }, new Array());

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
                                <Text style={[CommonStyles.styles.mediumLabel]}>{this.props.label}</Text>
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
        borderColor: CommonStyles.SEPARATOR_COLOR,
        borderWidth: 1,
        borderTopLeftRadius: CommonStyles.BORDER_RADIUS,
        borderTopRightRadius: CommonStyles.BORDER_RADIUS,
        borderBottomWidth: 0,
        paddingHorizontal: CommonStyles.GLOBAL_PADDING,
        paddingVertical: 4
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