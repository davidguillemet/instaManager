import React from 'react';
import {
    StackNavigator
} from 'react-navigation';

import NavigationOptions from '../styles/navigation';

import MediaScreen from '../screens/MediaScreen';

export default MediaStack = StackNavigator(
{
    MediaHome: { screen: MediaScreen }
},
{
    initialRouteName: 'MediaHome',
    navigationOptions: NavigationOptions
});
