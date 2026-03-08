import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerMateria } from "../api/materias";
import { obtenerEvaluaciones } from "../api/evaluaciones";
import { obtenerHorarios } from "../api/horarios";

function MateriaDetalle(){
    const {materiaId} = useParams()
    const [materia, setMateria] = useState(null)
    const [evaluaciones, setEvaluaciones] = useState([])
    const [horarios, setHorarios] = useState([])

    useEffect(() => {
        obtenerMateria(materiaId).then(data => setMateria(data))
    }, [materiaId])

    useEffect(() =>{
        obtenerEvaluaciones(materiaId).then(data => setEvaluaciones(data))
    }, [materiaId])

    useEffect(() => {
        obtenerHorarios(materiaId).then(data => setHorarios(data))
    }, [materiaId])


    return (
        <div>
            <div>
                {materia && (
                    <div>
                        <h1>{materia.nombre}</h1>
                        <p>Estado : {materia.estado}</p>
                    </div>
                )}
                <h1>Evaluaciones</h1>
                {Array.isArray(evaluaciones) && evaluaciones.map(evaluacion => (
                    <div key={evaluacion.id}>
                        <p>{evaluacion.tipo}</p>
                        <p>{evaluacion.numero_de_instancia}</p>
                        <p>{evaluacion.fecha}</p>
                        <p>{evaluacion.estado}</p>
                    </div>
                ))}
            </div>
            <div>
                <h1>Horarios</h1>
                {Array.isArray(horarios) && horarios.map(horario => (
                    <div key={horario.id}>
                        <p>{horario.dia_semana}</p>
                        <p>{horario.hora_inicio}</p>
                        <p>{horario.hora_fin}</p>
                    </div>
                ))}
            </div>
        </div>

    )

}

export default MateriaDetalle