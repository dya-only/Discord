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
      <img src={`/api/files/avatar/${this.props.avatar}`} alt="" />
      <div className='nickname'>{this.props.nickname}</div>
    </div>
  }
}

const Profile = styled(Element)`
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;
  width: 220px;
  height: 44px;
  padding: 1px 0;
  margin-left: 10px;

  .nickname {
    font-weight: 500;
    color: white;
  }

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin: 0 12px;
  }

  &:hover {
    background: #35373c;
  }
`

export default Profile
