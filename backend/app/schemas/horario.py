from sqlmodel import SQLModel
from ..enums import DiaSemana
from datetime import time

class HorarioBase(SQLModel):
    dia_semana: DiaSemana
    hora_inicio: time
    hora_fin: time
    nombre : str | None = None

class HorarioCreate(HorarioBase):
    pass

class HorarioRead(HorarioBase):
    id: int
    id_materia: int

class HorarioUpdate(SQLModel):
    dia_semana: DiaSemana | None = None
    hora_inicio: time | None = None
    hora_fin: time | None = None