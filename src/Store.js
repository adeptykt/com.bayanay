import { AsyncStorage } from 'react-native'
import { observable } from 'mobx'
import { autobind } from 'core-decorators'
import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import authentication from '@feathersjs/authentication-client'
import io from 'socket.io-client'
import PushNotification from 'react-native-push-notification'

const API_URL = 'http://admin.bayanay.center:3030'

function formatDate(d) {
  var yyyy = d.getFullYear().toString()
  var mm = (d.getMonth() + 101).toString().slice(-2)
  var dd = (d.getDate() + 100).toString().slice(-2)
  return dd + '.' + mm + '.' + yyyy
}

const operationTypes = [
  "Неопределено",
  "Продажа",
  "Списание бонусов",
  "Возврат"
]

const icons = [
  "help",
  "cart",
  "close",
  "undo"
]

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: token => {
    console.log('TOKEN:', token);
  },

  // (required) Called when a remote or local notification is opened or received
  onNotification: notification => {
    console.log('NOTIFICATION:', notification)
  },

  // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
  // senderID: "YOUR GCM SENDER ID",

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
    * (optional) default: true
    * - Specified if permissions (ios) and token (android and ios) will requested or not,
    * - if not, you must call PushNotificationsHandler.requestPermissions() later
    */
  requestPermissions: true
})

@autobind
class Store {

  @observable isAuthenticated = false
  @observable isConnecting = false
  @observable user = null
  @observable operations = []
  @observable hasMoreOperations = false
  @observable skip = 0
  @observable scores = 0
  @observable phone = ''

  constructor() {
    const options = { transports: ['websocket'], pingTimeout: 3000, pingInterval: 5000 }
    const socket = io(API_URL, options)
    PushNotification.cancelAllLocalNotifications()

    this.app = feathers()
      .configure(socketio(socket))
      .configure(authentication({
        jwtStrategy: 'jwt',
        storage: undefined // Passing a WebStorage-compatible object to enable automatic storage on the client.
        // storage: AsyncStorage // To store our accessToken
      }))

    this.connect()

    this.app.service('operations').on('created', operation => this.operations.unshift(this.formatOperation(operation)))
    this.app.service('operations').on('patched', operation => this.replaceElement(this.formatOperation(operation)))
    this.app.service('operations').on('updated', operation => this.replaceElement(this.formatOperation(operation)))

    this.app.service('users').on('patched', user => this.scores = user.scores)
    this.app.service('users').on('updated', user => this.scores = user.scores)

    console.log('accessToken: ' + this.app.get('accessToken'))
    if (this.app.get('accessToken')) this.isAuthenticated = this.app.get('accessToken') !== null

    this.logout = this.logout.bind(this)
  }

  pushNotification(notification) {
    PushNotification.localNotification({
      vibrate: true, // (optional) default: true
      title: 'Байанай клуб', // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
      message: notification.message
    })
    this.app.service('notifications').remove(notification._id)
  }

  connect() {
    this.isConnecting = false

    this.app.io.on('connect', () => {
      this.isConnecting = true
      this.authenticate()
        .then(() => {
          console.log('authenticated after reconnection')
          this.scores = this.user.scores
          this.app.service('notifications').find({ query: { $limit: 5 }}).then(response => {
            response.data.forEach(notification => {
              this.pushNotification(notification)
            })
          })
        })
        .catch(error => {
          console.log('error authenticating after reconnection', error);
        })
    })

    this.app.service('notifications').on('created', notification => this.pushNotification(notification))
    this.app.io.on('disconnect', () => { this.isConnecting = false })
  }

  getCode() {
    this.logout()
    return this.app.service('codes').create({ phone: this.phone })
  }

  getToken() {
    return this.app.service('tokens').create({ userId: this.user._id })
  }

  createAccount(email, password) {
    const userData = { email, password }
    return this.app.service('users').create(userData).then((result) => {
      return this.authenticate(Object.assign(userData, { strategy: 'local' }))
    })
  }

  saveUser(userData) {
    Object.assign(this.user, userData)
    return this.app.service('users').patch(this.user._id, userData)
  }

  login(email, password) {
    const payload = {
      strategy: 'local',
      email,
      password
    }
    return this.authenticate(payload)
  }

  mobile(code) {
    const payload = {
      strategy: 'mobile',
      phone: this.phone,
      code
    }
    return this.authenticate(payload)
  }

  authenticate(options) {
    options = options ? options : undefined
    return this._authenticate(options).then(user => {
      this.user = user
      this.isAuthenticated = true
      return Promise.resolve(user)
    }).catch(error => {
      return Promise.reject(error)
    })
  }

  _authenticate(payload) {
    return this.app.authenticate(payload)
      .then(response => { return this.app.passport.verifyJWT(response.accessToken) })
      .then(payload => {
        console.log('accessToken: ' + this.app.get('accessToken'))
        return this.app.service('users').get(payload.userId)
      })
      .catch(e => Promise.reject(e))
  }

  logout() {
    this.skip = 0
    this.operations = []
    this.user = null
    this.isAuthenticated = false
    this.app.logout()
  }

  loadOperations(loadNextPage) {
    let $skip = this.skip
    let $limit = 0

    const query = { query: { userId: this.user._id, status: 1, $sort: { createdAt: -1 }, $skip } }

    return this.app.service('operations').find(query).then(response => {
      const operations = []
      const skip = response.skip + response.limit

      for (let operation of response.data) {
        operations.push(this.formatOperation(operation))
      }

      if (!loadNextPage) {
        this.operations = operations
      } else {
        this.operations = this.operations.concat(operations)
      }
      datas = this.operations
      this.skip = skip
      this.hasMoreOperations = response.skip + response.limit < response.total
      return Promise.resolve(this.operations)
    }).catch(error => {
      console.log(error)
    })
  }

  replaceElement(operation) {
    let index = this.operations.findIndex((element, index, array) => { return (element.id == operation.id) ? true: false })
    if (index != -1) this.operations.splice(index, 1, operation)
  }

  formatOperation(operation) {
    return {
      id: operation.id,
      type: operation.type,
      icon: icons[operation.type],
      title: operationTypes[operation.type],
      expiredAt: formatDate(new Date(operation.expiredAt)),
      date: formatDate(new Date(operation.createdAt)),
      accrual: Math.abs(operation.accrual),
      scores: Math.abs(operation.scores),
      total: Math.abs(operation.total),
      cash: Math.abs(operation.cash)
    }
  }

  sendOperation(operations = {}, rowID = null) {
    this.app.service('operations').create({ text: operations[0].text }).then(result => {
      console.log('operation created!')
    }).catch((error) => {
      console.log('ERROR creating operation')
      console.log(error)
    })
  }
}

const store = new Store()

export default Store
export { store }
