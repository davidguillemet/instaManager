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
import CustomButton from '../../components/CustomButton';
import CommonStyles from '../../styles/common';

function renderSaveButton(params) {

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
        headerTitle += global.hashtagUtil.getItemTypeCaption(params.itemType);
        return {
            headerTitle: headerTitle,
            headerRight: renderSaveButton(params)
        }   
    };

    constructor(props) {
        super(props);

        const { params } = this.props.navigation.state;

        this.itemType = params.itemType;
        this.itemTypeName = global.hashtagUtil.getItemTypeCaption(this.itemType);
        
        const updateItem = params ? params.updateItem : null;
        
        let parentCategories = [];
        let parentCategoriesCaption = null;
        
        // children tags are not stored in state since it is managed/displayed by CategoryTagsDisplay component
        let childrenTags = [];

        if (updateItem != null) {

            if (this.itemType == global.TAG_ITEM && updateItem.categories != null) {
                
                parentCategories = updateItem.categories;

            } else if (this.itemType == global.CATEGORY_ITEM) {

                if (updateItem.parent != null) {
                    parentCategories = [updateItem.parent];
                }
                
                childrenTags = global.hashtagUtil.getHashtags(updateItem.id).map(tag => tag.id);
            }

            parentCategoriesCaption = this.getCaptionFromItems(parentCategories, global.CATEGORY_ITEM);
        }

        this.editorMode = updateItem ? global.UPDATE_MODE : global.CREATE_MODE;
        
        this.state = {
            dirty: false,
            itemId: updateItem ? updateItem.id : global.uniqueID(),
            itemName: updateItem ? updateItem.name : '',
            parentCategories: parentCategories, // List of identifiers
            parentCategoriesCaption: parentCategoriesCaption,
            childrenTags: childrenTags
        };

        this.onChangeText = this.onChangeText.bind(this);
        this.onCategoriesSelected = this.onCategoriesSelected.bind(this);
        this.onTagSelectionValidated = this.onTagSelectionValidated.bind(this);
        this.onSelectParentCategory = this.onSelectParentCategory.bind(this);
        this.onDeleteTag = this.onDeleteTag.bind(this);
        this.onSaveItem = this.onSaveItem.bind(this);
        this.isDirty = this.isDirty.bind(this);

        this.saveSubscriber = [];
    }
    
    componentDidMount() {

        this.props.navigation.setParams({ 
            onSaveItem: this.onSaveItem
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

        const itemName = this.state.itemName.trim();

        if (this.validateItem(itemName) == false) {
            this.saveSubscriber.forEach(listener => listener.setActionCompleted());
            return;
        }

        switch (this.itemType) {

            case global.TAG_ITEM:
                this.saveTag(itemName);
                break;

            case global.CATEGORY_ITEM:
                this.saveCategory(itemName);
                break;
        }

        this.props.navigation.goBack(null);
    }

    hasNoTags() {

        return ((this.state.parentCategories === null || this.state.parentCategories.length == 0) &&
                (this.state.childrenTags === null || this.state.childrenTags.length == 0));
    }

    saveTag(itemName) {

        let tagCategories = this.state.parentCategories;
        if (tagCategories == null) {

            tagCategories = [];
        }

        const tagToSave = {
            id: this.state.itemId,
            name: itemName,
            categories: tagCategories
        };

        this.props.onSaveTag(tagToSave, this.editorMode === global.UPDATE_MODE);
    }

    saveCategory(itemName) {
    
        let parent = null;
        if (this.state.parentCategories != null && this.state.parentCategories.length > 0) {
            parent = this.state.parentCategories[0];
        }

        const categoryToSave = {
            id: this.state.itemId,
            name: itemName,
            parent: parent,
            hashtags: this.state.childrenTags // useless...cannot be updated directly (type is "LinkingObjects")
        };

        this.props.onSaveCategory(categoryToSave, this.editorMode === global.UPDATE_MODE);
    }

    validateItem(itemName) {
        
        // 1. Check the category name has been entered
        if (itemName == null || itemName.length == 0) {
            Alert.alert('', `Please enter a ${this.itemTypeName} name.`);
            return false;
        }

        // 2. a tag name must not contain spaces or #
        if (this.itemType === global.TAG_ITEM && !global.hashtagUtil.tagNameIsValid(itemName)) {
            Alert.alert('Invalid tag', `The tag '${itemName}' is not valid.\n` + global.hashtagUtil.getTagNameRule());
            return false;
        }

        
        // 3. Check category does not already exist
        const itemsWithSameName = global.hashtagUtil.searchItem(this.itemType, itemName);
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
            Alert.alert('', `The ${this.itemTypeName} '${itemName}' already exists.`);
            return false;
        }

        return true;
    }

    onChangeText(text) {
        this.setState({
            dirty: true,
            itemName: text
        });
    }

    onCategoriesSelected(categories) {
        this.setState( {
            dirty: true,
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

        this.setState({
            dirty: true,
            childrenTags: selection
        });
    }

    onDeleteTag(tagId) {

        this.setState({
            dirty: true,
            childrenTags: this.state.childrenTags.filter(id => id != tagId)
        });
    }

    isDirty() {
        return this.state.dirty && this.state.itemName.trim().length > 0;
    }

    render() {
        return (
            <View style={CommonStyles.styles.standardPage}>
            
                <CustomButton
                    title={'Save'}
                    onPress={this.onSaveItem}
                    showActivityIndicator={true}
                    style={CommonStyles.styles.standardButton}
                    deactivated={this.isDirty() == false}
                    register={this.saveSubscriber}
                />

                <ScrollView style={[CommonStyles.styles.standardPage, {padding: 0}]}>
                    <View style={styles.parameterContainerView}>
                        <Text style={[CommonStyles.styles.smallLabel, styles.parameterLabel]}>Name</Text>
                        <TextInput
                            defaultValue={this.state.itemName}
                            autoFocus={this.editorMode == global.CREATE_MODE}
                            keyboardType='default'
                            style={styles.parameterInput}
                            placeholder={`Enter a ${this.itemTypeName} name`}
                            selectionColor={CommonStyles.TEXT_COLOR}
                            placeholderTextColor={CommonStyles.PLACEHOLDER_COLOR}
                            clearButtonMode={'always'}
                            onChangeText={this.onChangeText}
                            autoCapitalize='none'
                            returnKeyType={'done'}
                            textContentType={'none'}
                            autoCorrect={false}
                            blurOnSubmit={true}
                        />
                    </View>
                    <View style={styles.parameterContainerView}>
                        <Text style={[CommonStyles.styles.smallLabel, styles.parameterLabel]}>{this.itemType === global.TAG_ITEM ? 'Categories' : this.itemType === global.CATEGORY_ITEM ? 'Parent' : 'Category'}</Text>
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
                                    this.itemType === global.CATEGORY_ITEM ?
                                    'Press to select a parent' :
                                    'Press to select a category'
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
                        <View style={{paddingTop: CommonStyles.GLOBAL_PADDING}}>
                            <CategorieTagsDisplay
                                tags={this.state.childrenTags}
                                onDeleteTag={this.onDeleteTag}
                                onTagSelectionValidated={this.onTagSelectionValidated}
                                parentCategory={this.state.parentCategories && this.state.parentCategories.length > 0 ? this.state.parentCategories[0] : null}
                                itemType={this.itemType}
                            />
                        </View>
                        : null
                    }

                    <View style={{ height: 20 }}></View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create(
{
    parameterContainerView: {
        flexDirection: 'column',
        borderBottomColor: CommonStyles.SEPARATOR_COLOR,
        borderBottomWidth: 1,
        paddingTop: CommonStyles.GLOBAL_PADDING,
    },
    parameterInput: {
        flex: 1,
        fontSize: CommonStyles.MEDIUM_FONT_SIZE,
        color: CommonStyles.KPI_COLOR,
        padding: CommonStyles.GLOBAL_PADDING
    },
    parameterLabel: {
        flex: 1,
        paddingLeft: CommonStyles.GLOBAL_PADDING,
    },
    parentParameter: {
        flex: 1,
        fontSize: CommonStyles.MEDIUM_FONT_SIZE,
        color: CommonStyles.PLACEHOLDER_COLOR,
        padding: CommonStyles.GLOBAL_PADDING
    },
    iconSelect: {
        color: CommonStyles.PLACEHOLDER_COLOR,
    }
});
