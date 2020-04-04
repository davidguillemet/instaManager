import React from 'react';
import {
    createStackNavigator
} from 'react-navigation';

import NavigationOptions from '../styles/navigation';

import SettingsScreen from '../screens/SettingsScreen';
import ProfileListScreen from '../screens/ProfileListScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';

export default SettingsStack = createStackNavigator(
{
    SettingsHome: {
        screen: SettingsScreen,
        navigationOptions: () => ({
            headerLeft: null
        }),
    },
    ProfileList: { screen: ProfileListScreen },
    ProfileEdit: { screen: ProfileEditScreen }
},
{
    initialRouteName: 'SettingsHome',
    navigationOptions: NavigationOptions
});
