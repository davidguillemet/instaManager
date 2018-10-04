import React from 'react';
import {
    StackNavigator
} from 'react-navigation';

import NavigationOptions from '../styles/navigation';

import SettingsScreen from '../screens/SettingsScreen';

export default SettingsStack = StackNavigator(
{
    SettingsHome: {
        screen: SettingsScreen,
        navigationOptions: () => ({
            headerLeft: null
        }),
    }
},
{
    initialRouteName: 'SettingsHome',
    navigationOptions: NavigationOptions
});
