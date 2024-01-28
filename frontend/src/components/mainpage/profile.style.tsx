import { Component, MouseEvent } from 'react'
import styled from '../../theme'

interface Props {
  className?: string,
  nickname: string,
  avatar: string,
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
}

class Element extends Component<Props, object> {
  render() {
    return <div className={this.props.className}>
      <img src={`/api/files/events/${this.props.avatar}`} alt="" />
      <div className='nickname'>{this.props.nickname}</div>
    </div>
  }
}

const Profile = styled(Element)`
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;

  .nickname {
    font-weight: bold;
    color: white;
  }
`

export default Profile