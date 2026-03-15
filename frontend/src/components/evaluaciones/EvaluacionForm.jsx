import { useState } from "react"
import { Info } from "lucide-react"

function EvaluacionForm({ form, onChange, onSubmit, onCancelar, submitLabel = "Agregar" }) {
    const [mostrarTooltip, setMostrarTooltip] = useState(false)

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <select style={{ width: "100%" }} value={form.tipo} onChange={e => onChange({...form, tipo: e.target.value})}>
                <option value="parcial">Parcial</option>
                <option value="tp">TP</option>
                <option value="final">Final</option>
            </select>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <select style={{ flex: 1 }} value={form.numero_de_instancia} onChange={e => onChange({...form, numero_de_instancia: e.target.value})}>
                    <option value="">Instancia (opcional)</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
                <div style={{ position: "relative" }}
                    onMouseEnter={() => setMostrarTooltip(true)}
                    onMouseLeave={() => setMostrarTooltip(false)}>
                    <Info size={16} style={{ color: "var(--text-secondary)", cursor: "help" }} />
                    {mostrarTooltip && (
                        <div style={{
                            position: "absolute", right: "0", top: "calc(100% + 8px)",
                            background: "white", color: "#1a1a2e",
                            border: "1px solid #ddd", borderRadius: "8px",
                            padding: "10px 12px", fontSize: "12px", lineHeight: "1.6",
                            width: "200px", zIndex: 100,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                        }}>
                            <p style={{ fontWeight: "600", marginBottom: "6px" }}>Número de instancia</p>
                            <p>· 1 para el primer parcial</p>
                            <p>· 2 para el segundo</p>
                            <p style={{ marginTop: "6px" }}>Para recuperatorios usá el mismo número que el parcial que reemplaza</p>
                        </div>
                    )}
                </div>
            </div>

            <input type="date" style={{ width: "100%" }}
                value={form.fecha}
                onChange={e => onChange({...form, fecha: e.target.value})} />
            <input type="number" placeholder="Nota" style={{ width: "100%" }}
                value={form.nota}
                onChange={e => onChange({...form, nota: e.target.value})} />
            <select style={{ width: "100%" }} value={form.estado} onChange={e => onChange({...form, estado: e.target.value})}>
                <option value="pendiente">Pendiente</option>
                <option value="aprobado">Aprobado</option>
                <option value="desaprobado">Desaprobado</option>
            </select>
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <button onClick={onSubmit}>{submitLabel}</button>
                {onCancelar && <button className="ghost" onClick={onCancelar}>Cancelar</button>}
            </div>
        </div>
    )
}

export default EvaluacionForm