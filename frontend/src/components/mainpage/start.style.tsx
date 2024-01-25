import styled from 'styled-components'
import Start from '../../assets/start.png'

const StartMenu = (props: { name: string }) => { 
  return ( 
    <StyledStart>
      <h1>{ props.name }에<br/>오신 것을 환영합니다</h1>
      <div className='info'>새로운 서버에 오신 것을 환영해요. 처음에 알아두면 좋을 몇 가지를 알려 드릴게요! 자세한 정보는 시작하기 가이드를 확인해보세요.</div>
      <img src={Start} alt="" />
    </StyledStart>
  )
}

const StyledStart = styled.div`
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    color: white;
    font-size: 34px;
    font-weight: 700;
  }

  .info {
    width: 360px;
    color: rgb(181, 186, 193); 
    font-size: 15px;
    font-weight: 300;
    margin-bottom: 20px;
  }

  img {
    cursor: pointer;
    width: 380px;
  }
`

export default StartMenu