import { useState, useRef, useEffect, useLayoutEffect } from 'react'

import './widget.css'

const useResizeObserver = () => {
  const [width, setWidth] = useState<number | undefined>()
  const [height, setHeight] = useState<number | undefined>()

  const iframeContainer = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setWidth(width)
      setHeight(height)
    })

    resizeObserver.observe(iframeContainer.current!)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return { width, height, iframeContainer }
}

export const Widget = () => {
  const [height, setHeight] = useState<number | undefined>()

  const { width, iframeContainer } = useResizeObserver()
  const iframe = useRef<HTMLIFrameElement | null>(null)

  const handleResize = (event: MessageEvent) => {
    if (event?.data?.type === 'resize') {
      setHeight(event.data.height)
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
