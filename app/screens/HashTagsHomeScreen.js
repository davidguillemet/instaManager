import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Alert
} from 'react-native';

import { connect } from 'react-redux';
import { compose } from 'redux';

import LoadingIndicatorView from '../components/LoadingIndicator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommonStyles from '../styles/common';
import withControlStatus from '../components/WithControlStatus';
import ListItemSeparator from '../components/ListItemSeparator';

import { loadCategoriesIfNeeded, loadTagsIfNeeded } from '../actions';

class HashTagsHomeScreenComponent extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'Hashtag Management'
        }   
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { dispatch } = this.props
        dispatch(loadCategoriesIfNeeded());
        dispatch(loadTagsIfNeeded());
    }
    
    configureMenus() {
        this.sections = [];

        // Section Hashtags
        let hashtagMenuItems = [];
        hashtagMenuItems.push({
            caption: 'View/edit hashtags',
            target: 'HashTagList'
        });
        hashtagMenuItems.push({
            caption: 'Import hashtags',
            target: 'ImportFromText'
        });
        this.sections.push({
            title: 'Manage hashtags',
            data: hashtagMenuItems
        });

        // Section Categories
        let categoryMenuItems = [];
        categoryMenuItems.push({
            caption: 'View/edit categories',
            target: 'HashtagCategories'
        });        
        this.sections.push({
            title: 'Manage categories',
            data: categoryMenuItems
        });
    }

    renderSectionSeparator() {
        return (
            <View style={{ height: 10 }} />
        );
    }

    renderListFooter() {
        return (
            <View style={{height: 50}} />
        );
    }

    renderListItem(item) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate(item.target)}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[CommonStyles.styles.mediumLabel, styles.singleItem]}>{item.caption}</Text>
                    <Ionicons style={{ color: CommonStyles.TEXT_COLOR, paddingRight: CommonStyles.GLOBAL_PADDING }} name='ios-arrow-forward' size={CommonStyles.MEDIUM_FONT_SIZE} />
                </View>
            </TouchableOpacity>
        );
    }
  
    renderSectionHeader(section) {
        return (
            <View style={{ borderLeftColor: CommonStyles.GLOBAL_FOREGROUND, borderLeftWidth: 4 }}>
                <Text style={[CommonStyles.styles.largeLabel, styles.sectionHeader]}>{section.title}</Text>
            </View>
        );
    }

    render() {

        const { categoriesLoaded, tagsLoaded  } = this.props;

        if (categoriesLoaded && tagsLoaded) {
            this.configureMenus();
            return(
                <View style={[CommonStyles.styles.standardPage, {padding: 0}]}>
                    <SectionList
                        sections={this.sections} 
                        scrollEnabled={false}
                        renderItem={({item}) => this.renderListItem(item)}
                        renderSectionHeader={({section}) => this.renderSectionHeader(section)}
                        ItemSeparatorComponent={ListItemSeparator}
                        SectionSeparatorComponent={this.renderSectionSeparator}
                        ListFooterComponent={this.renderListFooter}
                        ListEmptyComponent={this.renderEmptyComponent}
                        keyExtractor={(item, index) => item.target}
                        stickySectionHeadersEnabled={false}
                    />
                </View>
            );
        } else {
            return <LoadingIndicatorView/>;
        }
    }
}

const styles = StyleSheet.create(
{
    sectionHeader: {
        paddingHorizontal: CommonStyles.GLOBAL_PADDING,
        paddingVertical: CommonStyles.GLOBAL_PADDING,
        backgroundColor: '#192b48',
        fontWeight: 'bold',
    },
    singleItem:  {
        flex: 1,
        paddingHorizontal: CommonStyles.GLOBAL_PADDING,
        paddingVertical: CommonStyles.GLOBAL_PADDING
    }, 
});



const mapStateToProps = state => {
    return {
        tagsLoaded: state.get('tagsLoaded'),
        categoriesLoaded: state.get('categoriesLoaded')
    }
}

export default compose(connect(mapStateToProps), withControlStatus)(HashTagsHomeScreenComponent);
