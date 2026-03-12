from fastapi import Depends, APIRouter, HTTPException
from sqlmodel import Session, col, select
from ..database import get_session

from ..models import Horario, Materia, Evento, Evaluacion, Plan
from ..schemas.horario import HorarioCreate, HorarioUpdate, HorarioRead
from ..enums import EstadoMateria

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

   
    
@router.get("/horarios/calendario")
def calendario(session: Session = Depends(get_session)):
    
    # materias cursando
    materias_cursando = session.exec(
        select(Materia).where(Materia.estado == EstadoMateria.cursando)
    ).all()
    ids_materias = [m.id for m in materias_cursando]

    # horarios
    horarios = session.exec(
        select(Horario).where(col(Horario.id_materia).in_(ids_materias))
    ).all()

    horarios_data = []

    for h in horarios:
        materia = next(m for m in materias_cursando if m.id == h.id_materia)
        plan = session.get(Plan, materia.id_plan)
        nombre_plan = plan.nombre if plan else ""

        if h.nombre:
            titulo = f"{materia.nombre} - {h.nombre}"
        else:
            titulo = f"{materia.nombre} - {nombre_plan}" if nombre_plan else materia.nombre

        horarios_data.append({
            "id": f"horario-{h.id}",
            "dia_semana": h.dia_semana,
            "hora_inicio": str(h.hora_inicio),
            "hora_fin": str(h.hora_fin),
            "materia_nombre": titulo,            
            "materia_id": materia.id
        })

    # evaluaciones
    evaluaciones = session.exec(
        select(Evaluacion).where(col(Evaluacion.id_materia).in_(ids_materias))
    ).all()

    eventos_evaluaciones = []
    
    for e in evaluaciones:
        if e.fecha is None:
            continue
        materia = next(m for m in materias_cursando if m.id == e.id_materia)
        eventos_evaluaciones.append({
            "id": f"eval-{e.id}",
            "titulo": f"{e.tipo} - {materia.nombre}",
            "fecha": str(e.fecha),
            "materia_id": materia.id
        })

    # eventos personales
    eventos = session.exec(select(Evento)).all()
    eventos_data = [
        {
            "id": f"evento-{ev.id}",
            "titulo": ev.titulo,
            "fecha_inicio": str(ev.fecha_inicio),
            "fecha_fin": str(ev.fecha_fin) if ev.fecha_fin else None,
            "color": ev.color
        }
        for ev in eventos
    ]

    return {
        "horarios": horarios_data,
        "evaluaciones": eventos_evaluaciones,
        "eventos": eventos_data
    }


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

    #formateo de horario
    horario_dict = HorarioRead.model_validate(horario).model_dump()
    horario_dict["hora_inicio"] = str(horario_dict["hora_inicio"])[:5]
    horario_dict["hora_fin"] = str(horario_dict["hora_fin"])[:5]

    return {
        "horario": horario_dict,
        "superposiciones": superposiciones      
    }
    


@router.delete("/horarios/{horario_id}")
def eliminar_horario(horario_id : int, session: Session = Depends(get_session)):
    horario = session.get(Horario, horario_id)
    if horario is None:
        raise HTTPException(status_code=404, detail="Horario no encontrado")
    
    session.delete(horario)
    session.commit()

    return{"detail": "Horario eliminado"}




