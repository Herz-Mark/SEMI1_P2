from fastapi import APIRouter, Request
from src.middlewares.auth_middleware import verificar_token
from src.controllers.tareas_controller import (
    obtener_tareas,
    crear_tarea,
    actualizar_tarea,
    eliminar_tarea
)

router = APIRouter()

# GET
@router.get("/")
def ruta_obtener_tareas(request: Request):
    payload = verificar_token(request)
    return obtener_tareas(payload["uid"])


# POST
@router.post("/")
def ruta_crear_tarea(data: dict, request: Request):
    payload = verificar_token(request)
    return crear_tarea(payload["uid"], data)


# PUT
@router.put("/{id}")
def ruta_actualizar_tarea(id: int, data: dict, request: Request):
    verificar_token(request)
    return actualizar_tarea(id, data)


# DELETE
@router.delete("/{id}")
def ruta_eliminar_tarea(id: int, request: Request):
    verificar_token(request)
    return eliminar_tarea(id)