import { useState } from "react"
import { ReactFlow, Panel, Background, BackgroundVariant } from "@xyflow/react"
import "@xyflow/react/dist/style.css"

const coloresPorEstado = {
    sin_cursar: { background: "var(--estado-sin-cursar)", color: "var(--text-secondary)" },
    cursando: { background: "var(--estado-cursando)", color: "var(--estado-text-cursando)" },
    regular: { background: "var(--estado-regular)", color: "#1a1a2e" },
    promocionada: { background: "var(--estado-promocionada)", color: "#1a1a2e" },
    libre: { background: "var(--estado-libre)", color: "white" },
    aprobada: { background: "var(--estado-aprobada)", color: "white" }
}

const leyenda = [
    { estado: "sin_cursar", label: "Sin cursar" },
    { estado: "cursando", label: "Cursando" },
    { estado: "regular", label: "Regular" },
    { estado: "promocionada", label: "Promocionada" },
    { estado: "libre", label: "Libre" },
    { estado: "aprobada", label: "Aprobada" }
]

const leyendaEdges = [
    { color: "var(--accent)", label: "Correlativa para cursar" },
    { color: "var(--estado-libre)", label: "Correlativa para rendir" }
]

function GrillaCurricular({ materias, requisitos, onNodoClick }) {
    const [nodoHover, setNodoHover] = useState(null)
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

    // nodos de año
    const anosUnicos = [...new Set(materias.map(m => m.anio))].sort()
    const nodosAnio = anosUnicos.map(anio => {
        const periodosDelAnio = [...new Set(materias.filter(m => m.anio === anio).map(m => m.periodo))].sort()
        const xCentro = (periodosDelAnio[0] + periodosDelAnio[periodosDelAnio.length - 1]) / 2 * 350
        return {
            id: `anio-${anio}`,
            className: "nodo-header",
            position: { x: xCentro -10, y: anio * 600 - 120 },
            data: { label: `${anio}° Año` },
            style: {
                background: "transparent",
                border: "1px solid var(--accent)",
                color: "var(--accent)",
                borderRadius: "20px",
                padding: "4px 16px",
                fontSize: "13px",
                fontWeight: "700",
                pointerEvents: "none",
                letterSpacing: "1px"
            },
            selectable: false,
            draggable: false
        }
    })

    // nodos de cuatrimestre
    const nodosCuatri = materias.reduce((acc, m) => {
        const key = `${m.anio}-${m.periodo}`
        if (!acc.find(n => n.id === `cuatri-${key}`)) {
            acc.push({
                id: `cuatri-${key}`,
                className: "nodo-header",
                position: { x: m.periodo * 350 , y: m.anio * 600 - 60 },
                data: { label: `${m.periodo === 1 ? "1er" : `${m.periodo}do`} Cuatrimestre` },
                style: {
                    background: "transparent",
                    border: "none",
                    color: "var(--text-secondary)",
                    fontSize: "11px",
                    fontWeight: "600",
                    pointerEvents: "none",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase"
                },
                selectable: false,
                draggable: false
            })
        }
        return acc
    }, [])

    const nodos = materias.map((materia) => {
        const materiasEnMismaPosicion = materias.filter(
            m => m.anio === materia.anio && m.periodo === materia.periodo
        )
        const posicionEnGrupo = materiasEnMismaPosicion.indexOf(materia)
        const estilo = coloresPorEstado[materia.estado] ?? { background: "var(--bg-surface-2)", color: "var(--text-primary)" }

        return {
            id: String(materia.id),
            position: {
                x: materia.periodo * 350,
                y: materia.anio * 600 + posicionEnGrupo * 150
            },
            data: { label: materia.nombre },
            style: {
                ...estilo,
                border: nodoHover === String(materia.id)
                    ? `2px solid white`
                    : `1px solid rgba(255,255,255,0.15)`,
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "13px",
                fontWeight: "500",
                boxShadow: nodoHover === String(materia.id)
                    ? `0 0 12px 3px rgba(255,255,255,0.2)`
                    : "none",
                transition: "all 0.2s ease"
            }
        }
    })

    const edges = requisitos.map(req => {
        const esConectadoAlHover = nodoHover === String(req.id_materia) || nodoHover === String(req.id_materia_req)
        const esRendir = req.para === "rendir_final"

        return {
            id: `${req.id_materia}-${req.id_materia_req}-${req.para}`,
            source: String(req.id_materia_req),
            target: String(req.id_materia),
            animated: esRendir,
            style: {
                stroke: esConectadoAlHover
                    ? (esRendir ? "var(--estado-libre)" : "var(--accent)")
                    : "rgba(255,255,255,0.1)",
                strokeWidth: esConectadoAlHover ? 2 : 1,
                transition: "all 0.2s ease"
            },
            zIndex: esConectadoAlHover ? 10 : 0
        }
    })

    const todosLosNodos = [...nodosAnio, ...nodosCuatri, ...nodos]

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <ReactFlow
                nodes={todosLosNodos}
                edges={edges}
                onNodeClick={(event, node) => {
                    if (node.id.startsWith("anio-") || node.id.startsWith("cuatri-")) return
                    onNodoClick && onNodoClick(node)
                }}
                onNodeMouseEnter={(event, node) => {
                    if (node.id.startsWith("anio-") || node.id.startsWith("cuatri-")) return
                    setNodoHover(node.id)
                    setTooltipPos({ x: event.clientX, y: event.clientY })
                }}
                onNodeMouseLeave={() => setNodoHover(null)}
                defaultViewport={{ x: 50, y: 50, zoom: 1 }}
                minZoom={0.3}
                maxZoom={2}
            >
                <Background
                    variant={BackgroundVariant.Lines}
                    gap={200}
                    size={1}
                    color="rgba(255,255,255,0.05)"
                />

                <Panel position="top-left">
                    <div style={{
                        marginTop: "40px",
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px"
                    }}>
                        {leyenda.map(({ estado, label }) => (
                            <div key={estado} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    background: coloresPorEstado[estado].background
                                }} />
                                <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>{label}</span>
                            </div>
                        ))}
                        <div style={{ borderTop: "1px solid var(--border)", marginTop: "6px", paddingTop: "6px" }}>
                            {leyendaEdges.map(({ color, label }) => (
                                <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                                    <div style={{ width: "20px", height: "2px", background: color }} />
                                    <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Panel>
            </ReactFlow>

            {nodoHover && (() => {
                const requisitosDelNodo = requisitos.filter(r => String(r.id_materia) === nodoHover)
                if (requisitosDelNodo.length === 0) return null
                return (
                    <div style={{
                        position: "fixed",
                        left: tooltipPos.x + 12,
                        top: tooltipPos.y + 12,
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        zIndex: 1000,
                        pointerEvents: "none",
                        minWidth: "180px"
                    }}>
                        <p style={{ color: "var(--text-secondary)", fontSize: "11px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase" }}>
                            Requisitos
                        </p>
                        {requisitosDelNodo.map(req => {
                            const matReq = materias.find(m => m.id === req.id_materia_req)
                            return (
                                <p key={req.id} style={{ color: "var(--text-primary)", fontSize: "12px", marginBottom: "2px" }}>
                                    {matReq?.nombre} · <span style={{ color: "var(--text-secondary)" }}>
                                        {req.para === "rendir_final" ? "para rendir" : "para cursar"}
                                    </span>
                                </p>
                            )
                        })}
                    </div>
                )
            })()}
        </div>
    )
}

export default GrillaCurricular