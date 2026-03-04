from sqlmodel import SQLModel, Field # type: ignore
from ..enums import CondicionRequisito, ParaRequisito
from sqlalchemy import UniqueConstraint # type: ignore

class Requisito(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    id_materia: int = Field(foreign_key="materia.id") #es materia.id_materia o materia.id? yo declare id solo en las clases
    id_materia_req: int = Field(foreign_key="materia.id")

    condicion : CondicionRequisito
    para: ParaRequisito

    __table_args__ = (
        UniqueConstraint("id_materia", "id_materia_req"),
    )
