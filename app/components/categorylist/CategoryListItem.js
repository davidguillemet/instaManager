import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SwipeableListViewItem from '../SwipeableListViewItem';

import CommonStyles from '../../styles/common'; 

/**
 * props:
 * - id
 * - name
 * - level
 * - selected : bool
 * - deactivated : bool
 * - mode = global.LIST_EDITION_MODE or LIST_SELECTION_MODE
 * - setParentState = callback to set parent state
 * - onDeleteCategory = callback when a category should be deleted (category id as parameter)
 * - onPress = callback when a category is pressed
 */
export default class CategoryListItem extends React.PureComponent {

    _onPress = () => {
        this.props.onPress(this.props.id);
    };

    _onDeleteCategory = (catId) => {

        const catToDelete = global.hashtagUtil.getCatFromId(catId);
        
        Alert.alert('', `Are you sure you want to delete the category '${catToDelete.name}'?`,
        [
            { 
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'OK',
                onPress: () => {
                    this.props.onDeleteCategory(this.props.id);
                }
            }
        ]);
    }

    _onArchiveCategory = (catId) => {
        //////////
        // TODO
        //////////
    }
    
    getHexValue(val) {
        x = val.toString(16);
        return (x.length == 1) ? '0' + x : x;
    }

    getTagCountColor() {
        const maxCount = global.settingsManager.getMaxNumberOfTags();
        if (this.props.tagCount > maxCount) {
            return CommonStyles.LIGHT_RED;
        }
        const colorStart = CommonStyles.DARK_GREEN.substring(1);
        const colorEnd = CommonStyles.TEXT_COLOR.substring(1);
        const ratio = this.props.tagCount / maxCount;
        const r = Math.ceil(parseInt(colorStart.substring(0,2), 16) * ratio + parseInt(colorEnd.substring(0,2), 16) * (1-ratio));
        const g = Math.ceil(parseInt(colorStart.substring(2,4), 16) * ratio + parseInt(colorEnd.substring(2,4), 16) * (1-ratio));
        const b = Math.ceil(parseInt(colorStart.substring(4,6), 16) * ratio + parseInt(colorEnd.substring(4,6), 16) * (1-ratio));
        const color = [r, g, b].reduce((color, chanelValue) => color + this.getHexValue(chanelValue), '');
        return `#${color}`;
    }

    renderCategoryIcon() {

        const indentation = CommonStyles.HIERARCHY_INDENT * this.props.level;
        const countLeftPosition = indentation + (this.props.tagCount < 10 ? 18 : 14);
        const countTopPosition = 8;

        return (
            <View>
                <Ionicons style={{
                        color: this.props.deactivated ? CommonStyles.DEACTIVATED_TEXT_COLOR : this.getTagCountColor(),
                        paddingLeft: CommonStyles.GLOBAL_PADDING,
                        marginLeft: indentation
                    }}
                    name='ios-folder-open'
                    size={CommonStyles.LARGE_FONT_SIZE}
                />
                <View style={{position: 'absolute', top: countTopPosition, left: countLeftPosition, backgroundColor: 'transparent'}}>
                    <Text style={{fontSize: CommonStyles.TINY_FONT_SIZE, color: 'black'}}>{this.props.tagCount}</Text>
                </View>
            </View>
        );
    }

    renderInnerItem() {

        let inlineTextStyle = { flex: 1 };
        if (this.props.deactivated) {
            inlineTextStyle = { ...inlineTextStyle /*, textDecorationLine: 'line-through' */}
        }
        return (
            <View style={[
                        CommonStyles.styles.singleListItemContainer, 
                        { flex: 1, flexDirection: 'row', alignItems: 'center' }
                    ]}
            >
                { this.renderCategoryIcon() }
                <Text style={[
                        this.props.deactivated ? CommonStyles.styles.deacivatedSingleListItem : CommonStyles.styles.singleListItem,
                        inlineTextStyle]}
                        numberOfLines={1}
                >
                    {this.props.name}
                </Text>
                {
                    this.props.selected ?
                    <Ionicons style={{ color: CommonStyles.ARCHIVE_COLOR, paddingRight: CommonStyles.GLOBAL_PADDING }} name='ios-checkmark-circle-outline' size={CommonStyles.LARGE_FONT_SIZE} /> :
                    this.props.deactivated ?
                    <Ionicons style={{ color: CommonStyles.LIGHT_RED, paddingRight: CommonStyles.GLOBAL_PADDING }} name='ios-remove-circle-outline' size={CommonStyles.LARGE_FONT_SIZE} /> :
                    null
                }
            </View>
        );
    }

    renderTouchableContent() {
        return (
            <TouchableOpacity onPress={this.props.deactivated ? null : this._onPress} disabled={this.props.deactivated || false}>
                { this.renderInnerItem() }
            </TouchableOpacity>
        );
    }

    renderSwipeableContent() {
        return (
            <SwipeableListViewItem
                itemId={this.props.id} 
                rightAction={{ caption: 'Delete', icon: 'ios-trash', color: CommonStyles.DELETE_COLOR, callback: this._onDeleteCategory.bind(this) }}
                leftAction={{ caption: 'Archive', icon: 'ios-archive', color: CommonStyles.ARCHIVE_COLOR, callback: this._onArchiveCategory.bind(this) }}
                onSwipeStart={() => this.props.setParentState({isSwiping: true})}
                onSwipeRelease={() => this.props.setParentState({isSwiping: false})}
            >
                { this.renderTouchableContent() }
            </SwipeableListViewItem>
        );
    }

    render() {
        if (this.props.mode == global.LIST_EDITION_MODE) {
            return this.renderSwipeableContent();
        } else {
            return this.renderTouchableContent();
        }
    }
}
