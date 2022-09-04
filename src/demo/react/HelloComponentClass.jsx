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
        <h4>Hello from react</h4>
        <div>{this.state.text} {this.state.counter} {this.props.myprop}</div>
        <div style={{border: 'solid 1px black', padding: '10px'}}>
          { this.props.children }
        </div>
        <button
          onClick={() => this.setState({
            counter: this.state.counter + 1,
          })}
        >
          React +1
        </button>
        <button
          onClick={() => this.setState({
            text: "Hey you!",
          })}
        >
          Hi
        </button>
        <button
          onClick={() => {
            let parameters = [this.state.counter, this.state.text]
            this.props.onAction({ name: "sendMessage", parameters })
        }}
        >
          call stimulus action
        </button>
      </div>
    )
  }
}
