import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { obtenerPlanes, obtenerProgreso } from "../api/planes"
import { obtenerAlertasActivas } from "../api/alertas"
import {obtenerCalendario, crearEvento} from "../api/calendario"
import PlanCard from "../components/planes/PlanCard"
import AlertaBadge from "../components/common/AlertaBadge"

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
        <div style={{ padding: "24px" }}>

            {/* Fila superior: Planes + Alertas */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
                
                {/* Slot Planes */}
                <div style={{
                    flex: 1,
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "16px",
                    overflow: "hidden"
                }}>
                    <h2 style={{ marginBottom: "12px" }}>Mis planes</h2>
                    <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
                        {planes.map(plan => (
                            <PlanCard key={plan.id} plan={plan} progreso={progresos[plan.id]} />
                        ))}
                    </div>
                </div>

                {/* Slot Alertas */}
                <div style={{
                    width: "280px",
                    minWidth: "280px",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "16px",
                    maxHeight: "250px",
                    overflowY: "auto"
                }}>
                    <h2 style={{ marginBottom: "12px" }}>Alertas</h2>
                    {alertasVisibles.length === 0 && (
                        <p style={{ color: "var(--text-secondary)" }}>Sin alertas</p>
                    )}
                    {alertasVisibles.map((alerta, i) => (
                        <AlertaBadge key={i} alerta={alerta} onDescartar={() => descartarAlerta(i)} />
                    ))}
                </div>
            </div>

            {/* Calendario full ancho */}
            {formEvento && (
                <div style={{
                    padding: "16px",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--accent)",
                    borderRadius: "12px",
                    marginBottom: "16px"
                }}>
                    <h3>Nuevo evento</h3>
                    <input type="text" placeholder="Título"
                        value={formEvento.titulo}
                        onChange={e => setFormEvento({...formEvento, titulo: e.target.value})}
                        style={{ marginRight: "8px" }} />
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: "8px 0" }}>
                        Desde: {formatearFecha(formEvento.fecha_inicio)} — Hasta: {formatearFecha(formEvento.fecha_fin)}
                    </p>
                    <input type="color" value={formEvento.color}
                        onChange={e => setFormEvento({...formEvento, color: e.target.value})}
                        style={{ marginRight: "8px", width: "40px", padding: "2px" }} />
                    <button onClick={handleGuardar}>Guardar</button>
                    <button className="ghost" onClick={() => setFormEvento(null)} style={{ marginLeft: "8px" }}>Cancelar</button>
                </div>
            )}

            <div style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "16px"
            }}>
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
                        const partes = arg.event.title.split(" - ")
                        const materia = partes[0]
                        const titulo = partes[1]
                        return (
                            <div style={{ padding: "2px 4px" }}>
                                <div style={{ fontWeight: "bold", fontSize: "0.85em" }}>{materia}</div>
                                {titulo && <div style={{ fontWeight: "normal", fontSize: "0.75em", opacity: 0.85 }}>{titulo}</div>}
                            </div>
                        )
                    }}
                />
            </div>
        </div>
    )
}



export default Dashboard