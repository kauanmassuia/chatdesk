// src/App.tsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Editor from './pages/Editor'
import ChatReader from './pages/ChatReader';
import PrivateRoute from './components/PrivateRoute';


function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/chat" element={<ChatReader />} />
        </Route>
        
      </Routes>
    </Layout>
  )
}

export default App
