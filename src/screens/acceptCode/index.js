import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { View, Keyboard } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { Toast, Container, Header, Title, Button, Icon, Text, Left, Right, Body } from 'native-base'
import CodePin from '../../components/pin-code'
import CountdownTimer from '../../components/countdownTimer'
// var Spinner = require('react-native-spinkit')

import styles from './styles'

@inject("store") @observer
class AcceptCode extends Component {
  constructor(props) {
    super(props)
    this.store = this.props.store
    this.state = {
      code: '',
      showCountdown: true,
      showProgress: false,
      error: ''
    }
  }

  navigateTo(routeName) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName })
      ]
    })
    this.props.navigation.dispatch(resetAction)
  }

  onSuccess(code) {
    this.setState({ showProgress: true })
    return this.store.mobile(code)
      .then(res => { 
        Keyboard.dismiss()
        this.navigateTo("AppNavigator")
      })
      .catch(error => { 
        this.setState({ showProgress: false, error: error.message }) 
        throw error.message
      })
  }

  onPressSendSMS() {
    this.setState({ showProgress: true, showCountdown: true, error: '', code: '' })
    this.store.getCode()
      .then(() => {
        this.setState({ showProgress: false })
      })
      .catch(error => {
        Keyboard.dismiss()
        this.setState({ showProgress: false })
        Toast.show({ text: error.message, position: 'bottom', duration: 3000 })
      })
  }

  onCountdownEnd() {
    this.setState({ showCountdown: false })
  }

  render() {
    const buttonText = this.state.showCountdown ? 
      <CountdownTimer secondsRemaining='60' onCountdownEnd={this.onCountdownEnd.bind(this)} style={{color: 'white'}} />
      : <Text>Отправить СМС снова</Text>

    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 4 }}>
            <Title>Авторизация</Title>
          </Body>
          <Right />
        </Header>

        <View style={{ flex: 1, padding: 12, justifyContent: 'flex-start', alignItems: 'center' }}>
          <View style={{ alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center' }} >
              <CodePin 
                code={this.state.code}
                number={4}
                success={this.onSuccess.bind(this)}
                containerStyle={styles.containerCodePin}
                containerPinStyle={{ height: 60, width: 160 }}
                pinStyle={styles.pinStyle}
                textStyle={{ fontSize: 14 }}
                text={'Введите код из SMS сообщения'}
                errorStyle={{ fontSize: 10 }}
                error={this.state.error}
                underlineColorAndroid='transparent'
                placeholder='&#8226;'
              />
          </View>
          <Button disabled={this.state.showCountdown} style={styles.button} onPress={this.onPressSendSMS.bind(this)}>
            {buttonText}
          </Button>
          {/* <Spinner style={styles.spinner} isVisible={this.state.showProgress} size={100} type='ThreeBounce' color='#000000'/> */}
        </View>
      </Container>
    )
  }
}

export default AcceptCode