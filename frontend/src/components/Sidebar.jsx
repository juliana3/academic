import { useNavigate, useLocation } from "react-router-dom";
import {LayoutDashboard, BookOpen, ChevronLeft, ChevronRight} from "lucide-react"

const links = [
    {path: "/", label: "Dashboard", icon: <LayoutDashboard size={18}/>},
    {path: "/planes", label: "Planes", icon: <BookOpen size={18}/>},
]


function Sidebar({colapsado, setColapsado}) {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <div style={{
            width: colapsado ? "60px" : "200px",
            minHeight: "100vh",
            borderRight: "1px solid #ccc",
            padding: "20px 0",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            position: "fixed",
            left: 0,
            top: 0,
            backgroundColor: "white",
            zIndex: 100,
            transition: "width 0.2s ease"
        }}>
            <div style={{ padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                {!colapsado && <h2 style={{ margin: 0 }}>Académico</h2>}
                <button onClick={() => setColapsado(!colapsado)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                    {colapsado ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {links.map(link => (
                <div key={link.path}
                    onClick={() => navigate(link.path)}
                    style={{
                        padding: "10px 16px",
                        cursor: "pointer",
                        borderRadius: "4px",
                        margin: "0 8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        background: location.pathname === link.path ? "#eee" : "transparent",
                        fontWeight: location.pathname === link.path ? "bold" : "normal"
                    }}>
                    {link.icon}
                    {!colapsado && <span>{link.label}</span>}
                </div>
            ))}
        </div>
    )
}

export default Sidebar