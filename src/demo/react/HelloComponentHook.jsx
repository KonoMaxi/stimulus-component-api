import React, { useState, useEffect } from 'react';

export default function HelloComponentHook({ children, counter, myprop, text, onChange, onAction }) {

  const [textState, setTextState ] = useState("default react hook Text")

  useEffect(() => {
    setTextState(text)
  }, [text])

  return (
    <div className="hello-component">
      <h4>Hello from react</h4>
      <div> {textState} {counter} {myprop}</div>
      <div style={{border: 'solid 1px black', padding: '10px'}}>
        { children }
      </div>
      <button
        onClick={() => onChange({ counter: counter + 1 })}
      >
        React +1
      </button>
      <button
        onClick={() => onChange({ text: ":(" })}
      >
        Bye
      </button>
      <button
        onClick={() => onAction({
          name: "sendMessage",
          parameters: [counter, text],
        })}
      >
        call stimulus action
      </button>
    </div>
  )
}