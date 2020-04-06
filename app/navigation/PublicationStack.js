import React from 'react';
import {
    createStackNavigator
} from 'react-navigation';

import NavigationOptions from '../styles/navigation';

import PublicationScreen from '../screens/PublicationScreen';
import HashtagCategoryEditScreen from '../screens/HashtagCategoryEditScreen';
import CategorySelectionScreen from '../screens/CategorySelectionScreen';
import HashTagListScreen from '../screens/HashTagListScreen';
import PublicationSummaryScreen from '../screens/PublicationSummaryScreen';
import PublicationWizardScreen from '../screens/PublicationWizardScreen';

export default PublicationStack = createStackNavigator(
{
    PublicationHome: {
        screen: PublicationScreen,
        defaultNavigationOptions: () => ({
            headerLeft: null
        }),
    },
    HashtagCategoryEdit: { screen: HashtagCategoryEditScreen },
    CategorySelection: { screen: CategorySelectionScreen },
    HashTagList: { screen: HashTagListScreen },
    PublicationSummary: { screen: PublicationSummaryScreen },
    PublicationWizard: { screen: PublicationWizardScreen }
},
{
    initialRouteName: 'PublicationHome',
    defaultNavigationOptions: NavigationOptions
});
