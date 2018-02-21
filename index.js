'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Keyboard, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native'

import OtpInput from './OtpInput'

export default class OtpInputs extends Component {
  static propTypes = {
    containerStyles: ViewPropTypes.style,
    errorMessage: PropTypes.string,
    errorMessageContainerStyles: ViewPropTypes.style,
    errorMessageTextStyles: ViewPropTypes.style,
    focusedBorderColor: PropTypes.string,
    inputContainerStyles: ViewPropTypes.style,
    inputTextErrorColor: PropTypes.string,
    numberOfInputs: PropTypes.number,
  }

  static defaultProps = {
    focusedBorderColor: '#0000ff',
    inputTextErrorColor: '#ff0000',
    numberOfInputs: 4,
  }

  state = {
    loading: false,
    otpCode: [],
  }

  maxIndex = this.props.numberOfInputs - 1
  minIndex = 0
  inputs = []

  _updateOtpCode = (text, index) => {
    if (text) {
      const otpCode = this.state.otpCode

      otpCode[index] = text

      this.setState({ otpCode, error: null })
      if (index === this.maxIndex) {
        return Keyboard.dismiss()
      }

      if (index > this.minIndex || index < this.maxIndex) {
        this._focusNextInput(index + 1)
      }
    }
  }

  _handleBackspace = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace') {
      const otpCode = this.state.otpCode
      otpCode[index] = ''
      this.setState({ otpCode, error: null })

      if (index > this.minIndex && index <= this.maxIndex) {
        this._focusNextInput(index - 1)
      }
    }
  }

  _focusNextInput = index => {
    this.inputs[index].input.focus()
  }

  _handleSubmitError = () => {
    this.inputs.forEach(input => input && input._onFocus())
  }

  _renderInputs = () => {
    const {
      errorMessage,
      focusedBorderColor,
      numberOfInputs,
      inputContainerStyles,
      inputTextErrorColor,
    } = this.props
    const { otpCode } = this.state

    for (let index = 0; index < numberOfInputs; index++) {
      return (
        <OtpInput
          containerStyles={inputContainerStyles}
          focusedBorderColor={focusedBorderColor}
          textErrorColor={inputTextErrorColor}
          error={errorMessage}
          handleBackspace={event => this._handleBackspace(event, index)}
          ref={input => (this.inputs[index] = input)}
          updateOtpCode={text => this._updateOtpCode(text, index)}
          value={otpCode[index]}
        />
      )
    }
  }

  render() {
    const {
      containerStyles,
      errorMessage,
      errorMessageContainerStyles,
      errorMessageTextStyles,
    } = this.props

    return (
      <View style={[defaultStyles.container, containerStyles]}>
        {errorMessage && (
          <View style={[defaultStyles.errorMessageContainer, errorMessageContainerStyles]}>
            <Text style={errorMessageTextStyles}>{errorMessage}</Text>
          </View>
        )}
        <View style={defaultStyles.inputsContainer}>{this._renderInputs()}</View>
      </View>
    )
  }
}

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  indputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 25,
    marginVertical: 20,
  },
  errorMessageContainer: {
    marginHorizontal: 25,
  },
})
