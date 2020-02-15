import React from 'react';
import {
    View,
    FlatList,
    TouchableOpacity
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import ListItemSeparator from '../../components/ListItemSeparator';
import ProfileListItem from './ProfileListItem';

function renderRightButtons(params) {

    return (
        <View style={{ flexDirection: 'row'}}>
            <TouchableOpacity onPress={params.onAddProfile}><Ionicons name={'md-add'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
        </View>
    );
}

export default class ProfileListScreen extends React.PureComponent {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'Profiles',
            headerRight: renderRightButtons(params)
        }   
    };

    constructor(props) {
        super(props);
        this.keyExtractor = this.keyExtractor.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
        this.onAddProfile = this.onAddProfile.bind(this);
        this.setStateProxy = this.setStateProxy.bind(this);

        this.state = {
            isSwiping: false
        }
    }

    componentDidMount() {

        this.props.navigation.setParams({ 
            onAddProfile: this.onAddProfile,
        });
    }

    onAddProfile() {
        this.props.navigation.navigate('ProfileEdit');
    }

    keyExtractor(item, index) {
        return item.name;
    }

    setStateProxy(state) {
        this.setState(state);
    }

    renderListItem({item}) {
        return (
            <ProfileListItem
                id={item.id}
                name={item.name}
                selected={this.props.activeProfileId == item.id}
                onDeleteProfile={this.props.onDeleteProfile}
                setParentState={this.setStateProxy}
                onPress={this.props.onSetActiveProfile}
            />
        );
    }

    render() {
        return(
            <View style={[CommonStyles.styles.standardPage, {padding: 0}]}>
                <FlatList
                    style={{ flex: 1 }}
                    scrollEnabled={!this.state.isSwiping}
                    data={this.props.profiles}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderListItem}
                    ItemSeparatorComponent={ListItemSeparator}
                    indicatorStyle={'white'} />
            </View>
        );
    }

}