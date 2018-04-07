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

/**
 * props:
 * - id
 * - name
 * - level
 * - selected
 * - onSelectionChanged (identifier Set)
 */
class CategoryListItem extends React.PureComponent {

    _onPress = () => {
        this.props.onPress(this.props.id);
    };
    
    renderInnerItem() {
        let inlineTextStyle = { flex: 1 };
        if (this.props.deactivated) {
            inlineTextStyle = { ...inlineTextStyle, textDecorationLine: 'line-through' }
        }
        return (
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons style={{
                    color: this.props.deactivated ? CommonStyles.DEACTIVATED_TEXT_COLOR : CommonStyles.TEXT_COLOR,
                    paddingLeft: CommonStyles.GLOBAL_PADDING,
                    marginLeft: CommonStyles.HIERARCHY_INDENT * this.props.level
                }}
                name='ios-folder-open-outline'
                size={CommonStyles.LARGE_FONT_SIZE}
            />
            <Text style={[
                    this.props.deactivated ? CommonStyles.styles.deacivatedSingleListItem : CommonStyles.styles.singleListItem,
                    inlineTextStyle]}
            >
                {this.props.name}
            </Text>
            {
                this.props.selected ?
                <Ionicons style={{ color: CommonStyles.TEXT_COLOR, paddingRight: 5 }} name='ios-checkmark-circle-outline' size={CommonStyles.LARGE_FONT_SIZE} /> :
                this.props.deactivated ?
                <Ionicons style={{ color: CommonStyles.WARNING_COLOR, paddingRight: 5 }} name='ios-warning-outline' size={CommonStyles.LARGE_FONT_SIZE} /> :
                null
            }
            </View>
        );
    }

    render() {
        return (
            <TouchableHighlight onPress={this.props.deactivated ? null : this._onPress}>
                { this.renderInnerItem() }
            </TouchableHighlight>
        );
    }
}

/**
 * props
 * - mode = global.LIST_SELECTION_MODE or global.LIST_EDITION_MODE
 * - selectionMode = global.SINGLE_SELECTION or global.MULTI_SELECTION (optional / Not used if mode is EDITION)
 * - selection = initial selection = identifier array
 * - onSelectionChanged (category array)
 * - categories = [ { id: string, name: string, parent: string, level: int } , ...]
 * - hiddenCategories = array containing categories which must not be displayed (+ children) [ id, ... ]
 * - navigation = the navigation object
 */
export default class CategoryList extends React.PureComponent {

    constructor(props) {
        super(props);

        let hiddenCategories = new Set(this.props.hiddenCategories);
        this.deactivateHiddenCategoriesChildren(this.props.categories, hiddenCategories);

        this.state = {
            isSwiping: false,
            categories: this.props.categories,
            categoriesMap: this.getMapFromCategories(this.props.categories),
            selection: new Set(this.props.selection),
            hiddenCategories: hiddenCategories
        };
    }

    deactivateHiddenCategoriesChildren(categories, hiddenSet) {

        let hidechildren = false;
        let hiddenRootLevel = 0;
        for (let category of categories) {
            
            if (hidechildren && category.level === hiddenRootLevel) {
                // current category is a sibling of the initial hidden category
                hidechildren = false;
            }
            
            if (hiddenSet.has(category.id)) {
                // The current category is already hidden
                // make sure to hidde children...
                hiddenRootLevel = category.level;
                hidechildren = true;
            } else if (hidechildren && category.level > hiddenRootLevel) {
                // It seems the category is a children of a hidden category
                // -> add the current category in the hidden set
                hiddenSet.add(category.id);
            }
        }
    }

    getMapFromCategories(categories) {
        return categories.reduce((map, cat) => { map.set(cat.id, cat); return map; }, new Map());
    }

    getNavigationParams(categoryToEdit) {
        return {
            updateItem: categoryToEdit,
            onItemUpdated: this.onCategoryUpdated.bind(this),
            itemType: global.CATEGORY_ITEM
        };
    }
    onAddCategory() {
        this.props.navigation.navigate('HashtagCategoryEdit', this.getNavigationParams(null));
    }

    onPressCategory(categoryId) {

        if (this.props.mode === global.LIST_EDITION_MODE) {

            const category = this.state.categoriesMap.get(categoryId);
            this.props.navigation.navigate('HashtagCategoryEdit', this.getNavigationParams(category));

        } else {

            let newSelection = null;

            if (this.props.selectionMode === global.SINGLE_SELECTION) { // LIST_SELECTION_MODE && SINGLE_SELECTION

                newSelection = new Set();
                if (!this.state.selection.has(categoryId)) {
                    // If the new pressed element was not already selected, it becomes the selected element
                    // In the oher case, it means it has been unselected and the new selection is empty
                    newSelection.add(categoryId);
                }
            } else { // LIST_SELECTION_MODE && MULTI_SELECTION
                
                newSelection = new Set(this.state.selection);
                
                if (newSelection.has(categoryId)) {
                    newSelection.delete(categoryId);
                } else {
                    newSelection.add(categoryId);
                }
            }

            this.setState( { selection: newSelection} );
            
            if (this.props.onSelectionChanged) {
                let selectedCategories = [...newSelection].reduce((array, catId) => {array.push(this.state.categoriesMap.get(catId)); return array; }, new Array());
                this.props.onSelectionChanged(selectedCategories);
            }
        }
    }

    onCategoryUpdated(updatedCategory) {

        global.hashtagManager.getCategories()
        .then((categories) => {

            this.setState( {
                categories: categories,
                categoriesMap: this.getMapFromCategories(categories)
            });
        });
    }

    renderCategory(category) {

        const deactivated = this.state.hiddenCategories.has(category.id);

        return (
            <CategoryListItem
                onPress={this.onPressCategory.bind(this)}
                id={category.id}
                name={category.name}
                level={category.level ? category.level : 0}
                selected={this.state.selection.has(category.id)}
                deactivated={deactivated}
            />
        );
    }

    renderEmptyComponent() {
        if (this.state.searchResults == null) {
            if (this.props.renderEmptyComponent) {

                return this.props.renderEmptyComponent();

            } else {
                return (
                    <View style={{ flex: 1, justifyContent: 'center', padding: CommonStyles.GLOBAL_PADDING}}>
                        <Text style={ [CommonStyles.styles.mediumLabel, { marginBottom: CommonStyles.GLOBAL_PADDING} ]}>You didn't defined any category yet.</Text>
                    </View>
                );
            }
        } else {
            // Empty search results
            return (
                <CategoryListItem
                    name={'No search results...'}
                    level={0}
                />
            );
        }
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

    getSearchDataSource() {
        return this.state.categories;
    }

    setSearchResults(results) {
        this.setState({
            searchResults: results
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{padding: CommonStyles.GLOBAL_PADDING, backgroundColor: CommonStyles.MEDIUM_BACKGROUND}}>
                    <SearchInput
                        placeholder={'search category'}
                        dataSource={this.getSearchDataSource.bind(this)}
                        resultsCallback={this.setSearchResults.bind(this)}
                        filterProperty={'name'}
                    />
                </View>
                <FlatList
                    scrollEnabled={!this.state.isSwiping}
                    data={this.state.searchResults != null ? this.state.searchResults : this.state.categories}
                    extraData={this.state}
                    keyExtractor={(item, index) => item.id}
                    ListEmptyComponent={this.renderEmptyComponent.bind(this)}
                    renderItem={({item}) => this.renderCategory(item)}
                    ItemSeparatorComponent={this.renderSeparator}
                />
            </View>
        );
    }
}