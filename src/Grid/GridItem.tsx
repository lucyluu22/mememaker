import styled from 'styled-components'

type GridItemProps = {
  row?: boolean,
  column?: boolean,
  colStart?: number,
  colEnd?: number,
  rowStart?: number,
  rowEnd?: number,
  justify?: string,
  align?: string,
}

export default styled.div<GridItemProps>`
  grid-column-start: ${props => (props.row ? 'col-start' : props.colStart)};
  grid-column-end: ${props => (props.row ? 'col-end' : props.colEnd)};
  grid-row-start: ${props => (props.column ? 'row-start' : props.rowStart)};
  grid-row-end: ${props => (props.column ? 'row-end' : props.rowEnd)};
  justify-self: ${props => props.justify};
  align-self: ${props => props.align};
`
