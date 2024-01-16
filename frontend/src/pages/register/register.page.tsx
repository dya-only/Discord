import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Artwork from '../../components/login/artwork.style'
import StyledButton from '../../components/login/button.style'
import StyledInput from '../../components/login/input.style'
import StyledMain from '../../components/login/main.style'
import styles from './register.module.css'
import axios from 'axios'
import StyledLink from '../../components/login/link.style'

const Register = () => {
  const [user, setUser] = useState({
    email: '',
    nickname: '',
    login: '',
    password: ''
  })

  const getRegister = (e: FormEvent) => {
    e.preventDefault()

    axios.post('/api/users', {
      email: user.email,
      nickname: user.nickname === '' ? user.login : user.nickname,
      login: user.login,
      password: user.password
    }, {
      headers: { 'Content-Type': 'application/json' }
    }).then((resp) => {
      const res = resp.data

      if (res.success) window.location.href = '/login' 
    })
  }

  const verify = () => {
    axios.get('/api/auth/status')
    .then((resp) => {
      const res = resp.data
      if (res.success) window.location.href = '/'
    })
  }

  useEffect(() => {
    verify()
  }, [])

  return (
    <StyledMain>

      {/* Artwork */}
      <Artwork />

      {/* Form */}
      <form onSubmit={getRegister} action=''>
        <div className={styles.tab}>
          <h1>계정 만들기</h1>
          <div className={styles.gap}></div>

          <label>이메일<span>*</span></label>
          <StyledInput type={'email'} onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, email: e.target.value })} />
          <div className={styles.gap}></div>
          
          <label>별명<span></span></label>
          <StyledInput type={'text'} onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, nickname: e.target.value })} />
          <div className={styles.gap}></div>

          <label>사용자명<span>*</span></label>
          <StyledInput type={'text'} onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, login: e.target.value })} />
          <div className={styles.gap}></div>

          <label>비밀번호<span>*</span></label>
          <StyledInput type={'password'} onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, password: e.target.value })} />
          <div className={styles.gap}></div>

          <StyledButton type='submit'>계속하기</StyledButton>
          <div className={styles.info}>등록하는 순간 Discord의 <span>서비스 이용 약관</span>과 <span>개인정보 보호 정책</span>에 동의하게 됩니다.</div> 
          <div className={styles.gap}></div>

          <StyledLink to={'/login'} className={styles.to}>이미 계정이 있으신가요?</StyledLink>
        </div>
      </form>
    </StyledMain>
  )
}

export default Register