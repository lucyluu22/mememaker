import { PropsWithChildren } from 'react'
import styled from 'styled-components'

type GridContainerProps = {
  columns?: string[],
  rows?: string[],
}

const Container = styled.div<Required<GridContainerProps>>`
  display: grid;
  grid-template-columns: [col-start] ${props => props.columns.join(' ')} [col-end];
  grid-template-rows: [row-start] ${props => props.rows.join(' ')} [row-end];
  grid-gap: 0.5rem;

  & + & {
    margin-top: 0.5rem;
  }
`

function GridContainer({ columns = ['auto'], rows = ['auto'], children = null }: PropsWithChildren<GridContainerProps>) {
  return (
    <Container columns={columns} rows={rows}>
      {children}
    </Container>
  )
}

export default GridContainer
