import React from 'react';
import {
    createStackNavigator,
    Text
} from 'react-navigation';

import NavigationOptions from '../styles/navigation';

import HashTagListScreen from '../screens/HashTagListScreen';
import HashtagCategoryEditScreen from '../screens/HashtagCategoryEditScreen';
import CategorySelectionScreen from '../screens/CategorySelectionScreen';
import ControlDetailsScreen from '../screens/ControlDetailsScreen';


const HashtagCategoryEditStack = createStackNavigator(
    {
        VirtualHashtagCategoryEdit: { screen: HashtagCategoryEditScreen }
    },
    {
        initialRouteName: 'VirtualHashtagCategoryEdit',
        navigationOptions: NavigationOptions,
        mode: 'card'
    }
);

const CategorySelectionStack = createStackNavigator(
    {
        VirtualCategorySelection: { screen: CategorySelectionScreen }
    },
    {
        initialRouteName: 'VirtualCategorySelection',
        navigationOptions: NavigationOptions,
        mode: 'card'
    }
);

const HashTagListStack = createStackNavigator(
    {
        VirtualHashtagSelection: { screen: HashTagListScreen }
    },
    {
        initialRouteName: 'VirtualHashtagSelection',
        navigationOptions: NavigationOptions
    }
);


export default ControlDetailsStack = createStackNavigator(
    {
        HashTagList: { screen: HashTagListStack },
        HashtagCategoryEdit: { screen: HashtagCategoryEditStack },
        CategorySelection: { screen: CategorySelectionStack },
        ControlDetails: { screen: ControlDetailsScreen }
    },
    {
        initialRouteName: 'ControlDetails',
        mode: 'modal',
        headerMode: 'none',
    }
);
