import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SectionList,
  TouchableOpacity,
  Alert
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchInput from '../components/Search';
import LoadingIndicatorView from '../components/LoadingIndicator';

import CommonStyles from '../styles/common'; 

function renderImportButton(params) {

    return (
        <TouchableOpacity onPress={params.onImport}><Ionicons name={'ios-cloud-download'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
    );
}

export default class HashTagsHomeScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'My Hashtags',
            headerRight: renderImportButton(params)
        }   
    };

    constructor(props) {
        super(props);
        this.state = { isLoading: true };
        this.sortedHashtags = null;
        this.sections = [];
    }
    
    componentWillMount() {

        this.props.navigation.setParams({ onImport: this.onImport.bind(this) });

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
  
    render() {

        return(
            <View style={CommonStyles.styles.standardPage}>
                <View>
                    { this.state.isLoading ? <LoadingIndicatorView/> : null }
                    <SearchInput
                        onChangeText={this.shouldSearch.bind(this)}
                        placeholder={'search hashtag'}
                    />
                    { this.state.searchResults ?
                        <FlatList
                            data={this.state.searchResults}
                            keyExtractor={(item, index) => item.name}
                            ListEmptyComponent={this.emptySearchResult}
                            renderItem={({item}) => <Text>{item.name}</Text>} />
                        :
                        <SectionList
                            sections={this.sections} 
                            renderItem={({item}) => <Text>{item.name}</Text>}
                            renderSectionHeader={({section}) => <Text>{section.title}</Text>}
                            keyExtractor={(item, index) => item.name} />
                    }
                </View>
            </View>
        );
    }
}