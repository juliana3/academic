#conexion con sqlite, engine y session
from sqlmodel import create_engine, SQLModel, Session
from typing import Generator
from sqlalchemy import event

engine = create_engine("sqlite:///academic.db")

#creo las tablas
def crear_db_y_tablas():
    SQLModel.metadata.create_all(engine)

#manejar la sesion
def get_session() -> Generator:
    with Session(engine) as session:
        yield session

#activar las claves foraneas en sqlite
@event.listens_for(engine, "connect")
def activar_fk(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

