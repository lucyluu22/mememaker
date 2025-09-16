/**
 * AdjustableView
 * Allows panning and zooming of wrapped element.
 * TODO: Convert to functional component (good luck).
 */

import { clamp, debounce, noop } from "lodash"
import type {
  RefObject,
  PropsWithChildren,
  MouseEvent,
  TouchEvent,
} from "react"
import React from "react"
import Impetus from "impetus"

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

  gestureLastScale: number | null

  shouldPreventContextMenu: boolean

  shouldDispatchSelect: boolean

  impetus: typeof Impetus

  isImpetusPanEnabled: boolean

  // Since wheel events don't fire an "end" event we have to anticipate it with a reasonable debounce.
  debouncedWheelEnd = debounce(() => {
    this.onZoomEnd()
  }, 1000)

  constructor(props: AdjustableViewProps & typeof AdjustableView.defaultProps) {
    super(props)

    this.container = React.createRef()
    this.zoomDelta = 0
    this.prevPinchDistance = null
    this.gestureLastScale = null
    this.isImpetusPanEnabled = false
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
    this.container.current?.addEventListener(
      "gestureend",
      this.onSafariGestureEnd as EventListener,
    )
    this.container.current?.addEventListener(
      "gesturechange",
      this.onSafariGesture as EventListener,
    )

    // Set up Impetus for mouse and touch panning.
    let prevX = 0
    let prevY = 0
    this.impetus = new Impetus({
      source: this.container.current,
      update: (x: number, y: number) => {
        const deltaX = prevX - x
        const deltaY = prevY - y

        prevX = x
        prevY = y

        if (this.isImpetusPanEnabled) this.onPanMove(deltaX, deltaY)
      },
    })
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

    this.impetus.destroy()
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
    } else if (event.buttons === 2) {
      // Otherwise assume user is using a mousewheel, holding right mouse.
      this.onZoom(Math.sign(deltaY) * zoomStep)
    } else {
      // Mimic typical two-finger move gesture on trackpad.
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

    const delta =
      ((this.gestureLastScale ?? scale) - scale) * zoomTrackpadSensitivity * 100

    this.gestureLastScale = scale

    this.onZoom(-delta)
  }

  onMouseDown = (evt: MouseEvent) => {
    // Right mouse to activate panning.
    const rightMouse = evt.button === 2

    if (rightMouse) {
      evt.preventDefault() // Prevent click events while panning.
      this.onPanStart()
    } else {
      // Only dispatch select event if target is AdjustableViewContainer or
      // AdjustableViewContent.
      this.shouldDispatchSelect =
        evt.target === evt.currentTarget ||
        evt.target === evt.currentTarget.children[0]

      this.isImpetusPanEnabled = false
    }
  }

  onMouseUp = (evt: MouseEvent) => {
    this.maybeDispatchContainerSelect(evt)
    this.onPanEnd()
  }

  onPanStart = () => {
    this.isImpetusPanEnabled = true
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
    if (touches.length === 1) this.onPanStart()
    else this.onPanEnd()
  }

  onTouchMove = (evt: TouchEvent) => {
    const { touches } = evt
    const { zoomTouchSensitivity } = this.props

    // Two finger pinch zoom.
    if (touches.length === 2) {
      evt.preventDefault()

      const sensitivity = zoomTouchSensitivity / window.devicePixelRatio
      const [t1, t2] = Array.from(touches)
      const dist = Math.sqrt(
        (t2.clientX - t1.clientX) ** 2 + (t2.clientY - t1.clientY) ** 2,
      )

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
