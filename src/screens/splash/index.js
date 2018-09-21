import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { BackHandler, ImageBackground, View, StatusBar } from 'react-native'
import { Container, H3 } from 'native-base'
import { NavigationActions } from 'react-navigation'

import styles from './styles'

const launchscreenBg = require('../../../img/background.png')
const launchscreenLogo = require('../../../img/logo.png')

@inject("store") @observer
class Splash extends Component {
  constructor(props) {
    super(props)
    this.store = this.props.store
    this.timer = setTimeout(() => this.checkConnecting(4), 500)
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

  checkConnecting(count) {
    console.log('checkConnecting: ' + count)
    if (this.store.isConnecting && this.store.isAuthenticated) {
      this.navigateTo("AppNavigator")
    }
    else if (count <= 0) {
      if (!this.store.isConnecting) {
        alert('Не удалось соединиться с сервером. Проверьте связь и повторите попытку входа.')
        BackHandler.exitApp()
      } else this.navigateTo("Login")
    }
    // else if (this.store.isConnecting) {
    //   if (count > 1) count = 1
    //   this.timer = setTimeout(() => this.checkConnecting(count - 1), 500)
    // }
    else {
      this.timer = setTimeout(() => this.checkConnecting(count - 1), 500)
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer)
  }

  render() {
    return (
      <Container>
        <StatusBar barStyle='light-content' hidden={true} />
        <ImageBackground source={launchscreenBg} style={styles.imageContainer}>
          <View style={styles.logoContainer}>
            <ImageBackground source={launchscreenLogo} style={styles.logo} />
          </View>
          <View style={{ alignItems: 'center', marginBottom: 50, backgroundColor: 'transparent' }}>
            <H3/>
            <H3 style={styles.text}>Добро пожаловать</H3>
            <View style={{ marginTop: 8 }} />
            <H3 style={styles.text}>В байанай клуб</H3>
          </View>
        </ImageBackground>
      </Container>
    )
  }
}

export default Splash
