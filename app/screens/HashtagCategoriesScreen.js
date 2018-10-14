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
import CustomButton from '../components/CustomButton';
import CommonStyles from '../styles/common';

import withControlStatus from './../components/WithControlStatus';

function renderRightButtons(params) {

    return (
        <View style={{ flexDirection: 'row'}}>
            <TouchableOpacity onPress={params.onAddCategory}><Ionicons name={'ios-add'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
        </View>
    );
}

class HashtagCategoriesScreenUi extends React.Component {

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

        this.onAddCategory = this.onAddCategory.bind(this);
        this.renderEmptyComponent = this.renderEmptyComponent.bind(this);
    }

    componentDidMount() {
        
        this.props.navigation.setParams({ 
            onAddCategory: this.onAddCategory
        });
    }

    onAddCategory() {
    
        const params = {
            itemId: null,
            itemType: global.CATEGORY_ITEM
        };
        this.props.navigation.navigate('HashtagCategoryEdit', params);
    }

    renderEmptyComponent() {
        return (
            <View style={{flex: 1, padding: CommonStyles.GLOBAL_PADDING}}>
                <View style={[CommonStyles.styles.standardTile, { flex: 1, flexDirection: 'column' }]}>
                    <Text style={CommonStyles.styles.mediumLabel}>You have not created any category yet.</Text>
                </View>
                <CustomButton style={CommonStyles.styles.standardButtonCentered} title={'Create your first category'} onPress={this.onAddCategory} />
            </View>
       );
    }

    render() {
        return (
            <View style={[CommonStyles.styles.standardPage, {padding: 0}]}>
                <CategoryList
                    mode={global.LIST_EDITION_MODE}
                    renderEmptyComponent={this.renderEmptyComponent}
                />
            </View>
        );
    }
}

export default withControlStatus(HashtagCategoriesScreenUi);
