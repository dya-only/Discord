import { useEffect, useState } from 'react'
import StyledMain from '../../components/setting/main.style'
import styles from './setting.module.css'
import axios from 'axios'

const Setting = () => {
  const [tab, setTab] = useState<number>(1)
  const [user, setUser] = useState<any>({})

  const getUser = async (userId: number) => {
    axios.get(`/api/users/${userId}`)
      .then((resp) => {
        const res = resp.data
        setUser(res.body)
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

  useEffect(() => {
    verify()
  }, [])

  return (
    <StyledMain>
      <section className={styles.sidebar}>
        <div className={styles.tag}>사용자 설정</div>

        <div className={tab === 1 ? styles.activesidebtn : styles.sidebtn} onClick={() => setTab(1)}>내 계정</div>
      </section>

      {/* Tab: 1 */}
      {tab === 1 ? <section className={styles.panel}>
        <div className={styles.panelMenu}>
          <h2>내 계정</h2>
          <div className={styles.xBtn}>
            <svg className={styles.xmark} aria-hidden="true" role="img" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
          </div>
        </div>

        <div className={styles.avatarContainer}>
          <div className={styles.avatarEditLogo}>
            <svg className={styles.editLogo} aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="white" d="m13.96 5.46 4.58 4.58a1 1 0 0 0 1.42 0l1.38-1.38a2 2 0 0 0 0-2.82l-3.18-3.18a2 2 0 0 0-2.82 0l-1.38 1.38a1 1 0 0 0 0 1.42ZM2.11 20.16l.73-4.22a3 3 0 0 1 .83-1.61l7.87-7.87a1 1 0 0 1 1.42 0l4.58 4.58a1 1 0 0 1 0 1.42l-7.87 7.87a3 3 0 0 1-1.6.83l-4.23.73a1.5 1.5 0 0 1-1.73-1.73Z"></path></svg>
          </div>
          <img className={styles.avatar} src={`/api/files/avatar/${user.avatar}`} alt="" />
        </div>
      </section> : null}
    </StyledMain>
  )
}

export default Setting