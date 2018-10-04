import React from 'react';
import {
    StackNavigator,
    SwitchNavigator
} from 'react-navigation';

import NavigationOptions from '../styles/navigation';

import HashTagsHomeScreen from '../screens/HashTagsHomeScreen';
import HashTagListScreen from '../screens/HashTagListScreen';
import HashTagImportScreen from '../screens/HashTagsImportScreen';
import HashtagCategoriesScreen from '../screens/HashtagCategoriesScreen';
import HashtagCategoryEditScreen from '../screens/HashtagCategoryEditScreen';
import CategorySelectionScreen from '../screens/CategorySelectionScreen';
import ImportFromTextScreen from '../screens/ImportFromTextScreen';
import ImportFromTextResultScreen from '../screens/ImportFromTextResultScreen';

const ImportStack = SwitchNavigator(
{
    HomeAfterImport: { screen: HashTagListScreen },
    ImportFromTextResult: { screen: ImportFromTextResultScreen }
},
{
    initialRouteName: 'ImportFromTextResult',
});

export default HashTagsStack = StackNavigator(
    {
        HashTagsHome: {
            screen: HashTagsHomeScreen,
            navigationOptions: () => ({
                headerLeft: null
            }),
        },
        HashTagList: { screen: HashTagListScreen },
        HashTagsImport: { screen: HashTagImportScreen },
        HashtagCategories: { screen: HashtagCategoriesScreen },
        HashtagCategoryEdit: { screen: HashtagCategoryEditScreen },
        CategorySelection: { screen: CategorySelectionScreen },
        ImportFromText: { screen: ImportFromTextScreen },
        Import: { screen: ImportStack }
    },
    {
        initialRouteName: 'HashTagsHome',
        navigationOptions: NavigationOptions
    }
);
    