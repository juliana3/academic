import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PlanesPage from './pages/PlanesPage'
import MateriasPage from './pages/MateriasPage'
import MateriaDetalle from './pages/MateriaDetalle'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Dashboard</div>}/>
        <Route path="/planes" element={<PlanesPage/>}/>
        <Route path="/planes/:planId/materias" element={<MateriasPage/>}/>
        <Route path ="/materias/:materiaId" element={<MateriaDetalle/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
