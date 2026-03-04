from sqlmodel import SQLModel, Field # type: ignore
from ..enums import TipoPlan
from datetime import date

class Plan(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre : str
    tipo: TipoPlan
    institucion: str | None = None
    fecha_inicio: date
    esta_activo: bool = Field(default=True)