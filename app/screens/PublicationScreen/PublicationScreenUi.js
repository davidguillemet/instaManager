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
import ListItemSeparator from '../../components/ListItemSeparator';
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
        
        const publication = global.hashtagUtil.getPubFromId(item);
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
                id={item}
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
        return item;
    }

    render() {

        if (this.props.publicationsLoaded == false) {
            return <LoadingIndicatorView/>;
        }

        return(
            <View style={[CommonStyles.styles.standardPage, {padding: 0}]}>
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
            </View>
        );
    }
}
