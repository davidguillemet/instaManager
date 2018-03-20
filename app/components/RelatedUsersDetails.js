import React, { Component } from 'react';
import {
  Picker,
  StyleSheet,
  View,
  Text,
  ActivityIndicator
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import CommonStyles from '../styles/common';

export default class RelatedUsersDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = { followersLoading: true, followingsLoading: true };
    }

    componentWillMount() {

        global.userManager.openRelatedRealm()
        .then(() => {
            // Once the related realm has been loaded:
            
            // - Update followers
            global.userManager.updateFollowers()
            .then(() => {
                this.setState({ followersLoading: false });            
            });

            // - Update followings
            global.userManager.updateFollowings()
            .then(() => {
                this.setState({ followingsLoading: false });            
            });
        });
    }
    
    render() {
        return (
            <View>
                <View style={CommonStyles.styles.standardTile}>
                    <Text style={CommonStyles.styles.mediumLabel}>New followers today</Text>
                    {
                        this.state.followersLoading ?
                        <ActivityIndicator animating={this.state.followersLoading}/> :
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            <Text style={styles.relatedInfoValue}>{global.userManager.getNewFollowersForToday()}</Text>
                            <Ionicons style={{ color: CommonStyles.TEXT_COLOR }} name='ios-arrow-forward' size={CommonStyles.MEDIUM_FONT_SIZE} />
                        </View>
                    }
                </View>
                <View style={CommonStyles.styles.standardTile}>
                    <Text style={CommonStyles.styles.mediumLabel}>Lost Followers today</Text>
                    {
                        this.state.followingsLoading ?
                        <ActivityIndicator animating={this.state.followingsLoading}/> :
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            <Text style={styles.relatedInfoValue}>{global.userManager.getNewFollowingsForToday()}</Text>
                            <Ionicons style={{ color: CommonStyles.TEXT_COLOR }} name='ios-arrow-forward' size={CommonStyles.MEDIUM_FONT_SIZE} />
                        </View>
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create(
{
    relatedInfoValue: {
        color: CommonStyles.KPI_COLOR,
        fontSize: CommonStyles.MEDIUM_FONT_SIZE,
        marginRight: 10
    }
});
     