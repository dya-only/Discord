import { useEffect, useState } from "react"
import axios from "axios"
import styles from './mainpage.module.css'
import StyledMain from "../../components/mainpage/main.style"
import ServerIcon from "../../components/mainpage/server.style"
import Channel from "../../components/mainpage/channel.style"
import Chat from "../../components/mainpage/chat.style"

const MainPage = () => {
  const [user, setUser] = useState()

  const verify = () => {
    axios.get('/api/auth/status')
      .then((resp) => {
        const res = resp.data
        setUser(res.body.id)
        console.log(user)
      })
      .catch(() => {
        window.location.href = '/login'
      })
  }

  useEffect(() => {
    verify()
  }, [])

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
          <ServerIcon></ServerIcon>
          <ServerIcon></ServerIcon>
          <ServerIcon></ServerIcon>
          <ServerIcon></ServerIcon>
          <ServerIcon></ServerIcon>
          <ServerIcon></ServerIcon>
          <ServerIcon></ServerIcon>
          <ServerIcon></ServerIcon>
          <ServerIcon></ServerIcon>
          <ServerIcon></ServerIcon>
          <ServerIcon></ServerIcon>
          <ServerIcon></ServerIcon>
          <ServerIcon></ServerIcon>
          <ServerIcon></ServerIcon>
          <ServerIcon></ServerIcon>
          <ServerIcon></ServerIcon>
          <ServerIcon></ServerIcon>
          <ServerIcon></ServerIcon>
          <ServerIcon></ServerIcon>
          <ServerIcon></ServerIcon>
          <ServerIcon></ServerIcon>
          <ServerIcon></ServerIcon>
        </nav>

        {/* Channel Nav */}
        <div className={styles.channelNav}>
          {/* Channel Headers */}
          <header>
          </header>

          <Channel name={'general'}></Channel>
        </div>
      </div>

      {/* Server Header */}
      <header className={styles.serverHeader}>
      </header>

      <div className={styles.chatContainer}>
        <div className={styles.ul}>
          <Chat profile='../../assets/profile.png' nickname='Discord' message="ping!"></Chat>
          <Chat profile='../../assets/profile.png' nickname='Discord' message="ping!"></Chat>
          <Chat profile='../../assets/profile.png' nickname='Discord' message="ping!"></Chat>
        </div>

        <form action='' className={styles.form}>
          <div className={styles.bar}>
            <button className={styles.upload}>
              <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#b5bac1" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="transparent"></circle><path fill="var(--interactive-normal)" fillRule="evenodd" d="M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22Zm0-17a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H7a1 1 0 1 1 0-2h4V7a1 1 0 0 1 1-1Z" clipRule="evenodd"></path></svg>
            </button>

            <input type="text" className={styles.input} placeholder="#general에 메시지 보내기" />
          </div>
        </form>
      </div>

      <aside className={styles.aside}></aside>
    </StyledMain>
  )
}

export default MainPage