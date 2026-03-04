from sqlmodel import SQLModel
from ..enums import CondicionRequisito, ParaRequisito

class RequisitoBase(SQLModel):
    condicion: CondicionRequisito
    para: ParaRequisito

class RequisitoCreate(RequisitoBase):
    id_materia: int
    id_materia_req: int

class RequisitoRead(RequisitoBase):
    id: int
    id_materia: int
    id_materia_req: int
