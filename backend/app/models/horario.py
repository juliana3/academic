from sqlmodel import SQLModel, Field # type: ignore
from ..enums import DiaSemana
from datetime import time

class Horario(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    id_materia: int = Field(foreign_key="materia.id", ondelete="CASCADE")
    dia_semana: DiaSemana
    hora_inicio: time
    hora_fin: time
