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
        this._onEditProfile = this._onEditProfile.bind(this);
        this._onPress = this._onPress.bind(this);
    }

    _onPress() {

        this.props.onPress(this.props.id);
    }

    _onEditProfile() {

        this.props.onEditProfile(this.props.id);
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
            <TouchableOpacity onPress={this._onPress} disabled={this.props.selected}>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', paddingRight: CommonStyles.GLOBAL_PADDING }}>
                    <View style={{flexDirection: 'column', flex: 1, paddingVertical: 5}}>
                        <Text style={[
                                CommonStyles.styles.singleListItem,
                                { fontWeight: this.props.id == global.MAIN_PROFILE_ID ? 'bold' : 'normal' }
                            ]} numberOfLines={1}>{this.props.name}</Text>
                        <Text style={[
                            CommonStyles.styles.singleListItem,
                            CommonStyles.styles.smallLabel,
                            {
                                fontStyle: 'italic',
                                color: CommonStyles.DEACTIVATED_TEXT_COLOR
                            }]}
                            numberOfLines={1}>
                            {`${this.props.tagsCount} tag(s) - ${this.props.categoriesCount} category(ies) - ${this.props.publicationsCount} publications`}
                        </Text>
                        <Text style={[
                            CommonStyles.styles.singleListItem,
                            CommonStyles.styles.smallLabel,
                            {
                                fontStyle: 'italic',
                                color: CommonStyles.DEACTIVATED_TEXT_COLOR
                            }]}
                            numberOfLines={1}>
                            {this.props.description}
                        </Text>
                    </View>
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
    
    render() {
        const rightAction = this.props.id == global.MAIN_PROFILE_ID ?
            null :
            {
                caption: 'Delete',
                icon: 'ios-trash',
                color: CommonStyles.DELETE_COLOR,
                callback: this._onDeleteProfile
            };

        return (
            <SwipeableListViewItem
                itemId={this.props.id}
                height={70}
                rightAction={rightAction}
                leftAction={{ caption: 'Edit', icon: 'ios-create', color: CommonStyles.DARK_GREEN, callback: this._onEditProfile }}
                onSwipeStart={() => this.props.setParentState({isSwiping: true})}
                onSwipeRelease={() => this.props.setParentState({isSwiping: false})}
            >
                { this.renderContent() }
            </SwipeableListViewItem>
        );
    }
}