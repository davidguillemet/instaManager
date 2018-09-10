import React from 'react';
import {
    StackNavigator
} from 'react-navigation';

import NavigationOptions from '../styles/navigation';

import PublicationScreen from '../screens/PublicationScreen';
import HashtagCategoryEditScreen from '../screens/HashtagCategoryEditScreen';
import CategorySelectionScreen from '../screens/CategorySelectionScreen';
import HashTagListScreen from '../screens/HashTagListScreen';
import PublicationSummaryScreen from '../screens/PublicationSummaryScreen';

export default PublicationStack = StackNavigator(
{
    PublicationHome: { screen: PublicationScreen },
    HashtagCategoryEdit: { screen: HashtagCategoryEditScreen },
    CategorySelection: { screen: CategorySelectionScreen },
    HashTagList: { screen: HashTagListScreen },
    PublicationSummary: { screen: PublicationSummaryScreen }
},
{
    initialRouteName: 'PublicationHome',
    navigationOptions: NavigationOptions
});