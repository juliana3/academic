import { Routes, Route, useLocation } from 'react-router-dom'
import { useState } from 'react'
import PlanesPage from './pages/PlanesPage'
import MateriaDetalle from './pages/MateriaDetalle'
import PlanDetalle from './pages/PlanDetalle'
import Dashboard from './pages/Dashboard'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
    const [sidebarColapsado, setSidebarColapsado] = useState(false)
    const token = localStorage.getItem("token")
    const location = useLocation()
    const esLogin = location.pathname === "/login"

    return (
        <div style={{ display: "flex" }}>
            {token && !esLogin && (
                <Sidebar colapsado={sidebarColapsado} setColapsado={setSidebarColapsado} />
            )}
            <div style={{
                marginLeft: token && !esLogin ? (sidebarColapsado ? "60px" : "200px") : "0",
                padding: esLogin ? "0" : "24px",
                flex: 1,
                transition: "margin 0.2s ease"
            }}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/planes" element={<ProtectedRoute><PlanesPage /></ProtectedRoute>} />
                    <Route path="/planes/:planId" element={<ProtectedRoute><PlanDetalle /></ProtectedRoute>} />
                    <Route path="/materias/:materiaId" element={<ProtectedRoute><MateriaDetalle /></ProtectedRoute>} />
                </Routes>
            </div>
        </div>
    )
}

export default App