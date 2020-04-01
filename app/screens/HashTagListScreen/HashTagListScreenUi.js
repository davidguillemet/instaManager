import React, { Component, PureComponent } from 'react';
import {
    Alert,
    View,
    Text,
    FlatList,
    SectionList,
    TouchableOpacity
} from 'react-native';

import SegmentedControlIOS from '@react-native-community/segmented-control';

import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../components/CustomButton';
import SearchInput from '../../components/Search';
import TagsCount from '../../components/TagsCount';
import LoadingIndicatorView from '../../components/LoadingIndicator';
import SectionListIndex from '../../components/SectionListIndex';
import TagListItem from './HashTagListItem';
import ListItemSeparator from '../../components/ListItemSeparator';
import { NotificationType, BottomNotification } from '../../components/BottomNotification';
import EmptySearchResult from './../../components/EmptySearchResult';

import CommonStyles from '../../styles/common'; 

export const DISPLAY_ALL = 0;
export const DISPLAY_ORPHANS = 1;

function renderEditionRightButtons(params) {

    return (
        <View style={{ flexDirection: 'row'}}>
            <TouchableOpacity onPress={params.onAddTag}><Ionicons name={'md-add'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
            <TouchableOpacity onPress={params.onImport}><Ionicons name={'md-cloud-download'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
        </View>
    );
}

function renderSelectionRightButtons(params) {

    return (
        <View style={{ flexDirection: 'row'}}>
            <TouchableOpacity onPress={params.onAddTag}><Ionicons name={'md-add'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
            <TouchableOpacity onPress={params.onValidateSelection}><Ionicons style={CommonStyles.styles.navigationButtonIcon} name={'md-checkmark'} size={40}/></TouchableOpacity>
        </View>
    );
}

export default class HashTagListScreenUi extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'Hashtags',
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
            selection: new Set(selectionArray),
            importNotification: params ? params.importNotification : null
        };

        this.sectionListRef = null;

        this.renderEmptyComponent = this.renderEmptyComponent.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
        this.keyExtractor = this.keyExtractor.bind(this);
        this.setSearchResults = this.setSearchResults.bind(this);
        this.setDisplayType = this.setDisplayType.bind(this);

        this.onAddTag = this.onAddTag.bind(this);
        this.onQuickAddTag = this.onQuickAddTag.bind(this);
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

    setSearchResults(results) {
        this.setState({ searchResults: results });
    }

    emptySearchResult() {
        return <EmptySearchResult />;
    }

    onImport() {
        this.props.navigation.navigate('ImportFromText' /* 'HashTagsImport' */);
    }

    navigateToEditScreen(itemId) {

        const params = {
            itemId: itemId,
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
            this.props.navigation.goBack(null);
        }
    }

    onEditTag(itemId) {

        this.navigateToEditScreen(itemId);
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

    onQuickAddTag(tagName) {
        
        const tagToSave = {
            id: global.uniqueID(),
            name: tagName,
            categories: []
        };

        this.props.onAddTag(tagToSave);
    }

    onValidateQuickAdd(tagName) {

        if (!global.hashtagUtil.tagNameIsValid(tagName)) {
            Alert.alert('Invalid tag name', `The tag '${tagName}' is not valid.\n` + global.hashtagUtil.getTagNameRule());
            return false;
        }

        return true;
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
            viewOffset: 0
        });
    }

    // CommonStyles.LIST_ITEM_HEIGHT: 40,
    // CommonStyles.LIST_SEPARATOR_HEIGHT: 1,
    // CommonStyles.SECTION_HEADER_HEIGHT: 30,
    getItemLayout(data, index) {

        let offset = 0;
        let globalIndex = 0;
        let height = 0;

        for (let sectionIndex = 0; sectionIndex < data.length; sectionIndex++) {

            if (globalIndex == index) {
                height = CommonStyles.SECTION_HEADER_HEIGHT;
                break;
            }       

            offset += CommonStyles.SECTION_HEADER_HEIGHT;
            globalIndex += 1; // an item for the section header
            const currentSection = data[sectionIndex];

            for (let itemIndex = 0; itemIndex < currentSection.data.length; itemIndex++, globalIndex++) {
                
                if (globalIndex == index) {
                    height = CommonStyles.LIST_ITEM_HEIGHT;
                    break;
                }
                
                offset += CommonStyles.LIST_ITEM_HEIGHT;
                if (itemIndex < currentSection.data.length - 1) {
                    offset += CommonStyles.LIST_SEPARATOR_HEIGHT;
                }
            }
            
            if (globalIndex == index) {
                break;
            }
            
            globalIndex += 1; // next item for the section footer (height = 0)
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
    
    renderEmptyComponent() {
        
        if (this.mode == global.LIST_SELECTION_MODE) {

            let emptyCaption;
            if (global.hashtagUtil.getTagsCount() > 0) {
                emptyCaption = 'All tags are used in parent categories.';
            } else {
                emptyCaption = 'You have not created any tags yet.';
            }

            return(
                <View style={{flex: 1, padding: CommonStyles.GLOBAL_PADDING}}>
                    <View style={[CommonStyles.styles.standardTile, { alignItems: 'center' } ]}>
                        <Text style={[CommonStyles.styles.mediumLabel, {flex: 1, flexWrap: 'wrap'}]}>{emptyCaption}</Text>
                    </View>                
                </View>
            );
        }
    
        return (
            <View style={{flex: 1, padding: CommonStyles.GLOBAL_PADDING}}>
                <CustomButton style={CommonStyles.styles.standardButtonCentered} title={'Create your first tag'} onPress={this.onAddTag} />
                <CustomButton style={CommonStyles.styles.standardButtonCentered} title={'Import tags from text'} onPress={this.onImport} />
            </View>
        );
    }

    setStateProxy(state) {
        this.setState(state);
    }

    renderListItem({item}) {
        
        const itemObject = item.id ? item : global.hashtagUtil.getTagFromId(item);

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
                id={itemObject.id}
                name={itemObject.name}
                used={itemObject.categories != null && itemObject.categories.length > 0}
                selected={this.state.selection.has(itemObject.id)}
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

    renderSeparator() {
        return <ListItemSeparator marginLeft={TagListItem.indicatorWidth + TagListItem.leftMargin * 2 }/>
    }

    setDisplayType(event) {

        const filterIndex = event.nativeEvent.selectedSegmentIndex;
        if (filterIndex == DISPLAY_ALL) {

            this.props.onShowAllTags();

        } else {

            this.props.onShowOrphanTags();

        }
    }

    render() {
   
        if (this.state.searchResults) {
            // Remove tags which could have been removed...
            for (let index = this.state.searchResults.length - 1; index >= 0; index--) {
                if (!global.hashtagUtil.hasTag(this.state.searchResults[index].id)) {
                    this.state.searchResults.splice(index, 1);
                }
            }
        }

        // In case we decide to make filtering an async. action, we will
        // read filterProcessing from props
        const filterProcessing = false;

        return(
            <View style={[CommonStyles.styles.standardPage, {padding: 0}]}>
                <SegmentedControlIOS
                    values={['All tags', 'Orphan tags']}
                    selectedIndex={this.props.tagFilterIndex}
                    onChange={this.setDisplayType}
                    tintColor={CommonStyles.TEXT_COLOR}
                    textColor={CommonStyles.TEXT_COLOR}
                    activeTextColor={CommonStyles.GLOBAL_BACKGROUND}
                    style={{ margin: CommonStyles.GLOBAL_PADDING}}
                />
                <View style={{flexDirection: 'row', alignItems: 'center', padding: CommonStyles.GLOBAL_PADDING, backgroundColor: CommonStyles.MEDIUM_BACKGROUND}}>
                    <SearchInput
                        placeholder={'search hashtag'}
                        dataSource={this.props.rawTags}
                        resultsCallback={this.setSearchResults}
                        filterProperty={'name'}
                        onAdd={this.onQuickAddTag}
                        onValidateAdd={this.onValidateQuickAdd}
                    />
                </View>
                {
                    filterProcessing == true ?
                    <LoadingIndicatorView/> :
                    this.state.searchResults ?
                    <FlatList
                        style={{ flex: 1 }}
                        scrollEnabled={!this.state.isSwiping}
                        data={this.state.searchResults}
                        keyExtractor={this.keyExtractor}
                        ListEmptyComponent={this.emptySearchResult}
                        renderItem={this.renderListItem}
                        ItemSeparatorComponent={ListItemSeparator}
                        indicatorStyle={'white'}
                    />
                    :
                    <View style={{ flex: 1, justifyContent: 'center'}}>
                        {
                            this.mode == global.LIST_SELECTION_MODE ?
                            <TagsCount tagsCount={this.state.selection.size} /> :
                            null
                        }
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
                            indicatorStyle={'white'}
                        />
                        <SectionListIndex
                            sections={this.props.sections}
                            onPressIndex={this.onPressSectionIndex}
                        />
                    </View>
                }
                { 
                    this.state.importNotification === true ?
                    <BottomNotification
                        caption={'The tags have been saved successfully.'}
                        type={NotificationType.SUCCESS}
                        manuallyCloseable={true}
                    />
                    :
                    null
                }
            </View>
        );
    }
}
