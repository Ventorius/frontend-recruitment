import React, { useEffect } from 'react'

export const IframeApp = () => {
  const onResize = () => {
    window.parent.window.parent.postMessage(
      {
        type: 'resize',
        //18 is accounting for horizontal bars
        height: document.body.scrollHeight + 18,
      },
      '*'
    )
  }

  useEffect(() => {
    onResize()
  }, [])

  return (
    <div
      style={{
        backgroundColor: 'rebeccapurple',
        color: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        fontSize: '2rem',
        height: '100%',
      }}
    >
      Dynamic marketing content will be here
    </div>
  )
}
