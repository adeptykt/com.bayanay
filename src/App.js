import React, { Component } from 'react'
import { YellowBox } from 'react-native'
import { Root } from 'native-base'
import { StackNavigator, DrawerNavigator } from 'react-navigation'
import { Provider } from 'mobx-react'
import _ from 'lodash'

import { store } from './Store'
import Splash from "./screens/splash/"
import Login from "./screens/login/"
import AcceptCode from "./screens/acceptCode/"
import Main from "./screens/main/"
import Profile from "./screens/profile/"
import SideBar from "./screens/sidebar"
import History from "./screens/history/"
import About from "./screens/about/"
// import Icon from "./screens/icon/"

const Drawer = DrawerNavigator(
  {
    Main: { screen: Main },
    Profile: { screen: Profile },
    History: { screen: History },
    About: { screen: About },
    // Icon: { screen: Icon }
  },
  {
    initialRouteName: "Main",
    contentOptions: {
      activeTintColor: "#e91e63"
    },
    contentComponent: props => <SideBar {...props} />
  }
)

const AppNavigator = StackNavigator(
  {
    Drawer: { screen: Drawer },
    Main: { screen: Main },
  },
  {
    initialRouteName: "Drawer",
    headerMode: "none"
  }
)

const MainNavigator = StackNavigator(
  {
    Splash: { screen: Splash },
    Login: { screen: Login },
    AcceptCode: { screen: AcceptCode },
    AppNavigator: { screen: AppNavigator }
  },
  {
    initialRouteName: "Splash",
    headerMode: "none"
  }
)

const stores = { store }
console.ignoredYellowBox = ['Setting a timer']
// YellowBox.ignoreWarnings(['Setting a timer']);
// const _console = _.clone(console);
// console.warn = message => {
//   if (message.indexOf('Setting a timer') <= -1) {
//     _console.warn(message);
//   }
// };

export default class App extends Component {
  render() {
    return (
      <Provider { ...stores }>
        <Root>
          <MainNavigator />
        </Root>
      </Provider>
    )
  }
}