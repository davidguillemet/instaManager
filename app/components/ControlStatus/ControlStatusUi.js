import React from 'react';

import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import ControlDetails from './../../components/ControlDetails';

export default class ControlStatusUi extends React.PureComponent {

    constructor(props){
        super(props);

        this.state = {
            modalVisible: false
        }

        this.openControlDetails = this.openControlDetails.bind(this);
        this.closeControlDetails = this.closeControlDetails.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
    }

    openControlDetails() {

        this.setState({ modalVisible: true });
    }

    closeControlDetails() {

        this.setState({ modalVisible: false });
    }

    onNavigate(screen, params) {

        this.closeControlDetails();
        this.props.navigation.navigate(screen, params);
    }

    render() {

        if (this.props.running === true) {
            return (
                <View style={styles.statusContainer}>
                    <ActivityIndicator />
                </View>
            );
        }
        else {

            const hasErrors = this.props.errors && (this.props.errors.duplicates.length > 0 || this.props.errors.overflow.length > 0);
            const color = hasErrors ? CommonStyles.LIGHT_RED : CommonStyles.LIGHT_GREEN;
            const iconName = hasErrors ? 'ios-alert' : 'ios-checkmark-circle';

            if (hasErrors == false) {
                return null;
            }

            return (
                <View style={styles.statusContainer}>
                    <Modal
                        animationType={'slide'}
                        transparent={false}
                        visible={this.state.modalVisible}
                        presentationStyle={'pageSheet'}
                    >
                        <View style={[CommonStyles.styles.standardPage, { paddingTop: 30}]}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 10}}>
                                <TouchableOpacity onPress={this.closeControlDetails}>
                                    <Ionicons style={{color: CommonStyles.GLOBAL_FOREGROUND}} name={'ios-close'} size={50}/>
                                </TouchableOpacity>
                            </View>
                            <ControlDetails onNavigate={this.onNavigate}/>
                        </View>
                    </Modal>
                    <TouchableOpacity onPress={this.openControlDetails}>
                        <Ionicons style={{color: color}} name={iconName} size={40} />
                    </TouchableOpacity>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create(
{
    statusContainer: {
        position: 'absolute',
        bottom: 0,
        right: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: CommonStyles.COLOR_TRANSPARENT
    }
});