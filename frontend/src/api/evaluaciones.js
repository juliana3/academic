import api from "./axios"

async function obtenerEvaluaciones(materiaId){
    try {
        const respuesta = await api.get("/materias/"+materiaId+"/evaluaciones")
        return respuesta.data
    }catch(error){
        console.error("Error", error)
        throw error
    }
}


async function crearEvaluacion(materiaId, datos){
    try{
        const respuesta = await api.post("/materias/"+materiaId+"/evaluaciones", datos)
        return respuesta.data
    }catch(error){
        console.error("Error", error)
        throw error
    }
}

async function actualizarEvaluacion(evaluacionId, datos){
    try{
        const respuesta = await api.put("/evaluaciones/"+evaluacionId, datos)
        return respuesta.data
    }catch(error){
        console.error("Error", error)
        throw error
    }
}

async function eliminarEvaluacion(evaluacionId){
    try {
        const respuesta = await api.delete("/evaluaciones/"+evaluacionId)
        return respuesta.data
    }catch(error){
        console.error("Error", error)
        throw error
    }
}


export {
    obtenerEvaluaciones,
    crearEvaluacion,
    actualizarEvaluacion,
    eliminarEvaluacion
}