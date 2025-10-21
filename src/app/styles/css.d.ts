import type * as CSS from "csstype"

declare module "csstype" {
  interface Properties {
    "--primary-color"?: CSS.Property.Color
    "--primary-color-darker"?: CSS.Property.Color
    "--primary-color-border"?: CSS.Property.Color
    "--primary-color-contrast"?: CSS.Property.Color
    "--on-primary-color"?: CSS.Property.Color
    "--secondary-color"?: CSS.Property.Color
    "--secondary-color-darker"?: CSS.Property.Color
    "--secondary-color-border"?: CSS.Property.Color
    "--on-secondary-color"?: CSS.Property.Color
    "--context-color-danger"?: CSS.Property.Color
    "--context-color-danger-border"?: CSS.Property.Color
    "--on-context-color-danger"?: CSS.Property.Color
    "--spacing-unit"?: CSS.Property.Padding
    "--thumb-size"?: CSS.Property.Width
    "--input-padding"?: CSS.Property.Padding
    "--border-radius"?: CSS.Property.BorderRadius
    "--shadow"?: CSS.Property.BoxShadow
  }
}
