import { useState, useEffect } from "react"

function Toast({ mensaje, tipo, onCerrar }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onCerrar && onCerrar()
        }, 3000)
        return () => clearTimeout(timer)
    }, [])

    const esError = tipo === "error"
    return (
        <div style={{
            padding: "12px 16px",
            borderRadius: "10px",
            marginBottom: "12px",
            background: esError ? "rgba(229, 57, 53, 0.15)" : "rgba(67, 160, 71, 0.15)",
            border: `1px solid ${esError ? "var(--estado-libre)" : "var(--estado-aprobada)"}`,
            color: esError ? "var(--estado-libre)" : "var(--estado-aprobada)",
            fontSize: "13px"
        }}>
            {mensaje}
        </div>
    )
}

export default Toast