import { Route, Routes } from 'react-router-dom'
import Login from './pages/login/login.page'
import MainPage from './pages/mainpage/main.page'
import Register from './pages/register/register.page'
import Join from './pages/join/join'

const App = () => {
  return (
    <Routes>
      <Route element={<MainPage />} path='/' />
      <Route element={<Login />} path='/login' />
      <Route element={<Register />} path='/register' />
      <Route element={<Join />} path='/join/:roomKey' />
    </Routes>
  )
}

export default App