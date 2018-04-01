import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  ProgressViewIOS,
  TouchableOpacity,
  Alert
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchInput from '../components/Search';
import CustomButton from '../components/CustomButton';

import CommonStyles from '../styles/common';

import MediaListService from '../services/media/MediaListService';
import MediaCommentsService from '../services/media/MediaCommentsService';

function renderBackButton(params) {

    return (
        <TouchableOpacity onPress={params.onBack}><Ionicons name={'ios-arrow-back'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
    );
}

export default class HashTagsImportScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'Import',
            headerLeft: renderBackButton(params)
        }   
    };

    constructor(props) {
        super(props);
        this.mediaCount = 0;
        this.initiaState = {
            canceled: false,
            completed: false,
            isLoading: true,
            importProgress: 0,
            importStep: "Preparing Import...",
            importCount: 0
        };
        this.importResults = new Set();
        this.currentTags = null;
        this.state = { ...this.initiaState };
    }
    
    componentDidMount() {

        this.props.navigation.setParams({ onBack: this.onBack.bind(this) });

        this.startProcess();
    }

    onStartCancel() {

        if (this.state.canceled) {
            // Launch import again = initialState
            this.setState( this.initiaState );
            this.startProcess();
        } else {
            // Just cancel the import
            this.setState({
                canceled: true,
                importStep: 'The scan process has been canceled.',
                isLoading: false,
                importProgress: this.mediaCount
            });
        }
    }

    onBack() {

        if (this.importResults.size > 0) {

            Alert.alert(
                null,
                "Some tags which have been imported from your media have not been saved. Would you like to continue?",
                [
                    {text: 'Cancel', onPress: null, style: 'cancel'},
                    {text: 'OK', onPress: () => this.props.navigation.goBack() }
                ]
            );

        } else {

            this.props.navigation.goBack();
        }
    }

    onViewResults() {
        // TODO...
    }

    startProcess() {

        // Clear possible previous import results
        this.importResults.clear();

        // populate a Set containing current tags
        const sortedHashtags = global.hashtagManager.getHashtags();
        this.currentTags = sortedHashtags.reduce((set, tag) => { set.add(tag.name); return set; }, new Set());

        global.userManager.getMediaCount()
        .then((mediaCount) => {

            this.mediaCount = mediaCount;
            this.setState({
                importStep: `Preparing scanning ${this.mediaCount} media...`
            });
            this.fetchMediaList(null);        
        });
    }

    fetchMediaList(cursorNext) {

        const mediaListServiceDelegate = new MediaListService(global.instaFacade.getUserId(), cursorNext);
        global.serviceManager.invoke(mediaListServiceDelegate)
        .then(({data, next}) => {
            this.scanMediaList(data, 0, next);
        })
        .catch((error) => {
            this.setState({
                importStep: `An error occurred...`,
                importProgress: this.mediaCount
            });
        });
    }

    scanMediaList(mediaList, indexToScan, cursorNext) {

        if (this.state.canceled) {
            return;
        }

        let progress = this.state.importProgress + 1;
        this.setState({
            importStep: `Scanning media ${progress} of ${this.mediaCount}...`,
            isLoading: false,
            importProgress: progress,
            importCount: this.importResults.size
        });
       
        this.scanMedia(mediaList[indexToScan].id)
        .then(() => {
            if (indexToScan < mediaList.length - 1) {
                // scan next media from the current page
                this.scanMediaList(mediaList, indexToScan + 1, cursorNext);
            } else  if (cursorNext) {
                // fecth possible next media page
                this.fetchMediaList(cursorNext);
            } else {
                // No more media page...scan completed
                this.setState({
                    completed: true,
                    importStep: `Scanning process sompleted`,
                    importProgress: this.mediaCount,
                    importCount: this.importResults.size
                });
            }
        });
    }

    scanMedia(mediaId) {

        let mediaCommentsServiceDelegate = new MediaCommentsService(mediaId);
        return global.serviceManager.invoke(mediaCommentsServiceDelegate)
        .then((media) => {

            if (this.state.canceled) {
                return;
            }

            // scan comments
            if (media.comments && media.comments.data) {
                this.scanComments(media.comments.data);
            }
           
            if (this.state.canceled) {
                return;
            }
            
            // scan caption
            this.scanText(media.caption);
        });
    }

    scanComments(comments) {
        
        if (!comments || this.state.canceled) {
            return;
        }

        for (let comment of comments) {

            if (this.state.canceled) {
                return;
            }

            if (comment.user.id != global.instaFacade.getUserId()) {
                // don't scan comments from other users...
                continue;
            }

            this.scanText(comment.text);                
        }
    }

    scanText(text) {
        
        if (this.state.canceled) {
            return;
        }
        
        const regex = new RegExp("(#([^#\\s]+))", "g");
        while ((m = regex.exec(text)) !== null) {
            
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            // The tag itself, without '#' is the second group
            const newTag = m[2];
            if (!this.currentTags.has(newTag)) {
                this.importResults.add(newTag);
            }
        }
    }

    render() {
        return (
            <View style={[CommonStyles.styles.standardPage, {alignItems: 'center', justifyContent: 'center'}]}>
                <Text style={[CommonStyles.styles.mediumLabel, {marginBottom: CommonStyles.GLOBAL_PADDING}]}>{this.state.importStep}</Text>
                <Text style={[CommonStyles.styles.smallLabel, {marginBottom: CommonStyles.GLOBAL_PADDING}]}>{this.state.importCount} new tag(s) found</Text>
                
                { this.state.isLoading ?
                    <ActivityIndicator
                        color={CommonStyles.TEXT_COLOR}
                        size='large'
                        style={{height: 40}}
                    />
                    :
                    <ProgressViewIOS
                        progressViewStyle='bar'
                        progress={this.state.importProgress / this.mediaCount}
                        trackTintColor={CommonStyles.TEXT_COLOR}
                        style={{width: '75%', height: 40}}/>
                }
                
                <CustomButton
                    onPress={this.onStartCancel.bind(this)}
                    title={(this.state.canceled || this.state.completed) ? 'Restart scan process' : 'Cancel scan process'}
                    style={{marginTop: CommonStyles.GLOBAL_PADDING}} />
                
                { (this.state.importCount > 0 && (this.state.completed || this.state.canceled)) ?
                    <CustomButton
                    onPress={this.onViewResults.bind(this)}
                    title={'View scan results'}
                    style={{marginTop: CommonStyles.GLOBAL_PADDING}} />
                    :
                    null
                }
            </View>
        );
    }
}
