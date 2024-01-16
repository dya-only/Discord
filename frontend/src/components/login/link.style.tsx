import { Component, ReactNode } from 'react'
import styled from '../../theme'
import { Link } from 'react-router-dom'

interface Props {
  to: string
  className?: string
  children: ReactNode
}

class Element extends Component<Props, object> {
  render() {
    return <Link to={this.props.to} className={this.props.className}>{ this.props.children }</Link>
  }
}

const StyledLink = styled(Element)`
  color: rgb(0, 168, 252);
  text-decoration: none;
  font-size: 14px;
`

export default StyledLink