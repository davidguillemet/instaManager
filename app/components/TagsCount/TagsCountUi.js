import React from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';

import CommonStyles from './../../styles/common';

class TagsCountUi extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        
        const remainingTags = this.props.maxTagsCount - this.props.tagsCount;
        const remainingError = remainingTags < 0;
        const titleStatusStyle = remainingError ? styles.errorTitle : styles.successTitle;
        const remainingStatusStyle = remainingError ? styles.errorText : styles.successText;
        const tagCount = `${this.props.tagsCount} Tag(s) in total - `;
        const remainingTip = remainingError ? `${-remainingTags} in excess` : `${remainingTags} remaining`;
    
        return (
            <View style={[CommonStyles.styles.standardTile, styles.tagSegmentTitle, titleStatusStyle]}>
                <Text style={[CommonStyles.styles.smallLabel, remainingStatusStyle]}>{tagCount + remainingTip}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create(
{
    tagSegmentTitle: {
        justifyContent: 'center'
    },
    errorText: {
        color: CommonStyles.DARK_RED
    },
    successText: {
        color: CommonStyles.DARK_GREEN
    },
    errorTitle: {
        backgroundColor: CommonStyles.LIGHT_RED
    },
    successTitle: {
        backgroundColor: CommonStyles.LIGHT_GREEN
    }
});

export default TagsCountUi;
    