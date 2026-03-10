import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { obtenerPlanes } from "../api/planes"
import { obtenerProgreso } from "../api/planes"
import { obtenerAlertasActivas } from "../api/alertas"

function Dashboard() {
    const navigate = useNavigate()
    const [planes, setPlanes] = useState([])
    const [progresos, setProgresos] = useState({})
    const [alertas, setAlertas] = useState([])

    useEffect(() => {
        obtenerPlanes().then(data => {
            setPlanes(data)
            data.forEach(plan => {
                obtenerProgreso(plan.id).then(progreso => {
                    setProgresos(prev => ({ ...prev, [plan.id]: progreso }))
                })
            })
        })
        obtenerAlertasActivas().then(data => setAlertas(data.alertas))
    }, [])

    const alertasFiltradas = alertas.filter(a => a.tipo !== "bloqueada_correlativa")

    return (
        <div>
            <h1>Dashboard</h1>

            <h2>Alertas</h2>
             
            {alertas.length === 0 && <p>Sin alertas</p>}
            {alertasFiltradas.map((alerta, i) => (
                <div key={i}>
                    <b>{alerta.tipo}</b> — {alerta.mensaje}
                </div>
            ))}

            <h2>Mis planes</h2>
            {planes.map(plan => {
                const progreso = progresos[plan.id]
                return (
                    <div key={plan.id} onClick={() => navigate(`/planes/${plan.id}`)}>
                        <h3>{plan.nombre}</h3>
                        {progreso && (
                            <p>{progreso.aprobadas} / {progreso.total} aprobadas — {progreso.cursando} cursando</p>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default Dashboard