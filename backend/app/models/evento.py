# models/evento.py
from sqlmodel import SQLModel, Field
from datetime import date

class Evento(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    titulo: str
    fecha_inicio: date
    fecha_fin: date | None = None
    color: str | None = None