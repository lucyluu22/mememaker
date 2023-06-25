import { PropsWithChildren } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  margin: 0;
`

const Title = styled.h2`
  display: inline-block;
  margin: 0;
  padding: 0 1rem;
  font-weight: bold;
  font-size: 1rem;
  background: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primaryBorder};
  border-bottom: none;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
`
const Content = styled.div`
  padding: 1rem;
  background: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primaryBorder};
  border-bottom-left-radius: 0.5rem;

  :not(${Title} + &) {
    border-top-left-radius: 0.5rem;
  }
`

type LayerPropertiesProps = {
  title?: string,
}

export function LayerProperties({
  children = null,
  title = '',
}: PropsWithChildren<LayerPropertiesProps>) {
  return (
    <Container>
      {title && <Title>{title}</Title>}
      <Content>
        {children}
      </Content>
    </Container>
  )
}
