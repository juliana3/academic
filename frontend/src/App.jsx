import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PlanesPage from './pages/PlanesPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Dashboard</div>}/>
        <Route path="/planes" element={<PlanesPage/>}/>
        <Route path="/planes/:planId/materias" element={<div>Materias</div>}/>
        <Route path ="/materias/:materiaId" element={<div>Detalle materia</div>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
