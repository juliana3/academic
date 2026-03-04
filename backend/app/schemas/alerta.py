from sqlmodel import SQLModel
from ..enums import TipoAlerta
from datetime import date

class AlertaRead(SQLModel):
    tipo: TipoAlerta
    id_materia: int
    nombre_materia: str
    mensaje: str
    prioridad: int
    fecha_referencia: date | None = None


class AlertaResponse(SQLModel):
    alertas: list[AlertaRead]
    total: int