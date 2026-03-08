import api from "./axios"

async function obtenerAlertasActivas(){
    try {
        const respuesta = await api.get("/alertas")
        return respuesta.data
    }catch (error){
        console.error("Error", error)
        throw error
    }
}

async function obtenerFechasProximas(dias = 7){
    try {
        const respuesta = await api.get(`/alertas/proximas?dias=${dias}`)
        return respuesta.data
    }catch(error){
        console.error("Error", error)
        throw error
    }
}


export {
    obtenerAlertasActivas,
    obtenerFechasProximas
}