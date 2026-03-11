#verifica superposicion de horarios

def detectar_superposiciones(horario_nuevo, todos_los_horarios) -> list:
    superposiciones = [] #guarda los horarios existentes con los que se superpone el nuevo horario

    for h in todos_los_horarios:
        if h.id == horario_nuevo.id:
            continue
        
        if h.dia_semana == horario_nuevo.dia_semana:
            if h.hora_inicio < horario_nuevo.hora_fin and horario_nuevo.hora_inicio < h.hora_fin:
                superposiciones.append(h)

    return superposiciones
