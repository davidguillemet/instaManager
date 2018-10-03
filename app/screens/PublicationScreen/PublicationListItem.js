import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';

import SwipeableListViewItem from '../../components/SwipeableListViewItem';

import CommonStyles from '../../styles/common'; 


export default class PublicationListItem extends React.PureComponent {

    static propTypes = {
        id: PropTypes.string.isRequired,            // item identifier
        name: PropTypes.string.isRequired,          // item name
        categoryName: PropTypes.string.isRequired,  // Category Name
        tagsCount: PropTypes.number.isRequired,     // number of tags
        time: PropTypes.string.isRequired,          // publication time
        setParentState: PropTypes.func.isRequired,  // callback to change parent state
        onDeleteItem: PropTypes.func.isRequired,    // callback when an item is deleted
        onPress: PropTypes.func.isRequired          // callback when an item is pressed
    };

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
        
        const pubToDelete = global.hashtagUtil.getPubFromId(itemId);
        const pubName = pubToDelete.name || 'no name';
        
        Alert.alert('', `Are you sure you want to delete the publication '${pubName}'?`,[
            { 
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'OK',
                onPress: () => {
                    this.props.onDeleteItem(this.props.id);
                }
            }
        ]);
    }

    _onArchiveTag(itemId) {
        //////////
        // TODO
        //////////
    }

    render() {

        const numberOfTags = `${this.props.tagsCount} tags`;
        const publicationTime = `created at ${this.props.time}`;
        const publicationCategory = `based on '${this.props.categoryName}'`;

        return (
            <SwipeableListViewItem
                itemId={this.props.id} 
                height={70}
                rightAction={{ caption: 'Delete', icon: 'ios-trash', color: CommonStyles.DELETE_COLOR, callback: this._onDeleteTag }}
                leftAction={{ caption: 'Archive', icon: 'ios-archive', color: CommonStyles.ARCHIVE_COLOR, callback: this._onArchiveTag }}
                onSwipeStart={() => this.props.setParentState({isSwiping: true})}
                onSwipeRelease={() => this.props.setParentState({isSwiping: false})}
            >
                <TouchableOpacity onPress={this._onPress}>
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                        <View style={{flexDirection: 'column', flex: 1, paddingVertical: 5}}>
                            <Text style={[CommonStyles.styles.singleListItem]} numberOfLines={1}>{this.props.name}</Text>
                            <Text style={[
                                CommonStyles.styles.singleListItem,
                                CommonStyles.styles.smallLabel,
                                {
                                    fontStyle: 'italic',
                                    color: CommonStyles.DEACTIVATED_TEXT_COLOR
                                }]}
                                numberOfLines={1}>
                                {publicationTime}
                            </Text>
                            <Text style={[
                                CommonStyles.styles.singleListItem,
                                CommonStyles.styles.smallLabel,
                                {
                                    fontStyle: 'italic',
                                    color: CommonStyles.DEACTIVATED_TEXT_COLOR
                                }]}
                                numberOfLines={1}>
                                {publicationCategory}
                            </Text>
                        </View>
                        <Text style={[CommonStyles.styles.singleListItem]} numberOfLines={1}>{numberOfTags}</Text>
                    </View>
                </TouchableOpacity>
            </SwipeableListViewItem>
        );
    }
}
