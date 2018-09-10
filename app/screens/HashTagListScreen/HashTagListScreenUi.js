import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  FlatList,
  SectionList,
  TouchableOpacity,
  Alert
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../components/CustomButton';
import SearchInput from '../../components/Search';
import LoadingIndicatorView from '../../components/LoadingIndicator';
import SectionListIndex from '../../components/SectionListIndex';
import TagListItem from './HashTagListItem';

import CommonStyles from '../../styles/common'; 

function renderEditionRightButtons(params) {

    return (
        <View style={{ flexDirection: 'row'}}>
            <TouchableOpacity onPress={params.onAddTag}><Ionicons name={'ios-add'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
            <TouchableOpacity onPress={params.onImport}><Ionicons name={'ios-cloud-download'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
        </View>
    );
}

function renderSelectionRightButtons(params) {

    return (
        <View style={{ flexDirection: 'row'}}>
            <TouchableOpacity onPress={params.onValidateSelection}><Ionicons name={'ios-checkmark'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
        </View>
    );
}

export default class HashTagListScreenUi extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'My Hashtags',
            headerRight: (params.mode == undefined || params.mode == global.LIST_EDITION_MODE) ? renderEditionRightButtons(params) : renderSelectionRightButtons(params)
        }   
    };

    constructor(props) {
        super(props);

        const { params } = this.props.navigation.state;
        // Edition by default
        this.mode = params && params.mode ? params.mode : global.LIST_EDITION_MODE;
        this.onSelectionValidated = params ? params.onSelectionValidated : null;
        let selectionArray = params ? params.selection : null;

        this.state =
        { 
            isSwiping: false,
            selection: new Set(selectionArray)
        };

        this.sectionListRef = null;

        this.renderEmptyComponent = this.renderEmptyComponent.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
        this.keyExtractor = this.keyExtractor.bind(this);
        this.setSearchResults = this.setSearchResults.bind(this);

        this.onAddTag = this.onAddTag.bind(this);
        this.onImport = this.onImport.bind(this);
        this.onValidateSelection = this.onValidateSelection.bind(this);
        this.onEditTag = this.onEditTag.bind(this);
        this.onSelectTag = this.onSelectTag.bind(this);
        this.onArchiveTag = this.onArchiveTag.bind(this);

        this.setStateProxy = this.setStateProxy.bind(this);

        this.onPressSectionIndex = this.onPressSectionIndex.bind(this);
    }
    
    componentDidMount() {

        this.props.navigation.setParams({ 
            onImport: this.onImport,
            onAddTag: this.onAddTag,
            onValidateSelection: this.onValidateSelection
        });
    }

    getSearchDataSource() {
        return global.hashtagUtil.getHashtags().valueSeq().toArray();
    }

    setSearchResults(results) {
        this.setState({ searchResults: results });
    }

    emptySearchResult() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', padding: CommonStyles.GLOBAL_PADDING}}>
                <Text style={ [CommonStyles.styles.mediumLabel, { marginBottom: CommonStyles.GLOBAL_PADDING} ]}>No results...</Text>
            </View>
        );
    }

    onImport() {
        this.props.navigation.navigate('HashTagsImport');
    }

    navigateToEditScreen(tagToEdit) {

        const params = {
            updateItem: tagToEdit,
            itemType: global.TAG_ITEM
        };

        this.props.navigation.navigate('HashtagCategoryEdit', params);
    }

    onAddTag() {

        this.navigateToEditScreen(null);
    }

    onValidateSelection() {

        if (this.onSelectionValidated) {

            this.onSelectionValidated([...this.state.selection]);
            this.props.navigation.goBack();
        }
    }

    onEditTag(itemId) {

        let tagItem = this.props.tags.get(itemId);
        this.navigateToEditScreen(tagItem);
    }

    onSelectTag(itemId) {

        let newSelection = new Set(this.state.selection);

        if (newSelection.has(itemId)) {
            // Item was selected, remove it from selection
            newSelection.delete(itemId);
        } else {
            // Item was not selected, add it in the selection
            newSelection.add(itemId);
        }

        this.setState( { selection: newSelection } );
    }

    onArchiveTag(itemId) {
        ///////////
        // TODO
        ///////////
    }

    onPressSectionIndex(sectionTitle) {

        if (this.sectionListRef == null) {
            return;
        }

        const sectionIndex = this.props.sections.findIndex((section, sectionIndex, array) => section.title == sectionTitle);

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
            <View style={{flex: 1, padding: CommonStyles.GLOBAL_PADDING}}>
                <CustomButton style={CommonStyles.styles.standardButtonCentered} title={'Create your first tag'} onPress={this.onAddTag} />
                <CustomButton style={CommonStyles.styles.standardButtonCentered} title={'Import tags from text'} onPress={this.onAddTag} />
            </View>
        );
    }

    setStateProxy(state) {
        this.setState(state);
    }

    renderListItem({item}) {
        
        const itemId = item.id || item;
        const itemName = item.name || global.hashtagUtil.getTagFromId(item).name;

        return (
            /**
             * props:
             * - id
             * - name
             * - selected
             * - mode = global.LIST_EDITION_MODE or LIST_SELECTION_MODE
             * - setParentState = callback to set parent state
             * - onDeleteTag = callback when a category should be deleted (category id as parameter)
             * - onPress = callback when a tag is pressed
             */
            <TagListItem
                id={itemId}
                name={itemName}
                selected={this.state.selection.has(itemId)}
                mode={this.mode}
                setParentState={this.setStateProxy}
                onDeleteTag={this.props.onDeleteTag}
                onPress={this.mode == global.LIST_SELECTION_MODE ? this.onSelectTag : this.onEditTag}
            />
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
        return item.id || item;
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
                                        sections={this.props.sections} 
                                        renderItem={this.renderListItem}
                                        renderSectionHeader={this.renderSectionHeader}
                                        ItemSeparatorComponent={this.renderSeparator}
                                        ListEmptyComponent={this.renderEmptyComponent}
                                        keyExtractor={this.keyExtractor}
                                        getItemLayout={this.getItemLayout}
                                    />
                                    <SectionListIndex
                                        sections={this.props.sections}
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
