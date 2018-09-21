import React, { Component } from 'react'
import { observable } from 'mobx'
import { TouchableWithoutFeedback, Animated, View, Easing } from 'react-native'
import { Icon, Text, Row, Col, Toast } from 'native-base'
import Collapsible from 'react-native-collapsible'
import styles from './styles'

class RowItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
        isCollapsed: true,
        scaleY: new Animated.Value(1)
    }
  }

  onPress() {
    let isCollapsed = !this.state.isCollapsed
    Animated.timing(this.state.scaleY, {
      toValue: isCollapsed ? 1: -1,
      duration: 200,
    }).start()
    this.setState({ isCollapsed })
  }

  getText(data) {
    if (data.type === 1) return (<Text note>Реализовано <Text>{data.cash}</Text> RUB</Text>)
    if (data.type === 2) return (<Text note>Списано <Text>{data.scores}</Text> баллов</Text>)
    if (data.type === 3) return (<Text note>Возвращено <Text>{data.cash}</Text> RUB</Text>)
    return ''
  }

  render() {
    const { isCollapsed, scaleY } = this.state
    const { data } = this.props
    const collapsible = data.type === 1 || data.type === 3

    return (
      <View>
        <Row style={{ height: 55 }}>
          <Col style={{ alignItems: 'center', flex: 0.6, justifyContent: 'center' }}>
            <Icon name={data.icon} style={{ fontSize: 30 }} />
          </Col>
          <Col style={{ flex: 2, justifyContent: 'center' }}>
            <Text num>{data.title}</Text>
            {this.getText(data)}
          </Col>
          <Col style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>{data.date}</Text>
            {collapsible && (<TouchableWithoutFeedback onPress={() => this.onPress()}>
              <Animated.View style={{ transform: [{ scaleY }], justifyContent: 'center', alignItems: 'center', width: "100%", height: 27 }}>
                <Icon name='arrow-down' style={{ fontSize: 16 }} />
              </Animated.View>
            </TouchableWithoutFeedback>)
            }
          </Col>
        </Row>
        {collapsible && (<Collapsible collapsed={isCollapsed}>
          <Row>
            <Col style={{ alignItems: 'center' }}>
              <Text num>{data.total}</Text>
              <Text note>RUB</Text>
            </Col>
            <Col style={{ alignItems: 'center' }}>
              <Text num>{data.scores}</Text>
              <Text note>Баллами</Text>
            </Col>
            <Col style={{ alignItems: 'center' }}>
              <Text num>{data.accrual}</Text>
              <Text note>Начислено</Text>
            </Col>
            <Col style={{ alignItems: 'center' }}>
              {data.type === 1 && <Text num>{data.expiredAt}</Text>}
              {data.type === 1 && <Text note>Истекает</Text>}
            </Col>
          </Row>
        </Collapsible>)}
        <Row style={styles.devider} />
      </View>
    )
  }
}

export default RowItem