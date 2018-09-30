import React from 'react';
import {
    SectionList,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingIndicatorView from '../../components/LoadingIndicator';
import CustomButton from '../../components/CustomButton';
import CommonStyles from '../../styles/common';
import PublicationListItem from './PublicationListItem';

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
            isSwiping: false
        }

        this.onCreatePublication = this.onCreatePublication.bind(this);
        this.onEditPublication = this.onEditPublication.bind(this);
        this.renderEmptyComponent = this.renderEmptyComponent.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
        this.setStateProxy = this.setStateProxy.bind(this);
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
        const params = {
            itemType: global.PUBLICATION_ITEM
        };
        this.props.navigation.navigate('HashtagCategoryEdit', params);        
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
        
        const publication = global.hashtagUtil.getPubFromId(item);
        let categoryName = '';
        if (publication.category != null) {
            categoryName = global.hashtagUtil.getCatFromId(publication.category).name;
        } else {
            // Removed category
            categoryName = publication.categoryName;
        }

        return (
            <PublicationListItem
                id={item}
                name={publication.name || 'no name'}
                categoryName={categoryName}
                tagsCount={publication.tagNames.length}
                time={publication.creationDate.toLocaleTimeString(global.locale)}
                setParentState={this.setStateProxy}
                onDeleteItem={this.props.onDeletePublication}
                onPress={this.onEditPublication}
            />
        );
    }

    keyExtractor(item, index) {
        return item;
    }

    render() {

        if (this.props.publicationsLoaded == false) {
            return <LoadingIndicatorView/>;
        }

        return(
            <View style={CommonStyles.styles.standardPage}>
                <View style={[CommonStyles.styles.standardTile, {flexDirection: 'column'}]}>
                    <Text style={CommonStyles.styles.smallLabel}>
                        When creating a publication, you will be able to define a set of tags by selecting a base category as well as additional single tags.
                    </Text>
                    <Text style={CommonStyles.styles.smallLabel}>
                        Once your publication contains all the desired tags, you will be able to copy them to the clipboard in order to paste them easily in your target social application.
                    </Text>
                </View>
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
                />
            </View>
        );
    }
}
