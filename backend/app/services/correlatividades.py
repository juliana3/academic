# verifica si una materia esta habilitada

from ..enums import CondicionRequisito, EstadoMateria, ParaRequisito

def esta_habilitada_para_cursar(requisitos, materias_del_plan) -> bool:
    for r in requisitos:
        if r.para == ParaRequisito.cursar:
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

