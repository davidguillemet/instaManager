import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';

import CommonStyles from '../styles/common';
import Ionicons from 'react-native-vector-icons/Ionicons';

class ModalTemplate extends React.PureComponent {

    static propTypes = {
        title: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.onClose = this.onClose.bind(this);
        this.onValidate = this.onValidate.bind(this);
    }

    onClose() {
        this.props.navigation.goBack(null);
    }

    onValidate() {
        this.props.onValidate();
        this.onClose();
    }

    render () {
        return (
            <View style={CommonStyles.styles.standardPage}>
                <View style={styles.headerStyle}>
                    <TouchableOpacity onPress={this.onClose} style={styles.closeModal}>
                        <Ionicons style={{color: CommonStyles.GLOBAL_FOREGROUND}} name={'ios-close'} size={50}/>
                    </TouchableOpacity>
                    {
                        this.props.title ?
                        <Text style={[CommonStyles.styles.mediumLabel, styles.modalTitle]}>{this.props.title}</Text> :
                        null
                    } 
                    {
                        this.props.onValidate ?
                        <TouchableOpacity onPress={this.onValidate} style={styles.validateModal}>
                            <Ionicons style={{color: CommonStyles.GLOBAL_FOREGROUND}} name={'md-checkmark'} size={40}/>
                        </TouchableOpacity>
                        :
                        null
                    }
                </View>
                { this.props.children }
            </View>
        );
    }
}

const topMargin = 10;
const horizontalButtonMArgin = 0;
const headerHeight = 60;
const headerMarginBottom = 20;

const styles = StyleSheet.create({
    headerStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: headerHeight,
        marginBottom: headerMarginBottom
    },
    modalTitle: {
        paddingVertical: CommonStyles.GLOBAL_PADDING,
        marginTop: topMargin
    },
    closeModal: {
        position: 'absolute',
        left: horizontalButtonMArgin,
        top: topMargin
    },
    validateModal: {
        position: 'absolute',
        right: horizontalButtonMArgin,
        top: topMargin
    }
});
    


export default withNavigation(ModalTemplate);