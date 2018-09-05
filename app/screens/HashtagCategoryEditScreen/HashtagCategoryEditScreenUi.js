import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import CategorieTagsDisplay from '../../components/CategorieTagsDisplay';

import CommonStyles from '../../styles/common';

function renderRightButtons(params) {

    return (
        <View style={{ flexDirection: 'row'}}>
            <TouchableOpacity onPress={params.onSaveItem}><Ionicons name={'ios-checkmark'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
        </View>
    );
}

export default class HashtagCategoryEditScreenUi extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        let headerTitle = params.updateItem ? 'Edit' : 'New';
        headerTitle += ' ';
        headerTitle += params.itemType == global.CATEGORY_ITEM ? 'Category' : 'Tag';
        return {
            headerTitle: headerTitle,
            headerRight: renderRightButtons(params)
        }   
    };

    constructor(props) {
        super(props);

        this.tagNameRegex = new RegExp("^[a-zA-Z]+[a-zA-Z0-9_]*$", "g");

        const { params } = this.props.navigation.state;

        this.itemType = params.itemType;
        this.itemTypeName = this.itemType == global.TAG_ITEM ? 'tag' : 'category';
        
        const updateItem = params ? params.updateItem : null;
        
        let parentCategories = [];
        let parentCategoriesCaption = null;
        
        // children tags are not stored in state since it is managed/displayed by CategoryTagsDisplay component
        this.childrenTags = [];

        if (updateItem != null) {

            if (this.itemType == global.TAG_ITEM && updateItem.categories != null) {
                
                parentCategories = updateItem.categories;

            } else if (this.itemType == global.CATEGORY_ITEM) {

                if (updateItem.parent != null) {
                    parentCategories = [updateItem.parent];
                }
                
                this.childrenTags = global.hashtagUtil.getHashtags(updateItem.id).map(tag => tag.id);
            }

            parentCategoriesCaption = this.getCaptionFromItems(parentCategories, global.CATEGORY_ITEM);
        }

        // Note: updateItem is a realm object. It will be updated automaticcaly when saving the new item
        //       -> to get the previous item name, we must copy the initial item
        this.initialItem = updateItem == null ? null : {...updateItem};
        this.editorMode = updateItem ? global.UPDATE_MODE : global.CREATE_MODE;
        
        this.state = {
            itemId: updateItem ? updateItem.id : global.uniqueID(),
            itemName: updateItem ? updateItem.name : null,
            parentCategories: parentCategories, // List of identifiers
            parentCategoriesCaption: parentCategoriesCaption
        };

        this.onCategoriesSelected = this.onCategoriesSelected.bind(this);
        this.onTagSelectionValidated = this.onTagSelectionValidated.bind(this);
        this.onSelectParentCategory = this.onSelectParentCategory.bind(this);
        this.onDeleteTag = this.onDeleteTag.bind(this);
    }
    
    componentDidMount() {

        this.props.navigation.setParams({ 
            onSaveItem: this.onSaveItem.bind(this)
        });
    }

    getCaptionFromItems(items, itemType) {

        if (items == null || items.length == 0)
        {
            return '';
        }

        return items.map(id => global.hashtagUtil.getCatFromId(id).name).sort().join(', ');
    }

    onSaveItem() {

        if (this.validateItem()) {

            switch (this.itemType) {

                case global.TAG_ITEM:
                    this.saveTag();
                    break;

                case global.CATEGORY_ITEM:
                    this.saveCategory();
                    break;
            }

            this.props.navigation.goBack();
        }
    }

    saveTag() {

        let tagCategories = this.state.parentCategories;
        if (tagCategories == null) {

            tagCategories = [];
        }

        const tagToSave = {
            id: this.state.itemId,
            name: this.state.itemName,
            categories: tagCategories
        };

        this.props.onSaveTag(tagToSave, this.editorMode === global.UPDATE_MODE);
    }

    saveCategory() {
    
        let parent = null;
        if (this.state.parentCategories != null && this.state.parentCategories.length > 0) {
            parent = this.state.parentCategories[0];
        }

        const categoryToSave = {
            id: this.state.itemId,
            name: this.state.itemName,
            parent: parent,
            hashtags: this.childrenTags // useless...cannot be updated directly (type is "LinkingObjects")
        };

        this.props.onSaveCategory(categoryToSave, this.editorMode === global.UPDATE_MODE);
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
        const itemsWithSameName = global.hashtagUtil.searchItem(this.itemType, this.state.itemName);
        let nameAlreadyExists = false;
        if (itemsWithSameName.length > 0) {
            
            if (this.editorMode == global.CREATE_MODE) {

                // Create mode = error as soon as a categiory exists with the same name in the database
                nameAlreadyExists = true;

            } else {

                // Edition mode = error as soon as a category with another id exists with the same name in the database
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

    onCategoriesSelected(categories) {
        this.setState( {
            parentCategories: categories,
            parentCategoriesCaption: this.getCaptionFromItems(categories, global.CATEGORY_ITEM)
        });
    }

    onSelectParentCategory() {

        const params = {
            onCategoriesSelected: this.onCategoriesSelected,
            selectedCategories: this.state.parentCategories,
            itemId: this.state.itemId,
            itemType: this.itemType
        };

        this.props.navigation.navigate('CategorySelection', params);
    }

    onTagSelectionValidated(selection) {

        this.childrenTags = selection;
    }

    onDeleteTag(tagId) {

        this.childrenTags = this.childrenTags.filter(id => id != tagId);
    }

    render() {
        return (
            <ScrollView style={CommonStyles.styles.standardPage}>
                <View style={[CommonStyles.styles.standardTile, { alignItems: 'center'} ]}>
                    <Ionicons name={'ios-information-circle'} style={[CommonStyles.styles.textIcon, { paddingLeft: 0}]}/>
                    <Text style={CommonStyles.styles.mediumLabel}>Click on </Text>
                    <Ionicons name={'ios-checkmark'} style={CommonStyles.styles.textIcon}/>
                    <Text style={CommonStyles.styles.mediumLabel}> to save the {this.itemTypeName}.</Text>
                </View>
                <View style={styles.parameterContainerView}>
                    <Text style={CommonStyles.styles.smallLabel}>Name</Text>
                    <View style={{ width: 20 }}/>
                    <TextInput
                        defaultValue={this.state.itemName ? this.state.itemName : null }
                        autoFocus={true}
                        keyboardType='default'
                        autoCapitalize='none'
                        style={styles.parameterInput}
                        placeholder={`Enter a ${this.itemTypeName} name`}
                        selectionColor={CommonStyles.TEXT_COLOR}
                        placeholderTextColor={CommonStyles.PLACEHOLDER_COLOR}
                        clearButtonMode={'always'}
                        onChangeText={this.onChangeText.bind(this)}
                    />
                </View>
                <View style={styles.parameterContainerView}>
                    <Text style={CommonStyles.styles.smallLabel}>{this.itemType === global.TAG_ITEM ? 'Categories' : 'Parent'}</Text>
                    <View style={{ width: 20 }}/>
                    <TouchableOpacity onPress={this.onSelectParentCategory} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                            style={this.state.parentCategories && this.state.parentCategories.length > 0 ? styles.parameterInput : styles.parentParameter }
                            numberOfLines={1}
                        >
                            {
                                this.state.parentCategoriesCaption && this.state.parentCategoriesCaption.length > 0 ? 
                                this.state.parentCategoriesCaption : 
                                this.itemType === global.TAG_ITEM ?
                                'Press to select categories' :
                                'Press to select a parent'
                            }
                        </Text>
                        <Ionicons name={'ios-arrow-forward'} style={[CommonStyles.styles.textIcon, styles.iconSelect]}/>
                        {
                            this.itemType == global.CATEGORY_ITEM ||
                            this.state.parentCategories == null ||
                            this.state.parentCategories.length == 0 ?

                            null :

                            <View style={{
                                position: 'absolute',
                                right: 30,
                                top: -3,
                                width: 24,
                                height: 24,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: CommonStyles.ARCHIVE_COLOR,
                                borderRadius: 12,
                            }}>
                                <Text style={{ fontSize: CommonStyles.SMALL_FONT_SIZE }}>{this.state.parentCategories.length}</Text>
                            </View>            
                        }
                    </TouchableOpacity>
                </View>
                
                {
                    this.itemType == global.CATEGORY_ITEM ?
                    <CategorieTagsDisplay
                        tags={this.childrenTags}
                        onDeleteTag={this.onDeleteTag}
                        onTagSelectionValidated={this.onTagSelectionValidated}
                        parentCategory={this.state.parentCategories && this.state.parentCategories.length > 0 ? this.state.parentCategories[0] : null}
                    />
                    : null
                }

                <View style={{ height: 20 }}></View>
            </ScrollView>
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
    parameterContainerColView: {
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
    }
});
