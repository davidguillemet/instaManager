import React, { Component, PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SectionList,
  TouchableOpacity,
  TouchableHighlight,
  Alert
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingIndicatorView from '../components/LoadingIndicator';
import SearchInput from '../components/Search';
import SwipeableListViewItem from '../components/SwipeableListViewItem';

import CommonStyles from '../styles/common'; 

function renderRightButtons(params) {

    return (
        <View style={{ flexDirection: 'row'}}>
            <TouchableOpacity onPress={params.onAddCategory}><Ionicons name={'ios-add'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
        </View>
    );
}

class CategoryListItem extends React.PureComponent {

    _onPress = () => {
        this.props.onPress(this.props.id);
    };
    
    render() {
        return (
            <TouchableHighlight onPress={this._onPress}>
                <Text style={[CommonStyles.styles.singleListItem, { marginLeft: CommonStyles.HIERARCHY_INDENT * this.props.level }]}>{this.props.name}</Text>
            </TouchableHighlight>
        );
    }
}

export default class HashtagCategoriesScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'My Categories',
            headerRight: renderRightButtons(params)
        }   
    };

    constructor(props) {
        super(props);
        
        this.state = {
            isLoading: true,
            isSwiping: false,
            searchResults: null,
            selection: [],
            categories: []
        };

    }

    componentDidMount() {

        this.props.navigation.setParams({ 
            onAddCategory: this.onAddCategory.bind(this)
        });

        global.hashtagManager.open()
        .then(() => {

            let rootCategories = global.hashtagManager.getRootCategories();
            let level = 0;
            let categories = [];

            for (let rootCategory of rootCategories) {

                categories.push({
                    id: rootCategory.id,
                    name: rootCategory.name,
                    parent: rootCategory.parent,
                    level: level 
                });

                this.getSubCategories(rootCategory, categories, level + 1);
            }
            
            this.setState({ isLoading: false, categories: categories }); 
        });
    }

    getSubCategories(parentCategory, categories, level) {
        
        let subCategories = global.hashtagManager.getSubCategories(parentCategory.name);
        if (subCategories.length == 0) {
            return;
        }

        for (let subCategory of subCategories) {
            
            categories.push({
                id: subdCategory.id,
                name: subdCategory.name,
                parent: subCategory.parent,
                level: level
            });

            this.getSubCategories(subCategory, categories, level + 1);
        }
    }

    onAddCategory() {
        this.props.navigation.navigate('HashtagCategoryEdit', { onItemUpdated: this.onItemUpdated.bind(this) });
    }

    onEditCategory(category) {
        this.props.navigation.navigate('HashtagCategoryEdit', { updateItem: category, onItemUpdated: this.onCategoryUpdated.bind(this) });
    }

    onCategoryUpdated(updatedCategory) {

        const categoryIndex = this.state.categories.findIndex((item, index, arr) => updatedCategory.id == item.id);
        // TODO: in case the parent is modified
        const updatedCategoryObject = {
            id: updatedCategory.id,
            name: updatedCategory.name,
            level: this.state.categories[categoryIndex].level,
            parent:  this.state.categories[categoryIndex].parent,
        };

        this.setState((prevState) => {
            // TODO: WIth this code, all items are re-rendered, while oonly the updated category ref is supposed to have changed...
            // copy the previous state rather than modifying it.
            let categories = prevState.categories;
            categories[categoryIndex] = updatedCategoryObject; // Update modified category
            return { categories: categories };
        });
    }

    shouldSearch(text) {

        // Trigger search process only if at least 2 characters
        if (text.length > 1) {
            
            this.setState({ isLoading: true });
            this.processSearch(text)
            .then((results) => {
                this.setState({ searchResults: results, isLoading: false });
            });
        } else if (text.length == 0) {
            this.setState({ searchResults: null });
        }
    }

    processSearch(searchText) {
        return new Promise(

            function(resolve, reject) {

                const sortedHashtags = global.hashtagManager.getHashtags();
                let results = [];
                const upperCaseSearch = searchText.toUpperCase();
                for (let hashtag of sortedHashtags) {
                    
                    let tagName = hashtag.name;
                    if (tagName.toUpperCase().includes(upperCaseSearch)) {
                        results.push(hashtag);
                    }
                }
                resolve(results);
            }
        );
    }


    renderEmptyComponent() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', padding: CommonStyles.GLOBAL_PADDING}}>
                <Text style={ [CommonStyles.styles.mediumLabel, { marginBottom: CommonStyles.GLOBAL_PADDING} ]}>You didn't defined any category yet.</Text>
                <Text style={ [CommonStyles.styles.mediumLabel, { marginBottom: CommonStyles.GLOBAL_PADDING} ]}>To create your first category, just click on <Ionicons name={'ios-add'} style={CommonStyles.styles.largeLabel} /> on the top of the screen.</Text>
            </View>
        );
    }

    renderSeparator() {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: CommonStyles.SEPARATOR_COLOR,
                    marginLeft: CommonStyles.GLOBAL_PADDING
                }}
            />
        );
    }    

    renderCategory(category) {
        return (
            <CategoryListItem
                onPress={() => this.onEditCategory(category)}
                id={category.id}
                name={category.name}
                level={category.level ? category.level : 0}/>
        );
    }

    render() {
        return (
            <View style={[CommonStyles.styles.standardPage, {paddingHorizontal: 0, paddingTop: 0}]}>
                { this.state.isLoading ? <LoadingIndicatorView/> : null }
                <View style={{padding: CommonStyles.GLOBAL_PADDING, backgroundColor: CommonStyles.MEDIUM_BACKGROUND}}>
                    <SearchInput
                        onChangeText={this.shouldSearch.bind(this)}
                        placeholder={'search category'}
                    />
                </View>
                <FlatList
                    scrollEnabled={!this.state.isSwiping}
                    data={this.state.categories}
                    extraData={this.state}
                    keyExtractor={(item, index) => item.id}
                    ListEmptyComponent={this.renderEmptyComponent}
                    renderItem={({item}) => this.renderCategory(item)}
                    ItemSeparatorComponent={this.renderSeparator}
                />
            </View>
        );
    }
}