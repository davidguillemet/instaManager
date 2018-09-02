import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SegmentedControlIOS,
} from 'react-native';

import { createMultiUpdateAction } from '../../actions';

import CategoryListItem from './CategoryListItem';
import LoadingIndicatorView from '../LoadingIndicator';
import SearchInput from '../Search';

import CommonStyles from '../../styles/common'; 

const DISPLAY_ALL = 0;
const DISPLAY_SELECTED = 1;

/**
 * props
 * - mode = global.LIST_SELECTION_MODE or global.LIST_EDITION_MODE
 * - selectionMode = global.SINGLE_SELECTION or global.MULTI_SELECTION (optional / Not used if mode is EDITION)
 * - selection = initial selection = identifier array
 * - onSelectionChanged (category array)
 * - categories = [ { id: string, name: string, parent: string, level: int , deactivted: bool } , ...]
 * - navigation = the navigation object
 */
export default class CategoryListUi extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            isSwiping: false,
            isLoading: false,
            selectedCategories: null,            
            selection: new Set(this.props.selection),
            displayType: DISPLAY_ALL
        };
        
        // if (this.props.selection != null && this.props.selection.length > 0) {
        //     this.state.displayType = DISPLAY_SELECTED;
        //     this.state.selectedCategories = this.getSelectedCategories();
        // }

        this.renderCategory = this.renderCategory.bind(this);
        this.renderEmptyComponent = this.renderEmptyComponent.bind(this);
        this.keyExtractor = this.keyExtractor.bind(this);
        this.getSearchDataSource = this.getSearchDataSource.bind(this);
        this.setSearchResults = this.setSearchResults.bind(this);

        this.onPressCategory = this.onPressCategory.bind(this);
        this.onDeleteCategory = this.onDeleteCategory.bind(this);
        this.setStateProxy = this.setStateProxy.bind(this);
    }

    navigateToEditScreen(categoryToEdit) {
        const params = {
            updateItem: categoryToEdit,
            itemType: global.CATEGORY_ITEM
        };
        this.props.navigation.navigate('HashtagCategoryEdit', params);
    }
    
    onAddCategory() {
        this.navigateToEditScreen(null);
    }

    onPressCategory(categoryId) {

        if (this.props.mode === global.LIST_EDITION_MODE) {

            const category = this.props.rawCategories.get(categoryId);
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
                this.state.selectedCategories = this.getSelectedCategories(newSelection);
            }

            this.setState( { selection: newSelection } );
            
            if (this.props.onSelectionChanged) {
                let selectedCategories = [...newSelection].reduce((array, catId) => {array.push(this.props.rawCategories.get(catId)); return array; }, new Array());
                this.props.onSelectionChanged(selectedCategories);
            }
        }
    }

    onDeleteCategory(categoryId) {

        let updates = global.hashtagManager.deleteCategory(this.props.rawCategories.get(categoryId));
        this.props.dispatch(createMultiUpdateAction(updates));
    }

    setStateProxy(state) {
        this.setState(state);
    }

    renderCategory({item}) {

        return (
            <CategoryListItem
                mode={this.props.mode}
                onPress={this.onPressCategory}
                onDeleteCategory={this.onDeleteCategory}
                setParentState={this.setStateProxy}
                id={item.id}
                name={item.name}
                level={item.level ? item.level : 0}
                selected={this.state.selection.has(item.id)}
                deactivated={item.deactivated}
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

        return this.props.categories;
    }

    setSearchResults(results) {

        this.setState({
            searchResults: results
        });
    }

    getSelectedCategories(selection) {

        let _selection = selection ? selection : this.state.selection;
        if (this.props.categories == null) {
            return [];
        }
        const displayedCategories = new Set(); 
        const selectedCategories = [];
        for (let category of this.props.categories) {
            if (_selection.has(category.id)) {
                selectedCategories.push(category);
                displayedCategories.add(category.id);
                this.addParentCategories(category, selectedCategories.length - 1, selectedCategories, displayedCategories);
            }
        }
        return selectedCategories;
    }

    addParentCategories(category, categoryIndex, selectedCategoriesList, selectedCategoriesSet) {
        if (category.parent && !selectedCategoriesSet.has(category.parent)) {
            const parentStoreCategory = this.props.rawCategories.get(category.parent);
            const parentCategory = {
                ...parentStoreCategory,
                level: category.level - 1
            };
            selectedCategoriesList.splice(categoryIndex, 0, parentCategory);
            selectedCategoriesSet.add(parentCategory.id);
            this.addParentCategories(parentCategory, categoryIndex, selectedCategoriesList, selectedCategoriesSet);
        }
    }

    applyDisplayType(displayType) {

        return new Promise((resolve, reject) => {
            let selectedCategories =
                displayType == DISPLAY_SELECTED ?
                this.getSelectedCategories() :
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

    keyExtractor(item, index) {
        return item.name;
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
                        style={{ marginBottom: 0 }}
                    />
                    :
                    null
                }
                <View style={{padding: CommonStyles.GLOBAL_PADDING, backgroundColor: CommonStyles.MEDIUM_BACKGROUND}}>
                    <SearchInput
                        placeholder={'search category'}
                        dataSource={this.getSearchDataSource}
                        resultsCallback={this.setSearchResults}
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
                                this.props.categories}
                            extraData={this.state}
                            keyExtractor={this.keyExtractor}
                            ListEmptyComponent={this.renderEmptyComponent}
                            renderItem={this.renderCategory}
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
        borderColor: CommonStyles.MEDIUM_BACKGROUND
    }
});

