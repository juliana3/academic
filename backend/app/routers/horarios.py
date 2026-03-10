from fastapi import Depends, APIRouter, HTTPException
from sqlmodel import Session, select
from ..database import get_session

from ..models import Horario, Materia
from ..schemas.horario import HorarioCreate, HorarioUpdate

from ..services.horarios import detectar_superposiciones
router = APIRouter(tags=["horarios"])

@router.get("/materias/{materia_id}/horarios")
def listar_horarios(materia_id : int, session : Session = Depends(get_session)):
    horarios = session.exec(select(Horario).where(Horario.id_materia == materia_id)).all()

    return horarios


@router.post("/materias/{materia_id}/horarios")
def crear_horario(materia_id : int, horario_data : HorarioCreate, session : Session = Depends(get_session)):
    materia = session.get(Materia, materia_id)
    if materia is None:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    
    horario = Horario(id_materia=materia_id, **horario_data.model_dump())
    horario.id_materia = materia_id

    session.add(horario)
    session.commit()
    session.refresh(horario)

    todos_los_horarios = session.exec(select(Horario)).all()

    superposiciones = detectar_superposiciones(horario, todos_los_horarios)

    return {"horario": horario, "superposiciones": superposiciones}

    


@router.put("/horarios/{horario_id}")
def actualizar_horario(horario_id : int, horario_data : HorarioUpdate, session: Session = Depends(get_session)):
    horario = session.get(Horario, horario_id)
    if horario is None:
        raise HTTPException(status_code=404, detail="Horario no encontrado")
    
    data = horario_data.model_dump(exclude_unset=True)
    horario.sqlmodel_update(data)

    session.add(horario)
    session.commit()
    session.refresh(horario)

    todos_los_horarios = session.exec(select(Horario)).all()

    superposiciones = detectar_superposiciones(horario, todos_los_horarios)

    return {"horario": horario, "superposiciones": superposiciones}
    


@router.delete("/horarios/{horario_id}")
def eliminar_horario(horario_id : int, session: Session = Depends(get_session)):
    horario = session.get(Horario, horario_id)
    if horario is None:
        raise HTTPException(status_code=404, detail="Horario no encontrado")
    
    session.delete(horario)
    session.commit()

    return{"detail": "Horario eliminado"}