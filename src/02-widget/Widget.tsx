import React, { useState, useRef, useEffect } from 'react'

import './widget.css'
import useResizeObserver from './useResizeObserver'

export const Widget = () => {
  const [width, setWidth] = useState<number | undefined>()
  const [height, setHeight] = useState<number | undefined>()

  const iframeContainer = useRef<HTMLIFrameElement | null>(null)
  const iframe = useRef<HTMLIFrameElement | null>(null)

  const sendMessage = () => {
    if (iframe.current) {
      iframe?.current?.contentWindow?.postMessage({
        type: 'analytics',
      })
    }
  }

  useEffect(() => {
    const measurements = iframeContainer?.current?.getBoundingClientRect()
    if (measurements) {
      setWidth(measurements.width)
    }
  }, [])
  //@ts-ignore
  useResizeObserver(sendMessage, document.body)

  const handleResize = (event: MessageEvent) => {
    if (event?.data?.type === 'resize') {
      setHeight(event.data.height)
      // setWidth(event.data.width)
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleResize)

    return () => {
      window.removeEventListener('message', handleResize)
    }
  }, [])

  return (
    <div className="widget">
      <h1>App content</h1>
      <p>Check out our latest podcast</p>
      <div
        style={{
          width: '100%',
          overflow: 'hidden',
        }}
        ref={iframeContainer}
      >
        <iframe
          ref={iframe}
          height={height}
          width={width}
          src="/iframe"
          style={{ border: 0 }}
        />
      </div>
    </div>
  )
}
