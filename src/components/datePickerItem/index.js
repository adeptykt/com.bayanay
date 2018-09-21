import React, { Component } from 'react'
import { TouchableOpacity, Animated, Platform, View } from 'react-native'
import { Label, Icon } from 'native-base'
import DatePicker from 'react-native-datepicker'

import variables from '../../native-base-theme/variables/platform'
import computeProps from 'native-base/src/Utils/computeProps'
import _ from 'lodash'

export default class DatePickerItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: '',
      topAnim: new Animated.Value(18),
      opacAnim: new Animated.Value(1),
    }
  }
  
  componentDidMount() {
    if(this.datePickerProps && this.datePickerProps.getRef)
    this.datePickerProps.getRef(this._inputRef)
  }

  floatBack() {
    Animated.timing(this.state.topAnim, {
      toValue: 18,
      duration: 150,
    }).start()
    Animated.timing(this.state.opacAnim, {
      toValue: 1,
      duration: 150,
    }).start()
  }

  floatUp() {
    Animated.timing(this.state.topAnim, {
      toValue: -22,
      duration: 150,
    }).start()
    Animated.timing(this.state.opacAnim, {
      toValue: 0.7,
      duration: 150,
    }).start()
  }

  renderLabel(label, labelProps) {
    const newLabel = []
    if (this.props.floatingLabel) {
      if (this.state.isFocused) {
        newLabel.push(React.createElement(
          Label,
          {
            ...labelProps,
            key: 'newFLabel',
            float: true,
            style: {
              fontSize: variables.inputFontSize - 3, 
              // fontSize: 15,
              lineHeight: 30,
              ...labelProps.style,
            }
          }
        ))
        this.floatUp()
      } else {
        newLabel.push(label)
        this.floatBack()
      }
    } else {
      newLabel.push(React.createElement(
          Label,
        {
          ...labelProps,
          key: 'newLabel',
        }
        ))
    }
    return newLabel
  }

  renderChildren() {
    const newChildren = []
    const childrenArray = React.Children.toArray(this.props.children)

    let label = []
    let labelProps = {}
    label = _.remove(childrenArray, (item) => {
      if (item.type === Label) {
        labelProps = item.props
        return item
      }
    })

    let datePicker = []
    let datePickerProps = {}
    datePicker = _.remove(childrenArray, (item) => {
      if (item.type === DatePicker) {
        datePickerProps = item.props
        this.datePickerProps = item.props
        return item
      }
    })

    let icon = []
    let iconProps = {}
    icon = _.remove(childrenArray, (item) => {
      if (item.type === Icon) {
        iconProps = item.props
        return item
      }
    })
    if(this.props.floatingLabel && icon.length) {
        newChildren.push(<Icon key="i1" {...iconProps} style={{ top: 6 }} />)
        newChildren.push(<Animated.View key="float" style={{ position: 'absolute', left: (this.props.last) ? 22 : 22, right: 0, top: this.state.topAnim, opacity: this.state.opacAnim, paddingTop: (Platform.OS === 'ios') ? undefined : undefined, paddingBottom: (Platform.OS === 'ios') ? undefined : 12 }}><Label {...labelProps} >{this.renderLabel(label, labelProps)}</Label></Animated.View>)
        newChildren.push(<DatePicker key="l2" {...datePickerProps} onPressDate={() => {this.setState({ isFocused: true }); (datePickerProps.onPressDate) && datePickerProps.onPressDate()}} onDateChange={date => {this.setState({ date }); (datePickerProps.onDateChange) && datePickerProps.onDateChange(date) }} />)
    }
    else if (this.props.floatingLabel) {
        newChildren.push(<Animated.View key="float" style={{ position: 'absolute', left: (this.props.last) ? 15 : 0, right: 0, top: this.state.topAnim, opacity: this.state.opacAnim, paddingTop: (Platform.OS === 'ios') ? undefined : undefined, paddingBottom: (Platform.OS === 'ios') ? undefined : 12 }}><Label {...labelProps}>{this.renderLabel(label, labelProps)}</Label></Animated.View>)
        newChildren.push(<DatePicker ref={(c) => this._inputRef = c} date={this.state.date} key="l2" {...datePickerProps}  onOpenModal={() => {this.setState({ isFocused: true }); (datePickerProps.onOpenModal) && datePickerProps.onOpenModal()}} onCloseModal={() => {!(this.state.date.length) && this.setState({ isFocused: false }); (datePickerProps.onCloseModal) && datePickerProps.onCloseModal()}} onDateChange={date => {this.setState({ date }); (datePickerProps.onDateChange) && datePickerProps.onDateChange(date) }} />)
    }
    else if (this.props.stackedLabel && icon.length) {
        newChildren.push(<View key="s" style={{ flexDirection: 'row', flex: 1, width: variables.deviceWidth - 15 }}><Icon key="s1" {...iconProps} style={{ marginTop: 26 }} /><View style={{ flexDirection: 'column' }}><Label key="s2" {...labelProps}></Label><DatePicker key="s3" {...datePickerProps} style={{ width: variables.deviceWidth - 40 }} /></View></View>)

    }
    else {
      return this.props.children
    }
    return newChildren
  }
  getInitialStyle() {
    return {
      roundedInputGroup: {
        borderWidth: (this.props.rounded) ? (variables.borderWidth * 2) : undefined,
        borderRadius: (this.props.rounded) ? variables.inputGroupRoundedBorderRadius : undefined,
      }
    }
  }

  prepareRootProps() {
    const defaultProps = {
      style: this.getInitialStyle().roundedInputGroup,
    }

    return computeProps(this.props, defaultProps)
  }
  render() {
    return (
      <TouchableOpacity ref={c => this._root = c} {...this.prepareRootProps()} activeOpacity={1} style={{marginTop: 15, marginLeft: 15}}>
        {this.renderChildren()}
      </TouchableOpacity>
    )
  }
}

const childrenType = function (props, propName, component) {
  let error
  const prop = props[propName]
  if (!props.children.length) {
    error = new Error(`${component} should have both Label and DatePicker components`)
  } else if (props.children[0].type.displayName !== 'Styled(Label)' || props.children[1].type.displayName !== 'Styled(DatePicker)') {
    error = new Error(`${component} should have Label and DatePicker components only`)
  }
  return error
}

const theme = {
  'NativeBase.TouchableOpacity':{
    '.floatingLabel': {
      'NativeBase.DatePicker': {
        width: 200,
        paddingLeft: null,
        top: 10,
        marginLeft: (Platform.OS === 'ios') ? undefined : -5,
      },
      'NativeBase.Label': {
        left: 0,
        top: 8,
      },
      marginTop: 15,
      marginLeft: 15,
    },
  },
}

export { DatePickerItem as DatePickerItem }
