import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView
} from 'react-native';

import TagContainer from '../../components/TagContainer';
import CustomButton from '../../components/CustomButton';
import CommonStyles from '../../styles/common';
import { NotificationType, BottomNotification } from '../../components/BottomNotification';

export default class PublicationSummaryScreenUi extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'Publication Summary'
        }   
    };

    constructor(props) {
        super(props);

        const { params } = this.props.navigation.state;

        let pubId = params.id;

        const publication = global.hashtagUtil.getPubFromId(pubId);
        this.name = publication.name;
        this.category = publication.category;
        this.categoryName = publication.categoryName;
        this.tags = publication.tagNames.map(tagName => this.getTagObject(tagName));
   
        this.onCopyToClipboard = this.onCopyToClipboard.bind(this);

        this.state = {
            copyCompleted: false // true as soon as the tags have been exported to clipboard
        }

        this.copyClipboardSubscriber = [];
        this.saveSubscriber = [];
    }

    getTagObject(tagName) {

        return {
            id: global.uniqueID(),
            name: tagName,
            categories: []
        }
    }

    onCopyToClipboard() {

        this.setState( {
            copyCompleted: false,
        });

        global.hashtagUtil.copyToClipboard(this.tags).then(() => {
            this.setState( {
                copyCompleted: true,
            });
            this.copyClipboardSubscriber.forEach(listener => listener.setActionCompleted());
        });
    }

    renderTagsCountCaption() {

        const remainingTags = this.props.maxTagsCount - this.tags.length;
        const remainingError = remainingTags < 0;
        const tagCount = `${this.tags.length} Tag(s) in total - `;
        const remainingTip = remainingError ? `${-remainingTags} in excess` : `${remainingTags} remaining`;

        return (
            <View style={[
                    CommonStyles.styles.standardTile,
                    {
                        justifyContent: 'center',
                        backgroundColor: remainingError ? CommonStyles.LIGHT_RED : CommonStyles.LIGHT_GREEN
                    }
                    ]}>
                <Text style={[
                        CommonStyles.styles.smallLabel,
                        {
                            color: remainingError ? CommonStyles.DARK_RED : CommonStyles.DARK_GREEN
                        }
                        ]}>
                    {tagCount + remainingTip}
                </Text>
            </View>
        );
    }

    render() {

        const categoryRemoved = (this.category == null || this.category.length == 0) && this.categoryName.length > 0;
        const categoryName = this.categoryName && this.categoryName.length > 0 ? this.categoryName : '<No category>';

        let baseCategoryParameterLabel = 'Base category';
        if (categoryRemoved) {
            baseCategoryParameterLabel += ' (removed)';
        }
            
        return(
            <View style={[CommonStyles.styles.standardPage, { padding: 0 }]}>
                
                <CustomButton
                    style={[CommonStyles.styles.standardButton, {justifyContent: 'center', marginTop: CommonStyles.GLOBAL_PADDING, marginHorizontal: CommonStyles.GLOBAL_PADDING}]}
                    title={'Copy to clipboard'}
                    onPress={this.onCopyToClipboard}
                    register={this.copyClipboardSubscriber}
                    showActivityIndicator={true}
                />

                <ScrollView style={CommonStyles.styles.standardPage}>

                    <View style={styles.parameterContainerView}>
                        <Text style={[CommonStyles.styles.smallLabel, styles.parameterLabel]}>Name</Text>
                        <TextInput
                            defaultValue={this.name || '<no name>'}
                            style={styles.parameterInput}
                            selectionColor={CommonStyles.TEXT_COLOR}
                            editable={false}
                        />
                    </View>
                    <View style={styles.parameterContainerView}>
                        <Text style={[CommonStyles.styles.smallLabel, styles.parameterLabel]}>{baseCategoryParameterLabel}</Text>
                        <TextInput
                            defaultValue={categoryName}
                            style={styles.parameterInput}
                            selectionColor={CommonStyles.TEXT_COLOR}
                            editable={false}
                        />
                    </View>
                    <View style={{height: 20}}></View>
                    { this.renderTagsCountCaption() }
                    <TagContainer style={{ marginTop: 10 }}
                        tags={this.tags}
                        itemType={global.TAG_ITEM}
                        readOnly={true}
                        addSharp={true}
                        asObject={true}
                    />
                    <View style={{ height: 20 }}></View>

                </ScrollView>
                
                { 
                    this.state.copyCompleted ?
                    <BottomNotification
                        caption={'The tags have been sent to the clipboard.'}
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

const styles = StyleSheet.create(
{
    parameterContainerView: {
        flexDirection: 'column',
        borderBottomColor: CommonStyles.SEPARATOR_COLOR,
        borderBottomWidth: 1,
        paddingTop: CommonStyles.GLOBAL_PADDING
    },
    parameterInput: {
        flex: 1,
        fontSize: CommonStyles.MEDIUM_FONT_SIZE,
        color: CommonStyles.KPI_COLOR,
        padding: CommonStyles.GLOBAL_PADDING
    },
    parameterLabel: {
        flex: 1,
        paddingLeft: CommonStyles.GLOBAL_PADDING,
    },
});
