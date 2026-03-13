import { useNavigate } from "react-router-dom"

function PlanCard({ plan, progreso }) {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => navigate(`/planes/${plan.id}`)}
            style={{
                padding: "20px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                cursor: "pointer",
                minWidth: "200px",
                transition: "border-color 0.2s ease"
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
            <h3 style={{ color: "var(--text-primary)", marginBottom: "8px" }}>{plan.nombre}</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginBottom: "12px" }}>
                {plan.institucion}
            </p>
            {progreso && (
                <>
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "4px" }}>
                        {progreso.aprobadas} / {progreso.total} aprobadas
                    </p>
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "10px" }}>
                        {progreso.cursando} cursando
                    </p>
                    <div style={{ background: "var(--bg-surface-2)", borderRadius: "4px", height: "6px" }}>
                        <div style={{
                            background: "var(--estado-aprobada)",
                            width: `${progreso.total > 0 ? (progreso.aprobadas / progreso.total) * 100 : 0}%`,
                            height: "6px",
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