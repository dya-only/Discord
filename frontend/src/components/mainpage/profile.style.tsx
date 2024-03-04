import { useEffect, useState } from 'react'
import styled from '../../theme'
import axios from 'axios'

const Profile = (props: { userId: number, type: 'online' | 'offline' }) => {
  const [user, setUser] = useState({
    id: 0,
    avatar: '',
    bio: '',
    createdAt: '',
    email: '',
    login: '',
    nickname: ''
  })

  useEffect(() => {
    const getUser = async () => {
      axios.get(`https://discordsv.dya.codes/api/users/${props.userId}`)
        .then((resp) => {
          const res = resp.data
          setUser(res.body)
        })
    }
    getUser()
  }, [])

  return props.type === 'online' ? (
    <Online>
      <img src={`https://discordsv.dya.codes/api/files/avatar/${user.avatar || 'default.png'}`} alt="" />
      <div className='nickname'>{user.nickname}</div>
      <div className='statusContainer'>
        <div className='status' />
      </div>
    </Online>
  ) : <Offline>
    <img src={`https://discordsv.dya.codes/api/files/avatar/${user.avatar}`} alt="" />
    <div className='nickname'>{user.nickname}</div>
  </Offline>
}

const Online = styled.div`
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
    object-fit: cover;
  }

  .statusContainer {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: rgb(43, 45, 49);
    position: absolute;
    margin-left: 30px;
    margin-top: 20px;
  }

  .status {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #589d5f;
    margin-left: 3px;
    margin-top: 3px;
  }

  &:hover {
    background: #35373c;
  }
`

const Offline = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;
  width: 220px;
  height: 44px;
  padding: 1px 0;
  margin-left: 10px;
  opacity: 0.3;

  .nickname {
    font-weight: 500;
    color: white;
  }

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin: 0 12px;
    object-fit: cover;
  }

  &:hover {
    background: #35373c;
    opacity: 1;
  }
`

export default Profile