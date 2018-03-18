import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image
} from 'react-native';

import DeltaIndicator from '../components/DeltaIndicator';
import CommonStyles from '../styles/common';

export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        const userInfo = global.userManager.getCurrentUser();
        const delta = {
            followed_by: userInfo.followed_by - userInfo.prev_followed_by,
            follows: userInfo.follows - userInfo.prev_follows,
            media: userInfo.media - userInfo.prev_media
        };

        return (
            <View style={styles.container}>
                
                <View style={styles.userInfoMainView}>
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


            </View>
        );
      }
}

const styles = StyleSheet.create(
{
    container: {
        flex: 1,
        backgroundColor: CommonStyles.GLOBAL_BACKGROUND,
        padding: CommonStyles.GLOBAL_PADDING,
    },
    userInfoMainView: {
        flexDirection: 'row',
        backgroundColor: CommonStyles.GLOBAL_FOREGROUND,
        borderRadius: CommonStyles.BORDER_RADIUS
    },
    profilePictureView: {
        width: CommonStyles.PROFILE_PICTURE_SIZE + CommonStyles.GLOBAL_PADDING * 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: CommonStyles.GLOBAL_PADDING,
    },
    userInfoView: {
        flex: 2,
        padding: CommonStyles.GLOBAL_PADDING,
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