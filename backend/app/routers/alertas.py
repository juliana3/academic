from fastapi import Depends, APIRouter, HTTPException
from sqlmodel import Session, select
from ..database import get_session


from ..models import Materia, Horario, Evaluacion, Requisito

from ..schemas.alerta import AlertaResponse

from ..services.alertas import generar_alertas

router = APIRouter(prefix="/alertas", tags=["alertas"])

def _obtener_datos(session: Session):
    todas_las_materias = session.exec(select(Materia)).all()
    todos_los_horarios = session.exec(select(Horario)).all()
    
    evaluaciones_por_materia = {}
    for materia in todas_las_materias:
        evaluaciones = session.exec(select(Evaluacion).where(Evaluacion.id_materia == materia.id)).all()
        evaluaciones_por_materia[materia.id] = evaluaciones

    requisitos_por_materia = {}
    for materia in todas_las_materias:
        requisitos = session.exec(select(Requisito).where(Requisito.id_materia == materia.id)).all()
        requisitos_por_materia[materia.id] = requisitos

    return todas_las_materias, todos_los_horarios, evaluaciones_por_materia, requisitos_por_materia





@router.get("/")
def alertas_activas(session: Session = Depends(get_session)):

    
    todas_las_materias, todos_los_horarios,evaluaciones_por_materia, requisitos_por_materia = _obtener_datos(session)


    alertas = generar_alertas(todas_las_materias, todos_los_horarios, evaluaciones_por_materia, requisitos_por_materia, dias_para_alerta = 7)

    return AlertaResponse(alertas=alertas,total = len(alertas))




@router.get("/proximas")
def fechas_proximas(dias: int = 7, session: Session = Depends(get_session)):
    todas_las_materias, todos_los_horarios,evaluaciones_por_materia, requisitos_por_materia = _obtener_datos(session)

    
    alertas = generar_alertas(todas_las_materias, todos_los_horarios, evaluaciones_por_materia, requisitos_por_materia, dias)

    return AlertaResponse(alertas=alertas,total = len(alertas))