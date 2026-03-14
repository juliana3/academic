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
            const activos = data.filter(p => p.esta_activo)
            setPlanes(activos)
            activos.forEach(plan => {
                obtenerProgreso(plan.id).then(progreso => {
                    setProgresos(prev => ({ ...prev, [plan.id]: progreso }))
                })
            })
        })
        obtenerAlertas().then(data => setAlertas(data.alertas ?? []))
        obtenerCalendario().then(data => setDatosCal(data))
    }, [])

    const alertasFiltradas = (alertas ?? []).filter(a => a.tipo !== "bloqueada_correlativa")
    const alertasVisibles = alertasFiltradas.filter(a => !alertasDescartadas.includes(a.mensaje))

    const descartarAlerta = (index) => {
        const nuevas = [...alertasDescartadas, alertasVisibles[index].mensaje]
        setAlertasDescartadas(nuevas)
        localStorage.setItem("alertasDescartadas", JSON.stringify(nuevas))
    }

    const colorAlerta = (tipo) => {
        const colores = {
            fecha_proxima: "var(--estado-regular)",
            promocion_posible: "var(--estado-promocionada)",
            conflicto_horario: "var(--estado-libre)",
            promocion_perdida: "var(--estado-libre)",
            regularidad_perdida: "var(--estado-libre)"
        }
        return colores[tipo] ?? "var(--accent)"
    }

    const formatearFecha = (fecha) => {
        if (!fecha) return ""
        const [anio, mes, dia] = fecha.split("-")
        return `${dia}/${mes}/${anio}`
    }

    const eventosCalendario = datosCal ? [
        ...datosCal.horarios.map(h => ({
            id: h.id,
            title: h.materia_nombre,
            daysOfWeek: [DIAS[h.dia_semana]],
            startTime: h.hora_inicio,
            endTime: h.hora_fin,
            backgroundColor: "#4a90d9",
            borderColor: "#4a90d9"
        })),
        ...datosCal.evaluaciones.map(e => ({
            id: e.id,
            title: e.titulo,
            start: e.fecha,
            backgroundColor: "var(--estado-regular)",
            borderColor: "var(--estado-regular)"
        })),
        ...datosCal.eventos.map(e => ({
            id: e.id,
            title: e.titulo,
            start: e.fecha_inicio,
            end: e.fecha_fin,
            backgroundColor: e.color ?? "var(--estado-aprobada)",
            borderColor: e.color ?? "var(--estado-aprobada)"
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
                    maxHeight: "250px",
                    overflowY: "auto"
                }}>
                    <h2 style={{ marginBottom: "12px" }}>Mis planes</h2>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "10px"
                    }}>
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

            {/* Calendario */}
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
                        style={{ marginRight: "8px", marginTop: "8px" }} />
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: "8px 0" }}>
                        Desde: {formatearFecha(formEvento.fecha_inicio)} — Hasta: {formatearFecha(formEvento.fecha_fin)}
                    </p>
                    <input type="color" value={formEvento.color}
                        onChange={e => setFormEvento({...formEvento, color: e.target.value})}
                        style={{ marginRight: "8px", width: "40px", padding: "2px" }} />
                    <button onClick={handleGuardar} style={{ marginRight: "8px" }}>Guardar</button>
                    <button className="ghost" onClick={() => setFormEvento(null)}>Cancelar</button>
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