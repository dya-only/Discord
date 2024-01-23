import { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'

const Chat = (props: { userId: number, message: string, type: string }) => {
  const [user, setUser] = useState({
    id: 0,
    avatar: '',
    bio: '',
    createdAt: '',
    email: '',
    login: '',
    nickname: '',
  })

  useEffect(() => {
    const getUser = async () => {
      axios.get(`/api/users/${props.userId}`)
      .then((resp) => {
        const res = resp.data
        setUser(res.body)
      })
    }  

    getUser()
  }, [])
  
  return props.type === 'normal' ? ( 
    <StyledChat>
      <div className='profile'></div>
      
      <div className='texts'>
        <div className='nickname'>{ user.nickname }</div>
        <div className='message'>{ props.message }</div>
      </div>
    </StyledChat>
  ) : <StyledMiniChat>{ props.message }</StyledMiniChat>
}

const StyledChat = styled.div`
  width: 100%;
  padding: 12px 0 4px 12px;
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
    background: white;
    margin-right: 15px;
    object-fit: cover;
    cursor: pointer;
  }
`

const StyledMiniChat = styled.div`
  width: 100%;
  padding: 4px 12px 4px 67px;
  color: white;


  &:hover {
    background: #2f3035;
  }
`

export default Chat