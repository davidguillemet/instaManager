import React from 'react';

import { connect } from 'react-redux';
import {
    createOpenEditorAction,
    createCloseEditorAction
} from './../actions';

import hoistNonReactStatics from 'hoist-non-react-statics';

import {
  Alert,
  Animated,
  Keyboard,
  TouchableOpacity,
  View
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import CommonStyles from './../styles/common';
import CustomButton from './../components/CustomButton';

function BackButton(props) {

  return (
      <View style={{ flexDirection: 'row'}}>
          <TouchableOpacity onPress={props.onCancel}><Ionicons name={'ios-arrow-back'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
      </View>
  );
} 

/**
 * @summary This High Oder Function allows to add the dynamic Save feature to a given component class.
 * @description The specified component class must implement ther following functions:
 *   - setSaveComponent: set the reference to the "Save" container component  
 *   - getItemId: returns the identifier of the item which is being edited
 *   - getHeaderTitle: returns the title to display in the navigation bar
 *   - canSaveItem: returns true if the item can be saved (validation from the underlying editor)
 *   - onSaveItem: the method to save the item being edited
 * @param {class} WrappedComponent The component class for which to add the dynamic Save feature.
 * 
 */
export default function withSaveButton(WrappedComponent) {

  class componentWithSaveButtonUI extends React.Component {

    static navigationOptions = ({ navigation }) => {
      const params = navigation.state.params || {};
      return {
          headerLeft: <BackButton onCancel={params.onCancel} />,
          headerTitle: params.headerTitle
      }   
    };

    constructor(props) {
      super(props);
      this.saveContainerAnimatedHeight = new Animated.Value(0);
      this.saveContainerVisible = false;

      this.onCancel = this.onCancel.bind(this);
      this.onSaveItem = this.onSaveItem.bind(this);
      this.connectWrappedComponent = this.connectWrappedComponent.bind(this);

      this.saveSubscriber = [];

      this.state = {
        dirty: false
      }
    }

    componentDidMount() {

      this.props.onOpen(this.wrappedComponent.getItemId());

      this.props.navigation.setParams({ 
          onCancel: this.onCancel,
          headerTitle: this.wrappedComponent.getHeaderTitle()
      });
    }

    onQuit() {
      Keyboard.dismiss();
      this.props.onClose(this.wrappedComponent.getItemId());
      this.props.navigation.goBack(null);
    }

    onCancel() {

      if (this.state.dirty == true) {
          Alert.alert('', `Are you sure you want to quit and lose your changes?`,
          [
              { 
                  text: 'Ooops, no don\'t quit...',
                  style: 'cancel'
              },
              {
                  text: 'Yes, quit and discard changes',
                  onPress: () => {
                      this.onQuit();
                  }
              }
          ]);
      } else {
          this.onQuit();
      }
    }

    onSaveItem() {
      
      if (this.wrappedComponent.canSaveItem() == false) {
          this.saveSubscriber.forEach(listener => listener.setActionCompleted());
          return;
      }

      this.wrappedComponent.onSaveItem();
      this.onQuit();
    }

    connectWrappedComponent(wrappedComponent) {
      this.wrappedComponent = wrappedComponent;
      if (wrappedComponent != null) {
        this.wrappedComponent.setSaveComponent(this);
      }
    }

    render() {

      if (this.state.dirty && this.saveContainerVisible == false) {
        this.saveContainerVisible = true;
        Animated.timing(
          this.saveContainerAnimatedHeight,
          {
            toValue: 60,
            duration: 200
          }
        ).start();
      } else if (this.state.dirty == false && this.saveContainerVisible == true) {
        this.saveContainerVisible = false;
        Animated.timing(
          this.saveContainerAnimatedHeight,
          {
            toValue: 0,
            duration: 200
          }
        ).start();
      }

      return (
        <View style={{ flex: 1 }}>
          <WrappedComponent ref={this.connectWrappedComponent} {...this.props} />
          <Animated.View style={{
            backgroundColor: CommonStyles.SEPARATOR_COLOR,
            borderTopColor: CommonStyles.GLOBAL_BACKGROUND,
            borderTopWidth: 1,
            height: this.saveContainerAnimatedHeight,
          }}>
            <CustomButton
              title={'Save'}
              onPress={this.onSaveItem}
              showActivityIndicator={true}
              style={[CommonStyles.styles.standardButton, { margin: CommonStyles.GLOBAL_PADDING }]}
              deactivated={this.state.dirty == false}
              register={this.saveSubscriber}
            />
          </Animated.View>
        </View>
      );
    }
  };

  hoistNonReactStatics(componentWithSaveButtonUI, WrappedComponent);
  
  const mapDispatchToProps = dispatch => {
    return {
        onOpen: (itemId) => {
            dispatch(createOpenEditorAction(itemId));
        },
        onClose: (itemId) => {
            dispatch(createCloseEditorAction(itemId));
        }
    }
  }

  return connect(null, mapDispatchToProps)(componentWithSaveButtonUI);
}
