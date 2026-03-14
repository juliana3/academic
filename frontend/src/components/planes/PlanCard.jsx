import { useNavigate } from "react-router-dom"

function PlanCard({ plan, progreso }) {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => navigate(`/planes/${plan.id}`)}
            style={{
                padding: "12px 16px",
                background: "var(--bg-surface-2)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                cursor: "pointer",
                width: "100%",
                transition: "border-color 0.2s ease"
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
            <h3 style={{ fontSize: "14px", marginBottom: "2px" }}>{plan.nombre}</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginBottom: "8px" }}>{plan.institucion}</p>
            {progreso && (
                <>
                    <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginBottom: "4px" }}>
                        {progreso.aprobadas} / {progreso.total} aprobadas · {progreso.cursando} cursando
                    </p>
                    <div style={{ background: "var(--border)", borderRadius: "4px", height: "4px" }}>
                        <div style={{
                            background: "var(--estado-aprobada)",
                            width: `${progreso.total > 0 ? (progreso.aprobadas / progreso.total) * 100 : 0}%`,
                            height: "4px",
                            borderRadius: "4px",
                            transition: "width 0.3s ease"
                        }} />
                    </div>
                </>
            )}
        </div>
    )
}

export default PlanCard