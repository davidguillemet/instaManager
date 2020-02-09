import React from 'react';
import {
    View,
    FlatList,
} from 'react-native';

import ListItemSeparator from '../../components/ListItemSeparator';

export default class ProfileListScreen extends React.PureComponent {
    static navigationOptions = {
        title: 'Profiles'
      };

    constructor(props) {
        super(props);
        this.keyExtractor = this.keyExtractor.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
    }

    keyExtractor(item, index) {
        return item.name;
    }

    renderListItem({item}) {
        return (
            <Text>item.name</Text>
        );
    }

    render() {
        return(
            <View style={[CommonStyles.styles.standardPage, {padding: 0}]}>
                <FlatList
                    style={{ flex: 1 }}
                    scrollEnabled={!this.state.isSwiping}
                    data={this.props.Profiles}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderListItem}
                    ItemSeparatorComponent={ListItemSeparator}
                    indicatorStyle={'white'} />
            </View>
        );
    }

}