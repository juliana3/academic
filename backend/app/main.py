#instancia de fastapi y registro de los routers
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import crear_db_y_tablas
from .models import Plan, Materia, Evaluacion, Horario, Requisito, Evento
from .routers import planes, materias, evaluaciones, horarios, requisitos, alertas, eventos, auth


app = FastAPI()

@app.on_event("startup")
def on_startup():
    crear_db_y_tablas()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(planes.router)
app.include_router(materias.router)
app.include_router(evaluaciones.router)
app.include_router(horarios.router)
app.include_router(requisitos.router)
app.include_router(alertas.router)
app.include_router(eventos.router)
app.include_router(auth.router)

