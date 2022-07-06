import React, { useState, useEffect } from 'react';

export default function HelloComponentHook({initialCounter, initialText, onChange}) {
  const [counter, setCounter] = useState(initialCounter || 100)
  const [text, setText] = useState(initialText || "this is hook default")

  useEffect(() => {
    onChange && onChange()
  })

  return (
    <div className="hello-component">
    <div>{ text } { counter }</div>
    <button
        onClick={() => setCounter(
          prevCount => prevCount + 1
        )}
    >
      +1
    </button>
    <button
        onClick={() => setText("value was emitted")}
    >
      emit input event
    </button>
    </div>
  )
}