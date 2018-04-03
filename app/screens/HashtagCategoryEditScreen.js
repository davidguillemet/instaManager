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
import LoadingIndicatorView from '../components/LoadingIndicator';
import SearchInput from '../components/Search';
import SwipeableListViewItem from '../components/SwipeableListViewItem';

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

        this.updateItem = params ? params.updateItem : null;
        this.onItemUpdated = params ? params.onItemUpdated : null;

        this.categoryName = this.updateItem ? this.updateItem.name : null;
        this.parentCategory = this.updateItem ? this.updateItem.parent : null;;

        this.editorMode = this.updateItem ? global.UPDATE_MODE : global.CREATE_MODE;
    }
    
    componentDidMount() {

        this.props.navigation.setParams({ 
            onSaveCategory: this.onSaveCategory.bind(this)
        });
    }

    onSaveCategory() {

        if (this.validateCategory()) {

            const update = this.editorMode == global.UPDATE_MODE;

            const categoryToSave = {
                id: update ? this.updateItem.id : global.uniqueID(),
                name: this.categoryName,
                parent: this.parentCategory
            };

            global.hashtagManager.saveCategory(categoryToSave, update);

            // TODO: what about level????
            this.onItemUpdated(categoryToSave);
            this.props.navigation.goBack();
        }
    }

    validateCategory() {
        
        // 1. Check the category name has been entered
        if (this.categoryName == null || this.categoryName.length == 0) {
            Alert.alert('', 'Please enter a category name.');
            return false;
        }
        
        // 2. Check category does not already exist (if CREATE mode)
        if (this.editorMode == global.CREATE_MODE && global.hashtagManager.searchCategory(this.categoryName).length > 0) {
            Alert.alert('', `The category '${this.categoryName}' already exists.`);
            return false;
        }

        return true;
    }

    onChangeText(text) {
        this.categoryName = text;
    }

    onSelectCategory() {

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
                        defaultValue={this.categoryName ? this.categoryName : null }
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
                        <Text style={this.parentCategory ? styles.parameterInput : styles.parentParameter }>
                            {this.parentCategory ? this.parentCategory : 'Press to select a parent' }
                        </Text>
                        <Ionicons name={'ios-arrow-forward'} style={[CommonStyles.styles.textIcon, styles.iconSelect]}/>
                    </TouchableOpacity>
                </View>
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
    }
});