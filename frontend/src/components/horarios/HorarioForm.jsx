function HorarioForm({ form, onChange, onSubmit, onCancelar, submitLabel = "Agregar" }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <select style={{ width: "100%" }} value={form.dia_semana} onChange={e => onChange({...form, dia_semana: e.target.value})}>
                <option value="lunes">Lunes</option>
                <option value="martes">Martes</option>
                <option value="miercoles">Miércoles</option>
                <option value="jueves">Jueves</option>
                <option value="viernes">Viernes</option>
                <option value="sabado">Sábado</option>
            </select>
            <input type="time" style={{ width: "100%" }}
                value={form.hora_inicio}
                onChange={e => onChange({...form, hora_inicio: e.target.value})} />
            <input type="time" style={{ width: "100%" }}
                value={form.hora_fin}
                onChange={e => onChange({...form, hora_fin: e.target.value})} />
            <input type="text" placeholder="Nombre (ej: Teoría, Práctica)" style={{ width: "100%" }}
                value={form.nombre ?? ""}
                onChange={e => onChange({...form, nombre: e.target.value})} />
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <button onClick={onSubmit}>{submitLabel}</button>
                {onCancelar && <button className="ghost" onClick={onCancelar}>Cancelar</button>}
            </div>
        </div>
    )
}

export default HorarioForm