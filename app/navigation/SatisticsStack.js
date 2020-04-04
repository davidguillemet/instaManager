import React from 'react';
import {
    createStackNavigator
} from 'react-navigation';

import NavigationOptions from '../styles/navigation';

import HomeScreen from '../screens/HomeScreen';

export default StatisticsStack = createStackNavigator(
    {
        Home: { screen: HomeScreen }
    },
    {
        initialRouteName: 'Home',
        navigationOptions: NavigationOptions
    });
    