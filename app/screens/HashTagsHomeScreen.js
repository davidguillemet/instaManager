import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SectionList
} from 'react-native';

import CustomButton from '../components/CustomButton';
import LoadingIndicatorView from '../components/LoadingIndicator';

export default class HashTagsHomeScreen extends React.Component {

    static navigationOptions = {
        title: 'Your Hashtags'
      };

    constructor(props) {
        super(props);
        this.state = { isLoading: true };
        this.sections = [];
    }
    
    componentWillMount() {

        global.hashtagManager.open()
        .then(() => {

            let sortedHashtags = global.hashtagManager.getHashtags();
            
            // Here we get a sorted list,
            // split into sections
            this.sections = [];
            let previousSectionTitle = null;
            let currentSectionData;
            for (let tagName of sortedHashtags) {

                let currentSectionTitle = tagName.charAt(0).toUpperCase();

                if (currentSectionTitle != previousSectionTitle) {
                    // New section
                    currentSectionData = [];
                    this.sections.push({ title: currentSectionTitle, data: currentSectionData });
                }
                currentSectionData.push(tagName);
            }

            // DEBUG

            this.sections.push({ title: 'A', data: ['arnaud', 'action'] });
            this.sections.push({ title: 'B', data: ['bruno', 'benoit'] });
            this.sections.push({ title: 'A', data: ['arnaud', 'action'] });
            this.sections.push({ title: 'B', data: ['bruno', 'benoit'] });
            this.sections.push({ title: 'A', data: ['arnaud', 'action'] });
            this.sections.push({ title: 'B', data: ['bruno', 'benoit'] });
            this.sections.push({ title: 'A', data: ['arnaud', 'action'] });
            this.sections.push({ title: 'B', data: ['bruno', 'benoit'] });
            this.sections.push({ title: 'A', data: ['arnaud', 'action'] });
            this.sections.push({ title: 'B', data: ['bruno', 'benoit'] });
            this.sections.push({ title: 'A', data: ['arnaud', 'action'] });
            this.sections.push({ title: 'B', data: ['bruno', 'benoit'] });
            this.sections.push({ title: 'A', data: ['arnaud', 'action'] });
            this.sections.push({ title: 'B', data: ['bruno', 'benoit'] });
            this.sections.push({ title: 'A', data: ['arnaud', 'action'] });
            this.sections.push({ title: 'B', data: ['bruno', 'benoit'] });
            this.sections.push({ title: 'A', data: ['arnaud', 'action'] });
            this.sections.push({ title: 'B', data: ['bruno', 'benoit'] });
            this.sections.push({ title: 'A', data: ['arnaud', 'action'] });
            this.sections.push({ title: 'B', data: ['bruno', 'benoit'] });
            this.sections.push({ title: 'A', data: ['arnaud', 'action'] });
            this.sections.push({ title: 'B', data: ['bruno', 'benoit'] });
            this.sections.push({ title: 'A', data: ['arnaud', 'action'] });
            this.sections.push({ title: 'B', data: ['bruno', 'benoit'] });
            this.sections.push({ title: 'A', data: ['arnaud', 'action'] });
            this.sections.push({ title: 'B', data: ['bruno', 'benoit'] });

            ///

            this.setState({ isLoading: false }); 
        });
    }

    _onImportYourHashtags() {

    }

    _onImportCompetitorsHashtags() {

    }
  
    render() {

        return(
            <View style={CommonStyles.styles.standardPage}>
                <CustomButton style={CommonStyles.styles.standardButton}
                    title='Import your Hashtags'
                    onPress={this._onImportYourHashtags.bind(this)}/>
                <CustomButton style={CommonStyles.styles.standardButton}
                    title='Import from competitors'
                    onPress={this._onImportCompetitorsHashtags.bind(this)}/>
                <View>
                    { this.state.isLoading ? <LoadingIndicatorView/> : null }
                    <SectionList
                        sections={this.sections} 
                        renderItem={({item}) => <Text>{item}</Text>}
                        renderSectionHeader={({section}) => <Text>{section.title}</Text>}
                        keyExtractor={(item, index) => index} />
                </View>
            </View>
        );
    }
}