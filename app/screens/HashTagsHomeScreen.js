import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SectionList,
  SegmentedControlIOS,
  TouchableOpacity,
  Alert,
  AlertIOS
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchInput from '../components/Search';
import LoadingIndicatorView from '../components/LoadingIndicator';

import CommonStyles from '../styles/common'; 

function renderImportButton(params) {

    return (
        <View style={{ flexDirection: 'row'}}>
            <TouchableOpacity onPress={params.onAddTag}><Ionicons name={'ios-add'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
            <TouchableOpacity onPress={params.onImport}><Ionicons name={'ios-cloud-download'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
        </View>
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
        AlertIOS.prompt(
            "New hashtag",
            "Enter a new hashtag",
            (value) => this.addTag(value)
        );
    }

    addTag(tagName) {
        Alert.alert("new tag", tagName);
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
            <View style={{height: 35}} />
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
                            renderItem={({item}) => <Text style={[CommonStyles.styles.mediumLabel, styles.singleItem]}>{item.name}</Text>}
                            ItemSeparatorComponent={this.renderSeparator} />
                        :
                        <SectionList
                            style={{ marginTop: CommonStyles.GLOBAL_PADDING }}
                            sections={this.sections} 
                            renderItem={({item}) => <Text style={[CommonStyles.styles.mediumLabel, styles.singleItem]}>{item.name}</Text>}
                            renderSectionHeader={({section}) => <Text style={[CommonStyles.styles.mediumLabel, styles.sectionHeader]}>{section.title}</Text>}
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