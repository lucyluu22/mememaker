import { PropsWithChildren } from 'react'

type AdjustableViewScalerProps = {
  zoom?: number,
  contentWidth: number,
  contentHeight: number,
}

function AdjustableViewScaler({
  children = null, zoom = 100, contentWidth, contentHeight,
}: PropsWithChildren<AdjustableViewScalerProps>) {
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
        position: 'relative', // establish new block formatting context
        transform: `scale(${scale})`,
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

export default AdjustableViewScaler
