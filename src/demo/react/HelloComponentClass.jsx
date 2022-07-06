import React from 'react';

export default class HelloComponentClass extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
          counter: props.counter || 10,
          text: props.text || "this is default"
        }
    }
    componentDidUpdate() {
      this.props.onChange && this.props.onChange()
    }

    render() {
        return (
            <div className="hello-component">
                <div>{ this.state.text } { this.state.counter }</div>
                <button
                    onClick={() => this.setState({
                        counter: this.state.counter + 1,
                    })}
                >
                  +1
                </button>
                <button
                    onClick={() => this.setState({
                        text: "value was emitted",
                    })}
                >
                  emit input event
                </button>
            </div>
        )
    }
}
