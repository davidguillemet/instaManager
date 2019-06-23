import React from 'react';
import { withNavigation } from 'react-navigation';

import {
  View,
  Text,
  FlatList,
  SegmentedControlIOS,
} from 'react-native';

import CategoryListItem from './CategoryListItem';
import LoadingIndicatorView from '../LoadingIndicator';
import SearchInput from '../Search';
import EmptySearchResult from './../EmptySearchResult';

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
class CategoryListUi extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            isSwiping: false,
            isLoading: false,
            selectedCategories: null,            
            selection: new Set(this.props.selection),
            displayType: DISPLAY_ALL
        };
        
        this.renderCategory = this.renderCategory.bind(this);
        this.renderEmptyComponent = this.renderEmptyComponent.bind(this);
        this.renderFooterComponent = this.renderFooterComponent.bind(this);
        this.renderHierarchyLevel = this.renderHierarchyLevel.bind(this);
        this.keyExtractor = this.keyExtractor.bind(this);
        this.setSearchResults = this.setSearchResults.bind(this);

        this.onPressCategory = this.onPressCategory.bind(this);
        this.setStateProxy = this.setStateProxy.bind(this);
    }

    navigateToEditScreen(categoryToEdit) {
        const params = {
            itemId: categoryToEdit.id,
            itemType: global.CATEGORY_ITEM
        };
        this.props.navigation.navigate('HashtagCategoryEdit', params);
    }
    
    onAddCategory() {
        this.navigateToEditScreen(null);
    }

    onPressCategory(categoryId) {

        if (this.props.mode === global.LIST_EDITION_MODE) {

            const category = global.hashtagUtil.getCatFromId(categoryId);
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
                let selectedCategories = [...newSelection].reduce((array, catId) => {array.push(global.hashtagUtil.getCatFromId(catId)); return array; }, new Array());
                this.props.onSelectionChanged(selectedCategories);
            }
        }
    }

    setStateProxy(state) {
        this.setState(state);
    }

    renderCategory({item}) {

        return (
            <CategoryListItem
                mode={this.props.mode}
                onPress={this.onPressCategory}
                onDeleteCategory={this.props.onDeleteCategory}
                setParentState={this.setStateProxy}
                id={item.id}
                name={item.name}
                level={item.level ? item.level : 0}
                tagCount={item.tagCount}
                maxTagsCount={this.props.maxTagsCount}
                selected={this.state.selection.has(item.id)}
                deactivated={item.deactivated}
                last={item.last}
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
                                'You have not created any category yet.'
                            }
                        </Text>
                    </View>
                );
            }
        } else {
            // Empty search results
            return <EmptySearchResult />;
        }
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
            const parentCategory = this.props.categoriesMap.get(category.parent);
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

    renderFooterComponent() {

        if (this.props.footerHeight && this.props.footerHeight > 0) {
            return (
                <View style={{height: this.props.footerHeight}}></View>
            );
        }

        return null;
    }

    renderHierarchyLevel(levelNodes) {
        return (
            <FlatList
                scrollEnabled={!this.state.isSwiping}
                data={levelNodes}
                extraData={this.state}
                keyExtractor={this.keyExtractor}
                ListEmptyComponent={this.renderEmptyComponent}
                renderItem={this.renderCategory}
                ListFooterComponent={this.renderFooterComponent}
                style={{flex: 1}}
                indicatorStyle={'white'}
            />
        );   
    }

    render() {

        if (this.state.searchResults) {
            let resultsModified = false;
            // Remove tags which could have been removed...
            for (let index = this.state.searchResults.length - 1; index >= 0; index--) {
                if (!global.hashtagUtil.hasCat(this.state.searchResults[index].id)) {
                    resultsModified = true;
                    this.state.searchResults.splice(index, 1);
                }
            }

            if (resultsModified) {
                if (this.state.searchResults.length == 0) {
                    this.state.searchResults = null;
                } else {
                    this.state.searchResults = [...this.state.searchResults];
                }
            }
        }

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
                        style={{ margin: CommonStyles.GLOBAL_PADDING }}
                    />
                    :
                    null
                }
                <View style={{flexDirection: 'row', alignItems: 'center', padding: CommonStyles.GLOBAL_PADDING, backgroundColor: CommonStyles.MEDIUM_BACKGROUND}}>
                    <SearchInput
                        placeholder={'search category'}
                        dataSource={this.props.categories}
                        resultsCallback={this.setSearchResults}
                        filterProperty={'name'}
                    />
                </View>
                <View style={{flex: 1}}>
                    {
                        this.state.isLoading ?
                        <LoadingIndicatorView/> :
                        <View style={{flex: 1}}>
                            {
                                this.props.mode == global.LIST_SELECTION_MODE &&
                                this.props.selectionMode === global.MULTI_SELECTION &&
                                this.state.searchResults == null ?
                                <Text style={[CommonStyles.styles.smallLabel, {padding: CommonStyles.GLOBAL_PADDING}]}>{`${this.state.selection.size} selected item(s)`}</Text> :
                                null
                            }
                            {
                                this.renderHierarchyLevel(
                                    this.state.searchResults != null ?
                                    this.state.searchResults :
                                    this.state.displayType == DISPLAY_SELECTED ?
                                    this.state.selectedCategories :
                                    this.props.categories)
                            }
                        </View>
                    }
                </View>
            </View>
        );
    }
}

export default withNavigation(CategoryListUi);

