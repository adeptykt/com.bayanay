import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Platform } from 'react-native'
import { Container, Header, Title, Content, Button, Label, Input, Body, Left, Right, Icon, Form, Item, Text, Picker, View } from 'native-base'
import DatePicker from 'react-native-datepicker'

import variables from '../../theme/variables/platform'
import { PickerItem } from '../../components/PickerItem'
import styles from './styles'

const regions = [
  "",
  "Абыйский",
  "Алданский",
  "Аллаиховский",
  "Амгинский",
  "Анабарский",
  "Булунский",
  "Верхневилюйский",
  "Верхнеколымский",
  "Верхоянский",
  "Вилюйский",
  "Горный",
  "Жиганский",
  "Кобяйский",
  "Ленский",
  "Мегино-Кангаласский",
  "Мирнинский",
  "Момский",
  "Намский",
  "Нерюнгринский",
  "Нижнеколымский",
  "Нюрбинский",
  "Оймяконский",
  "Оленёкский",
  "Олёкминский",
  "Среднеколымский",
  "Сунтарский",
  "Таттинский",
  "Томпонский",
  "Усть-Алданский",
  "Усть-Майский",
  "Усть-Янский",
  "Хангаласский",
  "Чурапчинский",
  "Эвено-Бытантайский",
  "Якутск"
]

@inject("store") @observer
class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: "",
      phone: '',
      email: '',
      floatingLabelPhone: true,
      floatingLabelName: true
    }
  }

  componentDidMount() {
    this.setState({
      phone: this.props.store.user.phone,
      email: this.props.store.user.email,
      surname: this.props.store.user.surname,
      name: this.props.store.user.name,
      patronymic: this.props.store.user.patronymic,
      birthday: this.props.store.user.birthday,
      region: this.props.store.user.region,
      floatingLabelPhone: false,
      floatingLabelName: false
    })
  }

  onChangePhone(phone) {
    number = phone.replace(/\D/g, "")
    phone = number.replace(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/, function(str, n0, n1, n2, n3, n4) {
      return '+7 ' + ((n1) ? '(' + n1 : '') + ((n2) ? ') ' + n2 : '') + ((n3) ? '-' + n3 : '') + ((n4) ? '-' + n4 : '')
    })
    if (phone == "") phone = '+7 '
    this.setState({ phone })
  }

  onFocusPhone() {
    if (this.state.phone.length < 4) {
      this.setState({ phone: '+7 ' })
    }
  }

  onBlurPhone() {
    if (this.state.phone.length < 4) {
      this.setState({ phone: '' })
    }
  }

  onPress() {
    this.props.store.saveUser({
      name: this.state.name,
      surname: this.state.surname,
      patronymic: this.state.patronymic,
      region: this.state.region,
      birthday: this.state.birthday,
      email: this.state.email
    }).then(() => this.props.navigation.goBack())
  }

  onPressDate() {
    this.setState({ dateColor: variables.toolbarDefaultBg })
    this.datepicker.onPressDate()
  }
  
  render() {
    let regionItems = regions.map((s, i) => {
      return <Item key={i} value={s} label={s} />
    })

    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Профиль</Title>
          </Body>
          <Right>
            <Button transparent onPress={this.onPress.bind(this)}>
              <Icon name='checkmark' />
            </Button>
          </Right>
        </Header>

        <Content>
          <Form>
            <Item floatingLabel={this.state.floatingLabelPhone} stackedLabel>
              <Label>Телефон для связи</Label>
              <Input
                ref={c=>this.phoneInput=c}
                returnKeyType='next'
                onSubmitEditing={()=>this.surname._root.focus()}
                autoCorrect={false}
                keyboardType='numeric'
                value={this.state.phone}
                maxLength={19}
                editable={false} />
            </Item>
            <Item style={{ borderColor: this.state.surnameColor }} stackedLabel>
              <Label style={{ color: this.state.surnameColor }}>Фамилия</Label>
              <Input
                ref={c=>this.surname=c}
                returnKeyType='next'
                onSubmitEditing={()=>this.name._root.focus()}
                autoCapitalize='words'
                value={this.state.surname}
                onChangeText={surname=>this.setState({surname})}
                onBlur={()=>this.setState({ surnameColor: variables.inputBorderColor })}
                onFocus={()=>this.setState({ surnameColor: variables.toolbarDefaultBg })} />
            </Item>
            <Item style={{ borderColor: this.state.nameColor }} stackedLabel>
              <Label style={{ color: this.state.nameColor }}>Имя</Label>
              <Input
                ref={c=>this.name=c}
                returnKeyType='next'
                onSubmitEditing={()=>this.patronymic._root.focus()}
                autoCapitalize='words'
                value={this.state.name}
                onChangeText={name=>this.setState({name})}
                onBlur={()=>this.setState({ nameColor: variables.inputBorderColor })}
                onFocus={()=>this.setState({ nameColor: variables.toolbarDefaultBg })} />
            </Item>
            <Item style={{ borderColor: this.state.patronymicColor }} stackedLabel>
              <Label style={{ color: this.state.patronymicColor }}>Отчество</Label>
              <Input
                ref={c=>this.patronymic=c}
                returnKeyType='next'
                onSubmitEditing={()=>this.email._root.focus()}
                autoCapitalize='words'
                value={this.state.patronymic}
                onChangeText={patronymic=>this.setState({patronymic})}
                onBlur={()=>this.setState({ patronymicColor: variables.inputBorderColor })}
                onFocus={()=>this.setState({ patronymicColor: variables.toolbarDefaultBg })} />
            </Item>
            <Item style={{ borderColor: this.state.emailColor }} stackedLabel>
              <Label style={{ color: this.state.emailColor }}>e-mail</Label>
              <Input
                ref={c=>this.email=c}
                returnKeyType='next'
                keyboardType='email-address'
                onSubmitEditing={()=>this.birthday._root.focus()}
                value={this.state.email}
                onChangeText={email=>this.setState({email})}
                onBlur={()=>this.setState({ emailColor: variables.inputBorderColor })}
                onFocus={()=>this.setState({ emailColor: variables.toolbarDefaultBg })} />
            </Item>
            <Item style={{ borderColor: this.state.dateColor }} stackedLabel>
              <Label style={{ color: this.state.dateColor }}>Когда тебя поздравить с Днем рождения?</Label>
              <Input
                ref={c=>this.birthday=c}
                returnKeyType='next'
                onSubmitEditing={()=>this.region._root.focus()}
                value={this.state.birthday}
                onFocus={()=>this.onPressDate()} />
            </Item>
            <PickerItem stackedLabel>
              <Label style={{top: 0 }}>Выберите регион проживания</Label>
              <Picker
                ref={c=>this.region=c}
                iosHeader="Select one"
                mode="dropdown"
                style={{
                  width: (Platform.OS === 'ios') ? undefined : "100%"
                }}
                selectedValue={this.state.region}
                onValueChange={region=>this.setState({region})}
              >
                {regionItems}
              </Picker>
            </PickerItem>
            <DatePicker
              ref={c => this.datepicker=c}
              date={this.state.birthday}
              mode="date"
              androidMode="spinner"
              placeholder=" "
              format="DD-MM-YYYY"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              disabled={false}
              style={{ height: 0 }}
              onDateChange={birthday => this.setState({ birthday, dateColor: variables.inputBorderColor })}
              onCloseModal={()=>this.setState({ dateColor: variables.inputBorderColor })}
            />
          </Form>
        </Content>
      </Container>
    )
  }
}

export default Profile