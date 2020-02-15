import React from 'react';
import {
    Alert,
    View,
    Text,
    TouchableOpacity
} from 'react-native';

import CommonStyles from '../../styles/common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SwipeableListViewItem from './../../components/SwipeableListViewItem';

export default class ProfileListItem extends React.PureComponent {

    constructor(props) {
        super(props);
        this._onDeleteProfile = this._onDeleteProfile.bind(this);
        this._onPress = this._onPress.bind(this);
    }

    _onPress() {

        this.props.onPress(this.props.id);
    }

    _onDeleteProfile(itemId) {
        
        Alert.alert('', `Are you sure you want to delete the profile '${this.props.name}'?`,[
            { 
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'OK',
                onPress: () => {
                    try {
                        this.props.onDeleteProfile(this.props.id);
                    } catch (e) {
                        Alert.alert('Error', e.message);
                    }
                 }
            }
        ]);
    }
    
    renderContent() {
        return (
            <TouchableOpacity onPress={this._onPress}>
                <View style={[
                    CommonStyles.styles.singleListItemContainer,
                    { flex: 1, flexDirection: 'row', alignItems: 'center'}
                    ]}>
                    <Text style={[CommonStyles.styles.singleListItem, { flex: 1 }]} numberOfLines={1}>{this.props.name}</Text>
                    {
                        this.props.selected ?
                        <Ionicons
                            style={{
                                color: CommonStyles.ARCHIVE_COLOR,
                                paddingRight: CommonStyles.GLOBAL_PADDING
                            }}
                            name='ios-checkmark-circle-outline'
                            size={CommonStyles.LARGE_FONT_SIZE}
                        /> :
                        null
                    }
                </View>
            </TouchableOpacity>
        )
    }
    
    renderSwipeableContent() {
        return (
            <SwipeableListViewItem
                itemId={this.props.id}
                rightAction={{ caption: 'Delete', icon: 'ios-trash', color: CommonStyles.DELETE_COLOR, callback: this._onDeleteProfile }}
                onSwipeStart={() => this.props.setParentState({isSwiping: true})}
                onSwipeRelease={() => this.props.setParentState({isSwiping: false})}
            >
                { this.renderContent() }
            </SwipeableListViewItem>
        );
    }

    render() {
        if (this.props.id == global.MAIN_PROFILE_ID) {
            return this.renderContent();
        } else {
            return this.renderSwipeableContent();
        }
    }

}