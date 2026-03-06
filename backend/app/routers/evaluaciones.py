from fastapi import Depends, APIRouter, HTTPException
from sqlmodel import Session, select
from ..database import get_session

from ..models import Evaluacion, Materia
from ..schemas import EvaluacionCreate, EvaluacionUpdate, EvaluacionConEstadoMateria 

from ..services.motor_estados import calcular_estado
from ..enums import EstadoEvaluacion

router = APIRouter(tags=["evaluaciones"])

@router.get("/materias/{materia_id}/evaluaciones")
def listar_evaluaciones(materia_id: int, session: Session = Depends(get_session)):
    evaluaciones = session.exec(select(Evaluacion).where(Evaluacion.id_materia == materia_id)).all()

    return evaluaciones


@router.post("/materias/{materia_id}/evaluaciones", response_model=EvaluacionConEstadoMateria)
def crear_evaluacion(materia_id: int, evaluacion_data: EvaluacionCreate, session: Session = Depends(get_session)):
    materia = session.get(Materia, materia_id)
    if materia is None:
        raise HTTPException(status_code=404, detail="Materia no encontrada")

    evaluacion = Evaluacion.model_validate(evaluacion_data)
    evaluacion.id_materia = materia_id

    session.add(evaluacion)
    session.commit()
    session.refresh(evaluacion)

    evaluaciones_no_pendientes = session.exec(select(Evaluacion).where(Evaluacion.id_materia == materia_id).where(Evaluacion.estado != EstadoEvaluacion.pendiente)).all()

    #recalculo el estado
    materia.estado = calcular_estado(materia, evaluaciones_no_pendientes)

    session.add(materia)
    session.commit()
    session.refresh(materia)

    return {"evaluacion" :evaluacion, "materia" : materia, "alertas" : []} 


@router.put("/evaluaciones/{evaluacion_id}")
def actualizar_evaluacion(evaluacion_id: int, evaluacion_data: EvaluacionUpdate, session: Session = Depends(get_session)):
    evaluacion =  session.get(Evaluacion, evaluacion_id)
    if evaluacion is None:
        raise HTTPException(status_code=404, detail="Evaluacion no encontrada")
    
    materia = session.get(Materia, evaluacion.id_materia)
    if materia is None:
        raise HTTPException(status_code=404, detail="Materia no encontrada")


    data = evaluacion_data.model_dump(exclude_unset = True)
    evaluacion.sqlmodel_update(data)

    session.add(evaluacion)
    session.commit()
    session.refresh(evaluacion)

    evaluaciones_no_pendientes = session.exec(select(Evaluacion).where(Evaluacion.id_materia == evaluacion.id_materia).where(Evaluacion.estado != EstadoEvaluacion.pendiente)).all()

    #recalculo estado
    materia.estado = calcular_estado(materia, evaluaciones_no_pendientes) 

    session.add(materia)
    session.commit()
    session.refresh(materia)

    return {"evaluacion" : evaluacion, "materia": materia, "alertas" : []}



@router.delete("/evaluaciones/{evaluacion_id}")
def eliminar_evaluacion(evaluacion_id: int, session: Session = Depends(get_session)):
    evaluacion = session.get(Evaluacion, evaluacion_id)
    if evaluacion is None:
        raise HTTPException(status_code=404, detail="Evaluacion no encontrada")
    
    materia = session.get(Materia, evaluacion.id_materia)
    if materia is None:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    
    session.delete(evaluacion)
    session.commit()

    evaluaciones_no_pendientes = session.exec(select(Evaluacion).where(Evaluacion.id_materia == evaluacion.id_materia).where(Evaluacion.estado != EstadoEvaluacion.pendiente)).all()

    materia.estado = calcular_estado(materia, evaluaciones_no_pendientes)

    session.add(materia)
    session.commit()
    session.refresh(materia)

    return {"detail": "Evaluacion eliminada.", "materia": materia}
