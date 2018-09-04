import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    TouchableOpacity
  } from 'react-native';

import CommonStyles from '../styles/common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Tag from './Tag';

  
/**
 * - tags = tag collection
 * - onDelete = callback when a tag is deleted
 * - onAdd = callback when selecting a new tag
 * - readOnly = true if the display is readonly, what means we cannot remove the tag
 * - addSharp = true pour ajouter le prefix #
 * - itemType = type of the displayed item (global.CATEGORY_ITEM or global.TAG_ITEM)
 */
export default class TagContainer extends React.PureComponent {

    constructor(props) {
        super(props);
    }
    render() {

        let tagList = this.props.tags.reduce((arr, id) => { arr.push(global.hashtagUtil.getTagFromId(id)); return arr; }, new Array());

        return (
            <View style={this.props.style}>
                {
                    this.props.label || !this.props.readOnly ?
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
                        {
                            this.props.label ?
                            <View style={styles.tagCcontainerLabel}>
                                <Text style={[CommonStyles.styles.mediumLabel]}>{this.props.label}</Text>
                            </View>
                            :
                            null
                        }
                        {
                            this.props.readOnly ?
                            null
                            :
                            <View style={styles.addTagButton}>
                                <TouchableOpacity onPress={this.props.onAdd}>
                                    <Ionicons style={{color: '#2DCF59'}} name={'ios-add-circle'} size={30} />
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                    :
                    null
                }
                <View style={styles.tagCcontainer}>
                    {
                        tagList.sort((t1, t2) => t1.name.localeCompare(t2.name)).map(tag => {
                            return (
                                <Tag
                                    style={styles.tag}
                                    key={tag.id}
                                    id={tag.id}
                                    name={(this.props.addSharp ? '#' : '') + tag.name}
                                    onPress={this.props.readOnly ? null : this.props.onDelete}
                                    iconName={'ios-close-circle-outline'}
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
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CommonStyles.GLOBAL_FOREGROUND,
        borderColor: CommonStyles.SEPARATOR_COLOR,
        borderRadius: 8,
        borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 5,
        paddingVertical: 3
    },
    tagCcontainerLabel: {
        borderColor: CommonStyles.SEPARATOR_COLOR,
        borderWidth: 1,
        borderTopLeftRadius: CommonStyles.BORDER_RADIUS,
        borderTopRightRadius: CommonStyles.BORDER_RADIUS,
        borderBottomWidth: 0,
        paddingHorizontal: 10,
        paddingVertical: 4
    },
    tagCcontainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: 10,
        paddingHorizontal: 10,
        paddingTop: 20,
        borderTopRightRadius: CommonStyles.BORDER_RADIUS,
        borderBottomLeftRadius: CommonStyles.BORDER_RADIUS,
        borderBottomRightRadius: CommonStyles.BORDER_RADIUS,
        borderColor: CommonStyles.SEPARATOR_COLOR,
        borderWidth: 1
    },
    addTagButton: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});