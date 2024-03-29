import { Component, MouseEvent } from 'react'
import styled from '../../theme'

interface Props {
  className?: string,
  name: string,
  imageUrl?: string,
  active: boolean,
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
}

class Element extends Component<Props, object> {
  render() {
    return <div className={this.props.className} onClick={this.props.onClick}>{ this.props.imageUrl === 'default.png' ? this.props.name[0] : null }</div>
  }
}

const ServerIcon = styled(Element)`
  display: flex;
  justify-content: center;
  line-height: 45px;
  ${ props => props.imageUrl !== 'default.png' ?
    `background-image: url('/api/files/events/${props.imageUrl}');`
    : 'background: rgb(49, 51, 56);'
  }
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  color: rgb(219, 222, 225);
  font-size: 18px;
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
  border-radius: ${ props => props.active ? '16px' : '50%' };
  ${ props => props.active && props.imageUrl === 'default.png' ? 'background: #686bff;' : null }
  transition: all .3s;

  &:hover {
    ${ props => props.active && props.imageUrl === 'default.png' ? 'background: #686bff;' : null }
    cursor: pointer;
    border-radius: 16px;
    transition: all .3s;
  }
`

export default ServerIcon