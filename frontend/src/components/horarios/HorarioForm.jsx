function HorarioForm({ form, onChange, onSubmit, onCancelar, submitLabel = "Agregar" }) {
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
            <select value={form.dia_semana} onChange={e => onChange({...form, dia_semana: e.target.value})}>
                <option value="lunes">Lunes</option>
                <option value="martes">Martes</option>
                <option value="miercoles">Miércoles</option>
                <option value="jueves">Jueves</option>
                <option value="viernes">Viernes</option>
                <option value="sabado">Sábado</option>
            </select>
            <input type="time" value={form.hora_inicio}
                onChange={e => onChange({...form, hora_inicio: e.target.value})} />
            <input type="time" value={form.hora_fin}
                onChange={e => onChange({...form, hora_fin: e.target.value})} />
            <input type="text" placeholder="Nombre (ej: Teoría, Práctica)" value={form.nombre ?? ""}
                onChange={e => onChange({...form, nombre: e.target.value})} />
            <button onClick={onSubmit}>{submitLabel}</button>
            {onCancelar && <button className="ghost" onClick={onCancelar}>Cancelar</button>}
        </div>
    )
}

export default HorarioForm