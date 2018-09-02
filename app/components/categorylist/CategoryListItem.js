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

        const catToDelete = global.hashtagManager.getItemFromId(global.CATEGORY_ITEM, catId);
        
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
                <Ionicons style={{
                        color: this.props.deactivated ? CommonStyles.DEACTIVATED_TEXT_COLOR : CommonStyles.TEXT_COLOR,
                        paddingLeft: CommonStyles.GLOBAL_PADDING,
                        marginLeft: CommonStyles.HIERARCHY_INDENT * this.props.level
                    }}
                    name='ios-folder-open-outline'
                    size={CommonStyles.LARGE_FONT_SIZE}
                />
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
                    <Ionicons style={{ color: CommonStyles.WARNING_COLOR, paddingRight: CommonStyles.GLOBAL_PADDING }} name='ios-alert-outline' size={CommonStyles.LARGE_FONT_SIZE} /> :
                    null
                }
            </View>
        );
    }

    renderTouchableContent() {
        return (
            <TouchableOpacity onPress={this.props.deactivated ? null : this._onPress}>
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
