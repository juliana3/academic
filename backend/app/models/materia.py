from sqlmodel import SQLModel, Field # type: ignore
from ..enums import TipoMateria, TipoAprobacion, EstadoMateria
from datetime import date

class Materia(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    id_plan: int = Field(foreign_key="plan.id", ondelete="CASCADE")
    nombre: str
    anio: int
    periodo: int
    tipo: TipoMateria
    tipo_aprobacion: TipoAprobacion
    nota_minima_parcial_regular: float
    nota_minima_parcial_promocion: float | None = None
    promedio_minimo_parciales_regular: float
    promedio_minimo_parciales_promocion: float | None = None
    cantidad_minima_tp_aprobados: int
    nota_minima_final: float
    nota_final: float | None = None
    fecha_estado: date | None = None
    fecha_inicio_cursada: date | None = None
    estado : EstadoMateria = Field(default=EstadoMateria.sin_cursar)