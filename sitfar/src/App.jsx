import { useContext, useState } from 'react'
import {Route,Routes} from 'react-router-dom'
import Login from './routes/Login'
import Home from './routes/Home'
import Register from './routes/Register'
import Navbar from './components/Navbar'
import RequireAuth from './components/RequireAuth'
import { UserContext } from './context/userProvider'

function App() {

  const {user}=useContext(UserContext);

  if(user===false){
    return <p>Loading....</p>
  }

  return (
    <>
      <div>
        <Navbar />
        <h1>App </h1>
        <Routes>
          <Route path="/" element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          } 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  )
}

export default App
