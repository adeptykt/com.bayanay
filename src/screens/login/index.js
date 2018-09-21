import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Linking, StatusBar, View, TextInput, Keyboard } from 'react-native'
import { Toast, Container, Header, Title, Content, Button, Icon, Text, Left, Right, Body } from 'native-base'
import variables from '../../theme/variables/platform'
// import AnimatedButton from '../../components/animatedButton'

import styles from './styles'

@inject("store") @observer
class Login extends Component {
  constructor(props) {
    super(props)
    this.store = this.props.store
    this.state = {
      phonenumber: '+7 ',
      nextDisabled: true,
      leftPhone: 0,
      showProgress: false,
    }
  }

  onChangePhone(phonenumber) {
    number = phonenumber.replace(/\D/g, "")
    phonenumber = number.replace(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/, (str, n0, n1, n2, n3, n4) => {
      return '+7 ' + ((n1) ? '(' + n1 : '') + ((n2) ? ') ' + n2 : '') + ((n3) ? '-' + n3 : '') + ((n4) ? '-' + n4 : '')
    })
    if (phonenumber == "") phonenumber = '+7 '
    this.setState({ phonenumber, nextDisabled: phonenumber.length < 18 })
    this.props.store.phone = number.substring(1)
  }

  onSuccess() {
    this.props.navigation.navigate("AcceptCode")
  }

  onError(error) {
    Keyboard.dismiss()
    this.setState({ showProgress: false })
    Toast.show({ text: error.message, position: 'bottom', duration: 3000 })
  }

  onNext() {
    this.store.getCode()
      .then(() => this.props.navigation.navigate("AcceptCode"))
      .catch((error) => {
        Keyboard.dismiss()
        this.setState({ showProgress: false })
        Toast.show({ text: error.message, position: 'bottom', duration: 3000 })
      })
  }

  render() {
    return (
      <Container style={styles.container}>
        <StatusBar barStyle='light-content' hidden={false} />
        <Header>
          <Left />
          <Body style={{flex: 4}}>
            <Title>Авторизация</Title>
          </Body>
          <Right />
        </Header>

        <View style={styles.main}>
          <Text style={styles.title}>Введите свой номер телефона</Text>
          <View 
            style={{
              borderBottomWidth: 2,
              borderColor: variables.toolbarDefaultBg,
              alignSelf: 'stretch',
            }} >
            <TextInput
              autoFocus={true}
              textAlign='left'
              returnKeyType='next'
              autoCorrect={false}
              keyboardType='numeric'
              onChangeText={this.onChangePhone.bind(this)}
              value={this.state.phonenumber}
              maxLength={18}
              style={styles.textInput}
              underlineColorAndroid='transparent'
            />
          </View>
          <Button block ref={e => (this.button = e)} disabled={this.state.nextDisabled} style={styles.button} onPress={() => this.onNext()}><Text style={{ fontWeight: 'bold' }}>Далее</Text></Button>
          {/* <AnimatedButton label='Далее' disabled={this.state.nextDisabled} onPress={() => this.store.getCode()} onSuccess={() => this.onSuccess()} onError={() => this.onError()} styles={{button: styles.stateful_button, label: styles.button_label}} /> */}
        </View>
        <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
          <Text style={styles.text}>Авторизовавшись, вы принимаете</Text>
          <Text style={styles.textLink} onPress={() => Linking.openURL('http://admin.bayanay.center/MobileAgreement.html')}>Ограничение ответственности и условия предоставления услуг</Text>
        </View >
      </Container>
    )
  }
}

export default Login