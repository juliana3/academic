function EvaluacionForm({ form, onChange, onSubmit, onCancelar, submitLabel = "Agregar" }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <select style={{ width: "100%" }} value={form.tipo} onChange={e => onChange({...form, tipo: e.target.value})}>
                <option value="parcial">Parcial</option>
                <option value="tp">TP</option>
                <option value="final">Final</option>
            </select>
            <input type="number" placeholder="Instancia" style={{ width: "100%" }}
                value={form.numero_de_instancia}
                onChange={e => onChange({...form, numero_de_instancia: e.target.value})} />
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