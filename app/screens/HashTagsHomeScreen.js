import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SectionList,
  TouchableHighlight,
  Alert
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import CommonStyles from '../styles/common'; 

export default class HashTagsHomeScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'Hashtags'
        }   
    };

    constructor(props) {
        super(props);
        this.sections = [];

        // Section Hashtags
        let hashtagMenuItems = [];
        hashtagMenuItems.push({
            caption: 'All your hashtags',
            target: 'HashTagList'
        });
        hashtagMenuItems.push({
            caption: 'Archived hashtags',
            target: 'ArchivedHashTags'
        });
        this.sections.push({
            title: 'Manage hashtags',
            data: hashtagMenuItems
        });

        // Section Categories
        let categoryMenuItems = [];
        categoryMenuItems.push({
            caption: 'All your categories',
            target: 'HashtagCategories'
        });        
        this.sections.push({
            title: 'Manage categories',
            data: categoryMenuItems
        });
    }
    
    renderItemSeparator() {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: CommonStyles.SEPARATOR_COLOR,
                    marginLeft: CommonStyles.GLOBAL_PADDING
                }}
            />
        );
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
            <TouchableHighlight onPress={() => this.props.navigation.navigate(item.target)}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[CommonStyles.styles.mediumLabel, styles.singleItem]}>{item.caption}</Text>
                    <Ionicons style={{ color: CommonStyles.TEXT_COLOR, paddingRight: 5 }} name='ios-arrow-forward' size={CommonStyles.MEDIUM_FONT_SIZE} />
                </View>
            </TouchableHighlight>
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

        return(
            <View style={CommonStyles.styles.standardPage}>
                <View style={CommonStyles.styles.standardTile}>
                    <Text style={CommonStyles.styles.mediumLabel}>Here you can manage your hashtags and organize them using categories to quickly get all the tags you need for each of your publications.</Text>
                </View>
                <View style={{ height: 10}}></View>
                <SectionList
                    sections={this.sections} 
                    renderItem={({item}) => this.renderListItem(item)}
                    renderSectionHeader={({section}) => this.renderSectionHeader(section)}
                    ItemSeparatorComponent={this.renderItemSeparator}
                    SectionSeparatorComponent={this.renderSectionSeparator}
                    ListFooterComponent={this.renderListFooter}
                    ListEmptyComponent={this.renderEmptyComponent}
                    keyExtractor={(item, index) => item.target} />
            </View>
        );
    }
}

const styles = StyleSheet.create(
{
    sectionHeader: {
        paddingHorizontal: CommonStyles.GLOBAL_PADDING,
        paddingVertical: 5,
        backgroundColor: '#192b48',
        fontWeight: 'bold',
    },
    singleItem:  {
        flex: 1,
        paddingHorizontal: CommonStyles.GLOBAL_PADDING,
        paddingVertical: 10
    }, 
});