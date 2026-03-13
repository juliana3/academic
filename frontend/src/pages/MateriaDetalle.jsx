import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerMateria, inscribirMateria, reinscribirMateria, aprobarMateria } from "../api/materias";
import { obtenerEvaluaciones, crearEvaluacion, eliminarEvaluacion, actualizarEvaluacion } from "../api/evaluaciones";
import { obtenerHorarios, crearHorario, eliminarHorario, actualizarHorario } from "../api/horarios";

function MateriaDetalle(){
    const {materiaId} = useParams()
    const [materia, setMateria] = useState(null)
    const [evaluaciones, setEvaluaciones] = useState([])
    const [horarios, setHorarios] = useState([])
    const [error, setError] = useState(null)
    const [evaluacionEditando, setEvaluacionEditando] = useState(null)
    const [horarioEditando, setHorarioEditando] = useState(null)
    const [formularioActivo, setFormularioActivo] = useState(null)

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
        aprobarMateria(materiaId).then(data => {
            setMateria(data)
            setError(null)
        }).catch(err => setError(err.response.data.detail))
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
                setHorarios([...horarios, data])
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

    useEffect(() => {
        obtenerMateria(materiaId).then(data => setMateria(data))
        obtenerEvaluaciones(materiaId).then(data => setEvaluaciones(data))
        obtenerHorarios(materiaId).then(data => setHorarios(data))
    }, [materiaId])

    if (!materia) return <p>Cargando...</p>

    return (
        <div>
            <h1>{materia.nombre}</h1>
            <p>Estado: {materia.estado}</p>
            <p>Año: {materia.anio} | Cuatrimestre: {materia.periodo}</p>
            <p>Tipo: {materia.tipo}</p>
            <p>Tipo de aprobación: {materia.tipo_aprobacion ?? "No configurado"}</p>

            {materia.estado === "aprobada" && (
                <div>
                    <p>✅ Materia aprobada</p>
                    {materia.nota_final && <p>Nota final: {materia.nota_final}</p>}
                    {materia.fecha_estado && <p>Fecha: {formatearFecha(materia.fecha_estado)}</p>}
                </div>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}

            {materia.estado === "sin_cursar" && (
                <button onClick={handleInscribir}>Inscribirse</button>
            )}
            {materia.estado === "libre" && (
                <button onClick={handleReinscribir}>Reinscribirse</button>
            )}
            {materia.estado !== "aprobada" && (
                <button onClick={handleAprobar}>Marcar como aprobada</button>
            )}

            {materia.estado !== "aprobada" && (
                <>
                    <h2>Evaluaciones</h2>
                    {evaluaciones.map(evaluacion => (
                        <div key={evaluacion.id}>
                            {evaluacionEditando !== null && evaluacionEditando.id === evaluacion.id ? (
                                <div>
                                    <select value={evaluacionEditando.tipo ?? ""} onChange={e => setEvaluacionEditando({...evaluacionEditando, tipo: e.target.value})}>
                                        <option value="parcial">Parcial</option>
                                        <option value="tp">TP</option>
                                        <option value="final">Final</option>
                                    </select>
                                    <input type="number" value={evaluacionEditando.numero_de_instancia ?? ""}
                                        onChange={e => setEvaluacionEditando({...evaluacionEditando, numero_de_instancia: e.target.value})} />
                                    <input type="date" value={evaluacionEditando.fecha ?? ""}
                                        onChange={e => setEvaluacionEditando({...evaluacionEditando, fecha: e.target.value})} />
                                    <input type="number" value={evaluacionEditando.nota ?? ""}
                                        onChange={e => setEvaluacionEditando({...evaluacionEditando, nota: e.target.value})} />
                                    <select value={evaluacionEditando.estado} onChange={e => setEvaluacionEditando({...evaluacionEditando, estado: e.target.value})}>
                                        <option value="pendiente">Pendiente</option>
                                        <option value="aprobado">Aprobado</option>
                                        <option value="desaprobado">Desaprobado</option>
                                    </select>
                                    <button onClick={handleActualizarEvaluacion}>Guardar</button>
                                    <button onClick={() => setEvaluacionEditando(null)}>Cancelar</button>
                                </div>
                            ) : (
                                <div>
                                    <p>{evaluacion.tipo} — {evaluacion.fecha} — {evaluacion.estado} {evaluacion.nota ? `| Nota: ${evaluacion.nota}` : ""}</p>
                                    <button onClick={() => setEvaluacionEditando({...evaluacion})}>✏️</button>
                                    <button onClick={() => handleEliminarEvaluacion(evaluacion.id)}>🗑</button>
                                </div>
                            )}
                        </div>
                    ))}

                    {evaluacionEditando === null && (
                        <>
                            <button onClick={() => setFormularioActivo(formularioActivo === "evaluacion" ? null : "evaluacion")}>
                                + Agregar evaluación
                            </button>
                            {formularioActivo === "evaluacion" && (
                                <div>
                                    <select value={formEvaluacion.tipo} onChange={e => setFormEvaluacion({...formEvaluacion, tipo: e.target.value})}>
                                        <option value="parcial">Parcial</option>
                                        <option value="tp">TP</option>
                                        <option value="final">Final</option>
                                    </select>
                                    <input type="number" placeholder="Instancia" value={formEvaluacion.numero_de_instancia}
                                        onChange={e => setFormEvaluacion({...formEvaluacion, numero_de_instancia: e.target.value})} />
                                    <input type="date" value={formEvaluacion.fecha}
                                        onChange={e => setFormEvaluacion({...formEvaluacion, fecha: e.target.value})} />
                                    <input type="number" placeholder="Nota" value={formEvaluacion.nota}
                                        onChange={e => setFormEvaluacion({...formEvaluacion, nota: e.target.value})} />
                                    <select value={formEvaluacion.estado} onChange={e => setFormEvaluacion({...formEvaluacion, estado: e.target.value})}>
                                        <option value="pendiente">Pendiente</option>
                                        <option value="aprobado">Aprobado</option>
                                        <option value="desaprobado">Desaprobado</option>
                                    </select>
                                    <button onClick={handleEvaluacion}>Agregar</button>
                                    <button onClick={() => setFormularioActivo(null)}>Cancelar</button>
                                </div>
                            )}
                        </>
                    )}

                    <h2>Horarios</h2>
                    {horarios.map(horario => (
                        <div key={horario.id}>
                            {horarioEditando !== null && horarioEditando.id === horario.id ? (
                                <div>
                                    <select value={horarioEditando.dia_semana} onChange={e => setHorarioEditando({...horarioEditando, dia_semana: e.target.value})}>
                                        <option value="lunes">Lunes</option>
                                        <option value="martes">Martes</option>
                                        <option value="miercoles">Miércoles</option>
                                        <option value="jueves">Jueves</option>
                                        <option value="viernes">Viernes</option>
                                        <option value="sabado">Sábado</option>
                                    </select>
                                    <input type="time" value={horarioEditando.hora_inicio ?? ""}
                                        onChange={e => setHorarioEditando({...horarioEditando, hora_inicio: e.target.value})} />
                                    <input type="time" value={horarioEditando.hora_fin ?? ""}
                                        onChange={e => setHorarioEditando({...horarioEditando, hora_fin: e.target.value})} />
                                    <input type="text" value={horarioEditando.nombre ?? ""}
                                        onChange={e => setHorarioEditando({...horarioEditando, nombre: e.target.value})} />
                                    <button onClick={handleActualizarHorario}>Guardar</button>
                                    <button onClick={() => setHorarioEditando(null)}>Cancelar</button>
                                </div>
                            ) : (
                                <div>
                                    <p>{horario.nombre ? `${horario.nombre} — ` : ""}{horario.dia_semana} {horario.hora_inicio} - {horario.hora_fin}</p>
                                    <button onClick={() => setHorarioEditando({...horario})}>✏️</button>
                                    <button onClick={() => handleEliminarHorario(horario.id)}>🗑</button>
                                </div>
                            )}
                        </div>
                    ))}

                    {horarioEditando === null && (
                        <>
                            <button onClick={() => setFormularioActivo(formularioActivo === "horario" ? null : "horario")}>
                                + Agregar horario
                            </button>
                            {formularioActivo === "horario" && (
                                <div>
                                    <select value={formHorario.dia_semana} onChange={e => setFormHorario({...formHorario, dia_semana: e.target.value})}>
                                        <option value="lunes">Lunes</option>
                                        <option value="martes">Martes</option>
                                        <option value="miercoles">Miércoles</option>
                                        <option value="jueves">Jueves</option>
                                        <option value="viernes">Viernes</option>
                                        <option value="sabado">Sábado</option>
                                    </select>
                                    <input type="time" value={formHorario.hora_inicio}
                                        onChange={e => setFormHorario({...formHorario, hora_inicio: e.target.value})} />
                                    <input type="time" value={formHorario.hora_fin}
                                        onChange={e => setFormHorario({...formHorario, hora_fin: e.target.value})} />
                                    <input type="text" placeholder="Nombre (ej: Teoría, Práctica)" value={formHorario.nombre ?? ""}
                                        onChange={e => setFormHorario({...formHorario, nombre: e.target.value})} />
                                    <button onClick={handleCrearHorario}>Agregar</button>
                                    <button onClick={() => setFormularioActivo(null)}>Cancelar</button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default MateriaDetalle