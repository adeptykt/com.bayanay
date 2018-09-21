import React, { Component } from 'react'
import { observer, inject } from 'mobx-react/native'
import { StatusBar, View } from 'react-native'
import { Container, Header, Title, Content, Button, Icon, Text, Left, Body, Right } from 'native-base'
import variables from '../../theme/variables/platform'

import styles from './styles'
import Barcode from 'react-native-barcode-builder'

@inject("store") @observer
class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '000000'
    }
  }

  componentDidMount() {
    this.props.store.getToken().then(response => this.setState({ code: response.code }))
  }

  getTextCode(code) {
    const nbsp = String.fromCharCode(160) + String.fromCharCode(160)
    // let result = code.replace(/(\d)(?=(\d{1})+(\D|$))/g, '$1' + nbsp)
    return code.split('').reduce((res, c, i) => { return res + c + (i == code.length - 1 ? '' : (i == 2 ? nbsp : '') + nbsp) }, '')
  }

  render() {
    return (
      <Container style={ styles.container }>
        <StatusBar barStyle='light-content' hidden={false} />
        <Header style={{ elevation: 2, shadowOffset: { height: 5, width: 0 }, shadowOpacity: 0.9, shadowRadius: 2.2 }}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate("DrawerOpen")}>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body style={{ flex: 2 }}>
            <Title>Байанай клуб</Title>
          </Body>
          <Right>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5 }}>
              <View>
                <Title>{ this.props.store.scores }&nbsp;</Title>
              </View>
              <View>
                <Icon name="star" style={{ color: 'gold' }} />
              </View>
            </View>
          </Right>
        </Header>
        <Content>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 17, padding: 10 }}>Покажите штрих-код продавцу</Text>
            <Text style={{ fontSize: 25 }}>{this.getTextCode(this.state.code)}</Text>
            <Barcode value={ '5' + this.state.code } format="EAN8" width={3.5} height={70} />
          </View>
        </Content>
      </Container>
    )
  }
}

export default Main