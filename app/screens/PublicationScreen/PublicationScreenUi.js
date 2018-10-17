import React from 'react';
import {
    FlatList,
    SectionList,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingIndicatorView from '../../components/LoadingIndicator';
import CustomButton from '../../components/CustomButton';
import ListItemSeparator from '../../components/ListItemSeparator';
import CommonStyles from '../../styles/common';
import PublicationListItem from './PublicationListItem';
import EmptySearchResult from './../../components/EmptySearchResult';
import SearchInput from '../../components/Search';

function renderEditionRightButtons(params) {

    return (
        <View style={{ flexDirection: 'row'}}>
            <TouchableOpacity onPress={params.onCreatePublication}><Ionicons name={'ios-add'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
        </View>
    );
}

export default class PublicationScreenUi extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'Publication Management',
            headerRight: renderEditionRightButtons(params)
        }   
    };

    constructor(props) {
        super(props);

        this.state = {
            isSwiping: false,
            searchResults: null
        }

        this.onCreatePublication = this.onCreatePublication.bind(this);
        this.onEditPublication = this.onEditPublication.bind(this);
        this.renderEmptyComponent = this.renderEmptyComponent.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
        this.setStateProxy = this.setStateProxy.bind(this);
        this.setSearchResults = this.setSearchResults.bind(this);
        this.searchPublication = this.searchPublication.bind(this);
    }

    componentDidMount() {
 
        this.props.navigation.setParams({ 
            onCreatePublication: this.onCreatePublication
        });

        this.props.onLoadPublications();
    }

    onEditPublication(pubId) {

        const params = {
            id: pubId
        };

        this.props.navigation.navigate('PublicationSummary', params);
    }

    onCreatePublication() {

        this.props.navigation.navigate('PublicationWizard');
    }

    renderSectionHeader({section}) {
        return (
            <View style={CommonStyles.styles.sectionHeaderContainer}>
                <Text style={CommonStyles.styles.sectionHeader}>{section.title}</Text>
            </View>
        );
    }

    renderEmptyComponent() {
    
        return (
            <CustomButton title={'Create your first publication'} onPress={this.onCreatePublication} style={CommonStyles.styles.standardButtonCentered}/>
        );
    }

    setStateProxy(state) {
        this.setState(state);
    }

    renderListItem({item}) {
        
        const publication = item;
        let categoryName = '';
        if (publication.category != null) {
            categoryName = global.hashtagUtil.getCatFromId(publication.category).name;
        } else {
            // Removed category
            categoryName = publication.categoryName;
        }

        const publicationDate =
            publication.creationDate.toLocaleDateString(global.locale, {year: "numeric", month: "long", day: "numeric"}) +
            ' - ' +
            publication.creationDate.toLocaleTimeString(global.locale);

        return (
            <PublicationListItem
                id={publication.id}
                name={publication.name || 'no name'}
                categoryName={categoryName}
                tagsCount={publication.tagNames.length}
                time={publicationDate}
                setParentState={this.setStateProxy}
                onDeleteItem={this.props.onDeletePublication}
                onPress={this.onEditPublication}
            />
        );
    }

    keyExtractor(item, index) {
        return item.id;
    }

    emptySearchResult() {
        return <EmptySearchResult />;
    }

    setSearchResults(results) {
        this.setState({ searchResults: results });
    }

    searchPublication(searchText) {
        return global.hashtagUtil.searchItem(global.PUBLICATION_ITEM, `*${searchText}*`);
    }

    render() {

        if (this.props.publicationsLoaded == false) {
            return <LoadingIndicatorView/>;
        }

        if (this.state.searchResults) {
            // Remove publications which could have been removed...
            for (let index = this.state.searchResults.length - 1; index >= 0; index--) {
                if (!global.hashtagUtil.hasPub(this.state.searchResults[index].id)) {
                    this.state.searchResults.splice(index, 1);
                }
            }
        }

        return(
            <View style={[CommonStyles.styles.standardPage, {padding: 0}]}>
                <View style={{padding: CommonStyles.GLOBAL_PADDING, backgroundColor: CommonStyles.MEDIUM_BACKGROUND}}>
                    <SearchInput
                        placeholder={'search publication'}
                        onSearch={this.searchPublication}
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
                        ItemSeparatorComponent={ListItemSeparator} />
                    :
                    <SectionList
                        ref={ref => this.sectionListRef = ref}
                        style={{ flex: 1 }}
                        scrollEnabled={!this.state.isSwiping}
                        sections={this.props.sections} 
                        renderItem={this.renderListItem}
                        renderSectionHeader={this.renderSectionHeader}
                        ItemSeparatorComponent={ListItemSeparator}
                        ListEmptyComponent={this.renderEmptyComponent}
                        keyExtractor={this.keyExtractor}
                    />
                }
            </View>
        );
    }
}
