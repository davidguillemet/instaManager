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

        const { params } = this.props.navigation.state;

        this.itemType = params.itemType;
        this.itemTypeName = this.itemType === global.TAG_ITEM ? 'tag' : 'category';
        
        const updateItem = params ? params.updateItem : null;
        const parentCategory = updateItem && updateItem.parent ? global.hashtagManager.getItemFromId(this.itemType, updateItem.parent) : null;

        this.onItemUpdated = params ? params.onItemUpdated : null;
        this.editorMode = updateItem ? global.UPDATE_MODE : global.CREATE_MODE;
        
        this.state = {
            selectingParent: false,
            categories: null,
            itemId: updateItem ? updateItem.id : global.uniqueID(),
            itemName: updateItem ? updateItem.name : null,
            parentCategoryId: parentCategory ? parentCategory.id  : null,
            parentCategoryName: parentCategory ? parentCategory.name : null
        };
    }
    
    componentDidMount() {

        this.props.navigation.setParams({ 
            onSaveItem: this.onSaveItem.bind(this)
        });
    }

    onSaveItem() {

        if (this.validateItem()) {

            const categoryToSave = {
                id: this.state.itemId,
                name: this.state.itemName,
                parent: this.state.parentCategoryId
            };

            ////////////////////////////////////////////
            // TODO - generic (tag or category)
            ////////////////////////////////////////////
            global.hashtagManager.saveCategory(categoryToSave, this.editorMode === global.UPDATE_MODE);

            this.onItemUpdated(categoryToSave);
            this.props.navigation.goBack();
        }
    }

    validateItem() {
        
        // 1. Check the category name has been entered
        if (this.state.itemName == null || this.state.itemName.length == 0) {
            Alert.alert('', `Please enter a ${this.itemTypeName} name.`);
            return false;
        }
        
        // 2. Check category does not already exist
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

        ////////////////////////////////////////////
        // TODO manage multiple selection for tags
        ////////////////////////////////////////////
        if (selectedCategories != null && selectedCategories.length > 0) {
            const selectedCategory = selectedCategories[0];
            this.setState( {
                parentCategoryId: selectedCategory.id,
                parentCategoryName: selectedCategory.name
            });
        } else {
            // No selection
            this.setState( {
                parentCategoryId: null,
                parentCategoryName: null
            });
        }

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
                        placeholder={'Enter a category name'}
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
                        <Text style={this.state.parentCategoryId ? styles.parameterInput : styles.parentParameter }>
                            {
                                this.state.parentCategoryName ? 
                                this.state.parentCategoryName : 
                                this.state.selectingParent ?
                                'No selection' :
                                'Press to select a parent'
                            }
                        </Text>
                        <Ionicons name={'ios-arrow-forward'} style={[CommonStyles.styles.textIcon, styles.iconSelect]}/>
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
                            selection={ this.state.parentCategoryId != null ? [this.state.parentCategoryId] : null}
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