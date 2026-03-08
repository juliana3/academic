import api from "./axios"

async function obtenerHorarios(materiaId){
    try { 
        const respuesta = await api.get("/materias/"+materiaId+"/horarios")
        return respuesta.data
    }catch(error){
        console.error("Error", error)
        throw error
    }
}


async function crearHorario(materiaId, datos) {
    try {
        const respuesta = await api.post("/materias/"+materiaId+"/horarios", datos)
        return respuesta.data
    }catch (error){
        console.error("Error", error)
        throw error
    }
}


async function actualizarHorario(horarioId, datos){
    try{
        const respuesta = await api.put("/horarios/"+horarioId, datos)
        return respuesta.data
    }catch (error){
        console.error("Error", error)
        throw error
    }
}

async function eliminarHorario(horarioId){
    try {
        const respuesta = await api.delete("/horarios/"+horarioId)
        return respuesta.data
    }catch (error){
        console.error("Error", error)
        throw error
    }
}


export {
    obtenerHorarios,
    crearHorario,
    actualizarHorario,
    eliminarHorario
}