from backend.app.schemas.alerta import AlertaRead
from backend.app.schemas.materia import MateriaRead
from sqlmodel import SQLModel
from ..enums import TipoEvaluacion, EstadoEvaluacion, ModalidadFinal
from datetime import date

class EvaluacionBase(SQLModel):
    tipo: TipoEvaluacion
    numero_de_instancia: int | None = None
    fecha: date
    nota: float | None = None
    estado: EstadoEvaluacion = EstadoEvaluacion.pendiente
    modalidad : ModalidadFinal | None = None
    

class EvaluacionCreate(EvaluacionBase):
    id_materia: int


class EvaluacionRead(EvaluacionBase):
    id: int
    id_materia: int 
    reemplaza_evaluacion_id: int | None = None

class EvaluacionUpdate(SQLModel):
    tipo: TipoEvaluacion | None = None
    numero_de_instancia: int | None = None
    fecha: date | None = None
    nota: float | None = None
    modalidad : ModalidadFinal | None = None
    reemplaza_evaluacion_id: int | None = None


class EvaluacionConEstadoMateria(SQLModel):
    evaluacion: EvaluacionRead
    materia: MateriaRead
    alertas: list[AlertaRead] = []