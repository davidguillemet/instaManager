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
import CategoryList from '../components/categorylist';


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
            isSwiping: false
        };
    }

    componentDidMount() {
        
        this.props.navigation.setParams({ 
            onAddCategory: this.onAddCategory.bind(this)
        });
    }

    onAddCategory() {
    
        const params = {
            updateItem: null,
            itemType: global.CATEGORY_ITEM
        };
        this.props.navigation.navigate('HashtagCategoryEdit', params);
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
                    <CategoryList
                        mode={global.LIST_EDITION_MODE}
                        renderEmptyComponent={this.renderEmptyComponent}
                    />
                }
            </View>
        );
    }
}
