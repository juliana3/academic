import api from "./axios"

async function  obtenerPlanes(){
    try {
        const respuesta = await api.get("/planes")
        return respuesta.data
    } catch (error){
        console.error("Error: ", error)
        throw error
    }
    
}

async function crearPlan(datos) {
    try {
        const respuesta = await api.post("/planes", datos)
        return respuesta.data
    } catch (error){
        console.error("Error: ", error)
        throw error
    }
}

async function obtenerPlan(id){
    try{
        const respuesta = await api.get("/planes/"+id)
        return respuesta.data
    } catch (error) {
        console.error("Error: ", error)
        throw error
    }
}

async function actualizarPlan(id, datos){
    try{
       const respuesta = await api.put("/planes/"+id, datos)
        return respuesta.data
    } catch (error) {
        console.error("Error: ", error)
        throw error
        
    }
}


async function eliminarPlan(id){
    try {
        const respuesta = await api.delete("/planes/"+id)
        return respuesta.data
    } catch (error){
        console.error("Error: ", error)
        throw error
    }
}

const obtenerRequisitosDelPlan = (planId) => {
    return api.get(`/planes/${planId}/requisitos`).then(res => res.data)
}


export{ 
    obtenerPlanes,
    crearPlan,
    obtenerPlan,
    actualizarPlan,
    eliminarPlan,
    obtenerRequisitosDelPlan
}