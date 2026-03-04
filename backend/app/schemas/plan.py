from sqlmodel import SQLModel
from ..enums import TipoPlan
from datetime import date

class PlanBase(SQLModel):
    nombre: str
    tipo: TipoPlan
    institucion: str | None = None
    fecha_inicio: date
    esta_activo: bool = True

class PlanCreate(PlanBase):
    pass

class PlanRead(PlanBase):
    id: int

class PlanUpdate(SQLModel):
    nombre: str | None = None
    tipo: TipoPlan | None = None
    institucion: str | None = None
    fecha_inicio: date | None = None
    esta_activo: bool | None = None