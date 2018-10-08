import React from 'react';
import PropTypes from 'prop-types';
import {
    FlatList,
    StyleSheet,
    Text,
    View
} from 'react-native';
import ListItemSeparator from './ListItemSeparator';
import CommonStyles from '../styles/common';

    
class WizardStep extends React.PureComponent {

    static propTypes = {
        step: PropTypes.object.isRequired,      // An object containing the wizard step { caption, key }
        active: PropTypes.bool.isRequired,      // true if the step is active
    };

    constructor(props) {
        super(props);
    }

    render() {

        let itemStyle = StyleSheet.flatten(this.props.active ? CommonStyles.styles.singleSelectedListItem : CommonStyles.styles.deacivatedSingleListItem);
        if (this.props.active == false) {
            itemStyle = {...itemStyle, fontSize: CommonStyles.SMALL_FONT_SIZE};
        }
        const itemBorder = {
            borderLeftWidth: this.props.active ? 6 : 4,
            borderColor: this.props.active ? CommonStyles.SELECTED_TEXT_COLOR : CommonStyles.DEACTIVATED_TEXT_COLOR
        };

        return (
            <View style={[
                    itemBorder,
                    { 
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        paddingVertical: CommonStyles.GLOBAL_PADDING,
                        backgroundColor: CommonStyles.BUTTON_COLOR
                    }]}>
                <Text style={itemStyle}>{this.props.step.caption}</Text>
                {
                    this.props.active && this.props.step.description ?
                    <Text style={[itemStyle, CommonStyles.styles.smallLabel, {fontStyle: 'italic'}]}>{this.props.step.description}</Text> :
                    null
                }
            </View>
        );
    }
}

export default class Wizard extends React.PureComponent {

    static propTypes = {
        steps: PropTypes.array.isRequired,      // An array containing the wizard steps { caption, key }
        activeStep: PropTypes.number.isRequired
    };

    static defaultProps = {
    };

    constructor(props) {
        super(props);

        this.renderStepItem = this.renderStepItem.bind(this);
    }

    renderStepItem({item, index}) {

        return <WizardStep step={item} active={index == this.props.activeStep} />;
    }

    render() {
        return (
            <FlatList
                scrollEnabled={false}
                data={this.props.steps}
                extraData={this.props.activeStep}
                renderItem={this.renderStepItem}
                ItemSeparatorComponent={ListItemSeparator} />
        );
    }

}