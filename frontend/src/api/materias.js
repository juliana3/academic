import api from "./axios"

async function obtenerMaterias(planId){
    try {
        const respuesta = await api.get("/planes/"+planId+"/materias")
        return respuesta.data

    }catch (error){
        console.error("Error" ,error)
        throw error
    }
}

async function crearMateria(planId, datos){
    try {
        const respuesta = await api.post("/planes/"+planId+"/materias", datos)
        return respuesta.data
    }catch (error){
        console.error("Detalle Error", error.response.data)
        throw error
    }
}

async function obtenerMateria(materiaId){
    try {
        const respuesta = await api.get("/materias/"+materiaId)
        return respuesta.data
    }catch(error){
        console.error("Error", error)
        throw error
    }
}

async function actualizarMateria(materiaId, datos){
    try {
        const respuesta = await api.put("/materias/"+materiaId, datos)
        return respuesta.data
    }catch (error){
        console.error("Error", error)
        throw error
    }
}

async function eliminarMateria(materiaId){
    try{
        const respuesta = await api.delete("/materias/"+materiaId)
        return respuesta.data
    }catch(error){
        console.error("Error", error)
        throw error
    }
}


async function inscribirMateria(materiaId){
    try{
        const respuesta = await api.post("/materias/"+materiaId+"/inscribir")
        return respuesta.data
    }catch(error){
        console.error("Error", error)
        throw error
    }
}


async function reinscribirMateria(materiaId){
    try{
        const respuesta = await api.post("/materias/"+materiaId+"/reinscribir")
        return respuesta.data
    }catch(error){
        console.error("Error", error)
        throw error
    }
}

const aprobarMateria = (materiaId) =>
    api.post("/materias/"+materiaId+"/aprobar").then(res => res.data)


const importarMaterias = (planId, archivo) => {
    const formData = new FormData()
    formData.append("archivo", archivo)
    return api.post("/planes/" +planId+"/importar", formData,{
        headers : { "Content-Type" : "multipart/form-data"}
    }).then(res => res.data)
}


export {
    obtenerMaterias,
    crearMateria,
    obtenerMateria,
    actualizarMateria,
    eliminarMateria,
    inscribirMateria,
    reinscribirMateria,
    aprobarMateria,
    importarMaterias
}