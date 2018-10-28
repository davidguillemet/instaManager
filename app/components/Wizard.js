import React from 'react';
import PropTypes from 'prop-types';
import {
    Alert,
    Dimensions,
    TouchableOpacity,
    Text,
    View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommonStyles from '../styles/common';


export default class Wizard extends React.PureComponent {

    static propTypes = {
        steps: PropTypes.array.isRequired,      // An array containing the wizard steps { caption, key }
        activeStep: PropTypes.number.isRequired
    };

    static defaultProps = {
    };

    constructor(props) {
        super(props);

        this.showActiveStepDescription = this.showActiveStepDescription.bind(this);
    }

    showActiveStepDescription() {
        Alert.alert(`Step ${this.props.activeStep+1}`, this.props.steps[this.props.activeStep].description,
        [
            { 
                text: 'OK',
                style: 'cancel'
            }
        ]);
    }

    render() {
        const {height, width} = Dimensions.get('window');
        const stepLineHeight = 4;
        const stepDotDiameter = 20;
        
        const availableWidth = width - stepDotDiameter;
        const stepWidth = (availableWidth - CommonStyles.GLOBAL_PADDING * 2) / (this.props.steps.length - 1);
        const stepLines = new Array(this.props.steps.length - 1).fill(0);

        const currentStep = this.props.steps[this.props.activeStep];

        return (
            <View style={{marginBottom: CommonStyles.GLOBAL_PADDING}}>
                <View style={{
                        alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={this.showActiveStepDescription}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: CommonStyles.GLOBAL_PADDING,
                            paddingHorizontal: CommonStyles.GLOBAL_PADDING * 2,
                            backgroundColor: CommonStyles.GLOBAL_FOREGROUND,
                            margin: CommonStyles.GLOBAL_PADDING,
                            borderRadius: CommonStyles.BORDER_RADIUS
                        }}>
                            <Text style={CommonStyles.styles.smallLabel}>
                                {`Step ${this.props.activeStep+1}: ${currentStep.caption}`}
                            </Text>
                            <Ionicons style={{color: CommonStyles.TEXT_COLOR, marginLeft: CommonStyles.GLOBAL_PADDING}} name={'ios-information-circle-outline'} size={20}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{height: stepLineHeight + CommonStyles.GLOBAL_PADDING*2}}>
                    {
                        stepLines.map((_, index) => {

                            const stepSegmentColor =
                                index < this.props.activeStep ? CommonStyles.LIGHT_GREEN :
                                CommonStyles.SEPARATOR_COLOR;
                            
                                return <View key={index} style={{
                                height: stepLineHeight,
                                width: stepWidth,
                                backgroundColor: stepSegmentColor,
                                position: 'absolute',
                                left: CommonStyles.GLOBAL_PADDING + stepDotDiameter/2 + index * stepWidth,
                                top: CommonStyles.GLOBAL_PADDING
                            }} />
                        })
                    }
                    {
                        this.props.steps.map((_, index) => {
                            
                            const stepSpotColor =
                                index <= this.props.activeStep ? CommonStyles.LIGHT_GREEN :
                                CommonStyles.SEPARATOR_COLOR;
                            
                            return ( 
                                <View key={index} style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    width: stepDotDiameter,
                                    height: stepDotDiameter,
                                    borderRadius: stepDotDiameter / 2,
                                    position: 'absolute',
                                    backgroundColor: stepSpotColor,
                                    top: CommonStyles.GLOBAL_PADDING + stepLineHeight/2 - stepDotDiameter/2,
                                    left: CommonStyles.GLOBAL_PADDING + index*stepWidth
                                }}>
                                {
                                    index < this.props.activeStep ?
                                    <Ionicons style={{color: CommonStyles.DARK_GREEN, marginTop: 2}} name={'ios-checkmark'} size={28}/> :
                                    null
                                }
                                </View>
                            );
                        })
                    }
                </View>
            </View>
        );
    }

}