import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlanesContext } from "../store/planesStore"
import { obtenerPlanes, crearPlan, eliminarPlan } from "../api/planes"
import { importarMaterias, crearMateria } from "../api/materias"
import ConfirmDialog from '../components/common/ConfirmDialog'
import MateriaForm from "../components/materias/MateriaForm"
import { Trash2 } from "lucide-react"


function PlanesPage(){
    const navigate = useNavigate()
    const { planes, setPlanes } = useContext(PlanesContext)
    const [planCreado, setPlanCreado] = useState(null)
    const [error, setError] = useState(null)
    const [exito, setExito] = useState(null)
    const [vistaActiva, setVistaActiva] = useState(null)
    const [mostrarFormPlan, setMostrarFormPlan] = useState(false)
    const [confirmEliminar, setConfirmEliminar] = useState(null)

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
            })
            .catch(err => setError(err.response.data.detail))
    }

    const handleImportar = (e) => {
        const archivo = e.target.files[0]
        if (!archivo) return
        importarMaterias(planCreado.id, archivo)
            .then(data => {
                setExito(data.detail)
                setError(null)
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
        <div>
            <h1>Planes</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {exito && <p style={{ color: "green" }}>{exito}</p>}

            {planes.map(plan => (
                <div key={plan.id} style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "8px", marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p onClick={() => navigate(`/planes/${plan.id}`)}
                            style={{ cursor: "pointer", margin: 0 }}>
                            {plan.nombre} — {plan.institucion}
                        </p>
                        <div>
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
                        <div style={{ marginTop: "10px" }}>
                            <button onClick={() => setVistaActiva(vistaActiva === "excel" ? null : "excel")}>
                                Importar desde Excel
                            </button>
                            <button onClick={() => setVistaActiva(vistaActiva === "individual" ? null : "individual")}>
                                Agregar materia
                            </button>

                            {vistaActiva === "excel" && (
                                <div>
                                    <input type="file" accept=".xlsx" onChange={handleImportar} />
                                </div>
                            )}

                            {vistaActiva === "individual" && (
                                <div style={{ padding: "16px", background: "var(--bg-surface-2)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                                    <MateriaForm
                                        form={formMateria}
                                        onChange={setFormMateria}
                                        onSubmit={handleCrearMateria}
                                        onCancelar={() => setVistaActiva(null)}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}

            <button onClick={() => setMostrarFormPlan(!mostrarFormPlan)}>
                + Crear nuevo plan
            </button>

            {mostrarFormPlan && (
                <div>
                    <input type="text" placeholder="Nombre" value={formPlan.nombre}
                        onChange={e => setFormPlan({...formPlan, nombre: e.target.value})} />
                    <input type="text" placeholder="Institución" value={formPlan.institucion}
                        onChange={e => setFormPlan({...formPlan, institucion: e.target.value})} />
                    <select value={formPlan.tipo} onChange={e => setFormPlan({...formPlan, tipo: e.target.value})}>
                        <option value="facultad">Facultad</option>
                        <option value="idioma">Idioma</option>
                        <option value="capacitacion">Capacitación</option>
                    </select>
                    <input type="date" value={formPlan.fecha_inicio}
                        onChange={e => setFormPlan({...formPlan, fecha_inicio: e.target.value})} />
                    <button onClick={handleCrearPlan}>Crear plan</button>
                    <button onClick={() => setMostrarFormPlan(false)}>Cancelar</button>
                </div>
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