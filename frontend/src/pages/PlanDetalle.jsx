import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { obtenerMaterias } from "../api/materias"
import { obtenerRequisitosDelPlan } from "../api/planes"
import GrillaCurricular from "../components/materias/GrillaCurricular"
import MateriaBadge from "../components/materias/MateriaBadge"
import Spinner from "../components/common/Spinner"
import { ArrowLeft } from "lucide-react"


function PlanDetalle() {
    const { planId } = useParams()
    const navigate = useNavigate()
    const [materias, setMaterias] = useState([])
    const [requisitos, setRequisitos] = useState([])
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(null)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        Promise.all([
            obtenerMaterias(planId).then(setMaterias),
            obtenerRequisitosDelPlan(planId).then(setRequisitos)
        ]).then(() => setCargando(false))

    }, [planId])

    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = "auto"
        }
    }, [])

    if(cargando) return (
        <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "-24px", marginTop: "-24px", position:"relative" }}>
            <Spinner size={120} />
        </div>
    )
    return (
        <div style={{ display: "flex", width: "100%", height: "calc(100vh)", marginLeft: "-24px", marginTop: "-24px", position: "relative" }}>
            
            {/* Botón volver */}
            <div style={{ position: "absolute", top: "50px", left: "16px", zIndex: 10 }}>
                <button className="ghost" onClick={() => navigate("/planes")}
                    style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
                    <ArrowLeft size={16} /> Planes
                </button>
            </div>

            <div style={{ flex: 1 }}>
                <GrillaCurricular
                    materias={materias}
                    requisitos={requisitos}
                    onNodoClick={(node) => {
                        const materia = materias.find(m => String(m.id) === node.id)
                        setMateriaSeleccionada(materia)
                    }}
                />
            </div>

            {materiaSeleccionada && (
                <div style={{
                    width: "300px",
                    padding: "20px",
                    paddingTop: "80px",
                    paddingLeft: "-20px",
                    marginRight: "-50px",
                    borderLeft: "1px solid var(--border)",
                    background: "var(--bg-surface)",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h2 style={{ margin: 0 }}>{materiaSeleccionada.nombre}</h2>
                        <button className="ghost" onClick={() => setMateriaSeleccionada(null)}>✕</button>
                    </div>
                    <MateriaBadge estado={materiaSeleccionada.estado} />
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                        Año {materiaSeleccionada.anio} · Cuatrimestre {materiaSeleccionada.periodo}
                    </p>
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                        {materiaSeleccionada.tipo}
                    </p>
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                        Tipo de aprobación: {materiaSeleccionada.tipo_aprobacion ?? "No configurado"}
                    </p>
                    <button onClick={() => navigate(`/materias/${materiaSeleccionada.id}`)}>
                        Ver detalle →
                    </button>
                </div>
            )}
        </div>
    )
}

export default PlanDetalle