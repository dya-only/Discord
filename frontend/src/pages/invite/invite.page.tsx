import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import StyledMain from '../../components/invite/main.style'
import Artwork from '../../components/invite/artwork.style'
import styles from './invite.module.css'

const Join = () => {
  const { roomKey } = useParams()
  const [server, setServer] = useState({
    name: '',
    users: [],
    image: ''
  })

  const getServer = async () => {
    axios.get(`/api/events/room/${roomKey}`)
      .then((resp) => {
        const res = resp.data.body
        setServer(res)
      })
  }

  const verify = async () => {
    axios.get('/api/auth/status')
      .then(() => {
        getServer()
      })
      .catch(() => {
        window.location.href = '/login'
      })
  }

  const joinRoom = async () => {
    axios.get(`/api/events/room/join/${roomKey}`)
      .then(() => {
        window.location.href = '/'
      })
      .catch(() => {
        window.location.href = '/'
      })
  }

  useEffect(() => {
    verify()
  }, [])

  return (
    <StyledMain>
      <Artwork />

      <div className={styles.window}>
        <img className={styles.logo} src={`/api/files/events/${server.image}`} alt="" />
        <h1>{ server.name }</h1>
        <div className={styles.status}>
          <div className={styles.i}></div>
          <span>멤버 { server.users.length }명</span>
        </div>

        <button className={styles.btn} onClick={joinRoom}>초대 수락하기</button>
      </div>
    </StyledMain>
  )
}

export default Join