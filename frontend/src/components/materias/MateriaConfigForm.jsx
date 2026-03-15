function MateriaConfigForm({ form, onChange, onSubmit, onCancelar }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Tipo</label>
            <select style={{ width: "100%" }} value={form.tipo} onChange={e => onChange({...form, tipo: e.target.value})}>
                <option value="obligatoria">Obligatoria</option>
                <option value="optativa">Optativa</option>
                <option value="electiva">Electiva</option>
            </select>

            <label style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Tipo de aprobación</label>
            <select style={{ width: "100%" }} value={form.tipo_aprobacion} onChange={e => onChange({...form, tipo_aprobacion: e.target.value})}>
                <option value="">No configurado</option>
                <option value="solo_final">Solo final</option>
                <option value="promocion">Promoción directa</option>
                <option value="promocion_con_final">Promoción con final</option>
            </select>

            <label style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Nota mínima parcial (regularidad)</label>
            <input type="number" style={{ width: "100%" }} value={form.nota_minima_parcial_regular}
                onChange={e => onChange({...form, nota_minima_parcial_regular: e.target.value})} />

            <label style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Promedio mínimo parciales (regularidad)</label>
            <input type="number" style={{ width: "100%" }} value={form.promedio_minimo_parciales_regular}
                onChange={e => onChange({...form, promedio_minimo_parciales_regular: e.target.value})} />

            <label style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Nota mínima parcial (promoción)</label>
            <input type="number" style={{ width: "100%" }} value={form.nota_minima_parcial_promocion}
                onChange={e => onChange({...form, nota_minima_parcial_promocion: e.target.value})} />

            <label style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Promedio mínimo parciales (promoción)</label>
            <input type="number" style={{ width: "100%" }} value={form.promedio_minimo_parciales_promocion}
                onChange={e => onChange({...form, promedio_minimo_parciales_promocion: e.target.value})} />

            <label style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Cantidad mínima TPs aprobados</label>
            <input type="number" style={{ width: "100%" }} value={form.cantidad_minima_tp_aprobados}
                onChange={e => onChange({...form, cantidad_minima_tp_aprobados: e.target.value})} />

            <label style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Nota mínima final</label>
            <input type="number" style={{ width: "100%" }} value={form.nota_minima_final}
                onChange={e => onChange({...form, nota_minima_final: e.target.value})} />

            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <button onClick={onSubmit}>Guardar</button>
                <button className="ghost" onClick={onCancelar}>Cancelar</button>
            </div>
        </div>
    )
}

export default MateriaConfigForm