import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator
} from 'react-native';

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
                <View style={{ flexDirection: 'row'}}>
                    <Text>New Followers</Text><ActivityIndicator animating={this.state.followersLoading}/>
                </View>
                <View style={{ flexDirection: 'row'}}>
                    <Text>Lost Followers</Text><ActivityIndicator animating={this.state.followersLoading}/>
                </View>
            </View>
        );
    }
}