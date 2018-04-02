import React, { Component } from 'react';
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
import SearchInput from '../components/Search';
import LoadingIndicatorView from '../components/LoadingIndicator';
import SwipeableListViewItem from '../components/SwipeableListViewItem';

import CommonStyles from '../styles/common'; 

function renderImportButton(params) {

    return (
        <View style={{ flexDirection: 'row'}}>
            <TouchableOpacity onPress={params.onAddTag}><Ionicons name={'ios-add'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
            <TouchableOpacity onPress={params.onImport}><Ionicons name={'ios-cloud-download'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
        </View>
    );
}

export default class HashTagListScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'My Hashtags',
            headerRight: renderImportButton(params)
        }   
    };

    constructor(props) {
        super(props);
        this.state = { isLoading: true , isSwiping: false };
        this.sortedHashtags = null;
        this.sections = [];
    }
    
    componentWillMount() {

        this.props.navigation.setParams({ 
            onImport: this.onImport.bind(this),
            onAddTag: this.onAddTag.bind(this)
        });

        global.hashtagManager.open()
        .then(() => {

            this.sortedHashtags = global.hashtagManager.getHashtags();
            
            // Here we get a sorted list,
            // split into sections
            this.sections = [];
            let previousSectionTitle = null;
            let currentSectionData;
            for (let hashtag of this.sortedHashtags) {
                let tagName = hashtag.name;
                let currentSectionTitle = tagName.charAt(0).toUpperCase();

                if (currentSectionTitle != previousSectionTitle) {
                    // New section
                    previousSectionTitle = currentSectionTitle;
                    currentSectionData = [];
                    this.sections.push({ title: currentSectionTitle, data: currentSectionData });
                }
                currentSectionData.push(hashtag);
            }

            this.setState({ isLoading: false }); 
        });
    }

    shouldSearch(text) {

        // Trigger search process only if at least 2 characters
        if (text.length > 1) {
            
            this.setState({ isLoading: true });
            this.processSearch(text)
            .then((results) => {
                this.setState({ searchResults: results, isLoading: false });
            });
        } else if (text.length == 0) {
            this.setState({ searchResults: null });
        }
    }

    processSearch(searchText) {
        return new Promise(

            function(resolve, reject) {

                const sortedHashtags = global.hashtagManager.getHashtags();
                let results = [];
                const upperCaseSearch = searchText.toUpperCase();
                for (let hashtag of sortedHashtags) {
                    
                    let tagName = hashtag.name;
                    if (tagName.toUpperCase().includes(upperCaseSearch)) {
                        results.push(hashtag);
                    }
                }
                resolve(results);
            }
        );
    }

    emptySearchResult() {
        return (
            <Text>No result...</Text>
        );
    }

    onImport() {
        this.props.navigation.navigate('HashTagsImport');
    }

    onAddTag() {
        // TODO
        Alert.alert("New Tag");
    }

    onDeleteTag(item) {
        // TODO
        Alert.alert("delete", item.name);
    }

    onArchiveTag(item) {
        // TODO
        Alert.alert("archive", item.name);
    }
    
    renderSeparator() {
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

    renderListFooter() {
        return (
            <View style={{height: 50}} />
        );
    }

    renderEmptyComponent() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', padding: CommonStyles.GLOBAL_PADDING}}>
                <Text style={ [CommonStyles.styles.mediumLabel, { marginBottom: CommonStyles.GLOBAL_PADDING} ]}>You didn't defined any hashtag yet.</Text>
                <Text style={ [CommonStyles.styles.mediumLabel, { marginBottom: CommonStyles.GLOBAL_PADDING} ]}>To add a single hashtag, just click on <Ionicons name={'ios-add'} style={CommonStyles.styles.mediumLabel}/> on the top of this screen.</Text>
                <Text style={ [CommonStyles.styles.mediumLabel, { marginBottom: CommonStyles.GLOBAL_PADDING} ]}>By clicking on <Ionicons name={'ios-cloud-download'} style={CommonStyles.styles.mediumLabel}/>, you can also import all the hashtags you have already used in your instagram posts.</Text>
            </View>
        );
    }

    renderListItem(item) {
        return (
            <SwipeableListViewItem
                item={item} 
                rightAction={{ caption: 'Delete', icon: 'ios-trash', color: CommonStyles.DELETE_COLOR, callback: this.onDeleteTag.bind(this) }}
                leftAction={{ caption: 'Archive', icon: 'ios-archive', color: CommonStyles.ARCHIVE_COLOR, callback: this.onArchiveTag.bind(this) }}
                renderItem={this.renderInnerListItem}
                onSwipeStart={() => this.setState({isSwiping: true})}
                onSwipeRelease={() => this.setState({isSwiping: false})}
            />
        );
    }

    renderInnerListItem(item) {
        return (
            <Text style={[CommonStyles.styles.mediumLabel, styles.singleItem]}>{item.name}</Text>
        );
    }
  
    renderSectionHeader(section) {
        return (
            <Text style={[CommonStyles.styles.mediumLabel, styles.sectionHeader]}>{section.title}</Text>
        );
    }

    render() {

        return(
            <View style={[CommonStyles.styles.standardPage, {paddingHorizontal: 0, paddingTop: 0}]}>
                <View>
                    { this.state.isLoading ? <LoadingIndicatorView/> : null }
                    <View style={{padding: CommonStyles.GLOBAL_PADDING, backgroundColor: CommonStyles.MEDIUM_BACKGROUND}}>
                        <SearchInput
                            onChangeText={this.shouldSearch.bind(this)}
                            placeholder={'search hashtag'}
                        />
                    </View>
                    { this.state.searchResults ?
                        <FlatList
                            scrollEnabled={!this.state.isSwiping}
                            data={this.state.searchResults}
                            keyExtractor={(item, index) => item.name}
                            ListEmptyComponent={this.emptySearchResult}
                            renderItem={({item}) => this.renderListItem(item)}
                            ItemSeparatorComponent={this.renderSeparator} />
                        :
                        <SectionList
                            scrollEnabled={!this.state.isSwiping}
                            sections={this.sections} 
                            renderItem={({item}) => this.renderListItem(item)}
                            renderSectionHeader={({section}) => this.renderSectionHeader(section)}
                            ItemSeparatorComponent={this.renderSeparator}
                            ListFooterComponent={this.renderListFooter}
                            ListEmptyComponent={this.renderEmptyComponent}
                            keyExtractor={(item, index) => item.name} />
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create(
{
    sectionHeader: {
        paddingHorizontal: CommonStyles.GLOBAL_PADDING,
        paddingVertical: 5,
        backgroundColor: '#192b48'
    },
    singleItem:  {
        paddingHorizontal: CommonStyles.GLOBAL_PADDING,
        paddingVertical: 10
    }, 
});