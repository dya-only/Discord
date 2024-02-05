import { Component, ReactNode } from 'react'
import styled from '../../theme'

interface Props {
  className?: string,
  children: ReactNode
}

class Element extends Component<Props, object> {
  render() {
    return <main className={this.props.className}>{ this.props.children }</main>
  }
}

const StyledMain = styled(Element)`
  width: 100vw;
  height: 100vh;
  display: flex;
`

export default StyledMain