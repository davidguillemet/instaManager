import React from 'react';
import { View } from 'react-native';
import CommonStyles from '../styles/common';

export default ListItemSeparator = (props) => {

    const marginLeft = props.marginLeft || CommonStyles.GLOBAL_PADDING;

    const separatorStyle = {
        height: CommonStyles.LIST_SEPARATOR_HEIGHT,
        width: "100%",
        backgroundColor: CommonStyles.SEPARATOR_COLOR,
        marginLeft: marginLeft
    };

    return (
        <View style={separatorStyle} />
    );
}