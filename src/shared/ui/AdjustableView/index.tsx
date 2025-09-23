/**
 * AdjustableView
 * Allows panning and zooming of wrapped element.
 * TODO: Convert to functional component (good luck).
 */

import { clamp, debounce, noop } from "lodash"
import type { RefObject, PropsWithChildren, MouseEvent, TouchEvent } from "react"
import React from "react"

import { AdjustableViewContainer } from "./AdjustableViewContainer"
import { AdjustableViewContent } from "./AdjustableViewContent"
import { AdjustableViewScaler } from "./AdjustableViewScaler"
import { AdjustableViewZoomIndicator } from "./AdjustableViewZoomIndicator"

interface SafariGestureEvent extends Event {
  scale: number
}

type AdjustableViewProps = PropsWithChildren<{
  contentWidth: number
  contentHeight: number
  zoom?: number
  minZoom?: number
  maxZoom?: number
  zoomStep?: number
  zoomTrackpadSensitivity?: number
  zoomTouchSensitivity?: number
  onZoom?(zoom: number): void
  onContainerSelect?(evt: MouseEvent): void
}>

interface AdjustableViewState {
  isPanning: boolean
}

export class AdjustableView extends React.PureComponent<
  AdjustableViewProps & typeof AdjustableView.defaultProps,
  AdjustableViewState
