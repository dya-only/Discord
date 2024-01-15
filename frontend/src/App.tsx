import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import axios from 'axios'
import './App.css'

interface MessageInterface {
  message: string,
  roomKey: string,
  userId: number
}

function App() {
  const [socket] = useState(() => io('http://localhost:3000')) // 서버 주소
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState<MessageInterface[]>([])

  useEffect(() => {
    socket.emit('joinRoom', 'asdf')
    axios.get(`/api/events/${'asdf'}`)
      .then((resp) => {
        const res = resp.data
        console.log(res)

        setChat(res.body)
      })
  }, [])

  useEffect(() => {
    const handleMessage = (msg: MessageInterface) => {
      setChat((prevChat: MessageInterface[]) => [...prevChat, msg])
    }
  
    socket.on('sendMessage', handleMessage)
  
    return () => {
      socket.off('sendMessage', handleMessage)
    }
  }, [socket])

  const sendMessage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (message) {
      socket.emit('sendMessage', { roomKey: 'asdf', message })

      axios.post('/api/events', {
        roomKey: 'asdf',
        message
      }, {
        headers: { 'Content-Type': 'application/json' }
      }).then((resp) => {
        console.log(resp.data)
      })

      setMessage('')
    }
  }
  return (
    <div>
      <ul id="messages">
        { chat.map((msg: MessageInterface, index) => (
          <li key={index}>{msg.message}</li>
        ) )}
      </ul>
      <form id='form' action=''>
        <input id="input" autoComplete="off" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </form>
    </div>
  )
}

export default App
