function Modal({ titulo, onCerrar, children }) {
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
                minWidth: "400px",
                maxWidth: "600px",
                maxHeight: "80vh",
                overflowY: "auto"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h2 style={{ margin: 0 }}>{titulo}</h2>
                    <button className="ghost" onClick={onCerrar}>✕</button>
                </div>
                {children}
            </div>
        </div>
    )
}

export default Modal