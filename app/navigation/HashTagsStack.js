import React from 'react';
import {
    StackNavigator
} from 'react-navigation';

import NavigationOptions from '../styles/navigation';

import HashTagsHomeScreen from '../screens/HashTagsHomeScreen';
import HashTagListScreen from '../screens/HashTagListScreen';
import HashTagImportScreen from '../screens/HashTagsImportScreen';
import HashtagCategoriesScreen from '../screens/HashtagCategoriesScreen';
import HashtagCategoryEditScreen from '../screens/HashtagCategoryEditScreen';

export default HashTagsStack = StackNavigator(
    {
        HashTagsHome: { screen: HashTagsHomeScreen },
        HashTagList: { screen: HashTagListScreen },
        HashTagsImport: { screen: HashTagImportScreen },
        HashtagCategories: { screen: HashtagCategoriesScreen },
        HashtagCategoryEdit: { screen: HashtagCategoryEditScreen }
    },
    {
        initialRouteName: 'HashTagsHome',
        navigationOptions: NavigationOptions
    });
    