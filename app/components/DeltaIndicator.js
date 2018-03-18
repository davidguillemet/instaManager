import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CommonStyles from '../styles/common';

export default class DeltaIndicator extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {

        const iconName = this.props.delta > 0 ? 'md-arrow-up' : 'md-arrow-down';
        const deltaStyle = this.props.delta > 0 ? styles.PositiveDelta : styles.NegativeDelta;
        const valueSize = this.props.size ? this.props.size : 10;
        const deltaSize = valueSize / 2;

        return (
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[styles.ValueStyle, { fontSize: valueSize }]}>{this.props.value}</Text>
                    {
                        this.props.delta == 0 ?
                        null :
                        <View style={[styles.DeltaContainer, { borderRadius: deltaSize / 2 }]}>
                            <Ionicons style={deltaStyle} name={iconName} size={deltaSize} />
                            <Text style={[deltaStyle, { fontSize: deltaSize}]}>{Math.abs(this.props.delta)}</Text>
                        </View>
                    }
                </View>
                { this.props.label ? <Text style={styles.LabelStyle}>{this.props.label}</Text> : null }
            </View>
        );
    }
}

const styles = StyleSheet.create(
{
    ValueStyle: {
        color: CommonStyles.KPI_COLOR,
        paddingRight: 5,
        fontWeight: 'bold'
    },
    LabelStyle: {
        color: CommonStyles.TEXT_COLOR,
        fontSize: CommonStyles.SMALL_FONT_SIZE
    },
    DeltaContainer: {
        flexDirection: 'row',
        backgroundColor: CommonStyles.KPI_COLOR,
        alignItems: 'center',
        padding: 3
    },
    NegativeDelta: {
        color: CommonStyles.NEGATIVE_DELTA_COLOR
    },
    PositiveDelta: {
        color: CommonStyles.POSITIVE_DELTA_COLOR
    }
});