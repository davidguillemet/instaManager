import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SwipeableListViewItem from '../../components/SwipeableListViewItem';

import CommonStyles from '../../styles/common'; 

export default class TagListItem extends React.PureComponent {

    static propTypes = {
        id: PropTypes.string.isRequired,            // item identifier
        name: PropTypes.string.isRequired,          // item name
        used: PropTypes.bool.isRequired,             // true when the tga is used in a category
        selected: PropTypes.bool,                   // initial selection state
        setParentState: PropTypes.func.isRequired,  // callback to change parent state
        onDeleteTag: PropTypes.func.isRequired,     // callback hwhen an item is deleted
        onPress: PropTypes.func.isRequired          // callback when an item is pressed
    };

    static defaultProps = {
        selected: false,        // by default, an item is not selected
        used: false
    };

    static leftMargin = CommonStyles.GLOBAL_PADDING;
    static indicatorWidth = 6;

    constructor(props) {
        super(props);

        this._onDeleteTag = this._onDeleteTag.bind(this);
        this._onArchiveTag = this._onArchiveTag.bind(this);
        this._onPress = this._onPress.bind(this);
    }

    _onPress() {

        this.props.onPress(this.props.id);
    }

    _onDeleteTag(itemId) {
        
        const tagToDelete = global.hashtagUtil.getTagFromId(itemId);
        
        Alert.alert('', `Are you sure you want to delete the tag '${tagToDelete.name}'?`,[
            { 
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'OK',
                onPress: () => {
                    this.props.onDeleteTag(this.props.id);
                }
            }
        ]);
    }

    _onArchiveTag(itemId) {
        //////////
        // TODO
        //////////
    }

    renderTouchableContent() {

        let itemIndicatorStyles = [styles.itemIndicator];
        if (this.props.used) {
            itemIndicatorStyles.push(styles.usedItemIndicator);
        }

        return (
            <TouchableOpacity onPress={this._onPress}>
                <View style={[
                        CommonStyles.styles.singleListItemContainer,
                        { flex: 1, flexDirection: 'row', alignItems: 'center'}
                    ]}
                >
                    <View style={itemIndicatorStyles} />
                    <Text style={[CommonStyles.styles.singleListItem, { flex: 1 }]} numberOfLines={1}>{this.props.name}</Text>
                    {
                        this.props.selected ?
                        <Ionicons style={{ color: CommonStyles.ARCHIVE_COLOR, paddingRight: CommonStyles.GLOBAL_PADDING + CommonStyles.INDEX_LIST_WIDTH }} name='ios-checkmark-circle-outline' size={CommonStyles.LARGE_FONT_SIZE} /> :
                        null
                    }
                </View>
            </TouchableOpacity>
        );
    }

    renderSwipeableContent() {
        return (
            <SwipeableListViewItem
                itemId={this.props.id}
                rightAction={{ caption: 'Delete', icon: 'ios-trash', color: CommonStyles.DELETE_COLOR, callback: this._onDeleteTag }}
                leftAction={{ caption: 'Archive', icon: 'ios-archive', color: CommonStyles.ARCHIVE_COLOR, callback: this._onArchiveTag }}
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

const styles = StyleSheet.create ({
    itemIndicator: {
        marginLeft: TagListItem.leftMargin,
        width: TagListItem.indicatorWidth
    },
    usedItemIndicator: {
        height: TagListItem.indicatorWidth,
        borderRadius: TagListItem.indicatorWidth / 2,
        borderColor: CommonStyles.LIGHT_GREEN,
        borderWidth: 0,
        backgroundColor: CommonStyles.LIGHT_GREEN,
    }
});   
