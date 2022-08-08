import React, { useState, useEffect } from 'react';

export default function HelloComponentHook({ children, counter, myprop, text, onChange, onAction }) {

  const [textState, setTextState ] = useState("default react hook Text")

  useEffect(() => {
    setTextState(text)
  }, [text])

  return (
    <div className="hello-component">
      <div> {textState} {counter} {myprop}</div>
      { children }
      <button
        onClick={() => onChange({ counter: counter + 1 })}
      >
        +1
      </button>
      <button
        onClick={() => onChange({ text: "hey you!" })}
      >
        Hi
      </button>
      <button
        onClick={() => onChange({ text: undefined })}
      >
        Bye
      </button>
      <button
        onClick={() => onAction("debugAction")}
      >
        Action
      </button>
    </div>
  )
}