import React, { Component } from 'react'
import { observable } from 'mobx'
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, Animated, Easing, UIManager, LayoutAnimation, Platform, findNodeHandle, StatusBar } from 'react-native'
import variables from '../../native-base-theme/variables/platform'
import styles from "./styles"
import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator
  } from 'react-native-indicators'

const buttonStartWidth = variables.deviceWidth - 20
const CustomLayoutSpring = {
    duration: 400,
    create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.7,
    },
    update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.7,
    },
}

var CustomLayoutLinear = {
    duration: 455,
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    }
}

class AnimatedButton extends Component {
    constructor(props) {
        super(props)
        this.animatedValue = new Animated.Value(0)
        this.state = {
            loading: false,
            visible: true,
            left: 0,
            top: 0,
            width: buttonStartWidth,
            height: 50,
            borderRadius: 7,
            opacity: 1
        }
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
        }
    }

    startAnimateButton() {
        // LayoutAnimation.spring()
        LayoutAnimation.configureNext(CustomLayoutSpring)
        this.setState({
            loading: true,
            left: (buttonStartWidth - 50) / 2,
            width: 50,
            borderRadius: 30
        })
        // await setTimeout(() => {}, 200)
        return Promise.resolve()
        // setTimeout(() => {
        //     this.setState({
        //         offsetY: this.state.clickTop - this.state.top,
        //         offsetX: this.state.clickLeft - this.state.left
        //     })
        //     console.log('this.state', this.state)
        // }, 0)
        // this.button.measure((fx, fy, width, height, px, py) => {
        //     console.log('measure', fx, fy, width, height, px, py)
        // })
        // LayoutAnimation.easeInEaseOut()
        // this.position = 'absolute'
        // this.left = -12.19
        // this.top = -225
        // this.width = variables.deviceWidth
        // setTimeout(() => {
        //     LayoutAnimation.easeInEaseOut()
        //     this.left = -10
        //     this.width = variables.deviceWidth
        // }, 280)
        
        // Animated.timing(this.animatedValue, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: false }).start()
        // Animated.parallel([
        //     Animated.timing(this.buttonWidth, { toValue: 50, duration: 10 }),
        //     Animated.timing(this.buttonLeft, { toValue: (buttonStartWidth - 50) / 2, duration: 10 })
        // ]).start()
        // Animated.timing(this.opacity, { toValue: 1, duration: 10 }).start()
        // // Animated.timing(
        // //     this.state.bounceValue,
        // //     {
        // //         toValue: 300,
        // //         duration: 455,
        // //         easing: Easing.in(Easing.quad)
        // //     }
        // // ).start()
        // setTimeout(() => Animated.timing(this.opacity, { toValue: 0 }).start(), 280)
    }

    startAnimateScreen() {
        // LayoutAnimation.linear()
        LayoutAnimation.configureNext(CustomLayoutLinear)
        this.setState({ visible: false, left: -this.px - 15, top: -this.py - 15, width: variables.deviceWidth + 30, height: variables.deviceHeight - StatusBar.currentHeight + 30 })
        // setTimeout(() =>  this.setState({ opacity: 0 }), 400)
    }

    onPress() {
        if (this.props.disabled) return
        // this.startAnimateScreen()
        // this.props.onSuccess()
        UIManager.measure(findNodeHandle(this.button), (fx, fy, width, height, px, py) => {
            console.log('measure:' + fx + ',' + fy + ',' + width + ',' + height + ',' + px + ',' + py)
            this.px = px
            this.py = py
        })
        this.startAnimateButton()
            .then(() => this.props.onPress())
            .then(() => {
                setTimeout(() => {
                    this.setState({ visible: false })
                    // this.props.onSuccess()
                    this.startAnimateScreen()
                }, 400)
            })
            .then(() => {
                setTimeout(() => {
                    this.props.onSuccess()
                    this.setState({ visible: true, left: 0, top: 0, width: buttonStartWidth, height: 50, borderRadius: 7, loading: false })
                }, 455)
            })
            .catch(error => {
                console.log('error', error)
                this.props.onError(error)
            })
            // this.props.onPress()
    }

    render() {
        // const translateX = { 
        //     transform: [
        //         {
        //             translateX: this.animatedValue.interpolate({
        //                 inputRange: [0, 1],
        //                 outputRange: [0, (buttonStartWidth - 50) / 2]
        //             })
        //         }
        //     ]
        // }
        // const scaleX = { 
        //     transform: [
        //         {
        //             scaleX: this.animatedValue.interpolate({
        //                 inputRange: [0, 1],
        //                 outputRange: [1, 50/buttonStartWidth]
        //             })
        //         }
        //     ]
        // }
        // const left = this.animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, (buttonStartWidth - 50) / 2] })
        // const width = this.animatedValue.interpolate({ inputRange: [0, 1], outputRange: [buttonStartWidth, 50] })
        // const borderRadius = this.animatedValue.interpolate({ inputRange: [0, 1], outputRange: [7, 30] })
        const { left, top, width, height, borderRadius, opacity } = this.state

        return (
            <TouchableWithoutFeedback onPress={this.onPress.bind(this)}>
                <Animated.View ref={ ref => this.button = ref } style={[
                    styles.button_container,
                    this.props.noDefaultStyles ? '' : styles.button, 
                    this.props.styles ? this.props.styles.button : '',
                    this.props.disabled ? styles.disabled : '',
                    // translateX, scaleX,
                    { left, top, width, height, borderRadius, opacity }
                    ]}>
                    { this.state.visible && (this.state.loading ? <BallIndicator size={25} /> : <Text style={this.props.styles.label}>{ this.props.label }</Text>) }
                </Animated.View>
            </TouchableWithoutFeedback>
        )
    }
}

export default AnimatedButton