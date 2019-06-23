import React, { Component, PureComponent } from 'react';
import {
  View,
  TouchableOpacity
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingIndicatorView from '../components/LoadingIndicator';
import CategoryList from '../components/categorylist';


import CommonStyles from '../styles/common'; 

function renderRightButtons(params) {

    return (
        <View style={{ flexDirection: 'row'}}>
            <TouchableOpacity onPress={params.onValidateSelection}><Ionicons name={'md-checkmark'} size={40} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
        </View>
    );
}

export default class CategorySelectionScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'Category Selection',
            headerRight: renderRightButtons(params)
        }   
    };

    constructor(props) {
        super(props);

        const { params } = this.props.navigation.state;

        this.itemType = params.itemType;
        this.initialSelectedCategories = params.selectedCategories;
        this.onCategoriesSelected = params.onCategoriesSelected;
        this.itemId = params.itemId;
        this.editorMode = this.itemId ? global.UPDATE_MODE : global.CREATE_MODE;
        this.newSelectedCategories = this.initialSelectedCategories;

        this.state = {
            isSwiping: false
        };

        this.onCategorySelectionChanged = this.onCategorySelectionChanged.bind(this);
    }

    componentWillMount() {
        
        this.props.navigation.setParams({ 
            onValidateSelection: this.onValidateSelection.bind(this)
        });
    }

    onValidateSelection() {

        if (this.onCategoriesSelected)
        {
            this.onCategoriesSelected(this.newSelectedCategories);
            this.props.navigation.goBack();
        }
    }

    onCategorySelectionChanged(selectedCategories) {

        this.newSelectedCategories = null;

        if (selectedCategories != null && selectedCategories.length > 0) {

            if (this.itemType === global.TAG_ITEM) { // Multi selection

                this.newSelectedCategories = selectedCategories.map(cat => cat.id);

            } else { // Single selection

                const selectedCategory = selectedCategories[0];
                this.newSelectedCategories = [selectedCategory.id];
            }
        }
    }

    render() {
        return (
            <View style={[CommonStyles.styles.standardPage, {padding: 0}]}>
                { 
                    this.state.isLoading ?
                    <LoadingIndicatorView/> :
                    <CategoryList
                        mode={global.LIST_SELECTION_MODE}
                        selectionMode={this.itemType === global.TAG_ITEM ? global.MULTI_SELECTION : global.SINGLE_SELECTION}
                        onSelectionChanged={this.onCategorySelectionChanged}
                        selection={ this.initialSelectedCategories }
                        hiddenCategories={
                            this.itemType === global.TAG_ITEM ? null : 
                            this.editorMode === global.UPDATE_MODE ? [ this.itemId ] : null }
                />
            }
            </View>
        );
    }
}