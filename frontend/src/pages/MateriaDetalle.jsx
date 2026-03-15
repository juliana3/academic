import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil, Trash2, ArrowLeft, Settings } from "lucide-react";
import { obtenerMateria, inscribirMateria, reinscribirMateria, aprobarMateria, actualizarMateria } from "../api/materias";
import { obtenerEvaluaciones, crearEvaluacion, eliminarEvaluacion, actualizarEvaluacion } from "../api/evaluaciones";
import { obtenerHorarios, crearHorario, eliminarHorario, actualizarHorario } from "../api/horarios";
import EvaluacionForm from "../components/evaluaciones/EvaluacionForm";
import HorarioForm from "../components/horarios/HorarioForm";
import MateriaBadge from "../components/materias/MateriaBadge";
import MateriaConfigForm from "../components/materias/MateriaConfigForm";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Modal from "../components/common/Modal";

function MateriaDetalle(){
    const navigate = useNavigate()
    const {materiaId} = useParams()
    const [materia, setMateria] = useState(null)
    const [evaluaciones, setEvaluaciones] = useState([])
    const [horarios, setHorarios] = useState([])
    const [error, setError] = useState(null)
    const [evaluacionEditando, setEvaluacionEditando] = useState(null)
    const [horarioEditando, setHorarioEditando] = useState(null)
    const [formularioActivo, setFormularioActivo] = useState(null)
    const [confirmEliminar, setConfirmEliminar] = useState(null)
    const [modalAprobar, setModalAprobar] = useState(false)
    const [notaFinal, setNotaFinal] = useState("")
    const [modalEditar, setModalEditar] = useState(false)
    const [formEditar, setFormEditar] = useState(null)

    const [formEvaluacion, setFormEvaluacion] = useState({
        tipo: "parcial",
        numero_de_instancia: "",
        fecha: "",
        nota: "",
        estado: "pendiente"
    })

    const [formHorario, setFormHorario] = useState({
        dia_semana: "lunes",
        hora_inicio: "",
        hora_fin: "",
        nombre: ""
    })

    const handleInscribir = () => {
        inscribirMateria(materiaId).then(data => {
            setMateria(data)
            setError(null)
        }).catch(err => setError(err.response.data.detail))
    }

    const handleReinscribir = () => {
        reinscribirMateria(materiaId).then(data => {
            setMateria(data)
            setError(null)
        }).catch(err => setError(err.response.data.detail))
    }

    const handleAprobar = () => {
        aprobarMateria(materiaId, notaFinal === "" ? null : parseFloat(notaFinal))
            .then(data => {
                setMateria(data)
                setModalAprobar(false)
                setNotaFinal("")
                setError(null)
            }).catch(err => setError(err.response.data.detail))
    }

    const handleAbrirEditar = () => {
        setFormEditar({
            tipo: materia.tipo,
            tipo_aprobacion: materia.tipo_aprobacion ?? "",
            nota_minima_parcial_regular: materia.nota_minima_parcial_regular ?? "",
            promedio_minimo_parciales_regular: materia.promedio_minimo_parciales_regular ?? "",
            nota_minima_parcial_promocion: materia.nota_minima_parcial_promocion ?? "",
            promedio_minimo_parciales_promocion: materia.promedio_minimo_parciales_promocion ?? "",
            cantidad_minima_tp_aprobados: materia.cantidad_minima_tp_aprobados ?? "",
            nota_minima_final: materia.nota_minima_final ?? ""
        })
        setModalEditar(true)
    }

    const handleGuardarEditar = () => {
        const datos = {
            ...formEditar,
            nota_minima_parcial_regular: formEditar.nota_minima_parcial_regular === "" ? null : parseFloat(formEditar.nota_minima_parcial_regular),
            promedio_minimo_parciales_regular: formEditar.promedio_minimo_parciales_regular === "" ? null : parseFloat(formEditar.promedio_minimo_parciales_regular),
            nota_minima_parcial_promocion: formEditar.nota_minima_parcial_promocion === "" ? null : parseFloat(formEditar.nota_minima_parcial_promocion),
            promedio_minimo_parciales_promocion: formEditar.promedio_minimo_parciales_promocion === "" ? null : parseFloat(formEditar.promedio_minimo_parciales_promocion),
            cantidad_minima_tp_aprobados: formEditar.cantidad_minima_tp_aprobados === "" ? null : parseInt(formEditar.cantidad_minima_tp_aprobados),
            nota_minima_final: formEditar.nota_minima_final === "" ? null : parseFloat(formEditar.nota_minima_final),
            tipo_aprobacion: formEditar.tipo_aprobacion === "" ? null : formEditar.tipo_aprobacion
        }
        actualizarMateria(materiaId, datos)
            .then(data => {
                setMateria(data)
                setModalEditar(false)
                setError(null)
            })
            .catch(err => setError(err.response.data.detail))
    }

    const handleEvaluacion = () => {
        const datos = {
            ...formEvaluacion,
            nota: formEvaluacion.nota === "" ? null : parseFloat(formEvaluacion.nota),
            numero_de_instancia: formEvaluacion.numero_de_instancia === "" ? null : parseInt(formEvaluacion.numero_de_instancia)
        }
        crearEvaluacion(materiaId, datos)
            .then(data => {
                setEvaluaciones([...evaluaciones, data.evaluacion])
                setMateria(data.materia)
                setFormularioActivo(null)
                setError(null)
            })
            .catch(err => {
                const detail = err.response.data.detail
                setError(typeof detail === "string" ? detail : JSON.stringify(detail))
            })
    }

    const handleCrearHorario = () => {
        crearHorario(materiaId, formHorario)
            .then(data => {
                setHorarios([...horarios, data.horario])
                setFormularioActivo(null)
                setError(null)
            })
            .catch(err => {
                const detail = err.response.data.detail
                setError(typeof detail === "string" ? detail : JSON.stringify(detail))
            })
    }

    const handleEliminarEvaluacion = (evaluacionId) => {
        eliminarEvaluacion(evaluacionId)
            .then(() => setEvaluaciones(evaluaciones.filter(e => e.id !== evaluacionId)))
            .catch(err => setError(err.response.data.detail))
    }

    const handleEliminarHorario = (horarioId) => {
        eliminarHorario(horarioId)
            .then(() => setHorarios(horarios.filter(h => h.id !== horarioId)))
            .catch(err => setError(err.response.data.detail))
    }

    const handleActualizarEvaluacion = () => {
        const datos = {
            ...evaluacionEditando,
            nota: evaluacionEditando.nota === "" ? null : parseFloat(evaluacionEditando.nota),
            numero_de_instancia: evaluacionEditando.numero_de_instancia === "" ? null : parseInt(evaluacionEditando.numero_de_instancia)
        }
        actualizarEvaluacion(evaluacionEditando.id, datos)
            .then(data => {
                setEvaluaciones(evaluaciones.map(e => e.id === data.evaluacion.id ? data.evaluacion : e))
                setMateria(data.materia)
                setEvaluacionEditando(null)
                setError(null)
            })
            .catch(err => setError(err.response.data.detail))
    }

    const handleActualizarHorario = () => {
        actualizarHorario(horarioEditando.id, horarioEditando)
            .then(data => {
                setHorarios(horarios.map(h => h.id === horarioEditando.id ? data.horario : h))
                setHorarioEditando(null)
                setError(null)
            })
            .catch(err => setError(err.response.data.detail))
    }

    const formatearFecha = (fecha) => {
        if (!fecha) return ""
        const [anio, mes, dia] = fecha.split("-")
        return `${dia}/${mes}/${anio}`
    }

    const formatearTipoAprobacion = (tipo) => {
        const tipos = {
            solo_final: "Solo final",
            promocion: "Promoción directa",
            promocion_con_final: "Promoción con final"
        }
        return tipos[tipo] ?? "No configurado"
    }
    
    useEffect(() => {
        obtenerMateria(materiaId).then(data => setMateria(data))
        obtenerEvaluaciones(materiaId).then(data => setEvaluaciones(data))
        obtenerHorarios(materiaId).then(data => setHorarios(data))
    }, [materiaId])

    if (!materia) return <p>Cargando...</p>

    return (
        <div style={{ padding: "24px" }}>

            <button className="ghost" onClick={() => navigate(-1)}
                style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
                <ArrowLeft size={16} /> Volver
            </button>

            {/* Header materia */}
            <div style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "24px"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <h1 style={{ marginBottom: "0" }}>{materia.nombre}</h1>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <MateriaBadge estado={materia.estado} />
                        {materia.estado !== "aprobada" && materia.estado !== "sin_cursar" && (
                            <button className="ghost" onClick={handleAbrirEditar} style={{ color: "var(--text-secondary)" }}>
                                <Settings size={16} />
                            </button>
                        )}
                    </div>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                    Año {materia.anio} · Cuatrimestre {materia.periodo} · {materia.tipo}
                </p>
                <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "16px" }}>
                    Tipo de aprobación: {formatearTipoAprobacion(materia.tipo_aprobacion)}
                </p>

                {materia.estado === "aprobada" && (
                    <div style={{ marginBottom: "12px" }}>
                        {materia.nota_final && <p style={{ color: "var(--text-secondary)" }}>Nota final: {materia.nota_final}</p>}
                        {materia.fecha_estado && <p style={{ color: "var(--text-secondary)" }}>Fecha: {formatearFecha(materia.fecha_estado)}</p>}
                    </div>
                )}

                {error && <p style={{ color: "var(--estado-libre)", marginBottom: "12px" }}>{error}</p>}

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {materia.estado === "sin_cursar" && (
                        <button onClick={handleInscribir}>Inscribirse</button>
                    )}
                    {materia.estado === "libre" && (
                        <button onClick={handleReinscribir}>Reinscribirse</button>
                    )}
                    {materia.estado !== "aprobada" && (
                        <button onClick={() => setModalAprobar(true)} style={{ background: "var(--estado-aprobada)" }}>
                            Marcar como aprobada
                        </button>
                    )}
                </div>
            </div>

            {["cursando", "regular", "promocionada", "libre"].includes(materia.estado) && (
                <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>

                    {/* Evaluaciones */}
                    <div style={{
                        flex: 1,
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        padding: "20px",
                        minWidth: "300px"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <h2 style={{ margin: 0 }}>Evaluaciones</h2>
                            {evaluacionEditando === null && (
                                <button onClick={() => setFormularioActivo("evaluacion")}>+ Agregar</button>
                            )}
                        </div>

                        {evaluaciones.map(evaluacion => (
                            <div key={evaluacion.id}>
                                {evaluacionEditando !== null && evaluacionEditando.id === evaluacion.id ? (
                                    <EvaluacionForm
                                        form={evaluacionEditando}
                                        onChange={setEvaluacionEditando}
                                        onSubmit={handleActualizarEvaluacion}
                                        onCancelar={() => setEvaluacionEditando(null)}
                                        submitLabel="Guardar"
                                    />
                                ) : (
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "10px 0",
                                        borderBottom: "1px solid var(--border)"
                                    }}>
                                        <div>
                                            <p style={{ color: "var(--text-primary)" }}>
                                                {evaluacion.tipo} {evaluacion.numero_de_instancia ? `#${evaluacion.numero_de_instancia}` : ""}
                                            </p>
                                            <p style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                                                {formatearFecha(evaluacion.fecha)} · {evaluacion.estado}
                                                {evaluacion.nota ? ` · Nota: ${evaluacion.nota}` : ""}
                                            </p>
                                        </div>
                                        <div style={{ display: "flex", gap: "4px" }}>
                                            <button className="ghost" onClick={() => setEvaluacionEditando({...evaluacion})}>
                                                <Pencil size={14} />
                                            </button>
                                            <button className="ghost" onClick={() => setConfirmEliminar({ tipo: "evaluacion", id: evaluacion.id })}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Horarios */}
                    <div style={{
                        flex: 1,
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        padding: "20px",
                        minWidth: "300px"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <h2 style={{ margin: 0 }}>Horarios</h2>
                            {horarioEditando === null && (
                                <button onClick={() => setFormularioActivo("horario")}>+ Agregar</button>
                            )}
                        </div>

                        {horarios.map(horario => (
                            <div key={horario.id}>
                                {horarioEditando !== null && horarioEditando.id === horario.id ? (
                                    <HorarioForm
                                        form={horarioEditando}
                                        onChange={setHorarioEditando}
                                        onSubmit={handleActualizarHorario}
                                        onCancelar={() => setHorarioEditando(null)}
                                        submitLabel="Guardar"
                                    />
                                ) : (
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "10px 0",
                                        borderBottom: "1px solid var(--border)"
                                    }}>
                                        <div>
                                            <p style={{ color: "var(--text-primary)" }}>
                                                {horario.nombre ? horario.nombre : horario.dia_semana}
                                            </p>
                                            <p style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                                                {horario.nombre ? `${horario.dia_semana} · ` : ""}{horario.hora_inicio} - {horario.hora_fin}
                                            </p>
                                        </div>
                                        <div style={{ display: "flex", gap: "4px" }}>
                                            <button className="ghost" onClick={() => setHorarioEditando({...horario})}>
                                                <Pencil size={14} />
                                            </button>
                                            <button className="ghost" onClick={() => setConfirmEliminar({ tipo: "horario", id: horario.id })}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal configurar materia */}
            {modalEditar && formEditar && (
                <Modal titulo="Configurar materia" onCerrar={() => setModalEditar(false)}>
                    <MateriaConfigForm
                        form={formEditar}
                        onChange={setFormEditar}
                        onSubmit={handleGuardarEditar}
                        onCancelar={() => setModalEditar(false)}
                    />
                </Modal>
            )}

            {/* Modal marcar como aprobada */}
            {modalAprobar && (
                <Modal titulo="Marcar como aprobada" onCerrar={() => setModalAprobar(false)}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <input type="number" placeholder="Nota final (opcional)"
                            value={notaFinal}
                            onChange={e => setNotaFinal(e.target.value)}
                            style={{ width: "100%" }} />
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={handleAprobar} style={{ background: "var(--estado-aprobada)" }}>Confirmar</button>
                            <button className="ghost" onClick={() => setModalAprobar(false)}>Cancelar</button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Modal agregar evaluacion */}
            {formularioActivo === "evaluacion" && (
                <Modal titulo="Agregar evaluación" onCerrar={() => setFormularioActivo(null)}>
                    <EvaluacionForm
                        form={formEvaluacion}
                        onChange={setFormEvaluacion}
                        onSubmit={handleEvaluacion}
                        onCancelar={() => setFormularioActivo(null)}
                    />
                </Modal>
            )}

            {/* Modal agregar horario */}
            {formularioActivo === "horario" && (
                <Modal titulo="Agregar horario" onCerrar={() => setFormularioActivo(null)}>
                    <HorarioForm
                        form={formHorario}
                        onChange={setFormHorario}
                        onSubmit={handleCrearHorario}
                        onCancelar={() => setFormularioActivo(null)}
                    />
                </Modal>
            )}

            {confirmEliminar && (
                <ConfirmDialog
                    mensaje={`¿Seguro que querés eliminar ${confirmEliminar.tipo === "evaluacion" ? "esta evaluación" : "este horario"}?`}
                    onConfirmar={() => {
                        if (confirmEliminar.tipo === "evaluacion") {
                            handleEliminarEvaluacion(confirmEliminar.id)
                        } else {
                            handleEliminarHorario(confirmEliminar.id)
                        }
                        setConfirmEliminar(null)
                    }}
                    onCancelar={() => setConfirmEliminar(null)}
                />
            )}
        </div>
    )
}

export default MateriaDetalle