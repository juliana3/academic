import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { obtenerPlanes, obtenerProgreso } from "../api/planes"
import { obtenerAlertasActivas } from "../api/alertas"
import {obtenerCalendario, crearEvento} from "../api/calendario"

const DIAS = {
    lunes: 1, 
    martes: 2, 
    miercoles: 3, 
    jueves: 4, 
    viernes: 5, 
    sabado: 6 
}


function Dashboard() {
    const navigate = useNavigate()
    const [planes, setPlanes] = useState([])
    const [progresos, setProgresos] = useState({})
    const [alertas, setAlertas] = useState([])
    const [datosCal, setDatosCal] = useState(null)
    const [formEvento, setFormEvento] = useState(null)
    const [alertasDescartadas, setAlertasDescartadas] = useState(
        () => JSON.parse(localStorage.getItem("alertasDescartadas") ?? "[]")
    )

    useEffect(() => {
        obtenerPlanes().then(data => {
            const planes_activos = data.filter(p => p.esta_activo)
            setPlanes(planes_activos)
            planes_activos.forEach(plan => {
                obtenerProgreso(plan.id).then(progreso => {
                    setProgresos(prev => ({ ...prev, [plan.id]: progreso }))
                })
            })
        })
        obtenerAlertasActivas().then(data => setAlertas(data.alertas ?? []))

        obtenerCalendario().then( data => {
            console.log("datos calendario: ", data)
            setDatosCal(data)})
        
    }, [])

    const alertasFiltradas = (alertas ?? []).filter(a => a.tipo !== "bloqueada_correlativa")

    const eventosCalendario = datosCal ? [
        ...datosCal.horarios.map(h => ({
            id: h.id,
            title: h.materia_nombre,
            daysOfWeek: [DIAS[h.dia_semana]],
            startTime: h.hora_inicio,
            endTime: h.hora_fin,
            startRecur: "2020-01-01",
            backgroundColor: "#4a90d9",
            borderColor: "#4a90d9"
        })),
        ...datosCal.evaluaciones.map(e => ({
            id: e.id,
            title: e.titulo,
            start: e.fecha,
            backgroundColor: "#f5a623",
            borderColor: "#f5a623"
        })),
        ...datosCal.eventos.map(ev => ({
            id: ev.id,
            title: ev.titulo,
            start: ev.fecha_inicio,
            end: ev.fecha_fin,
            backgroundColor: ev.color ?? "#7ed321",
            borderColor: ev.color ?? "#7ed321"
        }))
    ] : []

    const handleSeleccion = (info) => {
        setFormEvento({
            titulo: "",
            fecha_inicio: info.startStr,
            fecha_fin: info.endStr,
            color: "#7ed321"
        })
    }

    const handleGuardar = () => {
        crearEvento(formEvento).then(() => {
            obtenerCalendario().then(setDatosCal)
            setFormEvento(null)
        })
    }

    const formatearFecha = (fecha) => {
        if (!fecha) return ""
        const [anio, mes, dia] = fecha.split("-")
        return `${dia}/${mes}/${anio}`
    }

    const descartarAlerta = (index) => {
        const nuevas = [...alertasDescartadas, alertasFiltradas[index].mensaje]
        setAlertasDescartadas(nuevas)
        localStorage.setItem("alertasDescartadas", JSON.stringify(nuevas))
    }

    const alertasVisibles = alertasFiltradas.filter(a => !alertasDescartadas.includes(a.mensaje))

    return (
        <div>
            {/* Progreso por plan */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
                {planes.map(plan => {
                    const progreso = progresos[plan.id]
                    return (
                        <div key={plan.id} onClick={() => navigate(`/planes/${plan.id}`)}
                            style={{ padding: "16px", border: "1px solid #ccc", borderRadius: "8px", cursor: "pointer" }}>
                            <h3>{plan.nombre}</h3>
                            {progreso && (
                                <>
                                    <p>{progreso.aprobadas} / {progreso.total} aprobadas</p>
                                    <p>{progreso.cursando} cursando</p>
                                    <div style={{ background: "#eee", borderRadius: "4px", height: "8px" }}>
                                        <div style={{
                                            background: "#417505",
                                            width: `${(progreso.aprobadas / progreso.total) * 100}%`,
                                            height: "8px",
                                            borderRadius: "4px"
                                        }} />
                                    </div>
                                </>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Calendario + Alertas */}
            <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                    
                    {formEvento && (
                        
                        <div style={{ padding: "10px", border: "1px solid #ccc", marginBottom: "10px", borderRadius: "8px" }}>
                            <h3>Nuevo evento</h3>
                            <input type="text" placeholder="Título"
                                value={formEvento.titulo}
                                onChange={e => setFormEvento({...formEvento, titulo: e.target.value})} />
                            <p>Desde: {formatearFecha(formEvento.fecha_inicio)} — Hasta: {formatearFecha(formEvento.fecha_fin)}</p>
                            <input type="color" value={formEvento.color}
                                onChange={e => setFormEvento({...formEvento, color: e.target.value})} />
                            <button onClick={handleGuardar}>Guardar</button>
                            <button onClick={() => setFormEvento(null)}>Cancelar</button>
                        </div>
                    )}
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek"
                        }}
                        locale="es"
                        firstDay={1}
                        selectable={true}
                        select={handleSeleccion}
                        events={eventosCalendario}
                        height="600px"
                        eventContent={(arg) => {
                            const [materia, titulo] = arg.event.title.split(" - ")
                            return (
                                <div style={{ padding: "2px 4px" }}>
                                    <div style={{ fontWeight: "bold", fontSize: "0.85em" }}>{materia}</div>
                                    {titulo && <div style={{ fontWeight: "normal", fontSize: "0.75em", opacity: 0.85 }}>{titulo}</div>}
                                </div>
                            )
                        }}
                    />
                </div>

                {/* Alertas */}
                <div style={{ width: "280px" }}>
                    <h2>Alertas</h2>
                    {alertasFiltradas.length === 0 && <p>Sin alertas</p>}
                    {alertasVisibles.map((alerta, i) => (
                        <div key={i} style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "8px", marginBottom: "8px", position: "relative"}}>
                            <button
                                onClick={() => descartarAlerta(i)}
                                style = {{position: "absolute", top: "8px", right: "8px", background: "none", border: "none", cursor: "pointer", fontSize: "1em"}}
                            >✕</button>
                            <b>{alerta.tipo}</b>
                            <p>{alerta.mensaje}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}



export default Dashboard