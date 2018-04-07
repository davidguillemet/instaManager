import React, { Component, PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SectionList,
  TouchableOpacity,
  TouchableHighlight,
  Alert
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingIndicatorView from '../components/LoadingIndicator';
import SearchInput from '../components/Search';
import CategoryList from '../components/CategoryList';


import CommonStyles from '../styles/common'; 

function renderRightButtons(params) {

    return (
        <View style={{ flexDirection: 'row'}}>
            <TouchableOpacity onPress={params.onAddCategory}><Ionicons name={'ios-add'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
        </View>
    );
}

export default class HashtagCategoriesScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'My Categories',
            headerRight: renderRightButtons(params)
        }   
    };

    constructor(props) {
        super(props);
        
        this.state = {
            isLoading: true,
            isSwiping: false,
            searchResults: null,
            selection: [],
            categories: []
        };
    }

    componentWillMount() {
        
        this.props.navigation.setParams({ 
            onAddCategory: this.onAddCategory.bind(this)
        });

        global.hashtagManager.getCategories()
        .then((categories) => {           
            this.setState({ isLoading: false, categories: categories }); 
        });
    }

    onAddCategory() {
        this._categoryList.onAddCategory();
    }

    renderEmptyComponent() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', padding: CommonStyles.GLOBAL_PADDING}}>
                <Text style={ [CommonStyles.styles.mediumLabel, { marginBottom: CommonStyles.GLOBAL_PADDING} ]}>You didn't defined any category yet.</Text>
                <Text style={ [CommonStyles.styles.mediumLabel, { marginBottom: CommonStyles.GLOBAL_PADDING} ]}>To create your first category, just click on <Ionicons name={'ios-add'} style={CommonStyles.styles.largeLabel} /> on the top of the screen.</Text>
            </View>
        );
    }

    render() {
        return (
            <View style={[CommonStyles.styles.standardPage, {paddingHorizontal: 0, paddingTop: 0}]}>
                { 
                    this.state.isLoading ?
                    <LoadingIndicatorView/> :
                    <CategoryList
                        ref={component => this._categoryList = component}
                        mode={global.LIST_EDITION_MODE}
                        categories= {this.state.categories}
                        renderEmptyComponent={this.renderEmptyComponent}
                        navigation={this.props.navigation}
                    />
                }
            </View>
        );
    }
}