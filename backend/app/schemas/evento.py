# schemas/evento.py
from sqlmodel import SQLModel
from datetime import date

class EventoBase(SQLModel):
    titulo: str
    fecha_inicio: date
    fecha_fin: date | None = None
    color: str | None = None

class EventoCreate(EventoBase):
    pass

class EventoRead(EventoBase):
    id: int

class EventoUpdate(SQLModel):
    titulo: str | None = None
    fecha_inicio: date | None = None
    fecha_fin: date | None = None
    color: str | None = None