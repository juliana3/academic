from fastapi import Depends, APIRouter, HTTPException
from sqlmodel import Session, select
from ..database import get_session
from ..models import Evento
from ..schemas import EventoCreate, EventoUpdate

router = APIRouter(prefix="/eventos", tags=["eventos"])

@router.get("/")
def listar_eventos(session: Session = Depends(get_session)):
    return session.exec(select(Evento)).all()

@router.post("/")
def crear_evento(evento_data: EventoCreate, session: Session = Depends(get_session)):
    evento = Evento(**evento_data.model_dump())
    session.add(evento)
    session.commit()
    session.refresh(evento)
    return evento

@router.put("/{evento_id}")
def actualizar_evento(evento_id: int, evento_data: EventoUpdate, session: Session = Depends(get_session)):
    evento = session.get(Evento, evento_id)
    if evento is None:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    data = evento_data.model_dump(exclude_unset=True)
    evento.sqlmodel_update(data)
    session.add(evento)
    session.commit()
    session.refresh(evento)
    return evento

@router.delete("/{evento_id}")
def eliminar_evento(evento_id: int, session: Session = Depends(get_session)):
    evento = session.get(Evento, evento_id)
    if evento is None:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    session.delete(evento)
    session.commit()
    return {"detail": "Evento eliminado"}