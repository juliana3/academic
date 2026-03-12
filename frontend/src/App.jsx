import {  Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import PlanesPage from './pages/PlanesPage'
import MateriaDetalle from './pages/MateriaDetalle'
import PlanDetalle from './pages/PlanDetalle'
import Dashboard from './pages/Dashboard'
import Sidebar from './components/Sidebar'


function App() {
  const [sidebarColapsado, setSidebarColapsado] = useState(false)

  return (
      <div style={{ display: "flex" }}>
          <Sidebar colapsado={sidebarColapsado} setColapsado={setSidebarColapsado} />
          <div style={{ marginLeft: sidebarColapsado ? "60px" : "200px", padding: "24px", flex: 1, transition: "margin 0.2s ease" }}>
              <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/planes" element={<PlanesPage />} />
                  <Route path="/planes/:planId" element={<PlanDetalle />} />
                  <Route path="/materias/:materiaId" element={<MateriaDetalle />} />
              </Routes>
          </div>
      </div>
  )
}

export default App
