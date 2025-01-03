'use client'

import React from 'react'
import { useSpring, animated, SpringRef, ElementType } from '@react-spring/web'
import svgPanZoom from 'svg-pan-zoom'

import statePaths from './state-paths'
import { theme } from '@/utilities/theme'
import { panZoomEventsHandler } from './panZoomEventsHandler'
import { stateCodes } from '@/data/states'
import { useRouter } from 'next/navigation'
import { StateCode } from '@/lib/types'

const stateColor = theme.palette.primary.main
const stateColorOver = theme.palette.primary.dark

const mapAspectRatio = 450 / 700

export function Map() {
  const [containerWidth, setContainerWidth] = React.useState(700)

  React.useEffect(() => {
    svgPanZoom('#map', {
      zoomEnabled: true,
      controlIconsEnabled: false,
      fit: true,
      center: true,
      customEventsHandler: panZoomEventsHandler,
    })
  })
  const containerRef = React.useRef(null)
  const svgRef = React.useRef(null)

  React.useEffect(() => {
    const observer = new ResizeObserver(() => {
      handleContainerResize()
    })

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleContainerResize = () => {
    const panZoomMap = svgPanZoom('#map')
    panZoomMap.resize() // update SVG cached size and controls positions
    panZoomMap.fit()
    panZoomMap.center()
    const sizes = panZoomMap.getSizes()
    setContainerWidth(sizes.width)
  }

  const AnimatedSvg = animated('svg') as ElementType

  return (
    <div ref={containerRef}>
      <div className="" style={{ height: containerWidth * mapAspectRatio }}>
        <AnimatedSvg
          ref={svgRef}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          height="100%"
          width="100%"
          viewBox="-14 -7 700 431.2"
          preserveAspectRatio="xMinYMin"
          id="map"
          className="h-full w-full"
        >
          {stateCodes.map((stateCode) => (
            <SVGMapPath stateCode={stateCode} key={stateCode} />
          ))}
          {stateCodes.map((stateCode) => (
            <SVGMapRect stateCode={stateCode} key={stateCode} />
          ))}
          {stateCodes.map((stateCode) => (
            <SVGMapText stateCode={stateCode} key={stateCode} />
          ))}
        </AnimatedSvg>
      </div>
    </div>
  )
}

type SetStyle = SpringRef<{
  fill: string
}>

const addAllEvents = (stateCode: StateCode, setStyle: SetStyle) => {
  const addEvents = (element: Element | null, setStyle: SetStyle) => {
    element?.addEventListener('mouseover', () => {
      if (setStyle) setStyle.start({ fill: stateColorOver })
    })
    element?.addEventListener('mouseout', () => {
      if (setStyle) setStyle.start({ fill: stateColor })
    })
  }

  const mapPath = document.querySelector(`#map-path-${stateCode}`)
  const mapText = document.querySelector(`#map-text-${stateCode}`)
  const mapRect = document.querySelector(`#map-rect-${stateCode}`)

  addEvents(mapPath, setStyle)
  addEvents(mapText, setStyle)
  if (mapRect) addEvents(mapRect, setStyle)
}

function SVGMapPath({ stateCode }: { stateCode: StateCode }) {
  const router = useRouter()
  const [style, api] = useSpring(() => ({
    fill: stateColor,
    config: { mass: 1, tension: 170, friction: 26 },
  }))
  const d = statePaths[stateCode].d

  React.useEffect(() => {
    addAllEvents(stateCode, api)
  }, [router, api, stateCode])

  const AnimatedPath = animated('path') as ElementType

  return (
    <AnimatedPath
      id={`map-path-${stateCode}`}
      d={d}
      style={style}
      className="scale-[0.7] cursor-pointer stroke-white stroke-2 opacity-100"
      onClick={() => router.push(`/states/${stateCode.toLowerCase()}`)}
    />
  )
}

function SVGMapRect({ stateCode }: { stateCode: StateCode }) {
  const router = useRouter()
  const x = statePaths[stateCode].rectX
  const y = statePaths[stateCode].rectY
  const transform = statePaths[stateCode].rectTransform
  const [style, setStyle] = useSpring(() => ({
    fill: stateColor,
    config: { mass: 1, tension: 170, friction: 26 },
  }))

  React.useEffect(() => {
    addAllEvents(stateCode, setStyle)
  }, [router, setStyle, stateCode])

  if (!statePaths[stateCode].hasLabel) return null

  const AnimatedRect = animated('rect') as ElementType

  return (
    <AnimatedRect
      id={`map-rect-${stateCode}`}
      width="45"
      height="28"
      r="6"
      rx="6"
      ry="6"
      className="cursor-pointer stroke-[round] stroke-[1.875px] opacity-100"
      x={x}
      y={y}
      style={style}
      transform={transform}
      onClick={() => router.push(`/states/${stateCode.toLowerCase()}`)}
    />
  )
}

const SVGMapText = ({ stateCode }: { stateCode: StateCode }) => {
  const router = useRouter()
  const x = statePaths[stateCode].textX
  const y = statePaths[stateCode].textY
  const transform = statePaths[stateCode].textTransform

  return (
    <text
      id={`map-text-${stateCode}`}
      className="cursor-pointer fill-white stroke-none stroke-0 font-roboto text-[22px] opacity-100"
      x={x}
      y={y}
      textAnchor="middle"
      transform={transform}
      onClick={() => router.push(`/states/${stateCode.toLowerCase()}`)}
    >
      <tspan dy="7.75">{stateCode}</tspan>
    </text>
  )
}
