import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  Text,
  Image
} from 'react-native';

import UserService from '../services/users/UserService';
import DeltaIndicator from '../components/DeltaIndicator';
import RelatedUsersDetails from '../components/RelatedUsersDetails';
import CommonStyles from '../styles/common';

export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { refreshing: false };
    }
    
    getRefreshControl() {
        return (
            <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
            />
        );
    }

    _onRefresh() {

        this.setState({refreshing: true});

        const userServiceDelegate = new UserService('self');
        
        global.serviceManager.invoke(userServiceDelegate)
        .then((userInfo) => {
            global.userManager.setCurrentUser(userInfo);
            this.setState({refreshing: false});
        })
        .catch(error => {
            this.setState({refreshing: false});
        });
    }

    render() {
        const userInfo = global.userManager.getCurrentUser();
        const delta = {
            followed_by: userInfo.followed_by - userInfo.prev_followed_by,
            follows: userInfo.follows - userInfo.prev_follows,
            media: userInfo.media - userInfo.prev_media
        };

        return (
            <ScrollView style={CommonStyles.styles.standardPage} refreshControl={this.getRefreshControl()}>
                
                <View style={CommonStyles.styles.standardTile}>
                    <View style={styles.profilePictureView}>
                        <Image style={styles.profilePicture} source={{ uri: userInfo.profile_picture }}/>
                    </View>
                    <View style={styles.userInfoView}>
                        <Text style={[styles.userInfoText, styles.userNameInfoText]}>{userInfo.username}</Text>
                        <Text style={[styles.userInfoText, styles.fullNameInfoText]}>{userInfo.full_name}</Text>
                        <View style={styles.kpiContainerView}>
                            <DeltaIndicator size={CommonStyles.BIG_FONT_SIZE} value={userInfo.followed_by} delta={delta.followed_by} label='followers'/>
                            <DeltaIndicator size={CommonStyles.MEDIUM_FONT_SIZE} value={userInfo.follows} delta={delta.follows} label='following'/>
                            <DeltaIndicator size={CommonStyles.MEDIUM_FONT_SIZE} value={userInfo.media} delta={delta.media} label='posts'/>
                        </View>
                    </View>
                </View>

            </ScrollView>
        );
      }
}

const styles = StyleSheet.create(
{
    profilePictureView: {
        width: CommonStyles.PROFILE_PICTURE_SIZE + CommonStyles.GLOBAL_PADDING * 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    userInfoView: {
        flex: 2,
        paddingLeft: 0,
        justifyContent: 'space-between',
        alignItems: 'stretch'
    },
    kpiContainerView: {
        paddingTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    profilePicture: {
        width: CommonStyles.PROFILE_PICTURE_SIZE,
        height: CommonStyles.PROFILE_PICTURE_SIZE,
        borderRadius: CommonStyles.PROFILE_PICTURE_SIZE / 2,
        borderWidth: CommonStyles.PROFILE_PICTURE_BORDER_WIDTH,
        borderColor: CommonStyles.PROFILE_PICTURE_BORDER_COLOR
    },
    userInfoText: {
        color: CommonStyles.TEXT_COLOR,
        fontFamily: CommonStyles.FONT_NORMAL
    },
    userNameInfoText: {
        fontSize: CommonStyles.MEDIUM_FONT_SIZE,
        color: CommonStyles.KPI_COLOR
    },
    fullNameInfoText: {
        fontSize: CommonStyles.SMALL_FONT_SIZE
    }
});