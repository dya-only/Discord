import { Route, Routes } from 'react-router-dom'
import Login from './pages/login/login.page'
import MainPage from './pages/mainpage/main.page'
import Register from './pages/register/register.page'

const App = () => {
  return (
    <Routes>
      <Route element={<MainPage />} path='/' />
      <Route element={<Login />} path='/login' />
      <Route element={<Register />} path='/register' />
    </Routes>
  )
}

export default App