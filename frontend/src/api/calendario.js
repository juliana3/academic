import api from "./axios"

const obtenerCalendario = () =>
    api.get("/horarios/calendario").then(res => res.data)

const crearEvento = (datos) =>
    api.post("/eventos/", datos).then(res => res.data)

const eliminarEvento = (eventoId) =>
    api.delete("/eventos/"+eventoId).then(res => res.data)


export {
    obtenerCalendario,
    crearEvento,
    eliminarEvento
}