import React, { Component } from "react"
import { observer, inject } from 'mobx-react'
import { Alert, Image, ImageBackground, BackHandler } from "react-native"
import { NavigationActions } from 'react-navigation'
import { Content, Text, List, ListItem, Icon, Container, Left, Right, Badge } from "native-base"
import styles from "./style"

const drawerCover = require('../../../img/background.png')
const drawerImage = require('../../../img/logo.png')

const datas = [
  {
    name: 'Главная',
    route: 'Main',
    icon: 'home',
    bg: '#C5F442',
  },
  {
    name: 'История',
    route: 'History',
    icon: 'calendar',
    bg: '#C5F442',
  },
  {
    name: 'Профиль',
    route: 'Profile',
    icon: 'contact',
    bg: '#C5F442',
  },
  {
    name: 'О нас',
    route: 'About',
    icon: 'information-circle',
    bg: '#C5F442',
  },
  {
    name: 'Выйти',
    route: 'Login',
    icon: 'power',
    bg: '#C5F442',
  },
  // {
  //   name: 'Icon',
  //   route: 'Icon',
  //   icon: 'information-circle',
  //   bg: '#EF6092',
  // }
  // {
  //   name: 'Поделитья с друзьями',
  //   route: 'anatomy',
  //   icon: 'share',
  //   bg: '#C5F442',
  // },
  // {
  //   name: 'Настройки',
  //   route: 'anatomy',
  //   icon: 'settings',
  //   bg: '#C5F442',
  // },
]

@inject("store") @observer
class SideBar extends Component {
  constructor(props) {
    super(props)
  }

  navigateTo(routeName) {
    const resetAction = NavigationActions.reset({ index: 0, actions: [ NavigationActions.navigate({ routeName }) ] })
    this.props.navigation.dispatch(resetAction)
  }

  promptForLogout() {
    Alert.alert('Выход', 'Вы уверены что хотите выйти?',
      [
        { text: 'Да', onPress: () => { this.props.store.logout(); BackHandler.exitApp() }, style: 'destructive' },
        { text: 'Отмена', onPress: () => {}, style: 'cancel' },
      ]
    )
  }

  onPress(data) {
    if (data.name == 'Выйти') this.promptForLogout()
    else this.props.navigation.navigate(data.route)
  }

  render() {
    return (
      <Container>
        <Content
          bounces={false}
          style={{ flex: 1, backgroundColor: "#fff", top: -1 }}
        >
          <ImageBackground source={drawerCover} style={styles.drawerCover}>
            <Image square style={styles.drawerImage} source={drawerImage} />
          </ImageBackground>

          <List
            dataArray={datas}
            renderRow={data =>
              <ListItem
                button
                noBorder
                onPress={() => this.onPress(data)}
              >
                <Left>
                  <Icon
                    active
                    name={data.icon}
                    style={{ color: "#777", fontSize: 26, width: 30 }}
                  />
                  <Text style={styles.text}>
                    {data.name}
                  </Text>
                </Left>
                {data.types &&
                  <Right style={{ flex: 1 }}>
                    <Badge
                      style={{
                        borderRadius: 3,
                        height: 25,
                        width: 72,
                        backgroundColor: data.bg
                      }}
                    >
                      <Text
                        style={styles.badgeText}
                      >{`${data.types} Types`}</Text>
                    </Badge>
                  </Right>}
              </ListItem>}
          />
        </Content>
      </Container>
    )
  }
}

export default SideBar