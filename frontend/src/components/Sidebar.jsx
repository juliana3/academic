import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, ChevronLeft, ChevronRight } from "lucide-react"
import Logo  from "../assets/correlax_icon.svg?react"

const links = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={18}/> },
    { path: "/planes", label: "Planes", icon: <BookOpen size={18}/> },
]

function Sidebar({ colapsado, setColapsado }) {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <div style={{
            width: colapsado ? "60px" : "200px",
            minHeight: "100vh",
            borderRight: "1px solid var(--border)",
            padding: "20px 0",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            position: "fixed",
            left: 0,
            top: 0,
            backgroundColor: "var(--bg-surface)",
            zIndex: 100,
            transition: "width 0.2s ease",
            height : "100%"
        }}>
            <div style={{ padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                {!colapsado && <h2 style={{ color: "var(--accent)", letterSpacing: "1px", fontSize: "1rem", margin: "0 auto" }}>CORRELAX</h2>}
                <button onClick={() => setColapsado(!colapsado)} className="ghost" style={{ color: "var(--text-secondary)", padding: "4px" }}>
                    {colapsado ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {links.map(link => (
                <div key={link.path}
                    onClick={() => navigate(link.path)}
                    style={{
                        padding: "10px 16px",
                        cursor: "pointer",
                        borderRadius: "6px",
                        margin: "0 8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        background: location.pathname === link.path ? "var(--bg-surface-2)" : "transparent",
                        color: location.pathname === link.path ? "var(--accent)" : "var(--text-secondary)",
                        fontWeight: location.pathname === link.path ? "600" : "normal",
                        transition: "all 0.15s ease"
                    }}>
                    {link.icon}
                    {!colapsado && <span>{link.label}</span>}
                </div>
            ))}

            <div style={{
                marginTop: "auto",
                marginBottom: "-40px",
                padding: "16px 0",
                display: "flex",
                justifyContent: "center"
            }}>
                <Logo width={colapsado ? 60 : 150} height={colapsado ? 60 : 150} />
            </div>
        </div>
    )
}

export default Sidebar