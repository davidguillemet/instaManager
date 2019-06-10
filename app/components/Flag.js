import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import PropTypes from 'prop-types';
import CommonStyles from '../styles/common';


export default class Flag extends React.PureComponent {
    
    static propTypes = {
        caption: PropTypes.oneOfType([  // Flag caption
            PropTypes.string,
            PropTypes.number
          ]).isRequired,
        style: PropTypes.oneOfType([  // Flag style as simple style or array of styles
            PropTypes.object,
            PropTypes.array
          ])
   };
    
    constructor(props) {
        super(props);
    }

    render() {

        let globalStyle = this.props.style ? StyleSheet.flatten(this.props.style) : {};

        const defaultContainerStyle = {
            minWidth: 24,
            height: 24,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 4,
            backgroundColor: CommonStyles.ARCHIVE_COLOR,
            borderRadius: 12,
        };

        const defaultTextStyle = {
            fontSize: CommonStyles.SMALL_FONT_SIZE,
            fontWeight: 'normal',
            color: '#000000'
        };

        // We will replace width by minWidth...
        let { fontSize, fontWeight, width, color, ...allOtherStyles } = globalStyle;

        let containerStyle = { minWidth: width, ...defaultContainerStyle, ...allOtherStyles };

        let textStyle = {
            ...defaultTextStyle,
            fontSize: fontSize,
            fontWeight: fontWeight,
            color: color
        };
                
        return (
            <View style={containerStyle}>
                <Text style={textStyle}>{this.props.caption}</Text>
            </View>            
        );
    }
}
