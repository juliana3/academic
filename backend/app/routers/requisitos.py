from fastapi import Depends, APIRouter, HTTPException
from sqlmodel import Session, select
from ..database import get_session

from ..models import Requisito, Materia
from ..schemas.requisito import RequisitoCreate

from ..services.correlatividades import esta_habilitada_para_cursar

router = APIRouter(tags=["requisitos"])


@router.get("/materias/{materia_id}/requisitos")
def listar_requisitos(materia_id : int, session: Session = Depends(get_session)):
    requisitos = session.exec(select(Requisito).where(Requisito.id_materia == materia_id)).all()

    return requisitos


@router.post("/materias/{materia_id}/requisitos")
def crear_requisito(materia_id : int, requisito_data : RequisitoCreate, session : Session = Depends(get_session)):
    
    requisito = Requisito.model_validate(requisito_data)
    materia = session.get(Materia, materia_id)
    if materia is None:
        raise HTTPException(status_code = 404, detail="Materia no encontrada")
    
    materia_requerida =  session.get(Materia, requisito_data.id_materia_req)
    if materia_requerida is None:
        raise HTTPException(status_code = 404, detail="Materia requerida no encontrada")

    #verifico si existe el par
    existe = session.exec(select(Requisito).where(Requisito.id_materia == materia_id).where(Requisito.id_materia_req == requisito_data.id_materia_req)).first()

    if existe:
        raise HTTPException(status_code=400, detail="El requisito ya existe")
    

    requisito.id_materia = materia_id

    

    session.add(requisito)
    session.commit()
    session.refresh(requisito)

    return requisito


@router.delete("/requisitos/{requisito_id}")
def eliminar_requisito(requisito_id : int, session : Session = Depends(get_session)):
    requisito = session.get(Requisito, requisito_id)
    if requisito is None:
        raise HTTPException(status_code=404, detail="Requisito no encontraado")
    
    session.delete(requisito)
    session.commit()

    return{"detail": "Requisito eliminado"}


@router.get("/materias/{materia_id}/habilitada")
def esta_habilitada(materia_id : int, session : Session = Depends(get_session)):
    materia = session.get(Materia, materia_id)

    if materia is None:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    
    requisitos = session.exec(select(Requisito).where(Requisito.id_materia == materia_id)).all()

    materias_del_plan = session.exec(select(Materia).where(Materia.id_plan == materia.id_plan)) 

    esta_habilitada = esta_habilitada_para_cursar(requisitos, materias_del_plan)
    return {"habilitada" : esta_habilitada}

