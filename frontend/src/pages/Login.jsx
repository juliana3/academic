import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../api/axios"
import Logo from "../assets/correlax_icon.svg?react"

function Login() {
    const navigate = useNavigate()
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)

    const handleLogin = () => {
        axios.post("/login", { password })
            .then(res => {
                localStorage.setItem("token", res.data.token)
                navigate("/")
            })
            .catch(() => setError("Contraseña incorrecta"))
    }

    return (
        <div style={{
            width: "100vw", height: "100vh",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "var(--bg-primary)"
        }}>
            <div style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "40px",
                width: "320px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px"
            }}>
                <div style={{ width: "180px", height: "130px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Logo width={250} height={250} style={{ marginTop: "-5px" }} />
                </div>
                <h2 style={{ color: "var(--accent)", letterSpacing: "4px", fontWeight: "300" }}>CORRELAX</h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>seguimiento académico</p>

                {error && <p style={{ color: "var(--estado-libre)", fontSize: "13px" }}>{error}</p>}

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    style={{ width: "100%" }}
                />
                <button onClick={handleLogin} style={{ width: "100%" }}>
                    Ingresar
                </button>
            </div>
        </div>
    )
}

export default Login