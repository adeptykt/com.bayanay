import React, { Component } from 'react'
import { Container, Header, Left, Button, Icon, Body, Title, Right, Content, H1, Text } from 'native-base'

import styles from './styles'

class About extends Component {
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
            <Title>О нас</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
          <H1 style={styles.mb10}>Байанай центр</H1>
          <Text style={styles.text}>Торгово-розничная сеть товаров для охоты, рыбалки и туризма "Байанай Центр" одна из крупнейших на дальневосточном регионе. Широкий ассортимент продукции представлен в 3 розничных магазинах по самым привлекательным ценам для всех категорий покупателей.</Text>
          <Text style={styles.list}>Снаряжение для охоты и рыбалки.</Text>
          <Text style={styles.list}>Экипировка для туризма и отдыха.</Text>
          <Text style={styles.list}>Походная мебель.</Text>
          <Text style={styles.list}>Одежда и обувь для охоты, рыбалки и активного отдыха.</Text>
          <Text style={styles.list}>Специализированная торговля гражданским и служебным оружием и патронами к ним.</Text>
          <Text style={styles.text}>Стрелковый тир на дистанции до 80 метров для всех видов оружия. Услуги по проверке боя оружия. Настройка открытых, оптических и тепловизионных прицелов. Спортивная стрельба только для совершеннолетних граждан РФ.</Text>
          <Text style={styles.text}>Адреса магазинов:</Text>
          <Text>г. Якутск, ул. Труда, 3/1, тел. 45-99-20</Text>
          <Text>г. Якутск, ул. Хабарова, 1, тел. 701-389</Text>
          <Text>г. Якутск, ул. Автодорожная, 14А, тел. 713-346</Text>
          <Text style={styles.text}>Адрес тира:</Text>
          <Text style={styles.last}>г. Якутск, ул. Труда, 3/1, тел. 47-41-67. Предварительная запись. Гражданство РФ.</Text>
        </Content>
      </Container>
    )
  }
}

export default About
