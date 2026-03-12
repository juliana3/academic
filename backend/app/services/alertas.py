#genera alertas en runtime

from datetime import date, timedelta

from ..schemas.alerta import AlertaRead
from ..enums import EstadoEvaluacion, TipoAlerta, EstadoMateria
from ..services.motor_estados import cumple_promocion
from ..services.horarios import detectar_superposiciones
from .correlatividades import esta_habilitada_para_cursar



def alertas_fechas_proximas( materias_cursando,todas_las_evaluaciones, dias_para_alerta):
    alertas = []

    hoy = date.today()

    fecha_limite = hoy + timedelta(days = dias_para_alerta)

    for evaluacion in todas_las_evaluaciones:
        if evaluacion.fecha <= fecha_limite and evaluacion.estado == EstadoEvaluacion.pendiente:
            for materia in materias_cursando:
                if materia.id == evaluacion.id_materia:
                    alertas.append(AlertaRead(
                        tipo = TipoAlerta.fecha_proxima,
                        id_materia = evaluacion.id_materia,
                        nombre_materia = materia.nombre,
                        mensaje = f"Tenés un {evaluacion.tipo.value.upper()} de {materia.nombre} el {evaluacion.fecha}",
                        prioridad = 1,
                        fecha_referencia = evaluacion.fecha
                    ))

    return alertas



def alertas_promocion_posible(materias_cursando, evaluaciones_por_materias : dict):
    alertas = []
    """
    el dict que viene tiene esta estructura:
    
    evaluaciones_por_materias = {
        id_materia: [evaluaciones],
    }
    """

    for materia in materias_cursando:
        evaluaciones = evaluaciones_por_materias.get(materia.id, [])
        if materia.estado not in [EstadoMateria.promocionada, EstadoMateria.aprobada]:
            if cumple_promocion(materia, evaluaciones):
                alertas.append(AlertaRead(
                    tipo = TipoAlerta.promocion_posible,
                    id_materia = materia.id,
                    nombre_materia = materia.nombre,
                    mensaje = f"Ya alcanzaste la promocion en {materia.nombre}.",
                    prioridad = 2,
                    fecha_referencia = None
                ))

    return alertas



def alertas_conflictos_horarios(todos_los_horarios, materias):
    alertas = []
    pares_de_conflictos = set() #guarda pares de horarios que ya se han reportado como conflicto para evitar alertas duplicadas

    for h in todos_los_horarios:
        superposiciones = detectar_superposiciones(h, todos_los_horarios)
        if superposiciones:
            for s in superposiciones:
                par = (min(h.id, s.id), max(h.id, s.id))

                if par in pares_de_conflictos:
                    continue
                else: 
                    pares_de_conflictos.add(par)

                    #genero la alerta
                    materia_superpuesta = next((m for m in materias if m.id == h.id_materia), None)

                    if materia_superpuesta is None:
                        continue
                    else:
                        dia = h.dia_semana.value if hasattr(h.dia_semana, 'value') else h.dia_semana
                        hora_inicio = str(h.hora_inicio)[:5]
                        hora_fin = str(h.hora_fin)[:5]

                        alertas.append(AlertaRead(
                            tipo = TipoAlerta.conflicto_horario,
                            id_materia = h.id_materia,
                            nombre_materia = materia_superpuesta.nombre ,
                            mensaje = f"El horario de {materia_superpuesta.nombre} el {dia} de {hora_inicio} a {hora_fin} se superpone con otro horario.",
                            prioridad = 3,
                            fecha_referencia = None
                        ))
    return alertas
    


def alertas_correlativas_bloqueadas(todas_las_materias, requisitos_por_materia : dict):
    alertas = []
    """
    el dict que viene tiene esta estructura:
    
    requisitos_por_materia = {
        id_materia: [requisitos],
    }
    """

    for materia in todas_las_materias:
        if materia.estado == EstadoMateria.sin_cursar:
            requisitos = requisitos_por_materia.get(materia.id,[])

            if not esta_habilitada_para_cursar(requisitos, todas_las_materias):
                alertas.append(AlertaRead(
                    tipo = TipoAlerta.bloqueada_correlativa,
                    id_materia = materia.id,
                    nombre_materia = materia.nombre ,
                    mensaje = f"No cumplís los requisitos para cursar {materia.nombre}.",
                    prioridad = 4,
                    fecha_referencia = None
                ))

    return alertas


def generar_alertas(
        todas_las_materias,
        todos_los_horarios,
        evaluaciones_por_materias : dict,
        requisitos_por_materia : dict,
        dias_para_alerta : int = 7) -> list[AlertaRead]:
    
    alertas = []
    materias_cursando = [m for m in todas_las_materias if m.estado == EstadoMateria.cursando]
    todas_las_evaluaciones = [e for evals in evaluaciones_por_materias.values() for e in evals]

    alertas += alertas_fechas_proximas(materias_cursando, todas_las_evaluaciones, dias_para_alerta)

    alertas += alertas_promocion_posible(materias_cursando, evaluaciones_por_materias)
    alertas += alertas_conflictos_horarios(todos_los_horarios, todas_las_materias)
    alertas += alertas_correlativas_bloqueadas(todas_las_materias, requisitos_por_materia)

    return sorted(alertas, key=lambda a: a.prioridad)
