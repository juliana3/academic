from sqlmodel import SQLModel
from ..enums import TipoAprobacion, TipoMateria, EstadoMateria
from datetime import date

class MateriaBase(SQLModel):
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

class MateriaCreate(MateriaBase):
    id_plan: int

class MateriaRead(MateriaBase):
    id: int
    id_plan: int
    estado : EstadoMateria = EstadoMateria.sin_cursar

class MateriaUpdate(SQLModel):
    nombre: str | None = None
    anio: int | None = None
    periodo: int | None = None
    tipo: TipoMateria | None = None
    tipo_aprobacion: TipoAprobacion | None = None
    nota_minima_parcial_regular: float | None = None
    nota_minima_parcial_promocion: float | None = None
    promedio_minimo_parciales_regular: float | None = None
    promedio_minimo_parciales_promocion: float | None = None
    cantidad_minima_tp_aprobados: int | None = None
    nota_minima_final: float | None = None
    nota_final: float | None = None
    fecha_estado: date | None = None
    fecha_inicio_cursada: date | None = None
