function MateriaForm({ form, onChange, onSubmit, onCancelar, submitLabel = "Agregar" }) {
    return (
        <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            alignItems: "center"
        }}>
            <input type="text" placeholder="Nombre" value={form.nombre}
                onChange={e => onChange({...form, nombre: e.target.value})} />
            <input type="number" placeholder="Año" value={form.anio}
                style={{ width: "80px" }}
                onChange={e => onChange({...form, anio: e.target.value})} />
            <input type="number" placeholder="Cuatrimestre" value={form.periodo}
                style={{ width: "120px" }}
                onChange={e => onChange({...form, periodo: e.target.value})} />
            <select value={form.tipo} onChange={e => onChange({...form, tipo: e.target.value})}>
                <option value="obligatoria">Obligatoria</option>
                <option value="optativa">Optativa</option>
                <option value="electiva">Electiva</option>
            </select>
            <button onClick={onSubmit}>{submitLabel}</button>
            {onCancelar && <button className="ghost" onClick={onCancelar}>Cancelar</button>}
        </div>
    )
}

export default MateriaForm