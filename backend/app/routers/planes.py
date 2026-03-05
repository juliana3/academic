from fastapi import Depends, APIRouter, HTTPException
from sqlmodel import Session, select
from ..database import get_session

from ..models import Plan
from ..schemas import PlanCreate, PlanUpdate

router = APIRouter(prefix="/planes", tags=["planes"])

@router.get("/")
def listar_planes(session: Session = Depends(get_session)):
    planes =  session.exec(select(Plan)).all()
    return planes


@router.post("/")
def crear_plan(plan_data : PlanCreate, session: Session = Depends(get_session)):
    plan = Plan.model_validate(plan_data)
    session.add(plan)
    session.commit()
    session.refresh(plan)
    return plan


@router.get("/{plan_id}")
def obtener_plan_por_id(plan_id : int, session : Session = Depends(get_session)):
    plan = session.get(Plan, plan_id)
    if plan is None:
        raise HTTPException(status_code=404, detail="Plan no encontrado")


    return plan

@router.put("/{plan_id}")
def actualizar_plan(plan_id : int, plan_data : PlanUpdate, session : Session = Depends(get_session)):
    plan = session.get(Plan, plan_id)

    if plan is None:
        raise HTTPException(status_code=404, detail="Plan no encontrado")
    
    data = plan_data.model_dump(exclude_unset=True)
    plan.sqlmodel_update(data)
    session.add(plan)
    session.commit()
    session.refresh(plan)
    return plan


@router.delete("/{plan_id}")
def eliminar_plan(plan_id: int, session : Session = Depends(get_session)):
    plan = session.get(Plan, plan_id)
    if plan is None:
        raise HTTPException(status_code=404, detail="Plan no encontrado")
    session.delete(plan)
    session.commit()
    return {"detail": "Plan eliminado"}