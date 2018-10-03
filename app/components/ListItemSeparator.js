import React from 'react';
import { View } from 'react-native';
import CommonStyles from '../styles/common';

export default ListItemSeparator = (props) => {
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