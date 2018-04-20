import React, { Component, PureComponent } from 'react';
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
import SwipeableListViewItem from '../components/SwipeableListViewItem';
import SectionListIndex from '../components/SectionListIndex';

import CommonStyles from '../styles/common'; 

function renderRightButtons(params) {

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
            headerRight: renderRightButtons(params)
        }   
    };

    constructor(props) {
        super(props);

        this.state = { isLoading: true , isSwiping: false, sections: null };
        this.sectionsMap = new Map();
        this.sectionListRef = null;

        this.renderListItem = this.renderListItem.bind(this);
        this.keyExtractor = this.keyExtractor.bind(this);
        this.setSearchResults = this.setSearchResults.bind(this);

        this.onDeleteTag = this.onDeleteTag.bind(this);
        this.onArchiveTag = this.onArchiveTag.bind(this);

        this.onSwipeStart = this.onSwipeStart.bind(this);
        this.onSwipeRelease = this.onSwipeRelease.bind(this);

        this.onPressSectionIndex = this.onPressSectionIndex.bind(this);
    }
    
    componentWillMount() {

        this.props.navigation.setParams({ 
            onImport: this.onImport.bind(this),
            onAddTag: this.onAddTag.bind(this)
        });

        global.hashtagManager.open()
        .then(() => {

            const sortedHashtags = global.hashtagManager.getHashtags();
            
            // Here we get a sorted list,
            // split into sections
            let sections = [];
            let previousSectionTitle = null;
            let currentSectionData;
            for (let hashtag of sortedHashtags) {

                let tagName = hashtag.name;
                let currentSectionTitle = tagName.charAt(0).toUpperCase();

                if (currentSectionTitle != previousSectionTitle) {
                    // New section
                    previousSectionTitle = currentSectionTitle;
                    currentSectionData = [];
                    const newSection = {
                        title: currentSectionTitle,
                        data: currentSectionData
                    };
                    sections.push(newSection);
                    this.sectionsMap.set(currentSectionTitle, newSection);
                }
                currentSectionData.push(hashtag);
            }

            this.updateSections(sections);
        });
    }

    getSearchDataSource() {
        return global.hashtagManager.getHashtags();
    }

    setSearchResults(results) {
        this.setState({ searchResults: results, isLoading: false });
    }

    emptySearchResult() {
        return (
            <Text style={CommonStyles.styles.singleListItem}>No results...</Text>
        );
    }

    onImport() {
        this.props.navigation.navigate('HashTagsImport');
    }

    onTagUpdated(updatedItem, initialItem) {

        const tagId = updatedItem.id;
        const newSectionTitle = updatedItem.name.charAt(0).toUpperCase();
        const initialSectionTitle = initialItem.name.charAt(0).toUpperCase();

        if (newSectionTitle == initialSectionTitle) {
            // Same section...
            // -> Replace initial item and make sure to sort section data again and re-render item
            let section = this.sectionsMap.get(initialSectionTitle);
            const itemIndex = section.data.findIndex(item => item.id == initialItem.id);
            section.data.splice(itemIndex, 1, updatedItem);
            section.data.sort((t1, t2) => t1.name < t2.name ? -1 : ( t1.name > t2.name ? 1 : 0));
            this.updateSections(this.state.sections);

        } else {

            // Remove initial item from initial section
            let initialSection = this.sectionsMap.get(initialSectionTitle);
            const initialTagIndex = initialSection.data.findIndex(tag => tag.id == tagId);
            initialSection.data.splice(initialTagIndex, 1);
            if (initialSection.data.length == 0) {
                // Remove the section
                this.sectionsMap.delete(initialSectionTitle);
                const initialSectionIndex = this.state.sections.findIndex(section => section.title == initialSectionTitle);
                this.state.sections.splice(initialSectionIndex, 1);
            }

            // Add the updated item in the proper section
            this.onTagCreated(updatedItem);
        }
    }

    onTagCreated(createdTag) {

        const sectionTitle = createdTag.name.charAt(0).toUpperCase();
        let section = this.sectionsMap.get(sectionTitle);
        if (section == null) {

            const newSection = {
                title: sectionTitle,
                data: [createdTag]
            };

            this.sectionsMap.set(sectionTitle, newSection);
            
            this.state.sections.push(newSection);
            this.state.sections.sort((s1, s2) => s1.title < s2.title ? -1 : ( s1.title > s2.title ? 1 : 0));
            let newSections = [...this.state.sections];
            this.updateSections(newSections);

        } else {

            section.data.push(createdTag);
            section.data.sort((t1, t2) => t1.name < t2.name ? -1 : ( t1.name > t2.name ? 1 : 0));
            this.updateSections(this.state.sections);
        }
    }

    updateSections(sections) {

        this.setState({ isLoading: false, sections: sections });
    }

    navigateToEditScreen(tagToEdit) {

        const params = {
            updateItem: tagToEdit,
            onItemUpdated: tagToEdit ? this.onTagUpdated.bind(this) : this.onTagCreated.bind(this),
            itemType: global.TAG_ITEM
        };

        this.props.navigation.navigate('HashtagCategoryEdit', params);
    }

    onAddTag() {
        this.navigateToEditScreen(null);
    }

    onEditTag(tagItem) {
        this.navigateToEditScreen(tagItem);
    }

    onDeleteTag(itemId) {

        const tagToDelete = global.hashtagManager.getItemFromId(global.TAG_ITEM, itemId);
        
        Alert.alert('', `Are you sure you want to delete the tag '${tagToDelete.name}'?`,[
            { 
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'OK',
                onPress: () => {
                    const sectionTitle = tagToDelete.name.charAt(0).toUpperCase();
                    const section = this.sectionsMap.get(sectionTitle);
                    const tagIndex = section.data.findIndex(tag => tag.id == tagToDelete.id);
                    section.data.splice(tagIndex, 1);
                    if (section.data.length == 0) {
                        // Remove the section
                        this.sectionsMap.delete(sectionTitle);
                        const sectionIndex = this.state.sections.findIndex(section => section.title == sectionTitle);
                        this.state.sections.splice(sectionIndex, 1);
                    }
                    global.hashtagManager.deleteTag(tagToDelete.id);
                    this.setState({ sections: this.state.sections })        
                }
            }
        ]);
    }

    onArchiveTag(itemId) {
        ///////////
        // TODO
        ///////////
        const tag = global.hashtagManager.getItemFromId(global.TAG_ITEM, itemId);
        Alert.alert("archive", tag.name);
    }

    onPressSectionIndex(sectionTitle) {

        if (this.sectionListRef == null) {
            return;
        }

        const sectionIndex = this.state.sections.findIndex((section, sectionIndex, array) => section.title == sectionTitle);

        this.sectionListRef.scrollToLocation({
            animated: true,
            itemIndex: 0, // First item of the section
            sectionIndex: sectionIndex,
            viewOffset: CommonStyles.SECTION_HEADER_HEIGHT
        });
    }

    // LIST_ITEM_HEIGHT: 40,
    // LIST_SEPARATOR_HEIGHT: 1,
    // SECTION_HEADER_HEIGHT: 30,
    getItemLayout(data, index) {

        let offset = 0;
        let globalIndex = 0;
        let height = 0;

        for (let sectionIndex = 0; sectionIndex < data.length && globalIndex < index; sectionIndex++) {

            offset += CommonStyles.SECTION_HEADER_HEIGHT;
            const currentSection = data[sectionIndex];

            globalIndex += 1; // an item for the header
            if (globalIndex == index) {
                height = 0;
            }
            globalIndex += 1; // next item for the first data in section            

            for (let itemIndex = 0; itemIndex < currentSection.data.length && globalIndex < index; itemIndex++, globalIndex++) {
                
                if (globalIndex == index) {
                    height = CommonStyles.LIST_ITEM_HEIGHT;
                }
                
                offset += CommonStyles.LIST_ITEM_HEIGHT;
                if (itemIndex < currentSection.data.length - 1) {
                    offset += CommonStyles.LIST_SEPARATOR_HEIGHT;
                }
            }
        }

        return {
            index: index,
            length: height,
            offset: offset
        };
    }

    getItemHeight(index) {
        return this.sectionIndexes.has(index) ? CommonStyles.SECTION_HEADER_HEIGHT : CommonStyles.LIST_ITEM_HEIGHT;
    }

    onSwipeStart() {
        this.setState({isSwiping: true});
    }

    onSwipeRelease() {
        this.setState({isSwiping: false});
    }
    
    renderSeparator() {
        return (
            <View
                style={{
                    height: CommonStyles.LIST_SEPARATOR_HEIGHT,
                    width: "100%",
                    backgroundColor: CommonStyles.SEPARATOR_COLOR,
                    marginLeft: CommonStyles.GLOBAL_PADDING
                }}
            />
        );
    }

    renderEmptyComponent() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', padding: CommonStyles.GLOBAL_PADDING}}>
                <Text style={ [CommonStyles.styles.mediumLabel, { marginBottom: CommonStyles.GLOBAL_PADDING} ]}>You didn't defined any hashtag yet.</Text>
                <Text style={ [CommonStyles.styles.mediumLabel, { marginBottom: CommonStyles.GLOBAL_PADDING} ]}>To add a single hashtag, just click on <Ionicons name={'ios-add'} style={CommonStyles.styles.mediumLabel}/> on the top of the screen.</Text>
                <Text style={ [CommonStyles.styles.mediumLabel, { marginBottom: CommonStyles.GLOBAL_PADDING} ]}>By clicking on <Ionicons name={'ios-cloud-download'} style={CommonStyles.styles.mediumLabel}/>, you can also import all the hashtags you have already used in your instagram posts.</Text>
            </View>
        );
    }

    renderListItem({item}) {
        return (
            <SwipeableListViewItem
                itemId={item.id} 
                rightAction={{ caption: 'Delete', icon: 'ios-trash', color: CommonStyles.DELETE_COLOR, callback: this.onDeleteTag }}
                leftAction={{ caption: 'Archive', icon: 'ios-archive', color: CommonStyles.ARCHIVE_COLOR, callback: this.onArchiveTag }}
                onSwipeStart={this.onSwipeStart}
                onSwipeRelease={this.onSwipeRelease}
            >
                <TouchableOpacity onPress={() => this.onEditTag(item)}>
                        <Text style={CommonStyles.styles.singleListItem}>{item.name}</Text>
                </TouchableOpacity>
            </SwipeableListViewItem>
        );
    }
  
    renderSectionHeader({section}) {
        return (
            <View style={CommonStyles.styles.sectionHeaderContainer}>
                <Text style={CommonStyles.styles.sectionHeader}>{section.title}</Text>
            </View>
        );
    }

    keyExtractor(item, index) {
        return item.name;
    }

    render() {
        return(
            <View style={[CommonStyles.styles.standardPage, {padding: 0}]}>
                {
                    this.state.isLoading ? 
                    <LoadingIndicatorView/> :
                    (
                        <View style={{ flex: 1 }}>
                            <View style={{padding: CommonStyles.GLOBAL_PADDING, backgroundColor: CommonStyles.MEDIUM_BACKGROUND}}>
                                <SearchInput
                                    placeholder={'search hashtag'}
                                    dataSource={this.getSearchDataSource}
                                    resultsCallback={this.setSearchResults}
                                    filterProperty={'name'}
                                />
                            </View>
                            {
                                this.state.searchResults ?
                                <FlatList
                                    style={{ flex: 1 }}
                                    scrollEnabled={!this.state.isSwiping}
                                    data={this.state.searchResults}
                                    keyExtractor={this.keyExtractor}
                                    ListEmptyComponent={this.emptySearchResult}
                                    renderItem={this.renderListItem}
                                    ItemSeparatorComponent={this.renderSeparator} />
                                :
                                <View style={{ flex: 1, justifyContent: 'center'}}>
                                    <SectionList
                                        ref={ref => this.sectionListRef = ref}
                                        style={{ flex: 1 }}
                                        scrollEnabled={!this.state.isSwiping}
                                        sections={this.state.sections} 
                                        extraData={this.state}
                                        renderItem={this.renderListItem}
                                        renderSectionHeader={this.renderSectionHeader}
                                        ItemSeparatorComponent={this.renderSeparator}
                                        ListEmptyComponent={this.renderEmptyComponent}
                                        keyExtractor={this.keyExtractor}
                                        getItemLayout={this.getItemLayout}
                                    />
                                    <SectionListIndex
                                        sections={this.state.sections} extraData={this.state}
                                        onPressIndex={this.onPressSectionIndex}
                                    />
                                </View>
                            }
                        </View>
                    )
                }
            </View>
        );
    }
}