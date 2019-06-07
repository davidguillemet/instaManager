import React from 'react';
import PropTypes from 'prop-types';
import {
    Alert,
    Animated,
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

        this.state = {
            fromStep: null,
            toStep: this.props.activeStep,
            activeStepWidth: new Animated.Value(0)
        }

        this.animationDuration = 400;
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
    
    componentWillReceiveProps(nextProps) {
           
        this.state.fromStep = this.state.toStep;
        this.state.toStep = nextProps.activeStep;
        this.state.displayActiveStep = false;
    }

    getWizardLayoutInformation() {
        const {width} = Dimensions.get('window');
        const stepSpotWidth = 30;
        const availableWidth = width - CommonStyles.GLOBAL_PADDING * 2 - stepSpotWidth * 2
        return {
            availableWidth: availableWidth,
            stepSegmentWidth:  availableWidth / (this.props.steps.length - 1),
            stepSpotWidth: stepSpotWidth,
            stepLineHeight: 2
        };
    }

    componentDidUpdate() {

        if (this.state.toStep == 0 && this.state.fromStep == null) {
            // No animation if we display the first 
            return;
        }

        const { stepSpotWidth, stepSegmentWidth } = this.getWizardLayoutInformation();
        
        // Stop current line just before the active step spot
        let currentStepLineWidth = stepSegmentWidth * this.state.toStep;
        if (this.state.toStep < this.props.steps.length - 1) {
            currentStepLineWidth -= stepSpotWidth / 2;
        }

        const that = this;

        Animated.timing(
            this.state.activeStepWidth,
            {
                toValue: currentStepLineWidth,
                duration: this.animationDuration
            }
        ).start(() => {
            that.setState({displayActiveStep: true});
            if (this.state.fromStep < this.state.toStep && this.state.toStep < this.props.steps.length - 1)
            {
                Animated.timing(
                    this.state.activeStepWidth,
                    {
                        // Once the Spot id displayed green just set the line width at the end of the spot
                        toValue: currentStepLineWidth + stepSpotWidth,
                        duration: 0
                    }
                ).start();
            }
        });
    }

    render() {

        const { availableWidth, stepSpotWidth, stepLineHeight, stepSegmentWidth } = this.getWizardLayoutInformation();
        const currentStep = this.props.steps[this.props.activeStep];

        return (
            <View>
                <View style={{
                        alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={this.showActiveStepDescription}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: CommonStyles.GLOBAL_PADDING,
                            paddingHorizontal: CommonStyles.GLOBAL_PADDING * 2,
                            backgroundColor: CommonStyles.BUTTON_COLOR,
                            margin: CommonStyles.GLOBAL_PADDING,
                            marginBottom: 0,
                            borderRadius: CommonStyles.BORDER_RADIUS
                        }}>
                            <Text style={CommonStyles.styles.smallLabel}>
                                {`Step ${this.props.activeStep+1}: ${currentStep.caption}`}
                            </Text>
                            <Ionicons style={{color: CommonStyles.TEXT_COLOR, marginLeft: CommonStyles.GLOBAL_PADDING}} name={'ios-information-circle-outline'} size={20}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{height: stepSpotWidth + CommonStyles.GLOBAL_PADDING*2, justifyContent: 'center'}}>
                    <View style={{
                            height: stepLineHeight,
                            width: availableWidth,
                            backgroundColor: CommonStyles.SEPARATOR_COLOR,
                            position: 'absolute',
                            left: CommonStyles.GLOBAL_PADDING + stepSpotWidth
                        }}
                    />
                    <Animated.View style={{
                            position: 'absolute',
                            left: CommonStyles.GLOBAL_PADDING + stepSpotWidth,
                            height: stepLineHeight,
                            width: this.state.activeStepWidth,
                            backgroundColor: CommonStyles.LIGHT_GREEN
                        }}
                    />
                    {
                        this.props.steps.map((_, index) => {
                            
                            const stepSpotColor =
                                index < this.props.activeStep || (index == this.props.activeStep && this.state.fromStep > this.state.toStep) ? CommonStyles.LIGHT_GREEN :
                                index == this.props.activeStep && (this.state.displayActiveStep || this.props.activeStep == 0) ? CommonStyles.LIGHT_GREEN :
                                CommonStyles.SEPARATOR_COLOR;
                            
                            let spotLeft = index * stepSegmentWidth;
                            if (index > 0) {
                                spotLeft += stepSpotWidth;
                                if (index < this.props.steps.length - 1) {
                                    // intermediate spot
                                    spotLeft -= stepSpotWidth / 2;
                                }
                            }
                            
                            return ( 
                                <View key={index} style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    width: stepSpotWidth,
                                    height: stepSpotWidth,
                                    borderRadius: stepSpotWidth / 2,
                                    borderWidth: 2,
                                    borderColor: stepSpotColor,
                                    position: 'absolute',
                                    backgroundColor: index < this.state.toStep ? stepSpotColor : CommonStyles.GLOBAL_BACKGROUND,
                                    left: CommonStyles.GLOBAL_PADDING + spotLeft
                                }}>
                                {
                                    index < this.state.toStep ?
                                    <Ionicons style={{color: CommonStyles.DARK_GREEN, marginTop: -4}} name={'ios-checkmark'} size={34}/> :
                                    <Text style={[CommonStyles.styles.smallLabel,
                                        {
                                            color: stepSpotColor
                                        }]}>{index+1}</Text>
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