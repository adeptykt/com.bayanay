import React, { Component } from 'react'
import { autobind } from 'core-decorators'
import { observer, inject } from 'mobx-react'
import { View, TouchableWithoutFeedback, Animated } from 'react-native'
import { Container, Header, Left, Icon, Body, Title, Right, Content, Button, Text, Row, Col, Toast } from 'native-base'
import { InfiniteListView } from 'react-native-infinite-listview'
import RowItem from './row'

import styles from './styles'

@inject("store") @observer @autobind
class NHListIcon extends Component {
  state = {
    isRefreshing: false,
    isLoadingMore: false,
    items: {},
    visible: false,
    height: new Animated.Value()
  }

  constructor(props) {
    super(props)
    this.props.store.skip = 0
    this.props.store.loadOperations(false)
  }

  onRefresh() {
    this.props.store.skip = 0
    this.props.store.loadOperations(false)
  }

  onLoadMore() {
    this.props.store.loadOperations(true)
  }

  renderRow(data) {
    return (<RowItem data={data} />)
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 2 }}>
            <Title>История</Title>
          </Body>
          <Right>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5 }}>
              <View>
                <Title>{this.props.store.scores}&nbsp;</Title>
              </View>
              <View>
                <Icon name="star" style={{ color: 'gold' }} />
              </View>
            </View>
          </Right>
        </Header>

        <Content>
          <InfiniteListView
            dataArray={this.props.store.operations}
            renderRow={this.renderRow}
            onRefresh={this.onRefresh}
            isRefreshing={this.state.isRefreshing}
            canLoadMore={this.props.store.hasMoreOperations}
            isLoadingMore={this.state.isLoadingMore}
            onLoadMore={this.onLoadMore}
          />
        </Content>
      </Container>
    )
  }
}

export default NHListIcon