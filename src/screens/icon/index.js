import React, { Component } from "react"
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Text,
  Left,
  Body,
  Right,
  Grid,
  Col,
  Row
} from "native-base"
import styles from "./styles"
import iconsJSON from './NBIcons.json'

class NHIcon extends Component {
  render() {
    let icons = [], isRow = false
    for (var key in iconsJSON) icons.push(key)
    
    const IconRow = ({ row }) => (
      <Row style={styles.row}>
        {
          row.map((icon, index) => (
            <Col key={index} style={styles.col}> 
            {console.log(icon+':'+index)}
              <Icon name={icon} style={{ color: "#999" }} />
              <Text numberOfLines={1} style={styles.iconText}>{icon}</Text>
            </Col>
          ))
        }
      </Row>
    )

    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate("DrawerOpen")}>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Icons</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
        {
          icons.reduce((row, icon, index) => {
            if (index % 5 === 0) row.push([])
            row[row.length - 1].push(icon)
            return row
          }, []).map((row, index) => (<IconRow key={index} row={row} />))
        }
        </Content>
      </Container>
    )
  }
}

export default NHIcon;
