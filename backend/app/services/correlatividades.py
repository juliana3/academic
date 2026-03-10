# verifica si una materia esta habilitada

from ..enums import CondicionRequisito, EstadoMateria, ParaRequisito

def esta_habilitada_para_cursar(requisitos, materias_del_plan):
    faltantes = []

    for r in requisitos:
        if r.para != ParaRequisito.cursar:
            continue
        
        materia_requerida = next((m for m in materias_del_plan if m.id == r.id_materia_req))
        if materia_requerida is None:
            continue
        
        if r.condicion == CondicionRequisito.regular:
            estados_validos = [EstadoMateria.regular, EstadoMateria.promocionada, EstadoMateria.aprobada ]
        else:
            estados_validos = [EstadoMateria.aprobada]

        if materia_requerida.estado not in estados_validos:
            faltantes.append(materia_requerida.nombre)
            

    
    return faltantes


def esta_habilitada_para_rendir(requisitos, materias_del_plan) -> bool:
    for r in requisitos:
        if r.para == ParaRequisito.rendir_final:
            materia_requerida = [m for m in materias_del_plan if m.id == r.id_materia_req]

            if not materia_requerida:
                return False
            
            if r.condicion == CondicionRequisito.aprobada:
                if materia_requerida[0].estado != EstadoMateria.aprobada:
                    return False
                
            if r.condicion == CondicionRequisito.regular:
                if materia_requerida[0].estado not in [EstadoMateria.regular, EstadoMateria.promocionada, EstadoMateria.aprobada]:
                    return False
    
    return True

