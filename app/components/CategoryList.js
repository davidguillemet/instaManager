import React, { Component, PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SectionList,
  SegmentedControlIOS,
  TouchableOpacity,
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
 * - mode = global.LIST_EDITION_MODE or LIST_EDITION_MODE
 * - setParentState = callback to set parent state
 */
class CategoryListItem extends React.PureComponent {

    _onPress = () => {
        this.props.onPress(this.props.id);
    };

    _onRightAction = () => {
        ///////////
        // TODO
        //////////
    }

    _onLefttAction = () => {
        //////////
        // TODO
        //////////
    }
    
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
                    numberOfLines={1}
            >
                {this.props.name}
            </Text>
            {
                this.props.selected ?
                <Ionicons style={{ color: CommonStyles.ARCHIVE_COLOR, paddingRight: CommonStyles.GLOBAL_PADDING }} name='ios-checkmark-circle-outline' size={CommonStyles.LARGE_FONT_SIZE} /> :
                this.props.deactivated ?
                <Ionicons style={{ color: CommonStyles.WARNING_COLOR, paddingRight: CommonStyles.GLOBAL_PADDING }} name='ios-warning-outline' size={CommonStyles.LARGE_FONT_SIZE} /> :
                null
            }
            </View>
        );
    }

    renderTouchableContent() {
        return (
            <TouchableOpacity onPress={this.props.deactivated ? null : this._onPress}>
            { this.renderInnerItem() }
            </TouchableOpacity>
        );
    }

    renderSwipeableContent() {
        return (
            <SwipeableListViewItem
                itemId={this.props.id} 
                rightAction={{ caption: 'Delete', icon: 'ios-trash', color: CommonStyles.DELETE_COLOR, callback: this._onRightAction }}
                leftAction={{ caption: 'Archive', icon: 'ios-archive', color: CommonStyles.ARCHIVE_COLOR, callback: this._onRightAction }}
                onSwipeStart={() => this.props.setParentState({isSwiping: true})}
                onSwipeRelease={() => this.props.setParentState({isSwiping: false})}
            >
                { this.renderTouchableContent() }
            </SwipeableListViewItem>
        );
    }

    render() {
        if (this.props.mode == global.LIST_EDITION_MODE) {
            return this.renderSwipeableContent();
        } else {
            return this.renderTouchableContent();
        }
    }
}

const DISPLAY_ALL = 0;
const DISPLAY_SELECTED = 1;

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
            isLoading: false,
            categories: this.props.categories,
            selectedCategories: null,            
            categoriesMap: this.getMapFromCategories(this.props.categories),
            selection: new Set(this.props.selection),
            hiddenCategories: hiddenCategories,
            displayType: DISPLAY_ALL
        };
        
        if (this.props.selection != null && this.props.selection.length > 0) {
            this.state.displayType = DISPLAY_SELECTED;
            this.state.selectedCategories = this.getSelectedCategories(this.props.categories);
        }
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

    navigateToEditScreen(categoryToEdit) {
        const params = {
            updateItem: categoryToEdit,
            onItemUpdated: this.onCategoryUpdated.bind(this),
            itemType: global.CATEGORY_ITEM
        };
        this.props.navigation.navigate('HashtagCategoryEdit', params);
    }
    
    onAddCategory() {
        this.navigateToEditScreen(null);
    }

    onPressCategory(categoryId) {

        if (this.props.mode === global.LIST_EDITION_MODE) {

            const category = this.state.categoriesMap.get(categoryId);
            this.navigateToEditScreen(category);

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

                /////////////////////////////////////////////////////////
                // TODO
                // We should make sure we cannot select a node and a child
                // --> As soon as a node is selected, we should deactivate all descendants
                /////////////////////////////////////////////////////////

                newSelection = new Set(this.state.selection);
                
                if (newSelection.has(categoryId)) {
                    newSelection.delete(categoryId);
                } else {
                    newSelection.add(categoryId);
                }
            }

            if (this.state.displayType == DISPLAY_SELECTED) {
                // In case we display only selected items
                // populate again the selected categories
                this.state.selection = newSelection;
                this.state.selectedCategories = this.getSelectedCategories();
            }

            this.setState( { selection: newSelection } );
            
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
                mode={this.props.mode}
                onPress={this.onPressCategory.bind(this)}
                setParentState={this.setState.bind(this)}
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
                        <Text style={ [CommonStyles.styles.mediumLabel, { marginBottom: CommonStyles.GLOBAL_PADDING} ]}>
                            {
                                this.state.displayType == DISPLAY_SELECTED ?
                                'No selected items...' :
                                'You didn\t defined any category yet.'
                            }
                        </Text>
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

    getSelectedCategories() {

        /////////////////////////////////////////////////////////
        // TODO
        // we should display the ancestors for the selected items
        /////////////////////////////////////////////////////////
        if (this.state.categories == null) {
            return [];
        }
        let selectedCategories = [];
        for (let category of this.state.categories) {
            if (this.state.selection.has(category.id)) {
                selectedCategories.push(category);
            }
        }
        return selectedCategories;
    }

    applyDisplayType(displayType) {

        return new Promise((resolve, reject) => {
            let selectedCategories =
                displayType == DISPLAY_SELECTED ?
                this.getSelectedCategories(this.state.categories) :
                null;
            resolve(selectedCategories);
        });
    }

    setDisplayType(displayType) {
        
        this.setState({
            isLoading: true
        });

        this.applyDisplayType(displayType)
        .then((selectedCategories) => {

            this.setState({
                selectedCategories: selectedCategories,
                displayType: displayType,
                isLoading: false
            });
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {   
                    this.props.mode == global.LIST_SELECTION_MODE ?
                    <SegmentedControlIOS
                        values={['All items', 'Selected items']}
                        selectedIndex={this.state.displayType}
                        onChange={(event) => {
                            this.setDisplayType(event.nativeEvent.selectedSegmentIndex);
                        }}
                        tintColor={CommonStyles.TEXT_COLOR}
                        style={{ marginBottom: 5 }}
                    />
                    :
                    null
                }
                <View style={{padding: CommonStyles.GLOBAL_PADDING, backgroundColor: CommonStyles.MEDIUM_BACKGROUND}}>
                    <SearchInput
                        placeholder={'search category'}
                        dataSource={this.getSearchDataSource.bind(this)}
                        resultsCallback={this.setSearchResults.bind(this)}
                        filterProperty={'name'}
                    />
                </View>
                <View style={{flex: 1}}>
                    {
                        this.state.isLoading ?
                        <LoadingIndicatorView/> :
                        <FlatList
                            scrollEnabled={!this.state.isSwiping}
                            data={
                                this.state.searchResults != null ?
                                this.state.searchResults :
                                this.state.displayType == DISPLAY_SELECTED ?
                                this.state.selectedCategories :
                                this.state.categories}
                            extraData={this.state}
                            keyExtractor={(item, index) => item.id}
                            ListEmptyComponent={this.renderEmptyComponent.bind(this)}
                            renderItem={({item}) => this.renderCategory(item)}
                            ItemSeparatorComponent={this.renderSeparator}
                            style={ this.props.mode == global.LIST_SELECTION_MODE ? styles.categoryListWithBorder : null }
                        />
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create(
{
    categoryListWithBorder: {
        borderWidth: 1,
        borderColor: CommonStyles.MEDIUM_BACKGROUND
    }
});