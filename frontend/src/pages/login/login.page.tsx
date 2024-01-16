import styles from './login.module.css'
import Artwork from '../../components/login/artwork.style'
import StyledMain from '../../components/login/main.style'
import StyledInput from '../../components/login/input.style'
import StyledLink from '../../components/login/link.style'
import StyledButton from '../../components/login/button.style'

const Login = () => {

  const getLogin =  () => {

  }

  return (
    <StyledMain>
      {/* Artwork */}
      <Artwork />

      {/* Form */}
      <form onSubmit={getLogin} action=''>

        {/* Login Tab */}
        <div className={styles.tab}>
          <h1>돌아오신 것을 환영해요!</h1>
          <div className={styles.subt}>다시 만나다니 너무 반가워요!</div>

          <label>이메일 또는 전화번호<span>*</span></label>
          <StyledInput type={'text'} />
          <div className={styles.gap}></div>

          <label>비밀번호<span>*</span></label>
          <StyledInput type={'password'} />
          <div className={styles.element}>
            <StyledLink to={'/'}>비밀번호를 잊으셨나요?</StyledLink>
          </div>
          <div className={styles.gap}></div>

          <StyledButton>로그인</StyledButton>
          <div className={styles.label}>계정이 필요한가요? <span> <StyledLink to={'/signup'}>가입하기</StyledLink> </span></div>
        </div>

        {/* QR Tab */}
        <div className={styles.tab2}>
          <div className={styles.loading}></div>
          <h2>QR 코드로 로그인</h2>
          <div className={styles.info}><strong>Discord 모바일 앱</strong>으로 스캔해 바로 로그인하세요.</div>
        </div>

      </form>
    </StyledMain>
  )
}

export default Login