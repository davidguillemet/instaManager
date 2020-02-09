import React from 'react';
import {
    StackNavigator
} from 'react-navigation';

import NavigationOptions from '../styles/navigation';

import SettingsScreen from '../screens/SettingsScreen';
import ProfileListScreen from '../screens/ProfileListScreen';

export default SettingsStack = StackNavigator(
{
    SettingsHome: {
        screen: SettingsScreen,
        navigationOptions: () => ({
            headerLeft: null
        }),
    },
    ProfileList: { screen: ProfileListScreen },
},
{
    initialRouteName: 'SettingsHome',
    navigationOptions: NavigationOptions
});
