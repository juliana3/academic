function ConfirmDialog({ mensaje, onConfirmar, onCancelar }) {
    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
        }}>
            <div style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "24px",
                minWidth: "300px",
                textAlign: "center"
            }}>
                <p style={{ marginBottom: "20px", color: "var(--text-primary)" }}>{mensaje}</p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                    <button onClick={onConfirmar} style={{ background: "var(--estado-libre)" }}>
                        Eliminar
                    </button>
                    <button className="ghost" onClick={onCancelar}
                        style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDialog