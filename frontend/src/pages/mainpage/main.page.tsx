import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import axios from "axios"
import styles from './mainpage.module.css'
import StyledMain from "../../components/mainpage/main.style"
import ServerIcon from "../../components/mainpage/server.style"
import Channel from "../../components/mainpage/channel.style"
import Chat from "../../components/mainpage/chat.style"
import { io } from "socket.io-client"
import { useInView } from 'react-intersection-observer'
import StartMenu from "../../components/mainpage/start.style"
// import ScrollToBottom from 'react-scroll-to-bottom'

interface MessageInterface {
  msg: string,
  joinKey: string,
  userId: number
}
interface OldMessageInterface {
  message: string,
  channelId: number,
  userId: number,
}

const MainPage = () => {
  const [socket] = useState(() => io('http://localhost:3000'))
  const [user, setUser] = useState({
    id: 0,
    avatar: '',
    bio: '',
    createdAt: '',
    email: '',
    login: '',
    nickname: '',
    rooms: []
  })
  const [channels, setChannels] = useState([])
  const [current, setCurrent] = useState({
    server: '',
    channel: 0
  })
  const [serverName, setServerName] = useState<string>('')
  const [joinKey, setJoinKey] = useState<string>('')
  const [msg, setMsg] = useState<string>('')
  const [chat, setChat] = useState<MessageInterface[]>([])
  const [oldChat, setOldChat] = useState<OldMessageInterface[]>([])
  const [next, setNext] = useState<number>(1)
  
  const [view, inView] = useInView()
  const scrollRef = useRef<HTMLDivElement>(null)

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault()

    if (msg) {
      socket.emit('sendMessage', { joinKey, msg, userId: user.id })
      
      axios.post('/api/events', {
        channelId: current.channel,
        message: msg
      }, { headers: { 'Content-Type': 'application/json' } })
      
      setMsg('')
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight 
    }
  }

  const initChat = async (channelId: number) => {
    axios.get(`/api/events/chat/${channelId}/0`)
    .then((resp) => {
      const res = resp.data
      setOldChat(res.body)
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight 
    })
  }

  const getChats = async (channelId: number) => {
    axios.get(`/api/events/chat/${channelId}/${next}`)
    .then((resp) => {
      const res = resp.data
      res.body.map((el: OldMessageInterface) => {
        oldChat.unshift(el)
        // if (scrollRef.current) scrollRef.current.scrollTo({ behavior: 'smooth' })
        if (scrollRef.current) scrollRef.current.scrollTop += 10
      })
      setNext(res.next)
    })

  }

  const getChannels = async (roomKey: string) => {
    axios.get(`/api/events/room/${roomKey}`)
      .then((resp) => {
        const res = resp.data
        setChannels(res.body.channels)
        setCurrent({ server: res.body.roomKey, channel: res.body.channels[0].id })

        setNext(1)
        initChat(res.body.id)
      })
  }

  const getUser = async (userId: number) => {
    axios.get(`/api/users/${userId}`)
      .then((resp) => {
        const res = resp.data
        setUser(res.body)
        getChannels(res.body.rooms[0].roomKey)
        setServerName(res.body.rooms[0].name)
      })
  }

  const verify = async () => {
    axios.get('/api/auth/status')
      .then((resp) => {
        const res = resp.data
        getUser(res.body.userId)
      })
      .catch(() => {
        window.location.href = '/login'
      })
  }

  // Auth
  useEffect(() => {
    verify()
  }, [])

  // Message Handler
  useEffect(() => {
    const handleMessage = (msg: MessageInterface) => {
      setChat((prev: MessageInterface[]) => [...prev, msg])
    }

    socket.on('sendMessage', handleMessage)

    return () => {
      socket.off('sendMessage', handleMessage)
    }
  }, [socket])

  // Current Change
  useEffect(() => {
    setJoinKey(`${current.server}/${current.channel}`)
    socket.emit('joinChannel', `${current.server}/${current.channel}`)

    setNext(1)
    initChat(current.channel)
    setChat([])

    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight 
  }, [current, socket])

  // Chat Infinite Pagination
  useEffect(() => {
    if (inView) {
      getChats(current.channel)

      // if (scrollRef.current) scrollRef.current.scrollTop += 200
    }
  }, [inView]) 

  return (
    <StyledMain>
      <div className={styles.panel}>
        <nav className={styles.nav}>

          {/* DM Button */}
          <div className={styles.dmContainer}>
            <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="#dbdee1" d="M19.73 4.87a18.2 18.2 0 0 0-4.6-1.44c-.21.4-.4.8-.58 1.21-1.69-.25-3.4-.25-5.1 0-.18-.41-.37-.82-.59-1.2-1.6.27-3.14.75-4.6 1.43A19.04 19.04 0 0 0 .96 17.7a18.43 18.43 0 0 0 5.63 2.87c.46-.62.86-1.28 1.2-1.98-.65-.25-1.29-.55-1.9-.92.17-.12.32-.24.47-.37 3.58 1.7 7.7 1.7 11.28 0l.46.37c-.6.36-1.25.67-1.9.92.35.7.75 1.35 1.2 1.98 2.03-.63 3.94-1.6 5.64-2.87.47-4.87-.78-9.09-3.3-12.83ZM8.3 15.12c-1.1 0-2-1.02-2-2.27 0-1.24.88-2.26 2-2.26s2.02 1.02 2 2.26c0 1.25-.89 2.27-2 2.27Zm7.4 0c-1.1 0-2-1.02-2-2.27 0-1.24.88-2.26 2-2.26s2.02 1.02 2 2.26c0 1.25-.88 2.27-2 2.27Z"></path></svg>
          </div>
          <div className={styles.hr} />

          {/* Server Icons */}
          {user.rooms.map((el: { name: string, image: string, roomKey: string }, idx) => ((
            <ServerIcon key={idx} name={el.name} imageUrl={el.image} active={current.server === el.roomKey ? true : false}
              onClick={() => {
                setCurrent({ ...current, server: el.roomKey })
                getChannels(el.roomKey)
              }} />
          )))}
        </nav>

        {/* Channel Nav */}
        <div className={styles.channelNav}>
          {/* Channel Headers */}
          <header>
            <div className={styles.serverName}>{ serverName }</div>
          </header>

          {/* Channels */}
          {channels.map((el: { name: string, id: number }, idx) => (
            <Channel key={idx} name={el.name} active={current.channel === el.id ? true : false}
              onClick={() => {
                setCurrent({ ...current, channel: el.id })
              }} ></Channel>
          ))
          }
        </div>
      </div>

      {/* Server Header */}
      <header className={styles.serverHeader}>
      </header>

      {/* Chats */}
      <div className={styles.chatContainer}>
        <div className={styles.ul} ref={scrollRef}>
          {/* Chat Start Menu */}
          <StartMenu name={serverName} />

          <div className={styles.infinite} ref={view}></div>

          {oldChat.map((el: OldMessageInterface, idx) => (
            idx > 0 && oldChat[idx - 1].userId === oldChat[idx].userId ? <Chat key={idx} userId={el.userId} message={el.message} type={'mini'}></Chat> : <Chat key={idx} userId={el.userId} message={el.message} type={'normal'}></Chat>
          ))}

          {chat.map((msg: MessageInterface, idx) => (
            msg.joinKey === joinKey ? ( idx > 0 && chat[idx - 1].userId === chat[idx].userId ? <Chat key={idx} userId={msg.userId} message={msg.msg} type={'mini'}></Chat> : <Chat key={idx} userId={msg.userId} message={msg.msg} type={'normal'}></Chat> ) : null
          ))}
        </div>

        <form action='' className={styles.form} onSubmit={sendMessage}>
          <div className={styles.bar}>
            <button className={styles.upload}>
              <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#b5bac1" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="transparent"></circle><path fill="var(--interactive-normal)" fillRule="evenodd" d="M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22Zm0-17a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H7a1 1 0 1 1 0-2h4V7a1 1 0 0 1 1-1Z" clipRule="evenodd"></path></svg>
            </button>

            <input type="text" autoComplete='off' className={styles.input} placeholder={`#general에 메시지 보내기`} value={msg} onChange={(e: ChangeEvent<HTMLInputElement>) => setMsg(e.target.value)} />
          </div>
        </form>
      </div>

      <aside className={styles.aside}></aside>
    </StyledMain>
  )
}

export default MainPage