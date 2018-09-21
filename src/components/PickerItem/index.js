import React, { Component } from 'react'
import { TouchableOpacity, Animated, Platform, View } from 'react-native'
import { Label, Icon, Picker, mapPropsToStyleNames } from 'native-base'

import { connectStyle } from "native-base-shoutem-theme"
import variables from '../../theme/variables/platform'
import computeProps from 'native-base/src/Utils/computeProps'
import _ from 'lodash'

const platform = Platform.OS

export default class PickerItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: '',
      topAnim: new Animated.Value(18),
      opacAnim: new Animated.Value(1),
    }
  }
  componentDidMount() {
		if (this.props.floatingLabel) {
			if (this.pickerProps && this.pickerProps.value) {
				this.setState({ isFocused: true })
				this.floatUp(-16)
			}
			if (this.pickerProps && this.pickerProps.getRef) this.pickerProps.getRef(this._inputRef);
		}
  }
	componentWillReceiveProps(nextProps) {
		const childrenArray = React.Children.toArray(nextProps.children);
		let pickerProps = {}
		picker = _.remove(childrenArray, item => {
			if (item.type.displayName === "Styled(Input)") {
				pickerProps = item.props
				this.pickerProps = item.props
				return item
			}
		})
		if (this.props.floatingLabel) {
			if (this.pickerProps && this.pickerProps.value) {
				this.setState({ isFocused: true })
				this.floatUp(-16)
			}
			if (this.pickerProps && this.pickerProps.getRef) this.pickerProps.getRef(this._inputRef)
		}
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
              fontSize: 15,
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
    label = _.remove(childrenArray, item => {
      if (item.type === Label) {
        labelProps = item.props
        return item
      }
    })

    let picker = []
    let pickerProps = {}
    picker = _.remove(childrenArray, item => {
      if (item.type === Picker) {
        pickerProps = item.props
        this.pickerProps = item.props
        return item
      }
    })

    let icon = []
    let iconProps = {}
    icon = _.remove(childrenArray, item => {
      if (item.type === Icon) {
        iconProps = item.props
        return item
      }
    })
    if (this.props.floatingLabel && icon.length) {
        newChildren.push(<Icon key="i1" {...iconProps} style={{ top: 6 }} />)
        newChildren.push(<Animated.View key="float" style={{ position: 'absolute', left: (this.props.last) ? 22 : 22, right: 0, top: this.state.topAnim, opacity: this.state.opacAnim, paddingTop: (Platform.OS === 'ios') ? undefined : undefined, paddingBottom: (Platform.OS === 'ios') ? undefined : 12 }}><Label {...labelProps} >{this.renderLabel(label, labelProps)}</Label></Animated.View>)
        newChildren.push(<Picker key="l2" {...pickerProps} onPressDate={() => {this.setState({ isFocused: true }); (pickerProps.onPressDate) && pickerProps.onPressDate()}} onDateChange={date => {this.setState({ date }); (pickerProps.onDateChange) && pickerProps.onDateChange(date) }} />);
    }
    else if (this.props.floatingLabel) {
        newChildren.push(<Animated.View key="float" style={{ position: 'absolute', left: (this.props.last) ? 0 : 0, right: 0, top: this.state.topAnim, opacity: this.state.opacAnim, paddingTop: (Platform.OS === 'ios') ? undefined : undefined, paddingBottom: (Platform.OS === 'ios') ? undefined : 12 }}><Label {...labelProps}>{this.renderLabel(label, labelProps)}</Label></Animated.View>)
        newChildren.push(
            <Picker ref={(c) => this._inputRef = c} date={this.state.date} key="l2" {...pickerProps}  onValueChange={(value) => {isFocused = value != ""; this.setState({ isFocused }); (pickerProps.onValueChange) && pickerProps.onValueChange(value)}}>
        {pickerProps.children}
            </Picker>
        )
    }
    else if (this.props.stackedLabel && icon.length) {
      newChildren.push(
        <View
          key="s"
          style={{
            flexDirection: 'row',
            flex: 1,
            width: variables.deviceWidth - 15
          }}
        >
          <Icon key="s1" {...iconProps} />
          <View style={{ flexDirection: 'column' }}>
            <Label key="s2" {...labelProps} />
            <Picker key="s3" {...pickerProps} style={{ width: variables.deviceWidth - 40 }} />
          </View>
        </View>
      )
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
      },
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
      <TouchableOpacity ref={c => this._root = c} {...this.prepareRootProps()} activeOpacity={1}>
        {this.renderChildren()}
      </TouchableOpacity>
    )
  }
}

const childrenType = function (props, propName, component) {
  let error
  const prop = props[propName]
  if (!props.children.length) {
    error = new Error(`${component} should have both Label and Picker components`)
	} else if (
		props.children[0].type.displayName !== "Styled(Label)" ||
		props.children[1].type.displayName !== "Styled(Picker)"
	) {
    error = new Error(`${component} should have Label and Picker components only`)
  }
  return error
}
const StyledItem = connectStyle("NativeBase.PickerItem", {}, mapPropsToStyleNames)(PickerItem)

export { StyledItem as PickerItem }