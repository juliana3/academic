#calcula estados de una materia"
from ..enums import TipoAprobacion, TipoEvaluacion, EstadoEvaluacion, EstadoMateria, ModalidadFinal

""" Recibe materia y evaluaciones y devuelve el estado de la materia """

def resolver_recuperatorios(evaluaciones):
    #reciba lista de evaluaciones y devuelve lista limpia sin los parciales reemplazados

    ids_reemplazados = []
    for e in evaluaciones:
        if e.reemplaza_evaluacion_id:
            ids_reemplazados.append(e.reemplaza_evaluacion_id)
    
 
    evaluaciones_limpias =[]
    for e in evaluaciones:
        if e.id not in ids_reemplazados:
            evaluaciones_limpias.append(e)

    return evaluaciones_limpias


def cumple_regularidad(materia, evaluaciones):
    #recibe la mateeria y la lista limpia de parciales. Devuelve true o false
    #regularidad: cada parcial debe tener nota mayor o igual a nota minima de regularidad, cantidad de tps aprobados debe ser mayor o igual a cantidad minima de tps aprobados y promedio debe ser mayor o igual a promedio minimo de regularidad
    if materia.nota_minima_parcial_regular is None:
        return False
    
    parciales = [e for e in evaluaciones if e.tipo == TipoEvaluacion.parcial]

    tps_aprobados = [e for e in evaluaciones if e.tipo == TipoEvaluacion.tp and e.estado == EstadoEvaluacion.aprobado]

    promedio_parciales = sum(p.nota for p in parciales)/ len(parciales) if parciales else 0

    return (
        all(p.nota >= materia.nota_minima_parcial_regular for p in parciales) 
        and len(tps_aprobados) >= materia.cantidad_minima_tp_aprobados 
        and promedio_parciales >= materia.promedio_minimo_parciales_regular
    )

    


def cumple_promocion(materia, evaluaciones):
    #recibe la mateeria y la lista limpia de parciales. Devuelve true o false
    #promocion: cada parcial debe tener nota mayor o igual a nota minima de promocions y promedio debe ser mayor o igual a promedio minimo de promocion
    if materia.nota_minima_parcial_promocion is None:
        return False
    
    parciales = [e for e in evaluaciones if e.tipo == TipoEvaluacion.parcial]
    if materia.tipo_aprobacion == TipoAprobacion.solo_final:
        return False
    
    promedio_parciales = sum(p.nota for p in parciales)/ len(parciales) if parciales else 0

    return(
        all(p.nota >= materia.nota_minima_parcial_promocion for p in parciales) 
        and promedio_parciales >= materia.promedio_minimo_parciales_promocion
    )



def calcular_estado(materia, evaluaciones):
    #recibe materia y evaluaciones y devuelve el estado de la materia
    evaluaciones_limpias = resolver_recuperatorios(evaluaciones)

    final = [e for e in evaluaciones_limpias if e.tipo == TipoEvaluacion.final]

    if materia.fecha_inicio_cursada is None:
        if final and final[0].modalidad == ModalidadFinal.libre and  final[0].estado == EstadoEvaluacion.aprobado:
            return EstadoMateria.aprobada
        
        return EstadoMateria.sin_cursar
   
    

    if final and final[0].estado == EstadoEvaluacion.aprobado and (final[0].modalidad == ModalidadFinal.regular or final[0].modalidad == ModalidadFinal.libre):
        return EstadoMateria.aprobada
    
    if materia.tipo_aprobacion is None or materia.nota_minima_parcial_regular is None:
        return EstadoMateria.cursando
    
    if not cumple_regularidad(materia, evaluaciones_limpias):
        return EstadoMateria.libre
    
    if materia.tipo_aprobacion == TipoAprobacion.solo_final:
        return EstadoMateria.regular
    
    if cumple_promocion(materia, evaluaciones_limpias):
        if materia.tipo_aprobacion == TipoAprobacion.promocion:
            return EstadoMateria.aprobada
        elif materia.tipo_aprobacion == TipoAprobacion.promocion_con_final:
            return EstadoMateria.promocionada
        
    return EstadoMateria.regular
        
        

