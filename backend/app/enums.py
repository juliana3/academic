#todos los enums
from enum import Enum

"""
class NombreEnum(str, Enum):
    valor1 = "valor1"
    valor2 = "valor2"
"""

class TipoPlan(str, Enum):
    facultad = "facultad"
    idioma = "idioma"
    capacitacion = "capacitacion"

class TipoMateria(str, Enum):
    obligatoria = "obligatoria"
    optativa = "optativa"
    electiva = "electiva"


class TipoAprobacion(str, Enum):
    solo_final = "solo_final"
    promocion = "promocion"
    promocion_con_final = "promocion_con_final"

class EstadoMateria(str, Enum):
    sin_cursar = "sin_cursar"
    cursando = "cursando"
    regular = "regular"
    promocionada = "promocionada"
    libre = "libre"
    aprobada = "aprobada"


class TipoEvaluacion(str, Enum):
    parcial = "parcial"
    final = "final"
    tp = "tp"
    recuperatorio = "recuperatorio"

class EstadoEvaluacion(str, Enum):
    pendiente = "pendiente"
    aprobado= "aprobado"
    desaprobado = "desaprobado"

class ModalidadFinal(str, Enum):
    regular = "regular"
    libre = "libre"

class DiaSemana(str, Enum):
    lunes = "lunes"
    martes = "martes"
    miercoles = "miercoles"
    jueves = "jueves"
    viernes = "viernes"
    sabado = "sabado"
    domingo = "domingo"

class CondicionRequisito(str, Enum):
    aprobada = "aprobada"
    regular = "regular"

class ParaRequisito(str, Enum):
    cursar = "cursar"
    rendir_final = "rendir_final"

class TipoAlerta(str,Enum):
    fecha_proxima = "fecha_proxima"
    promocion_posible = "promocion_posible"
    conflicto_horario = "conflicto_horario"
    bloqueada_correlativa = "bloqueada_correlativa"
    promocion_perdida = "promocion_perdida"
    regularidad_perdida = "regularidad_perdida"