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

        let tagList = this.props.tags.reduce((arr, id) => { arr.push(global.hashtagManager.getItemFromId(this.props.itemType, id)); return arr; }, new Array());

        return (
            <ScrollView style={styles.scrollViewer}>
                <View style={styles.tagCcontainer}>
                    <Tag
                        style={[styles.tag, { backgroundColor: '#2DCF59' }]}
                        id={'addnew'}
                        name={'Add new...'}
                        onPress={this.props.onAdd}
                        iconName={'ios-add-circle-outline'}
                    />
                    {
                        tagList.sort((t1, t2) => t1.name.localeCompare(t2.name)).map(tag => {
                            return (
                                <Tag
                                    style={styles.tag}
                                    key={tag.id}
                                    id={tag.id}
                                    name={(this.props.addSharp ? '#' : '') + tag.name}
                                    onPress={this.props.onDelete}
                                    iconName={'ios-close-circle-outline'}
                                />
                            );
                        })
                    }
                </View>
            </ScrollView>
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
        borderRadius: 15,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    tagCcontainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: 10,
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    scrollViewer: {
        flex: 1,
        borderColor: CommonStyles.SEPARATOR_COLOR,
        borderRadius: 5,
        borderWidth: 1
    }
});