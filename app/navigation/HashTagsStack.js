import React from 'react';
import {
    StackNavigator
} from 'react-navigation';

import NavigationOptions from '../styles/navigation';

import HashTagsHomeScreen from '../screens/HashTagsHomeScreen';

export default HashTagsStack = StackNavigator(
    {
        HashTagsHome: { screen: HashTagsHomeScreen }
    },
    {
        initialRouteName: 'HashTagsHome',
        navigationOptions: NavigationOptions
    });
    