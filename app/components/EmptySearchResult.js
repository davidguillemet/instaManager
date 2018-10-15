import React from 'react';
import {
    Text,
    View
} from 'react-native';
import CommonStyles from '../styles/common';

export default EmptySearchResult = () => {
    return (
        <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={ [CommonStyles.styles.largeLabel, { margin: CommonStyles.GLOBAL_PADDING * 2} ]}>{'No results...'}</Text>
        </View>
    );
}