import { Component } from 'react'
import styled from '../../theme'

interface Props {
  className?: string,
  imageUrl?: string
}

class Element extends Component<Props, object> {
  render() {
    return <div className={this.props.className}></div>
  }
}

const ServerIcon = styled(Element)`
  ${ props => props.imageUrl ?
    `background-image: url(${props.imageUrl});`
    : 'background: rgb(49, 51, 56);'
  }
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
  border-radius: 50%;
  transition: all .3s;

  &:hover {
    cursor: pointer;
    border-radius: 16px;
    transition: all .3s;
  }
`

export default ServerIcon