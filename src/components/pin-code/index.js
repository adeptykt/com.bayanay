import React, { Component } from 'react';
import { TextInput, View, Text } from 'react-native'

import { codePinStyles } from './pin-code-style'

class CodePin extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: '',
      code: '',
    }
    this.onPressPin = this.onPressPin.bind(this)
  }

  focus = () => {
    this.textInput.focus()
  }

  onChangeText(value) {
    this.setState({
      error: '',
      code: value,
    })
    if (value.length == this.props.number) {
      this.props.success(value).catch((error) => {
        this.setState({error: error})
        this.textInput.focus()
      })
    }
  }

  onBlur() {
    if (this.state.code.length < this.props.number) this.textInput.focus()
  }

  onPressPin() {
    this.textInput.focus()
  }

  render() {
    const {
      text,
      number,
      success,
      error,
      pinStyle,
      textStyle,
      errorStyle,
      containerStyle,
      containerPinStyle,
      placeholder,
      ...props
    } = this.props
    const { code } = this.state

    pins = []

    for (let i = 0; i < number; i++) {
      pins.push(<Text key={i} onPress={this.onPressPin} style={[codePinStyles.pin, pinStyle]} {...props}>{code[i] ? code[i].toString() : placeholder}</Text>)
    }

    return (
      <View style={[codePinStyles.container, containerStyle]}>
        <Text style={[codePinStyles.text, textStyle]}>{text}</Text>
        {error ? (<Text style={[codePinStyles.error, errorStyle]}>{error}</Text>) : null}
        <TextInput
          autoFocus={true}
          ref={e => (this.textInput = e)}
          returnKeyType={'none'}
          autoCapitalize={'sentences'}
          autoCorrect={false}
          onChangeText={(c) => this.onChangeText(c)}
          maxLength={number}
          keyboardType="numeric"
          blurOnSubmit={true}
          onBlur={() => this.onBlur()}
          style={{height: 0, width: 0, padding: 0}} />
        <View style={[codePinStyles.containerPin, containerPinStyle]}>{pins}</View>
      </View>
    )
  }
}

CodePin.defaultProps = {
  number: 4,
  text: 'Pin code',
  error: 'Bad pin code.',
  pinStyle: {},
  containerPinStyle: {},
  containerStyle: {},
  textStyle: {},
  errorStyle: {}
}

export default CodePin;
