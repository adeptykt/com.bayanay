import React, { Component } from 'react'
import { Text } from 'react-native'

class CountdownTimer extends Component {
    static defaultProps = {
        secondsRemaining: 60,
        hidden: false,
        onCountdownEnd() {}
    }

    constructor(props) {
        super(props)
        this.state = { secondsRemaining: this.props.secondsRemaining }
    }

    tick() {
        this.setState({ secondsRemaining: this.state.secondsRemaining - 1 })
        if (this.state.secondsRemaining <= 0) {
            clearInterval(this.interval)
            if (this.props.onCountdownEnd) { this.props.onCountdownEnd() }
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    getFormattedTime(totalSeconds) {
        const two = (s) => { return ("0" + s).slice(-2) }
        return two(parseInt(totalSeconds / 60, 10) % 60) + ':' + two(parseInt(totalSeconds % 60, 10))
    }

    render() {
        return this.props.hidden ? null : (<Text {...this.props}>{this.getFormattedTime(this.state.secondsRemaining)}</Text>)
    }
}

module.exports = CountdownTimer