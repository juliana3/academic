const colores = {
    sin_cursar: { bg: "var(--estado-sin-cursar)", text: "var(--text-secondary)" },
    cursando: { bg: "var(--estado-cursando)", text: "var(--estado-text-cursando)" },
    regular: { bg: "var(--estado-regular)", text: "#1a1a2e" },
    promocionada: { bg: "var(--estado-promocionada)", text: "#1a1a2e" },
    libre: { bg: "var(--estado-libre)", text: "white" },
    aprobada: { bg: "var(--estado-aprobada)", text: "white" }
}

function MateriaBadge({ estado }) {
    const color = colores[estado] ?? { bg: "var(--border)", text: "var(--text-secondary)" }

    return (
        <span style={{
            display: "inline-block",
            padding: "3px 10px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            background: color.bg,
            color: color.text
        }}>
            {estado.replace(/_/g, " ")}
        </span>
    )
}

export default MateriaBadge