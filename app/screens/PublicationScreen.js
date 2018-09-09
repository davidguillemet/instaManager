import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import CustomButton from '../components/CustomButton';
import CommonStyles from '../styles/common';

export default class PublicationScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'Publication Management'
        }   
    };

    constructor(props) {
        super(props);

        this.onCreatePublication = this.onCreatePublication.bind(this);
    }

    onCreatePublication() {
        const params = {
            itemType: global.PUBLICATION_ITEM
        };
        this.props.navigation.navigate('HashtagCategoryEdit', params);        
    }

    render() {
        return(
            <View style={CommonStyles.styles.standardPage}>
                <View style={CommonStyles.styles.standardTile}>
                    <Text style={CommonStyles.styles.smallLabel}>
                        When creating a publication, you will be able to define a set of tags by selecting a base category as well as additional single tags.
                    </Text>
                </View>
                <View style={CommonStyles.styles.standardTile}>
                    <Text style={CommonStyles.styles.smallLabel}>
                        Once your publication contains all the desired tags, you will be able to copy them to the clipboard in order to paste them easily in your target social application.
                    </Text>
                </View>
                <CustomButton title={'Create a publication'} onPress={this.onCreatePublication} />
            </View>
        );
    }
}