import { Component, ReactNode } from 'react'
import styled from '../../theme'

interface Props {
  className?: string,
  children: ReactNode
}

class Element extends Component<Props, object> {
  render() {
    return <button className={this.props.className}>{ this.props.children }</button>
  }
}

const StyledButton = styled(Element)`
  background: rgb(88, 101, 242);
  color: white;
  cursor: pointer;
  font-size: 16px;
  padding: 2px 16px;
  text-align: center;
  outline: none;
  border: none;
  border-radius: 4px;
  width: 417px;
  height: 44px;
`

export default StyledButton