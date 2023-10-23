import React, { useEffect, useState, useRef } from 'react'
import { PillData } from './data'
import { Pill } from './Pill'

interface PillsProps {
  pills: PillData[]
  headers: string[]
  toggleHeader: (id: string) => void
}

interface LayoutBreakElement {
  index: string
  type: 'line-break'
}

interface LayoutPillElement {
  index: string
  type: 'pill'
  pill: PillData
}

type LayoutElement = LayoutBreakElement | LayoutPillElement

export function Pills({ pills, headers, toggleHeader }: PillsProps) {
  const containerNode = useRef<HTMLDivElement>(null)
  const pillRefs = useRef<{ [id: PillData['id']]: HTMLDivElement }>({})

  const [layoutElements, setLayoutElements] = useState<LayoutElement[]>(() => {
    return pills.map(pill => ({
      index: pill.id,
      type: 'pill',
      pill: pill,
    }))
  })

  useEffect(() => {
    setLayoutElements(
      pills.map(pill => ({
        index: pill.id,
        type: 'pill',
        pill: pill,
      }))
    )
  }, [pills])

  const setPillRef = (id: PillData['id'], node: HTMLDivElement) => {
    if (node) {
      pillRefs.current[id] = node
    }
  }

  const recalculateLayout = () => {
    const containerWidth = containerNode.current?.clientWidth || 0
    //@ts-ignore
    let currentLine = []
    let lineWidth = 0
    let maxLineWidth = 0

    layoutElements.forEach((el, index) => {
      if (el.type === 'line-break') {
        if (lineWidth > maxLineWidth) {
          maxLineWidth = lineWidth
        }
        lineWidth = 0
      } else {
        const pillRef = pillRefs.current[el.pill.id]
        const pillWidth = pillRef?.offsetWidth + 30 || 0

        if (lineWidth + pillWidth > containerWidth) {
          currentLine.push({ index: el.index, type: 'line-break' })
          lineWidth = 0
        }

        currentLine.push(el)
        lineWidth += pillWidth
      }
    })
    //@ts-ignore
    console.log(currentLine)

    //@ts-ignore
    setLayoutElements(currentLine)
  }
  useEffect(() => {
    recalculateLayout()

    window.addEventListener('resize', recalculateLayout)

    return () => {
      window.removeEventListener('resize', recalculateLayout)
    }
  }, [])

  return (
    <div
      ref={containerNode}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
      }}
    >
      {layoutElements.map(el => {
        if (el.type === 'line-break') {
          return (
            <div
              style={{
                flexBasis: '100%',
                height: '0',
              }}
              key={`__${el.type}-${el.index}`}
            />
          )
        } else {
          return (
            <Pill
              key={el.pill.id}
              header={headers.includes(el.pill.id)}
              onClick={() => {
                toggleHeader(el.pill.id)
              }}
              ref={element => element && setPillRef(el.pill.id, element)}
            >
              {el.pill.value}
            </Pill>
          )
        }
      })}
    </div>
  )
}
