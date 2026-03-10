import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PlanesPage from './pages/PlanesPage'
import MateriaDetalle from './pages/MateriaDetalle'
import PlanDetalle from './pages/PlanDetalle'
import Dashboard from './pages/Dashboard'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/planes" element={<PlanesPage/>}/>
        <Route path="/planes/:planId" element={<PlanDetalle/>}/>
        <Route path ="/materias/:materiaId" element={<MateriaDetalle/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
