from datetime import date

from fastapi import Depends, APIRouter, HTTPException, UploadFile, File
from sqlmodel import Session, select
from ..database import get_session

from ..models import Materia, Requisito, Evaluacion
from ..schemas import MateriaCreate, MateriaUpdate

from ..enums import CondicionRequisito, EstadoMateria, ParaRequisito
from ..services.correlatividades import esta_habilitada_para_cursar

import openpyxl

router = APIRouter(tags=["materias"])

@router.get("/planes/{plan_id}/materias")
#listar todas las materias de 1 plan
def listar_materias(plan_id : int, session: Session = Depends(get_session)):
    materias = session.exec(select(Materia).where(Materia.id_plan == plan_id)).all()
    return materias

@router.post("/planes/{plan_id}/materias")
#crear una materia para un plan
def crear_materia(plan_id : int, materia_data : MateriaCreate, session: Session = Depends(get_session)):
    materia = Materia(id_plan=plan_id, **materia_data.model_dump())
    materia.id_plan = plan_id
    session.add(materia)
    session.commit()
    session.refresh(materia)
    return materia



@router.get("/materias/{materia_id}")
#obtener una materia por id
def obtener_materia_por_id(materia_id : int, session : Session = Depends(get_session)):
    materia = session.get(Materia, materia_id)
    if materia is None:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    
    return materia


@router.put("/materias/{materia_id}")
#actualizar una materia
def actualizar_materia(materia_id : int, materia_data: MateriaUpdate, session : Session = Depends(get_session)):
    materia = session.get(Materia, materia_id)

    if materia is None:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    
    data = materia_data.model_dump(exclude_unset=True)
    materia.sqlmodel_update(data)
    session.add(materia)
    session.commit()
    session.refresh(materia)
    return materia


@router.delete("/materias/{materia_id}")
#eliminar una materia
def eliminar_materia(materia_id: int, session : Session = Depends(get_session)):
    materia = session.get(Materia, materia_id)
    if materia is None:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    
    session.delete(materia)
    session.commit()
    return {"detail": "Materia eliminada"}


@router.post("/materias/{materia_id}/inscribir")
#inscribirse a una materia 
def inscribirse_materia(materia_id : int, session : Session = Depends(get_session)):
    #buscar la materia por id -> 404 si no existe
    materia = session.get(Materia, materia_id)
    if materia is None:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    
    #verifico que este sin cursar -> 400 si ya se eesta cursando
    if materia.estado == EstadoMateria.cursando:
        raise HTTPException(status_code=400, detail="Ya estás cursando esta materia")
    
    #obtengo los requisitos de la materia
    requisitos = session.exec(select(Requisito).where(Requisito.id_materia == materia_id)).all()

    #obtengo todas las materias del plan
    materias_plan = session.exec(select(Materia).where(Materia.id_plan == materia.id_plan)).all()

    #verifico correlatividades -> 400 si no se cumplen
    if not esta_habilitada_para_cursar(requisitos, materias_plan):
        raise HTTPException(status_code=400, detail="No se cumplen los requisitos para cursar esta materia")
    
    #seteo fecha de inicio de cursada, estado y guardo
    materia.fecha_inicio_cursada = date.today()
    materia.estado = EstadoMateria.cursando

    session.add(materia)
    session.commit()
    session.refresh(materia)

    return materia


@router.post("/materias/{materia_id}/reinscribir")
#reinscribirse a una materia
def reinscribirse_materia(materia_id : int, session : Session = Depends(get_session)):
    #buscar la materia por id -> 404 si no existe
    materia = session.get(Materia, materia_id)
    if materia is None:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    
    #verifico que este libre -> 400 si no esta libre
    if materia.estado != EstadoMateria.libre:
        raise HTTPException(status_code=400, detail="Solo puedes reinscribirte a materias libres")
    
    #borro las evaluaciones de esa materia
    evaluaciones = session.exec(select(Evaluacion).where(Evaluacion.id_materia == materia_id)).all()
    for e in evaluaciones:
        session.delete(e)

    #seteo fecha de inicio de cursada, estado y guardo
    materia.fecha_inicio_cursada = date.today()
    materia.estado = EstadoMateria.cursando

    session.add(materia)
    session.commit()
    session.refresh(materia)

    return materia


@router.post("/planes/{plan_id}/importar")
def importar_materias(plan_id : int, archivo : UploadFile = File (...), session : Session = Depends(get_session)):
    materias_creadas = []
    correlativas_pendientes = []
    numero_a_materia = {}
    requisitos_creados = set()

    workbook = openpyxl.load_workbook(archivo.file)
    hoja = workbook.active #primera hoja
    
    for fila in hoja.iter_rows(min_row=2, values_only=True): # type: ignore
        numero, nombre, anio, cuatrimestre, tipo, correlativas_cursar, correlativas_rendir, anio_completo = fila

        if nombre is None:
            continue

        materia = Materia(
            id_plan = plan_id,
            nombre = nombre, # type: ignore
            anio = anio, # type: ignore
            periodo = cuatrimestre, # type: ignore
            tipo = tipo # type: ignore
        )

        materias_creadas.append(materia)
        numero_a_materia[numero] = materia
        correlativas_pendientes.append((numero, correlativas_cursar, correlativas_rendir, anio_completo))
 

    # guardar todas las materias
    for m in materias_creadas:
        session.add(m)
    session.commit()
    for m in materias_creadas:
        session.refresh(m)


    # procesar correlativas
    for numero, corr_cursar, corr_rendir, anio_completo  in correlativas_pendientes:
        # buscar la materia que acabamos de crear
        materia = numero_a_materia.get(numero)
        if materia is None:
            continue
        
        
        #corre para cursar
        if corr_cursar:
            for num_req in str(corr_cursar).split("-"):
                m_req = numero_a_materia.get(int(num_req.strip()))
                if m_req is None:
                    continue

                par = (materia.id, m_req.id)
                if par not in requisitos_creados:
                    requisitos_creados.add(par)

                    session.add(Requisito(
                        id_materia = materia.id,
                        id_materia_req= m_req.id,
                        condicion = CondicionRequisito.regular,
                        para= ParaRequisito.cursar
                    ))

        #corre para rendir
        if corr_rendir:
            for num_req in str(corr_rendir).split("-"):
                m_req = numero_a_materia.get(int(num_req.strip()))
                if m_req is None:
                    continue

                par = (materia.id, m_req.id)
                if par not in requisitos_creados:
                    requisitos_creados.add(par)

                    session.add(Requisito(
                        id_materia = materia.id,
                        id_materia_req = m_req.id,
                        condicion= CondicionRequisito.aprobada,
                        para = ParaRequisito.rendir_final
                    ))


        #año completo requerido
        if anio_completo:
            materias_del_anio = [m for m in materias_creadas if m.anio == anio_completo]

            for m_req in materias_del_anio:
                if m_req.id == materia.id:
                    continue

                par = (materia.id, m_req.id)
                if par not in requisitos_creados:
                    requisitos_creados.add(par)

                    session.add(Requisito(
                        id_materia= materia.id,
                        id_materia_req = m_req.id,
                        condicion = CondicionRequisito.aprobada,
                        para = ParaRequisito.rendir_final
                    ))
        

    
    session.commit()

    return {"detail": f"{len(materias_creadas)} materias importadas"}