> {
  static defaultProps = {
    zoom: 100,
    minZoom: 10,
    maxZoom: 100,
    zoomStep: 5,
    zoomTrackpadSensitivity: 1,
    zoomTouchSensitivity: 0.8,
    onZoom: noop as (zoom: number) => void,
    onContainerSelect: noop as (evt: MouseEvent) => void,
  }

  container: RefObject<HTMLDivElement | null>

  zoomDelta: number

  prevPinchDistance: number | null
  prevPointerX: number | null
  prevPointerY: number | null

  gestureLastScale: number | null

  shouldPreventContextMenu: boolean

  shouldDispatchSelect: boolean

  // Since wheel events don't fire an "end" event we have to anticipate it with a reasonable debounce.
  debouncedWheelEnd = debounce(() => {
    this.onZoomEnd()
  }, 1000)

  constructor(props: AdjustableViewProps & typeof AdjustableView.defaultProps) {
    super(props)

    this.container = React.createRef()
    this.zoomDelta = 0
    this.prevPinchDistance = null
    this.prevPointerX = null
    this.prevPointerY = null
    this.gestureLastScale = null
    this.shouldPreventContextMenu = false
    this.shouldDispatchSelect = false

    this.state = {
      isPanning: false,
    }
  }

  componentDidMount() {
    // In Chrome 73 wheel events are passive by default, meaning we can't block
    // the default action of zooming (via trackpad) into the web page.
    // Therefore we attach an active event directly on the container.
    this.container.current?.addEventListener("wheel", this.onWheel, {
      passive: false,
    })

    // Safari proprietary events.
    // We need to handle zooming specifically for them since wheel events don't work.
    this.container.current?.addEventListener(
      "gesturestart",
      this.onSafariGestureStart as EventListener,
    )
    this.container.current?.addEventListener("gestureend", this.onSafariGestureEnd as EventListener)
    this.container.current?.addEventListener("gesturechange", this.onSafariGesture as EventListener)
  }

  componentWillUnmount() {
    this.container.current?.removeEventListener("wheel", this.onWheel)

    this.container.current?.removeEventListener(
      "gesturestart",
      this.onSafariGestureStart as EventListener,
    )
    this.container.current?.removeEventListener(
      "gestureend",
      this.onSafariGestureEnd as EventListener,
    )
    this.container.current?.removeEventListener(
      "gesturechange",
      this.onSafariGesture as EventListener,
    )
  }

  onContextMenu = (event: MouseEvent) => {
    if (this.shouldPreventContextMenu) {
      event.preventDefault()
      this.shouldPreventContextMenu = false
      return false
    }
    this.onPanEnd()
    return true
  }

  onWheel = (event: WheelEvent) => {
    // Prevent Chrome zooming in on the web page.
    event.preventDefault()

    const { zoomTrackpadSensitivity, zoomStep } = this.props
    const { deltaX, deltaY } = event

    if (event.ctrlKey) {
      // Ctrl key is set to true when using pinch gesture on trackpad.
      this.onZoom(-deltaY * zoomTrackpadSensitivity)
      this.debouncedWheelEnd()
    } else if (event.shiftKey) {
      // Otherwise assume mouse wheel if shift key is pressed.
      this.onZoom(Math.sign(deltaY) * zoomStep)
    } else {
      // Wheel event on a trackpad, so do the usual two-finger move.
      this.onPanMove(deltaX, deltaY)
    }
  }

  onSafariGestureStart = (event: SafariGestureEvent) => {
    // Prevent default web page zoom via pinch gesture.
    event.preventDefault()

    this.gestureLastScale = event.scale
  }

  onSafariGestureEnd = () => {
    this.onZoomEnd()
  }

  onSafariGesture = (event: SafariGestureEvent) => {
    // Prevent "show all tabs" gesture while zooming out.
    event.preventDefault()

    const { zoomTrackpadSensitivity } = this.props
    const { scale } = event

    const delta = ((this.gestureLastScale ?? scale) - scale) * zoomTrackpadSensitivity * 100

    this.gestureLastScale = scale

    this.onZoom(-delta)
  }

  onMouseDown = (evt: MouseEvent) => {
    // Middle mouse to activate panning.
    const middleMouse = evt.button === 1
    this.prevPointerX = evt.clientX
    this.prevPointerY = evt.clientY

    if (middleMouse) {
      this.onPanStart()
    }
  }

  onMouseMove = (evt: MouseEvent) => {
    if (!this.state.isPanning) return

    const deltaX = (this.prevPointerX ?? evt.clientX) - evt.clientX
    const deltaY = (this.prevPointerY ?? evt.clientY) - evt.clientY
    this.prevPointerX = evt.clientX
    this.prevPointerY = evt.clientY

    this.onPanMove(deltaX, deltaY)
  }

  onMouseUp = (evt: MouseEvent) => {
    this.maybeDispatchContainerSelect(evt)
    this.onPanEnd()
  }

  onPanStart = () => {
    this.setState({ isPanning: true })
  }

  onPanMove = (deltaX: number, deltaY: number) => {
    const container = this.container.current

    if (container) {
      container.scrollLeft += deltaX
      container.scrollTop += deltaY
    }

    this.shouldPreventContextMenu = true
  }

  onPanEnd = () => {
    this.setState({ isPanning: false })
  }

  onZoom = (delta: number) => {
    const { zoom, minZoom, maxZoom, zoomStep, onZoom } = this.props

    this.shouldPreventContextMenu = true
    this.zoomDelta += delta

    const applyZoom = Math.round(this.zoomDelta / (zoomStep * 2)) * zoomStep
    if (applyZoom !== 0) {
      const newZoom = zoom + applyZoom
      this.zoomDelta -= applyZoom
      onZoom(clamp(newZoom, minZoom, maxZoom))
    }
  }

  onZoomEnd = () => {
    this.zoomDelta = 0
  }

  onTouchStart = ({ touches }: TouchEvent) => {
    this.prevPinchDistance = null
    if (touches.length === 1) {
      this.prevPointerX = touches[0].clientX
      this.prevPointerY = touches[0].clientY
      this.onPanStart()
    } else {
      this.onPanEnd()
    }
  }

  onTouchMove = (evt: TouchEvent) => {
    const { touches } = evt
    const { zoomTouchSensitivity } = this.props

    // Typical one finger move.
    if (this.state.isPanning && touches.length === 1) {
      const t = touches[0]
      const deltaX = (this.prevPointerX ?? t.clientX) - t.clientX
      const deltaY = (this.prevPointerY ?? t.clientY) - t.clientY
      this.prevPointerX = t.clientX
      this.prevPointerY = t.clientY

      this.onPanMove(deltaX, deltaY)
    }
    // Two finger pinch zoom.
    else if (touches.length === 2) {
      const sensitivity = zoomTouchSensitivity / window.devicePixelRatio
      const [t1, t2] = Array.from(touches)
      const dist = Math.sqrt((t2.clientX - t1.clientX) ** 2 + (t2.clientY - t1.clientY) ** 2)

      const delta = ((this.prevPinchDistance ?? dist) - dist) * sensitivity

      this.prevPinchDistance = dist

      this.onZoom(-delta)
    }
  }

  maybeDispatchContainerSelect = (evt: MouseEvent) => {
    const { onContainerSelect } = this.props
    if (this.shouldDispatchSelect) {
      onContainerSelect(evt)
    }
  }

  render() {
    const { children, zoom, contentWidth, contentHeight } = this.props
    const { isPanning } = this.state
    return (
      <AdjustableViewContainer
        ref={this.container}
        $isPanning={isPanning}
        onContextMenu={this.onContextMenu}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        onMouseLeave={this.onPanEnd}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onPanEnd}
      >
        <AdjustableViewContent>
          {/* The extra padding is to circumvent margin collapsing without hiding overflow. */}
          <div style={{ position: "relative", padding: 1 }}>
            <AdjustableViewZoomIndicator zoom={zoom} />
            <AdjustableViewScaler
              zoom={zoom}
              contentWidth={contentWidth}
              contentHeight={contentHeight}
            >
              {children}
            </AdjustableViewScaler>
          </div>
        </AdjustableViewContent>
      </AdjustableViewContainer>
    )
  }
}
