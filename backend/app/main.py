#instancia de fastapi y registro de los routers

from fastapi import FastAPI
from .database import crear_db_y_tablas
from .models import Plan, Materia, Evaluacion, Horario, Requisito

app = FastAPI()

@app.on_event("startup")
def on_startup():
    crear_db_y_tablas()
