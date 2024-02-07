import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useInView } from 'react-intersection-observer'
import { io } from "socket.io-client"
import axios from "axios"
import styles from './mainpage.module.css'
import StyledMain from "../../components/mainpage/main.style"
import ServerIcon from "../../components/mainpage/server.style"
import Channel from "../../components/mainpage/channel.style"
import Chat from "../../components/mainpage/chat.style"
import StartMenu from "../../components/mainpage/start.style"
import StyledInput from "../../components/mainpage/input.style"
import Profile from "../../components/mainpage/profile.style"

import CreateServerSVG from '../../assets/imgs/create_server.svg'
import ArrowSVG from '../../assets/imgs/arrow.svg'
import ChannelType from '../../assets/imgs/channelType.png'

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
  const navigate = useNavigate()
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
  const [serverInfo, setServerInfo] = useState({
    ownerId: 0,
  })
  const [channels, setChannels] = useState([])
  const [current, setCurrent] = useState({
    server: '',
    channel: 0
  })
  const [joinUsers, setJoinUsers] = useState([])
  const [serverName, setServerName] = useState<string>('')
  const [joinKey, setJoinKey] = useState<string>('')
  const [msg, setMsg] = useState<string>('')
  const [chat, setChat] = useState<MessageInterface[]>([])
  const [oldChat, setOldChat] = useState<OldMessageInterface[]>([])
  const [next, setNext] = useState<number>(1)
  const [isServerWindow, setIsServerWindow] = useState<boolean>(false)
  const [inviteStep, setInviteStep] = useState<number>(0)
  const [inviteCode, setInviteCode] = useState<string>()
  const [createServerDto, setCreateServerDto] = useState({
    name: '',
    image: File
  })
  const [logoImage, setLogoImage] = useState<any>()
  const [logoPreview, setLogoPreview] = useState<string>()
  const [channelMenu, setChannelMenu] = useState<boolean>(false)
  const [createChannelWindow, setCreateChannelWindow] = useState<boolean>(false)
  const [copyUrlWindow, setCopyUrlWindow] = useState<boolean>(false)
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [createChannelName, setCreateChannelName] = useState<string>('')
  const [onlines, setOnlines] = useState<string[]>([])

  const [socket, setSocket] = useState(() => io('https://39.116.116.214:3000', {
    query: { userId: user.id }
  }))
  // Socket reset on user change
  useEffect(() => {
    const newSocket = io('https://39.116.116.214:3000', {
      query: { userId: user.id },
    })
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [user.id])

  const [view, inView] = useInView()
  const scrollRef = useRef<HTMLDivElement>(null)
  const serverLogoRef = useRef<HTMLInputElement>(null)

  const createChannel = async () => {
    await axios.post('/api/events/channel', {
      roomId: current.channel,
      name: createChannelName
    })

    getChannels(current.server)
    setCreateChannelName('')
    setCreateChannelWindow(false)
  }

  const joinServer = async () => {
    await axios.get(`/api/events/room/join/${inviteCode}`)
    window.location.href = '/'
  }

  const createServer = async () => {
    const formData = new FormData()
    formData.append('logo', logoImage)
    formData.append('name', createServerDto.name)

    axios.post('/api/events/room',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )
      .then(() => {
        window.location.href = '/'
      })
  }

  const uploadServerLogo = async () => {
    const file = serverLogoRef.current?.files![0]
    const reader = new FileReader()

    console.log(file)
    setLogoImage(file)

    reader.readAsDataURL(file!)
    reader.onloadend = () => {
      setLogoPreview(reader.result?.toString())
    }
  }

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
        setOldChat(res.body.reverse())
      })
  }

  const getChats = async (channelId: number) => {
    axios.get(`/api/events/chat/${channelId}/${next}`)
      .then((resp) => {
        const res = resp.data
        res.body.map((el: OldMessageInterface) => {
          oldChat.unshift(el)
          if (scrollRef.current) scrollRef.current.scrollTop += 50
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
        console.log(res.body.rooms)
      })
  }

  const getServerInfo = async (roomKey: string) => {
    const res = (await axios.get(`/api/events/room/${roomKey}`)).data.body
    setJoinUsers(res.users)
    setServerInfo({ ownerId: res.ownerId })

    return res
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

    // On any user on connect
    socket.on('onlineUsers', (users: string[]) => {
      console.table(users)
      setOnlines(users) 
    })

    return () => {
      socket.off('sendMessage', handleMessage)
      socket.disconnect()
    }
  }, [socket])

  // Current Change
  useEffect(() => {
    setJoinKey(`${current.server}/${current.channel}`)
    socket.emit('joinChannel', `${current.server}/${current.channel}`)

    setNext(1)
    initChat(current.channel)
    setChat([])

    const serverSets = async () => {
      const server = await getServerInfo(current.server)
      setServerName(server.name)
    }
    serverSets()
  }, [current, socket])

  // Chat Infinite Pagination
  useEffect(() => {
    if (inView) {
      getChats(current.channel)
    }
  }, [inView])

  // If Chat is Updated
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [chat])
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [oldChat])

  return (
    <StyledMain>
      {/* Create Server Window */}
      {isServerWindow ?
        (!inviteStep ? <div className={styles.windowContainer}>
          {isServerWindow ? <div className={styles.windowBG} onClick={() => setIsServerWindow(false)}></div> : null}
          <div className={styles.window}>
            <svg className={styles.x} onClick={() => setIsServerWindow(false)} aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>

            <div className={styles.title}>
              <h1>서버를 만들어보세요!</h1>
              <div>서버는 나와 친구들이 함께 어울리는 공간입니다. 내 서버를 만들고 대화를 시작해보세요.</div>
            </div>

            <div className={styles.createBtns}>
              <button className={styles.windowBtn} onClick={() => { setInviteStep(2); setCreateServerDto({ ...createServerDto, name: `${user.nickname}님의 서버` }) }}>
                <img className={styles.btnLogo} src={CreateServerSVG} alt="" />
                <div>직접 만들기</div>
                <img className={styles.arrowLogo} src={ArrowSVG} alt="" />
              </button>
            </div>

            <div className={styles.inviteContainer}>
              <h2>이미 초대장을 받으셨나요?</h2>
              <button onClick={() => setInviteStep(1)}>서버 참가하기</button>
            </div>
          </div>
        </div>
          : inviteStep === 1 ? // Join
            <div className={styles.windowContainer}>
              {isServerWindow ? <div className={styles.windowBG} onClick={() => { setIsServerWindow(false); setInviteStep(0) }}></div> : null}
              <div className={styles.windowInvite}>
                <svg className={styles.x} onClick={() => { setIsServerWindow(false); setInviteStep(0) }} aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>

                <div className={styles.title}>
                  <h1>서버 참가하기</h1>
                  <div>아래에 초대 코드를 입력하여 서버에 참가하세요.</div>
                </div>

                <div className={styles.linkContainer}>
                  <div className={styles.label}>초대 링크 <span>*</span></div>
                  <StyledInput type={'text'} placeholder={'Pi4qfVJrLU3'} onChange={(e: ChangeEvent<HTMLInputElement>) => setInviteCode(e.target.value)} />

                  <div className={styles.gap}></div>

                  <div className={styles.label}>초대는 다음 형태여야 해요.</div>
                  <div className={styles.inviteEx}>Pi4qfVJrLU3</div>
                </div>

                <div className={styles.inviteContainer2}>
                  <div onClick={() => setInviteStep(0)}>뒤로 가기</div>
                  <button onClick={joinServer}>서버 참가하기</button>
                </div>
              </div>
            </div>
            : <div className={styles.windowContainer}>
              {isServerWindow ? <div className={styles.windowBG} onClick={() => { setIsServerWindow(false); setInviteStep(0) }}></div> : null}
              <div className={styles.windowInvite}>
                <svg className={styles.x} onClick={() => { setIsServerWindow(false); setInviteStep(0) }} aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>

                <div className={styles.title}>
                  <h1>Customize Your Server</h1>
                  <div>새로운 서버에 이름과 아이콘을 부여해 개성을 드러내보세요. 나중에 언제든 바꿀 수 있어요.</div>
                </div>

                {logoPreview ? <img className={styles.logoUploaded} src={logoPreview} alt="" onClick={() => serverLogoRef.current?.click()} />
                  : <svg className={styles.logoUpload} onClick={() => serverLogoRef.current?.click()} width="80" height="80" viewBox="0 0 80 80" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M54.8694 2.85498C53.8065 2.4291 52.721 2.04752 51.6153 1.71253L51.3254 2.66957L51.0354 3.62661C51.9783 3.91227 52.9057 4.23362 53.8161 4.58911C54.1311 3.98753 54.4832 3.40847 54.8694 2.85498ZM75.4109 26.1839C76.0125 25.8689 76.5915 25.5168 77.145 25.1306C77.5709 26.1935 77.9525 27.279 78.2875 28.3847L77.3304 28.6746L76.3734 28.9646C76.0877 28.0217 75.7664 27.0943 75.4109 26.1839ZM78.8148 43.8253L79.8102 43.9222C79.9357 42.6318 80 41.3234 80 40C80 38.6766 79.9357 37.3682 79.8102 36.0778L78.8148 36.1747L77.8195 36.2715C77.9389 37.4977 78 38.7414 78 40C78 41.2586 77.9389 42.5023 77.8195 43.7285L78.8148 43.8253ZM43.8253 1.18515L43.9222 0.189853C42.6318 0.0642679 41.3234 0 40 0C38.6766 0 37.3682 0.064268 36.0778 0.189853L36.1747 1.18515L36.2715 2.18045C37.4977 2.06112 38.7414 2 40 2C41.2586 2 42.5023 2.06112 43.7285 2.18045L43.8253 1.18515ZM28.6746 2.66957L28.3847 1.71253C25.8549 2.47897 23.4312 3.48925 21.1408 4.71604L21.6129 5.59756L22.0851 6.47907C24.2606 5.3138 26.5624 4.35439 28.9646 3.62661L28.6746 2.66957ZM15.2587 9.85105L14.6239 9.0784C12.5996 10.7416 10.7416 12.5996 9.0784 14.6239L9.85105 15.2587L10.6237 15.8935C12.2042 13.9699 13.9699 12.2042 15.8935 10.6237L15.2587 9.85105ZM5.59756 21.6129L4.71604 21.1408C3.48925 23.4312 2.47897 25.8549 1.71253 28.3847L2.66957 28.6746L3.62661 28.9646C4.35439 26.5624 5.3138 24.2607 6.47907 22.0851L5.59756 21.6129ZM0 40C0 38.6766 0.0642679 37.3682 0.189853 36.0778L1.18515 36.1747L2.18045 36.2715C2.06112 37.4977 2 38.7414 2 40C2 41.2586 2.06112 42.5023 2.18045 43.7285L1.18515 43.8253L0.189853 43.9222C0.064268 42.6318 0 41.3234 0 40ZM2.66957 51.3254L1.71253 51.6153C2.47897 54.1451 3.48926 56.5688 4.71604 58.8592L5.59756 58.3871L6.47907 57.9149C5.3138 55.7394 4.35439 53.4376 3.62661 51.0354L2.66957 51.3254ZM9.85105 64.7413L9.0784 65.3761C10.7416 67.4004 12.5996 69.2584 14.6239 70.9216L15.2587 70.1489L15.8935 69.3763C13.9699 67.7958 12.2042 66.0301 10.6237 64.1065L9.85105 64.7413ZM21.6129 74.4024L21.1408 75.284C23.4312 76.5107 25.8549 77.521 28.3847 78.2875L28.6746 77.3304L28.9646 76.3734C26.5624 75.6456 24.2607 74.6862 22.0851 73.5209L21.6129 74.4024ZM36.1747 78.8148L36.0778 79.8102C37.3682 79.9357 38.6766 80 40 80C41.3234 80 42.6318 79.9357 43.9222 79.8102L43.8253 78.8148L43.7285 77.8195C42.5023 77.9389 41.2586 78 40 78C38.7414 78 37.4977 77.9389 36.2715 77.8195L36.1747 78.8148ZM51.3254 77.3304L51.6153 78.2875C54.1451 77.521 56.5688 76.5107 58.8592 75.284L58.3871 74.4024L57.9149 73.5209C55.7394 74.6862 53.4376 75.6456 51.0354 76.3734L51.3254 77.3304ZM64.7413 70.1489L65.3761 70.9216C67.4004 69.2584 69.2584 67.4004 70.9216 65.3761L70.1489 64.7413L69.3763 64.1065C67.7958 66.0301 66.0301 67.7958 64.1065 69.3763L64.7413 70.1489ZM74.4024 58.3871L75.284 58.8592C76.5107 56.5688 77.521 54.1451 78.2875 51.6153L77.3304 51.3254L76.3734 51.0354C75.6456 53.4375 74.6862 55.7393 73.5209 57.9149L74.4024 58.3871Z" fill="currentColor"></path><circle cx="68" cy="12" r="12" fill="#5865f2"></circle><path d="M73.3332 11.4075H68.5924V6.66675H67.4072V11.4075H62.6665V12.5927H67.4072V17.3334H68.5924V12.5927H73.3332V11.4075Z" fill="white"></path><path d="M40 29C37.794 29 36 30.794 36 33C36 35.207 37.794 37 40 37C42.206 37 44 35.207 44 33C44 30.795 42.206 29 40 29Z" fill="currentColor"></path><path d="M48 26.001H46.07C45.402 26.001 44.777 25.667 44.406 25.111L43.594 23.891C43.223 23.335 42.598 23 41.93 23H38.07C37.402 23 36.777 23.335 36.406 23.89L35.594 25.11C35.223 25.667 34.598 26 33.93 26H32C30.895 26 30 26.896 30 28V39C30 40.104 30.895 41 32 41H48C49.104 41 50 40.104 50 39V28C50 26.897 49.104 26.001 48 26.001ZM40 39C36.691 39 34 36.309 34 33C34 29.692 36.691 27 40 27C43.309 27 46 29.692 46 33C46 36.31 43.309 39 40 39Z" fill="currentColor"></path><path d="M24.6097 52.712V47.72H22.5457V52.736C22.5457 53.792 22.0777 54.404 21.1417 54.404C20.2177 54.404 19.7377 53.78 19.7377 52.712V47.72H17.6737V52.724C17.6737 55.04 19.0897 56.132 21.1177 56.132C23.1217 56.132 24.6097 55.016 24.6097 52.712ZM26.0314 56H28.0834V53.252H28.6114C30.6154 53.252 31.9474 52.292 31.9474 50.42C31.9474 48.62 30.7114 47.72 28.6954 47.72H26.0314V56ZM29.9554 50.456C29.9554 51.308 29.4514 51.704 28.5394 51.704H28.0594V49.268H28.5754C29.4874 49.268 29.9554 49.664 29.9554 50.456ZM37.8292 56L37.5532 54.224H35.0092V47.72H32.9572V56H37.8292ZM45.9558 51.848C45.9558 49.292 44.4078 47.564 42.0078 47.564C39.6078 47.564 38.0478 49.304 38.0478 51.872C38.0478 54.428 39.6078 56.156 41.9838 56.156C44.3958 56.156 45.9558 54.404 45.9558 51.848ZM43.8918 51.86C43.8918 53.504 43.1958 54.548 41.9958 54.548C40.8078 54.548 40.0998 53.504 40.0998 51.86C40.0998 50.216 40.8078 49.172 41.9958 49.172C43.1958 49.172 43.8918 50.216 43.8918 51.86ZM52.2916 56.084L54.3676 55.748L51.4876 47.684H49.2316L46.2556 56H48.2716L48.8236 54.284H51.6916L52.2916 56.084ZM50.2516 49.796L51.1756 52.676H49.3156L50.2516 49.796ZM62.5174 51.848C62.5174 49.388 61.0174 47.72 58.1374 47.72H55.2814V56H58.1854C60.9814 56 62.5174 54.308 62.5174 51.848ZM60.4534 51.86C60.4534 53.636 59.5414 54.404 58.0774 54.404H57.3334V49.316H58.0774C59.4814 49.316 60.4534 50.12 60.4534 51.86Z" fill="currentColor"></path></svg>}
                <input type="file" ref={serverLogoRef} style={{ display: 'none' }} onChange={uploadServerLogo} />

                <div className={styles.gap}></div>
                <div className={styles.gap}></div>

                <div className={styles.label}>서버 이름</div>
                <StyledInput type={'text'} value={createServerDto.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setCreateServerDto({ ...createServerDto, name: e.target.value })} />
                <div className={styles.policy}>서버를 만들면 Discord의 <strong>커뮤니티 지침</strong>에 동의하게 됩니다.</div>

                <div className={styles.gap}></div>

                <div className={styles.inviteContainer2}>
                  <div onClick={() => setInviteStep(0)}>뒤로 가기</div>
                  <button onClick={createServer}>만들기</button>
                </div>
              </div>
            </div>)
        : null}

      {/* Copy URL Window */}
      {copyUrlWindow ?
        <div className={styles.windowContainer}>
          <div className={styles.windowBG} onClick={() => setCopyUrlWindow(false)}></div>

          <div className={styles.copyWindow}>
            <div className={styles.copyWindowMenu}>
              <h1>친구를 {serverName} 그룹으로 초대하기</h1>
              <svg className={styles.copyX} onClick={() => setCopyUrlWindow(false)} aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
            </div>

            <div className={styles.copyContainer}>
              <input type="text" readOnly={true} value={`https://localhost:5173/invite/${current.server}`} />
              <button className={isCopied ? styles.copyBtnGreen : styles.copyBtn} onClick={async () => {
                await navigator.clipboard.writeText(`http://localhost:5173/invite/${current.server}`)
                setIsCopied(true)
                setTimeout(() => setIsCopied(false), 1000)
              }}>{isCopied ? '복사됨' : '복사'}</button>
            </div>
          </div>
        </div>
        : null}

      {/* Create Channel Window */}
      {createChannelWindow ?
        <div className={styles.windowContainer}>
          <div className={styles.windowBG} onClick={() => setCreateChannelWindow(false)}></div>

          <div className={styles.createChannelWindow}>
            <div className={styles.createChannelMenu}>
              채널 만들기
              <svg className={styles.createChannelX} onClick={() => setCreateChannelWindow(false)} aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
            </div>

            <label className={styles.createChannelLabel}>채널 유형</label>
            <img className={styles.createChannelType} src={ChannelType} alt="" />

            <label className={styles.createChannelLabel}>채널 이름</label>
            <div className={styles.createChannelInputContainer}>
              <svg className={styles.createChannelInputLogo} aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M10.99 3.16A1 1 0 1 0 9 2.84L8.15 8H4a1 1 0 0 0 0 2h3.82l-.67 4H3a1 1 0 1 0 0 2h3.82l-.8 4.84a1 1 0 0 0 1.97.32L8.85 16h4.97l-.8 4.84a1 1 0 0 0 1.97.32l.86-5.16H20a1 1 0 1 0 0-2h-3.82l.67-4H21a1 1 0 1 0 0-2h-3.82l.8-4.84a1 1 0 1 0-1.97-.32L15.15 8h-4.97l.8-4.84ZM14.15 14l.67-4H9.85l-.67 4h4.97Z" clipRule="evenodd"></path></svg>
              <input type="text" className={styles.createChannelInput} value={createChannelName} onChange={(e: ChangeEvent<HTMLInputElement>) => setCreateChannelName(e.target.value)} placeholder="새로운 채널" />
            </div>

            <div className={styles.createChannelBtns}>
              <button className={styles.createChannelBtnCancel} onClick={() => setCreateChannelWindow(false)}>취소</button>
              <button className={styles.createChannelBtnCreate} onClick={() => createChannel()}>채널 만들기</button>
            </div>
          </div>
        </div>
        : null}

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

          {/* Create Server Button */}
          <div className={styles.createServer} onClick={() => setIsServerWindow(true)}>
            <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M13 5a1 1 0 1 0-2 0v6H5a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2h-6V5Z"></path></svg>
          </div>
        </nav>

        {/* Channel Nav */}
        <div className={styles.channelNav}>
          {/* Channel Headers */}
          <header onClick={() => {
            if (channelMenu) setChannelMenu(false)
            else setChannelMenu(true)
          }}>
            <div className={styles.serverName}>{serverName}</div>

            {channelMenu ? <svg width='18' height='18' className={styles.channelNavBtn}><g fill="none" fillRule="evenodd"><path d="M0 0h18v18H0"></path><path stroke="currentColor" d="M4.5 4.5l9 9" strokeLinecap="round"></path><path stroke="currentColor" d="M13.5 4.5l-9 9" strokeLinecap="round"></path></g></svg>
              : <svg width='15' height='15' fill='#ffffff' className={styles.channelNavBtn} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" /></svg>}
          </header>

          {/* ServerMenu */}
          {channelMenu ?
            <div className={styles.channelMenu}>
              <div className={styles.channelMenuItem} onClick={() => { setCopyUrlWindow(true); setChannelMenu(false) }}>
                초대하기
                <svg className={styles.channelMenuIcon} aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width='18' height='18' fill="none" viewBox="0 0 24 24"><path d="M19 14a1 1 0 0 1 1 1v3h3a1 1 0 0 1 0 2h-3v3a1 1 0 0 1-2 0v-3h-3a1 1 0 1 1 0-2h3v-3a1 1 0 0 1 1-1Z" fill="currentColor"></path><path d="M16.83 12.93c.26-.27.26-.75-.08-.92A9.5 9.5 0 0 0 12.47 11h-.94A9.53 9.53 0 0 0 2 20.53c0 .81.66 1.47 1.47 1.47h.22c.24 0 .44-.17.5-.4.29-1.12.84-2.17 1.32-2.91.14-.21.43-.1.4.15l-.26 2.61c-.02.3.2.55.5.55h7.64c.12 0 .17-.31.06-.36C12.82 21.14 12 20.22 12 19a3 3 0 0 1 3-3h.5a.5.5 0 0 0 .5-.5V15c0-.8.31-1.53.83-2.07ZM12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" fill="currentColor"></path></svg>
              </div>
            </div>
            : null}

          <div className={styles.channelContainer}>
            <div>
              {channels.length ? <div className={styles.category}>
                채팅 채널
                {serverInfo.ownerId === user.id ? <svg className={styles.addChannelBtn} onClick={() => setCreateChannelWindow(true)} aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M13 6a1 1 0 1 0-2 0v5H6a1 1 0 1 0 0 2h5v5a1 1 0 1 0 2 0v-5h5a1 1 0 1 0 0-2h-5V6Z"></path></svg> : null}
              </div> : null}

              {/* Channels */}
              {channels.map((el: { name: string, id: number }, idx) => (
                <Channel key={idx} name={el.name} active={current.channel === el.id ? true : false}
                  onClick={() => {
                    setCurrent({ ...current, channel: el.id })
                  }} ></Channel>
              ))}
            </div>

            {channels.length === 0 ? <div className={styles.noChannel}></div> : null}

            <div className={styles.statusContainer}>
              <div className={styles.statusProfile}>
                <img src={`/api/files/avatar/${user.avatar}`} alt="" />
                <div className={styles.statusInfo}>
                  <div className={styles.statusName}>{user.login}</div>
                  <div className={styles.status}>온라인</div>
                </div>
              </div>
              <div className={styles.voiceMenu}>
                {/* Microphone */}
                <svg className={styles.microphone} aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a4 4 0 0 0-4 4v4a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4Z"></path><path fill="currentColor" d="M6 10a1 1 0 0 0-2 0 8 8 0 0 0 7 7.94V20H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-2.06A8 8 0 0 0 20 10a1 1 0 1 0-2 0 6 6 0 0 1-12 0Z"></path></svg>

                {/* Headset */}
                <svg className={styles.headset} aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3a9 9 0 0 0-8.95 10h1.87a5 5 0 0 1 4.1 2.13l1.37 1.97a3.1 3.1 0 0 1-.17 3.78 2.85 2.85 0 0 1-3.55.74 11 11 0 1 1 10.66 0c-1.27.71-2.73.23-3.55-.74a3.1 3.1 0 0 1-.17-3.78l1.38-1.97a5 5 0 0 1 4.1-2.13h1.86A9 9 0 0 0 12 3Z"></path></svg>

                {/* Setting */}
                <svg className={styles.setting} onClick={() => navigate('/setting')} aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path fill="var(--interactive-normal)" fillRule="evenodd" d="M10.56 1.1c-.46.05-.7.53-.64.98.18 1.16-.19 2.2-.98 2.53-.8.33-1.79-.15-2.49-1.1-.27-.36-.78-.52-1.14-.24-.77.59-1.45 1.27-2.04 2.04-.28.36-.12.87.24 1.14.96.7 1.43 1.7 1.1 2.49-.33.8-1.37 1.16-2.53.98-.45-.07-.93.18-.99.64a11.1 11.1 0 0 0 0 2.88c.06.46.54.7.99.64 1.16-.18 2.2.19 2.53.98.33.8-.14 1.79-1.1 2.49-.36.27-.52.78-.24 1.14.59.77 1.27 1.45 2.04 2.04.36.28.87.12 1.14-.24.7-.95 1.7-1.43 2.49-1.1.8.33 1.16 1.37.98 2.53-.07.45.18.93.64.99a11.1 11.1 0 0 0 2.88 0c.46-.06.7-.54.64-.99-.18-1.16.19-2.2.98-2.53.8-.33 1.79.14 2.49 1.1.27.36.78.52 1.14.24.77-.59 1.45-1.27 2.04-2.04.28-.36.12-.87-.24-1.14-.96-.7-1.43-1.7-1.1-2.49.33-.8 1.37-1.16 2.53-.98.45.07.93-.18.99-.64a11.1 11.1 0 0 0 0-2.88c-.06-.46-.54-.7-.99-.64-1.16.18-2.2-.19-2.53-.98-.33-.8.14-1.79 1.1-2.49.36-.27.52-.78.24-1.14a11.07 11.07 0 0 0-2.04-2.04c-.36-.28-.87-.12-1.14.24-.7.96-1.7 1.43-2.49 1.1-.8-.33-1.16-1.37-.98-2.53.07-.45-.18-.93-.64-.99a11.1 11.1 0 0 0-2.88 0ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clip-rule="evenodd"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Server Header */}
      <header className={styles.serverHeader}>
      </header>

      {/* Chats */}
      <div className={styles.chatContainer}>
        <div className={styles.ul} ref={scrollRef}>
          {/* Channel Start Menu */}
          {user.rooms.length ?
            <StartMenu name={serverName} />
            : null}

          <div className={styles.infinite} ref={view}></div>

          {oldChat.map((el: OldMessageInterface, idx) => (
            idx > 0 && oldChat[idx - 1].userId === oldChat[idx].userId ? <Chat key={idx} userId={el.userId} message={el.message} type={'mini'}></Chat> : <Chat key={idx} userId={el.userId} message={el.message} type={'normal'}></Chat>
          ))}

          {chat.map((msg: MessageInterface, idx) => (
            msg.joinKey === joinKey ? (idx > 0 && chat[idx - 1].userId === chat[idx].userId ? <Chat key={idx} userId={msg.userId} message={msg.msg} type={'mini'}></Chat> : <Chat key={idx} userId={msg.userId} message={msg.msg} type={'normal'}></Chat>) : null
          ))}
        </div>

        {user.rooms.length ?
          <form action='' className={styles.form} onSubmit={sendMessage}>
            <div className={styles.bar}>
              <div className={styles.upload}>
                <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#b5bac1" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="transparent"></circle><path fill="var(--interactive-normal)" fillRule="evenodd" d="M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22Zm0-17a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H7a1 1 0 1 1 0-2h4V7a1 1 0 0 1 1-1Z" clipRule="evenodd"></path></svg>
              </div>

              <input type="text" autoComplete='off' className={styles.input} placeholder={`#general에 메시지 보내기`} value={msg} onChange={(e: ChangeEvent<HTMLInputElement>) => setMsg(e.target.value)} />
            </div>
          </form>
          : null}
      </div>

      <aside className={styles.aside}>
        <div className={styles.gap}></div>
        <div className={styles.gap}></div>
        <div className={styles.gap}></div>
        <div className={styles.gap}></div>

        <div className={styles.asideOnline}>온라인 ㅡ { onlines.length }</div>
        {onlines.map((el) => (
          <Profile key={+el} userId={+el} type={'online'} />
        ))}

        <div className={styles.gap}></div>

        <div className={styles.asideOnline}>오프라인 ㅡ { joinUsers.length - onlines.length + 1 }</div>
        {joinUsers.map((el: { id: number }) => (
          !onlines.includes(el.id.toString()) ?
            <Profile key={el.id} userId={el.id} type={'offline'} />
        : null ))}
      </aside>
    </StyledMain>
  )
}

export default MainPage