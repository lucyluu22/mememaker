import type { JSX, PropsWithChildren } from "react"

interface AdjustableViewScalerProps extends PropsWithChildren {
  zoom?: number
  contentWidth: number
  contentHeight: number
}

export const AdjustableViewScaler = ({
  children = null,
  zoom = 100,
  contentWidth,
  contentHeight,
}: AdjustableViewScalerProps): JSX.Element => {
  // ---vertical and horizontal corrections---
  // Parent container won't shrink to match the new scaled dimensions
  // from CSS transform (required for centering).
  // These values are applied to the margins in order to mock the element
  // width and height to that of it's scale.
  const scale = zoom / 100
  const vMargin = (contentHeight * scale - contentHeight) / 2
  const hMargin = (contentWidth * scale - contentWidth) / 2

  return (
    <div
      style={{
        position: "relative", // establish new block formatting context
        transform: `scale(${String(scale)})`,
        marginTop: vMargin,
        marginBottom: vMargin,
        marginLeft: hMargin,
        marginRight: hMargin,
      }}
    >
      {children}
    </div>
  )
}
