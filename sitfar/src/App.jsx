import { useState } from 'react'
import {Route,Routes} from 'react-router-dom'
import Login from './routes/Login'
import Home from './routes/Home'
import Navbar from './components/Navbar'
import RequireAuth from './components/RequireAuth'

function App() {

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
        </Routes>
      </div>
    </>
  )
}

export default App
