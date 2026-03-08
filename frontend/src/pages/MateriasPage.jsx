import { useState, useEffect } from "react"
import {useParams} from "react-router-dom"
import {obtenerMaterias} from "../api/materias"

function MateriasPage(){
    const {planId} = useParams()
    const [materias, setMaterias] = useState([])

    useEffect(() => {
        obtenerMaterias(planId).then(data => setMaterias(data))
    }, [planId])

    return (
        <div>
            <h1>Materias</h1>
            {Array.isArray(materias) && materias.map(materia => (
                <div key={materia.id}>
                    <p>{materia.nombre}</p>
                </div>
            ))}
        </div>
    )
}

export default MateriasPage