import { Component } from 'react'
import styled from '../../theme'

interface Props {
  className?: string,
  profile: string,
  nickname: string,
  message: string
}

class Element extends Component<Props, object> {
  render() {
    return <div className={this.props.className}>
      <div className='profile'></div>
    </div>
  }
}

const Chat = styled(Element)`
  width: 100%;
  padding: 12px;
  display: flex;
  align-items: center;
  color: white;

  &:hover {
    background: #2f3035;
  }

  .profile {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: url(${props => props.profile})
    object-fit: cover;
  }
`

export default Chat