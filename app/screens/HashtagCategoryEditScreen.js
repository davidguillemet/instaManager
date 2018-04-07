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
            <TouchableOpacity onPress={params.onSaveCategory}><Ionicons name={'ios-checkmark'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
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

        const updateItem = params ? params.updateItem : null;
        const parentCategory = updateItem && updateItem.parent ? global.hashtagManager.getCategoryFromId(updateItem.parent) : null;

        this.onItemUpdated = params ? params.onItemUpdated : null;
        this.editorMode = updateItem ? global.UPDATE_MODE : global.CREATE_MODE;
        
        this.state = {
            selectingParent: false,
            categories: null,
            categoryId: updateItem ? updateItem.id : global.uniqueID(),
            categoryName: updateItem ? updateItem.name : null,
            parentCategoryId: parentCategory ? parentCategory.id  : null,
            parentCategoryName: parentCategory ? parentCategory.name : null
        };
    }
    
    componentDidMount() {

        this.props.navigation.setParams({ 
            onSaveCategory: this.onSaveCategory.bind(this)
        });
    }

    onSaveCategory() {

        if (this.validateCategory()) {

            const categoryToSave = {
                id: this.state.categoryId,
                name: this.state.categoryName,
                parent: this.state.parentCategoryId
            };

            global.hashtagManager.saveCategory(categoryToSave, this.editorMode === global.UPDATE_MODE);

            this.onItemUpdated(categoryToSave);
            this.props.navigation.goBack();
        }
    }

    validateCategory() {
        
        // 1. Check the category name has been entered
        if (this.state.categoryName == null || this.state.categoryName.length == 0) {
            Alert.alert('', 'Please enter a category name.');
            return false;
        }
        
        // 2. Check category does not already exist
        const categoriesWithSameName = global.hashtagManager.searchCategory(this.state.categoryName);
        let nameAlreadyExists = false;
        if (categoriesWithSameName.length > 0) {
            
            if (this.editorMode == global.CREATE_MODE) {
                // Create mode = error as son as a categiory exists with the same name in the database
                nameAlreadyExists = true;
            } else {
                // Edition mode = error as soon as a category with another id exists xwith the same name in the database
                for (let category of categoriesWithSameName) {
                    if (category.id !== this.state.categoryId) {
                        nameAlreadyExists = true;
                        break;
                    }
                }
            }
        }
        
        if (nameAlreadyExists === true) {
            Alert.alert('', `The category '${this.state.categoryName}' already exists.`);
            return false;
        }

        return true;
    }

    onChangeText(text) {
        this.state.categoryName = text;
    }

    onSelectCategory() {

        global.hashtagManager.getCategories()
        .then((categories) => {
            this.setState({ selectingParent: true, categories: categories }); 
        });
    }

    onParentCategorySelected(selectedCategories) {
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
                    <Text style={CommonStyles.styles.mediumLabel}> to save the category.</Text>
                </View>
                <View style={styles.parameterContainerView}>
                    <Text style={CommonStyles.styles.mediumLabel}>Name</Text>
                    <View style={{ width: 20 }}/>
                    <TextInput
                        defaultValue={this.state.categoryName ? this.state.categoryName : null }
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
                    <Text style={CommonStyles.styles.mediumLabel}>Parent</Text>
                    <View style={{ width: 20 }}/>
                    <TouchableOpacity onPress={this.onSelectCategory.bind(this)} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={this.state.parentCategoryId ? styles.parameterInput : styles.parentParameter }>
                            {this.state.parentCategoryName ? this.state.parentCategoryName : 'Press to select a parent' }
                        </Text>
                        <Ionicons name={'ios-arrow-forward'} style={[CommonStyles.styles.textIcon, styles.iconSelect]}/>
                    </TouchableOpacity>
                </View>
                { 
                    this.state.selectingParent ? 
                    <View style={styles.categoryList}>
                        <CategoryList
                            mode={global.LIST_SELECTION_MODE}
                            selectionMode={global.SINGLE_SELECTION}
                            categories= {this.state.categories}
                            renderEmptyComponent={this.renderNoCategories}
                            onSelectionChanged={this.onParentCategorySelected.bind(this)}
                            selection={ this.state.parentCategoryId != null ? [this.state.parentCategoryId] : null}
                            hiddenCategories={ this.editorMode === global.UPDATE_MODE ? [ this.state.categoryId ] : null}
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