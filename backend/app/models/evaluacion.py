from sqlmodel import SQLModel, Field # type: ignore
from ..enums import TipoEvaluacion, EstadoEvaluacion, ModalidadFinal
from datetime import date

class Evaluacion(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    id_materia: int = Field(foreign_key="materia.id", ondelete="CASCADE")
    tipo : TipoEvaluacion
    numero_de_instancia: int | None = None
    fecha: date
    nota: float | None = None
    estado: EstadoEvaluacion = Field(default=EstadoEvaluacion.pendiente)
    modalidad: ModalidadFinal | None = None
    reemplaza_evaluacion_id: int | None = Field(default=None, foreign_key="evaluacion.id")

    
