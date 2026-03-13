function EvaluacionForm({ form, onChange, onSubmit, onCancelar, submitLabel = "Agregar" }) {
    return (
        <div style={{
            padding: "16px",
            background: "var(--bg-surface-2)",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            alignItems: "center",
            marginTop: "12px"
        }}>
            <select value={form.tipo} onChange={e => onChange({...form, tipo: e.target.value})}>
                <option value="parcial">Parcial</option>
                <option value="tp">TP</option>
                <option value="final">Final</option>
            </select>
            <input type="number" placeholder="Instancia" value={form.numero_de_instancia}
                style={{ width: "90px" }}
                onChange={e => onChange({...form, numero_de_instancia: e.target.value})} />
            <input type="date" value={form.fecha}
                onChange={e => onChange({...form, fecha: e.target.value})} />
            <input type="number" placeholder="Nota" value={form.nota}
                style={{ width: "80px" }}
                onChange={e => onChange({...form, nota: e.target.value})} />
            <select value={form.estado} onChange={e => onChange({...form, estado: e.target.value})}>
                <option value="pendiente">Pendiente</option>
                <option value="aprobado">Aprobado</option>
                <option value="desaprobado">Desaprobado</option>
            </select>
            <button onClick={onSubmit}>{submitLabel}</button>
            {onCancelar && <button className="ghost" onClick={onCancelar}>Cancelar</button>}
        </div>
    )
}

export default EvaluacionForm