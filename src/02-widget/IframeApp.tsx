import React, { useEffect } from 'react'

export const IframeApp = () => {
  const onResize = () => {
    console.log('resize')
    window.parent.postMessage(
      {
        type: 'resize',
        //20 is accounting for horizontal bars
        height: document.body.scrollHeight + 20,
        width: document.body.scrollWidth,
      },
      '*'
    )
  }

  const handleParentResize = (event: MessageEvent) => {
    onResize()
  }

  useEffect(() => {
    onResize()

    window.addEventListener('message', handleParentResize)

    return () => {
      window.removeEventListener('message', handleParentResize)
    }
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
