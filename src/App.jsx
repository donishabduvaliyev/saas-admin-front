import React, { useEffect } from 'react'
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
import useAuthStore from './store/auth'
import ProtectedRoute from './components/ProtectedRoute'
import BroadCast from './pages/BroadCast'
import Login from './pages/LogIn'

const protectedRoutes = [

  { path: "/superDashboard", Componetn: <Dashboard />, role: "superadmin" },
  { path: "/superAnalytics", Componetn: <Dashboard />, role: "superadmin" },
  { path: "/superAIconnect", Componetn: <Dashboard />, role: "superadmin" },
  { path: "/superShops", Componetn: <Dashboard />, role: "superadmin" },
  { path: "/superBroadCast", Componetn: <Dashboard />, role: "superadmin" },

]



const App = () => {

  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);


  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="*" element={<NotFound />} />
      <Route path='/' element={<Layout />} >
        <Route path="/map" element={<ProtectedRoute role="shopowner"><MapView /></ProtectedRoute>} />
        <Route index element={<ProtectedRoute role="superadmin"><Home /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute role="shopowner"><Dashboard /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute role="shopowner"><Orders /></ProtectedRoute>} />
        <Route path="/clients" element={<ProtectedRoute role="shopowner"><Clients /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute role="shopowner"><Analytics /></ProtectedRoute>} />
        <Route path="/setting" element={<ProtectedRoute role="shopowner"><Setting /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute role="shopowner"><Profile /></ProtectedRoute>} />
        <Route path="/shop" element={<ProtectedRoute role="shopowner"><Shop /></ProtectedRoute>} />
        <Route path="/broadCast" element={<ProtectedRoute role="shopowner" ><BroadCast /></ProtectedRoute>} />




        {protectedRoutes.map(({ path, Componetn, role }, i) => (
          <Route
            key={i}
            path={path}
            element={<ProtectedRoute role={role}>{Componetn}</ProtectedRoute>}
          />
        ))}

      </Route>

    </Routes>
  )
}

export default App