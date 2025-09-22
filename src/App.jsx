import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NotFound from './pages/NotFound'
import Layout from './layouts/Layout'
import MapView from './pages/MapView'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Clients from './pages/Clients'
import Analytics from './pages/Analytics'
import Setting from './pages/Setting'
import Profile from './pages/Profile'
import Shop from './pages/Shop'

const App = () => {
  return (
    <Routes>

      <Route path="*" element={<NotFound />} />
      <Route path='/' element={<Layout />} >
        <Route path="/map" element={<MapView />} />
        <Route index element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/superdashboard" element={<Dashboard />} />
        <Route path="/superdashboard" element={<Dashboard />} />
        <Route path="/superaiconnect" element={<Dashboard />} />
        <Route path="/supershopdashboard" element={<Dashboard />} />

      </Route>

    </Routes>
  )
}

export default App