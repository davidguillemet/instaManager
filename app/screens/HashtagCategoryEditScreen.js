import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import CategoryList from '../components/CategoryList';

import CommonStyles from '../styles/common'; 

function renderRightButtons(params) {

    return (
        <View style={{ flexDirection: 'row'}}>
            <TouchableOpacity onPress={params.onSaveItem}><Ionicons name={'ios-checkmark'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
        </View>
    );
}

export default class HashtagCategoryEditScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'New Category',
            headerRight: renderRightButtons(params)
        }   
    };

    constructor(props) {
        super(props);

        this.tagNameRegex = new RegExp("^[a-zA-Z]+[a-zA-Z0-9_]*$", "g");

        const { params } = this.props.navigation.state;

        this.itemType = params.itemType;
        this.itemTypeName = this.itemType === global.TAG_ITEM ? 'tag' : 'category';
        
        const updateItem = params ? params.updateItem : null;
        
        let parentCategories = null;
        let parentCategoriesCaption = null;

        if (updateItem != null) {

            if (this.itemType === global.TAG_ITEM && updateItem.categories != null) {
                
                parentCategories = updateItem.categories;
                parentCategoriesCaption = this.getCaptionFromCategories(global.hashtagManager.getItemsFromId(global.CATEGORY_ITEM, updateItem.categories));

            } else if (this.itemType === global.CATEGORY_ITEM && updateItem.parent != null) {

                const parentCategory = global.hashtagManager.getItemFromId(global.CATEGORY_ITEM, updateItem.parent);
                parentCategories = [updateItem.parent];
                parentCategoriesCaption = parentCategory.name;
            }
        }

        // Note: updateItem is a realm object. It will be updated automaticcaly when saving the new item
        //       -> to get the previous item name, we must copy the initial item
        this.initialItem = updateItem == null ? null : {...updateItem};
        this.onItemUpdated = params ? params.onItemUpdated : null;
        this.editorMode = updateItem ? global.UPDATE_MODE : global.CREATE_MODE;
        
        this.state = {
            selectingParent: false,
            categories: null,
            itemId: updateItem ? updateItem.id : global.uniqueID(),
            itemName: updateItem ? updateItem.name : null,
            parentCategories: parentCategories,
            parentCategoriesCaption: parentCategoriesCaption
        };
    }
    
    componentDidMount() {

        this.props.navigation.setParams({ 
            onSaveItem: this.onSaveItem.bind(this)
        });
    }

    getCaptionFromCategories(categories) {

        let parentCategoriesCaption = '';
        let parentIndex = 0;
        for (let parentCategory of categories) {
            if (parentIndex > 0) {
                parentCategoriesCaption += '\n';
            }
            parentCategoriesCaption += parentCategory.name;
            parentIndex++;
        }
        return parentCategoriesCaption;
    }

    onSaveItem() {

        if (this.validateItem()) {

            let updatedItem; 

            switch (this.itemType) {

                case global.TAG_ITEM:
                    updatedItem = this.saveTag();
                    break;

                case global.CATEGORY_ITEM:
                    updatedItem = this.saveCategory();
                    break;
            }

            this.onItemUpdated(updatedItem, this.initialItem);
            this.props.navigation.goBack();
        }
    }

    saveTag() {

        let tagCategories = this.state.parentCategories;
        if (tagCategories === null) {

            tagCategories = [];
        }

        const tagToSave = {
            id: this.state.itemId,
            name: this.state.itemName,
            categories: tagCategories
        };

        global.hashtagManager.saveTag(tagToSave, this.editorMode === global.UPDATE_MODE);

        return tagToSave;
    }

    saveCategory() {
    
        let parent = null;
        if (this.state.parentCategories != null && this.state.parentCategories.length > 0) {
            parent = this.state.parentCategories[0];
        }

        const categoryToSave = {
            id: this.state.itemId,
            name: this.state.itemName,
            parent: parent
        };

        global.hashtagManager.saveCategory(categoryToSave, this.editorMode === global.UPDATE_MODE);

        return categoryToSave;
    }

    validateItem() {
        
        // 1. Check the category name has been entered
        if (this.state.itemName == null || this.state.itemName.length == 0) {
            Alert.alert('', `Please enter a ${this.itemTypeName} name.`);
            return false;
        }

        // 2. a tag name must not contain spaces or #
        if (this.itemType === global.TAG_ITEM && this.tagNameRegex.test(this.state.itemName) == false) {
            Alert.alert('Invalid tag name', `The tag name '${this.state.itemName}' is not valid.\nIt can only contain a letter, a number or an underscore and must start by a letter.`);
            return false;
        }

        
        // 3. Check category does not already exist
        const itemsWithSameName = global.hashtagManager.searchItem(this.itemType, this.state.itemName);
        let nameAlreadyExists = false;
        if (itemsWithSameName.length > 0) {
            
            if (this.editorMode == global.CREATE_MODE) {

                // Create mode = error as son as a categiory exists with the same name in the database
                nameAlreadyExists = true;

            } else {

                // Edition mode = error as soon as a category with another id exists xwith the same name in the database
                for (let item of itemsWithSameName) {
                    if (item.id !== this.state.itemId) {
                        nameAlreadyExists = true;
                        break;
                    }
                }
            }
        }
        
        if (nameAlreadyExists === true) {
            Alert.alert('', `The ${this.itemTypeName} '${this.state.itemName}' already exists.`);
            return false;
        }

        return true;
    }

    onChangeText(text) {
        this.state.itemName = text;
    }

    onSelectParentCategory() {

        global.hashtagManager.getCategories()
        .then((categories) => {
            this.setState({ selectingParent: true, categories: categories }); 
        });
    }

    onParentCategorySelected(selectedCategories) {

        let parentCategories = null;
        let parentCategoriesCaption = null;

        if (selectedCategories != null && selectedCategories.length > 0) {

            if (this.itemType === global.TAG_ITEM) { // Multi selection

                parentCategories = selectedCategories.map(cat => cat.id),
                parentCategoriesCaption = this.getCaptionFromCategories(selectedCategories)

            } else { // Single selection

                const selectedCategory = selectedCategories[0];
                    parentCategories = [selectedCategory.id],
                    parentCategoriesCaption = selectedCategory.name
            }
        }

        this.setState( {
            parentCategories: parentCategories,
            parentCategoriesCaption: parentCategoriesCaption
        });
    }

    renderNoCategories() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', padding: CommonStyles.GLOBAL_PADDING}}>
                <Text style={ [CommonStyles.styles.mediumLabel, { marginBottom: CommonStyles.GLOBAL_PADDING} ]}>You didn't defined any category yet.</Text>
            </View>
        );        
    }

    render() {
        return (
            <View style={CommonStyles.styles.standardPage}>
                <View style={[CommonStyles.styles.standardTile, { alignItems: 'center'} ]}>
                    <Ionicons name={'ios-information-circle'} style={[CommonStyles.styles.textIcon, { paddingLeft: 0}]}/>
                    <Text style={CommonStyles.styles.mediumLabel}>Click on </Text>
                    <Ionicons name={'ios-checkmark'} style={CommonStyles.styles.textIcon}/>
                    <Text style={CommonStyles.styles.mediumLabel}> to save the {this.itemTypeName}.</Text>
                </View>
                <View style={styles.parameterContainerView}>
                    <Text style={CommonStyles.styles.mediumLabel}>Name</Text>
                    <View style={{ width: 20 }}/>
                    <TextInput
                        defaultValue={this.state.itemName ? this.state.itemName : null }
                        keyboardType='default'
                        style={styles.parameterInput}
                        placeholder={`Enter a ${this.itemTypeName} name`}
                        selectionColor={CommonStyles.TEXT_COLOR}
                        placeholderTextColor={CommonStyles.PLACEHOLDER_COLOR}
                        clearButtonMode={'always'}
                        onChangeText={this.onChangeText.bind(this)}
                    />
                </View>
                <View style={styles.parameterContainerView}>
                    <Text style={CommonStyles.styles.mediumLabel}>{this.itemType === global.TAG_ITEM ? 'Categories' : 'Parent'}</Text>
                    <View style={{ width: 20 }}/>
                    <TouchableOpacity onPress={this.onSelectParentCategory.bind(this)} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                            style={this.state.parentCategories ? styles.parameterInput : styles.parentParameter }
                            numberOfLines={1}
                        >
                            {
                                this.state.parentCategoriesCaption ? 
                                this.state.parentCategoriesCaption : 
                                this.state.selectingParent ?
                                'No selection' :
                                this.itemType === global.TAG_ITEM ?
                                'Press to select categories' :
                                'Press to select a parent'
                            }
                        </Text>
                        <Ionicons name={'ios-arrow-forward'} style={[CommonStyles.styles.textIcon, styles.iconSelect]}/>
                        {
                            this.state.parentCategories.length <= 1 ?
                            null :
                            <View style={{
                                position: 'absolute',
                                right: 30,
                                top: -3,
                                width: 24,
                                height: 24,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'red',
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: 'red' 
                            }}>
                                <Text style={{ color: CommonStyles.TEXT_COLOR, fontSize: CommonStyles.SMALL_FONT_SIZE }}>{this.state.parentCategories.length}</Text>
                            </View>            
                        }
                    </TouchableOpacity>
                </View>
                { 
                    this.state.selectingParent ? 
                    <View style={styles.categoryList}>
                        <CategoryList
                            mode={global.LIST_SELECTION_MODE}
                            selectionMode={this.itemType === global.TAG_ITEM ? global.MULTI_SELECTION : global.SINGLE_SELECTION}
                            categories= {this.state.categories}
                            renderEmptyComponent={this.renderNoCategories}
                            onSelectionChanged={this.onParentCategorySelected.bind(this)}
                            selection={ this.state.parentCategories }
                            hiddenCategories={
                                this.itemType === global.TAG_ITEM ? null : 
                                this.editorMode === global.UPDATE_MODE ? [ this.state.itemId ] : null }
                        />
                    </View>
                    : null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create(
{
    parameterContainerView: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: CommonStyles.SEPARATOR_COLOR,
        borderBottomWidth: 1,
        paddingTop: CommonStyles.GLOBAL_PADDING,
        paddingLeft: CommonStyles.GLOBAL_PADDING
    },
    parameterInput: {
        flex: 1,
        textAlign: 'right',
        fontSize: CommonStyles.MEDIUM_FONT_SIZE,
        color: CommonStyles.KPI_COLOR,
        padding: CommonStyles.GLOBAL_PADDING
    },
    parentParameter: {
        flex: 1,
        textAlign: 'right',
        fontSize: CommonStyles.MEDIUM_FONT_SIZE,
        color: CommonStyles.PLACEHOLDER_COLOR,
        padding: CommonStyles.GLOBAL_PADDING
    },
    iconSelect: {
        color: CommonStyles.PLACEHOLDER_COLOR,
    },
    categoryList: {
        flex: 1,
        margin: CommonStyles.GLOBAL_PADDING
    }
});