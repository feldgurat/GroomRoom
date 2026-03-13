import './App.css'
import Header from './components/Header'
import Home from './pages/Home'
import About from './pages/About'
import Contacts from './pages/Contacts'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import { Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'

function App() {

  return (
    <div className='app'>
      <Header />

       <main style={{ minHeight: "70vh", padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
