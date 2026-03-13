function AlertaBadge({ alerta, onDescartar }) {
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

    return (
        <div style={{
            padding: "12px 16px",
            background: "var(--bg-surface-2)",
            border: `1px solid ${colorAlerta(alerta.tipo)}`,
            borderRadius: "10px",
            marginBottom: "8px",
            position: "relative"
        }}>
            <button className="ghost" onClick={onDescartar}
                style={{ position: "absolute", top: "8px", right: "8px", fontSize: "12px" }}>✕</button>
            <p style={{ fontSize: "11px", color: colorAlerta(alerta.tipo), fontWeight: "600", marginBottom: "4px", textTransform: "uppercase" }}>
                {alerta.tipo.replace(/_/g, " ")}
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{alerta.mensaje}</p>
        </div>
    )
}

export default AlertaBadge