'use strict';
import React, {Component} from 'react';

import {StyleSheet, TextInput, Animated, Easing, View, Text} from 'react-native';
import {color, hp, isWEB, normalize, wp} from '../../helper/themeHelper';

class FloatingLabel extends Component {
  constructor(props) {
    super(props);
    let dirty = this.props.value || this.props.placeholder ? 0 : 1;
    this.state = {
      text: this.props.value,
      isLabel: new Animated.Value(dirty),
      extraLabel: this.props.extraLabel,
    };
  }

  componentWillReceiveProps(props) {
    if (typeof props.value !== 'undefined' && props.value !== this.state.text) {
      this.setState({text: props.value});
      this._animate(props.value);
    }
  }

  _animate = bool => {
    var nextStyle = bool ? 0 : 1;
    Animated.timing(
      this.state.isLabel,
      {
        toValue: nextStyle,
        duration: 200,
      },
      Easing.ease
    ).start();
  };

  _onFocus = () => {
    this._animate(true);
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  };

  _onBlur = () => {
    if (!this.state.text) {
      this._animate(false);
    }

    if (this.props.onBlur) {
      this.props.onBlur();
    }
  };

  onChangeText = text => {
    this.setState({text});
    if (this.props.onChangeText) {
      this.props.onChangeText(text);
      this.setState({text: text});
    }
  };

  updateText = event => {
    var text = event.nativeEvent.text;
    this.setState({text});

    if (this.props.onEndEditing) {
      this.props.onEndEditing(event);
    }
  };

  _renderLabel = () => {
    return (
      <Animated.Text
        allowFontScaling={false}
        style={[
          styles.label,
          this.props.labelStyle,
          {
            color: this.state.isLabel.interpolate({
              inputRange: [0, 1],
              outputRange: [color.themePurple, color.darkGray],
            }),
            fontSize: this.state.isLabel.interpolate({
              inputRange: [0, 1],
              outputRange: [isWEB?normalize(8):normalize(12), isWEB?normalize(8):normalize(15)],
            }),
            marginTop: this.state.isLabel.interpolate({
              inputRange: [0, 1],
              outputRange: [hp(0.5), hp(3.5)],
            }),
            // lineHeight: normalize(20) * 1.2,
            // alignSelf: 'stretch',
          },
        ]}>
        {this.props.extraLabel !== null && this.props.extraLabel
          ? this.props.label
          : this.props.label}
        {this.props.extraLabel !== null && this.props.extraLabel && (
          <Text allowFontScaling={false} style={{color: 'red'}}>
            {'*' + ' '}
          </Text>
        )}
      </Animated.Text>
    );
  };

  render() {
    var props = {
        autoCapitalize: this.props.autoCapitalize,
        autoCorrect: this.props.autoCorrect,
        autoFocus: this.props.autoFocus,
        bufferDelay: this.props.bufferDelay,
        clearButtonMode: this.props.clearButtonMode,
        clearTextOnFocus: this.props.clearTextOnFocus,
        controlled: this.props.controlled,
        editable: this.props.editable,
        enablesReturnKeyAutomatically: this.props.enablesReturnKeyAutomatically,
        keyboardType: this.props.keyboardType,
        maxLength: this.props.maxLength,
        minLength: this.props.minLength,
        multiline: this.props.multiline,
        numberOfLines: this.props.numberOfLines,
        onBlur: this._onBlur,
        onChange: this.props.onChange,
        onChangeText: this.onChangeText,
        onEndEditing: this.updateText,
        onFocus: this._onFocus,
        onSubmitEditing: this.props.onSubmitEditing,
        password: this.props.secureTextEntry || this.props.password, // Compatibility
        placeholder: this.props.placeholder,
        secureTextEntry: this.props.secureTextEntry || this.props.password, // Compatibility
        returnKeyType: this.props.returnKeyType,
        selectTextOnFocus: this.props.selectTextOnFocus,
        selectionState: this.props.selectionState,
        style: [styles.input],
        testID: this.props.testID,
        value: this.state.text,
        underlineColorAndroid: this.props.underlineColorAndroid, // android LabelInputText will show the default bottom border
        onKeyPress: this.props.onKeyPress,
        rightIcon: this.props.rightIcon,
      },
      elementStyles = [styles.element];

    if (this.props.inputStyle) {
      props.style.push(this.props.inputStyle);
    }

    if (this.props.style) {
      elementStyles.push(this.props.style);
    }

    return (
      <View style={elementStyles}>
        {this._renderLabel()}
        <TextInput allowFontScaling={false} {...props} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  element: {
    position: 'relative',
  },
  input: {
    height: hp(10),
    borderColor: 'gray',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    borderWidth: 1,
    color: 'black',
    fontSize: 20,
    borderRadius: 4,
    paddingLeft: 10,
    marginTop: 20,
    marginLeft: 1,
  },
  label: {
    marginTop: 21,
    paddingLeft: 9,
    color: '#AAA',
      width:180,
    position: 'absolute',
    fontWeight: '500',
  },
});

export {FloatingLabel};
