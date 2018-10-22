import React from 'react';
import {
    Picker,
    StyleSheet,
    Text,
    View
} from 'react-native';

import ModalTemplate from './../../components/ModalTemplate';
import CommonStyles from './../../styles/common';

export default class PublicationFilterScreenUi extends React.PureComponent {

    constructor(props) {
        super(props);

        const initialPublicationFilter = this.props.publicationFilter;

        const maxValue = 400;

        this.state = {
            periodUnit: initialPublicationFilter.periodUnit,
            periodCount: initialPublicationFilter.periodCount,
            type: initialPublicationFilter.type,
            values: new Array(maxValue).fill(0)
        }

        this.onPeriodUnitChange = this.onPeriodUnitChange.bind(this);
        this.onPeriodCountChnage = this.onPeriodCountChnage.bind(this);
        this.onFilterTypeChange = this.onFilterTypeChange.bind(this);
        this.onValidate = this.onValidate.bind(this);
    }

    onPeriodUnitChange(itemValue, itemPosition) {
        this.setState({periodUnit: itemValue});
    }

    onPeriodCountChnage(itemValue, itemPosition) {
        this.setState({periodCount: itemValue});
    }

    onFilterTypeChange(itemValue, itemPosition) {
        this.setState({type: itemValue});
    }

    onValidate() {

        const type = this.state.type == 'all' ? 'all' : 'period';

        const periodUnit = 
            this.state.type == 'today' ? 'day' :
            this.state.type == 'week' ? 'week' :
            this.state.type == 'month' || this.state.type == 'threemonths' ? 'month' :
            this.state.periodUnit;
        
        const periodCount =
            this.state.type == 'today' ? 0 :
            this.state.type == 'week' ? 1 :
            this.state.type == 'month' ? 1 :
            this.state.type == 'threemonths' ? 3 :
            this.state.periodCount;
        
        this.props.onUpdateFilter({
            type: type,
            periodUnit: periodUnit,
            periodCount: periodCount,
            referenceDate: null // Not yet supported
        });
    }

    render() {
        return (
            <ModalTemplate title={'Display Publications from'} onValidate={this.onValidate}>
                <View style={{flexDirection: 'column', justifyContent: 'flex-start'}}>
                    <Picker selectedValue={this.state.type} itemStyle={CommonStyles.styles.mediumLabel} onValueChange={this.onFilterTypeChange} style={styles.filterBorder}>
                        <Picker.Item label={'today'} value={'today'}></Picker.Item>
                        <Picker.Item label={'last 7 days'} value={'week'}></Picker.Item>
                        <Picker.Item label={'last month'} value={'month'}></Picker.Item>
                        <Picker.Item label={'last 3 months'} value={'threemonths'}></Picker.Item>
                        <Picker.Item label={'last...'} value={'period'}></Picker.Item>
                        <Picker.Item label={'all'} value={'all'}></Picker.Item>
                    </Picker>
                    {
                        this.state.type == 'period' ?
                        <View style={[styles.filterBorder, {flexDirection: 'row', alignItems: 'center' }]}>
                            <Picker selectedValue={this.state.periodCount} itemStyle={CommonStyles.styles.mediumLabel} onValueChange={this.onPeriodCountChnage} style={styles.filterPicker}>
                                {
                                    this.state.values.map((_, index) => {
                                        return (<Picker.Item label={index.toString()} value={index} key={index}></Picker.Item>);
                                    })
                                }
                            </Picker>
                            <Picker selectedValue={this.state.periodUnit} itemStyle={CommonStyles.styles.mediumLabel} onValueChange={this.onPeriodUnitChange} style={styles.filterPicker}>
                                <Picker.Item label={'years'} value={'year'}></Picker.Item>
                                <Picker.Item label={'months'} value={'month'}></Picker.Item>
                                <Picker.Item label={'weeks'} value={'week'}></Picker.Item>
                                <Picker.Item label={'days'} value={'day'}></Picker.Item>
                            </Picker>
                        </View>
                        :
                        null
                    }
                </View>
            </ModalTemplate>
        );
    }
}

const styles = StyleSheet.create(
{
    filterPicker: {
        flex: 1
    },
    filterBorder: {
        marginBottom: CommonStyles.GLOBAL_PADDING,
        borderWidth: 1,
        borderColor: CommonStyles.SEPARATOR_COLOR,
        borderRadius: CommonStyles.BORDER_RADIUS
    }
});
    