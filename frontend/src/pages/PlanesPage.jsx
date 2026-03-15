import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlanesContext } from "../store/planesStore"
import { obtenerPlanes, crearPlan, eliminarPlan } from "../api/planes"
import { importarMaterias, crearMateria } from "../api/materias"
import ConfirmDialog from '../components/common/ConfirmDialog'
import Modal from '../components/common/Modal'
import Toast from '../components/common/Toast'
import MateriaForm from "../components/materias/MateriaForm"
import { Trash2, ArrowLeft } from "lucide-react"

function PlanesPage(){
    const navigate = useNavigate()
    const { planes, setPlanes } = useContext(PlanesContext)
    const [planCreado, setPlanCreado] = useState(null)
    const [error, setError] = useState(null)
    const [exito, setExito] = useState(null)
    const [vistaActiva, setVistaActiva] = useState(null)
    const [mostrarFormPlan, setMostrarFormPlan] = useState(false)
    const [confirmEliminar, setConfirmEliminar] = useState(null)
    const [archivoExcel, setArchivoExcel] = useState(null)

    const [formPlan, setFormPlan] = useState({
        nombre: "",
        institucion: "",
        tipo: "facultad",
        fecha_inicio: ""
    })

    const [formMateria, setFormMateria] = useState({
        nombre: "",
        anio: "",
        periodo: "",
        tipo: "obligatoria"
    })

    useEffect(() => {
        obtenerPlanes().then(data => setPlanes(data))
    }, [])

    const handleCrearPlan = () => {
        crearPlan(formPlan)
            .then(data => {
                setPlanes([...planes, data])
                setPlanCreado(data)
                setMostrarFormPlan(false)
                setError(null)
                setExito("Plan creado correctamente")
                setFormPlan({ nombre: "", institucion: "", tipo: "facultad", fecha_inicio: "" })
            })
            .catch(err => setError(err.response.data.detail))
    }

    const handleImportar = () => {
        if (!archivoExcel) return
        importarMaterias(planCreado.id, archivoExcel)
            .then(data => {
                setExito(data.detail)
                setArchivoExcel(null)
                setError(null)
                setVistaActiva(null)
            })
            .catch(err => {
                const detail = err.response.data.detail
                setError(typeof detail === "string" ? detail : JSON.stringify(detail))
            })
    }

    const handleCrearMateria = () => {
        crearMateria(planCreado.id, {
            ...formMateria,
            anio: parseInt(formMateria.anio),
            periodo: parseInt(formMateria.periodo)
        })
            .then(() => {
                setExito("Materia agregada correctamente")
                setError(null)
                setVistaActiva(null)
                setFormMateria({ nombre: "", anio: "", periodo: "", tipo: "obligatoria" })
            })
            .catch(err => {
                const detail = err.response.data.detail
                setError(typeof detail === "string" ? detail : JSON.stringify(detail))
            })
    }

    const handleEliminarPlan = (planId) => {
        eliminarPlan(planId)
            .then(() => {
                setPlanes(planes.filter(p => p.id !== planId))
                if (planCreado?.id === planId) setPlanCreado(null)
            })
            .catch(err => setError(err.response.data.detail))
    }

    return (
        <div style={{ padding: "24px" }}>
            <button className="ghost" onClick={() => navigate("/")}
                style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
                <ArrowLeft size={16} /> Dashboard
            </button>
            <h1>Planes</h1>

            {error && <Toast mensaje={error} tipo="error" onCerrar={() => setError(null)} />}
            {exito && <Toast mensaje={exito} tipo="exito" onCerrar={() => setExito(null)} />}
                
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                {planes.map(plan => (
                    <div key={plan.id} style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        padding: "16px",
                        transition: "border-color 0.2s ease"
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div onClick={() => navigate(`/planes/${plan.id}`)} style={{ cursor: "pointer" }}>
                                <h3 style={{ margin: 0 }}>{plan.nombre}</h3>
                                <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: 0 }}>{plan.institucion}</p>
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button onClick={(e) => {
                                    e.stopPropagation()
                                    setPlanCreado(planCreado?.id === plan.id ? null : plan)
                                    setVistaActiva(null)
                                }}>
                                    + Agregar materias
                                </button>
                                <button className="ghost" onClick={(e) => {
                                    e.stopPropagation()
                                    setConfirmEliminar(plan.id)
                                }}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        {planCreado?.id === plan.id && (
                            <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <button onClick={() => setVistaActiva(vistaActiva === "excel" ? null : "excel")}>
                                        Importar desde Excel
                                    </button>
                                    <button onClick={() => setVistaActiva(vistaActiva === "individual" ? null : "individual")}>
                                        + Agregar materia
                                    </button>
                                </div>

                                {vistaActiva === "excel" && (
                                    <div style={{ padding: "16px", background: "var(--bg-surface-2)", borderRadius: "8px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "12px" }}>
                                        <label style={{
                                            display: "inline-flex", alignItems: "center", gap: "8px",
                                            padding: "8px 14px", borderRadius: "6px",
                                            background: "var(--bg-surface)", border: "1px solid var(--border)",
                                            cursor: "pointer", color: "var(--text-primary)", fontSize: "13px"
                                        }}>
                                            {archivoExcel ? archivoExcel.name : "Elegir archivo Excel"}
                                            <input type="file" accept=".xlsx" style={{ display: "none" }}
                                                onChange={e => setArchivoExcel(e.target.files[0])} />
                                        </label>
                                        {archivoExcel && (
                                            <button onClick={handleImportar} style={{ alignSelf: "flex-start" }}>
                                                Confirmar subida
                                            </button>
                                        )}
                                    </div>
                                )}

                                {vistaActiva === "individual" && (
                                    <Modal titulo="Agregar materia" onCerrar={() => setVistaActiva(null)}>
                                        <MateriaForm
                                            form={formMateria}
                                            onChange={setFormMateria}
                                            onSubmit={handleCrearMateria}
                                            onCancelar={() => setVistaActiva(null)}
                                        />
                                    </Modal>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button onClick={() => setMostrarFormPlan(true)}>
                + Crear nuevo plan
            </button>

            {mostrarFormPlan && (
                <Modal titulo="Crear nuevo plan" onCerrar={() => setMostrarFormPlan(false)}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <input type="text" placeholder="Nombre" style={{ width: "100%" }}
                            value={formPlan.nombre}
                            onChange={e => setFormPlan({...formPlan, nombre: e.target.value})} />
                        <input type="text" placeholder="Institución" style={{ width: "100%" }}
                            value={formPlan.institucion}
                            onChange={e => setFormPlan({...formPlan, institucion: e.target.value})} />
                        <select style={{ width: "100%" }} value={formPlan.tipo}
                            onChange={e => setFormPlan({...formPlan, tipo: e.target.value})}>
                            <option value="facultad">Facultad</option>
                            <option value="idioma">Idioma</option>
                            <option value="capacitacion">Capacitación</option>
                        </select>
                        <input type="date" style={{ width: "100%" }}
                            value={formPlan.fecha_inicio}
                            onChange={e => setFormPlan({...formPlan, fecha_inicio: e.target.value})} />
                        <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                            <button onClick={handleCrearPlan}>Crear plan</button>
                            <button className="ghost" onClick={() => setMostrarFormPlan(false)}>Cancelar</button>
                        </div>
                    </div>
                </Modal>
            )}

            {confirmEliminar && (
                <ConfirmDialog
                    mensaje="¿Seguro que querés eliminar este plan? Se eliminarán todas las materias, evaluaciones y horarios asociados."
                    onConfirmar={() => {
                        handleEliminarPlan(confirmEliminar)
                        setConfirmEliminar(null)
                    }}
                    onCancelar={() => setConfirmEliminar(null)}
                />
            )}
        </div>
    )
}

export default PlanesPage