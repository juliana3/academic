import { ReactFlow } from "@xyflow/react"
import "@xyflow/react/dist/style.css" 
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { obtenerMaterias } from "../api/materias"
import {obtenerRequisitosDelPlan} from "../api/planes"


function PlanDetalle() {
    const navigate = useNavigate()
    const {planId} = useParams()
    const [materias, setMaterias] = useState([])
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(null)
    const [requisitos, setRequisitos] = useState([])

    useEffect(() => {
        obtenerMaterias(planId).then(data => {
            console.log(data),
            setMaterias(data)})
            obtenerRequisitosDelPlan(planId).then(data => setRequisitos(data))
    }, [planId])


    const coloresPorEstado = {
        sin_cursar: { background: "#cccccc", opacity: 0.5 },
        cursando: { background: "#4a90d9" },
        regular: { background: "#f5a623" },
        promocionada: { background: "#7ed321" },
        libre: { background: "#d0021b" },
        aprobada: { background: "#417505" }
    }
    const nodos = materias.map((materia) => {
        const materiasEnMismaPosicion = materias.filter(
            m => m.anio === materia.anio && m.periodo === materia.periodo
        )
        const posicionEnGrupo = materiasEnMismaPosicion.indexOf(materia)

        return {
            id: String(materia.id),
            position: {
                x: materia.periodo * 250,
                y: materia.anio *400 + posicionEnGrupo * 120
            },
            data : {label: materia.nombre},
            style: coloresPorEstado[materia.estado]
        }

    })
    const edges = requisitos.map(req => ({
        id: `${req.id_materia}-${req.id_materia_req}-${req.para}`,
        source: String(req.id_materia_req),
        target: String(req.id_materia),
        animated: req.para === "rendir_final",
        style: { stroke: req.para === "rendir_final" ? "#d0021b" : "#555" }
    }))


    return (
        <div style={{ display: "flex", width: "100%", height: "100vh" }}>
            <div style={{ flex: 1 }}>
                <ReactFlow 
                    nodes={nodos} 
                    edges={edges}
                    onNodeClick={(event, node) => {
                        const materia = materias.find(m => String(m.id) === node.id)
                        setMateriaSeleccionada(materia)
                    }}
                />
            </div>

            {materiaSeleccionada && (
                <div style={{ width: "300px", padding: "20px", borderLeft: "1px solid #ccc", overflowY: "auto" }}>
                    <button onClick={() => setMateriaSeleccionada(null)}>✕</button>
                    <h2>{materiaSeleccionada.nombre}</h2>
                    <p><b>Estado:</b> {materiaSeleccionada.estado}</p>
                    <p><b>Año:</b> {materiaSeleccionada.anio}</p>
                    <p><b>Cuatrimestre:</b> {materiaSeleccionada.periodo}</p>
                    <p><b>Tipo:</b> {materiaSeleccionada.tipo}</p>
                    <p><b>Tipo de aprobación:</b> {materiaSeleccionada.tipo_aprobacion ?? "No configurado"}</p>
                    <button onClick={() => navigate(`/materias/${materiaSeleccionada.id}`)}>
                        Ver detalle completo
                    </button>
                </div>
            )}
        </div>
    )
}

export default PlanDetalle