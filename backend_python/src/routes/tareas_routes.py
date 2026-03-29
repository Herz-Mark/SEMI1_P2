from fastapi import APIRouter
from src.controllers.tareas_controller import (
    obtener_tareas,
    crear_tarea,
    actualizar_tarea,
    eliminar_tarea
)

router = APIRouter()

# ✅ GET con uid en la URL (como tu frontend)
@router.get("/{uid}")
def ruta_obtener_tareas(uid: str):
    return obtener_tareas(uid)


# POST (se mantiene igual)
@router.post("/")
def ruta_crear_tarea(data: dict):
    return crear_tarea(data.get("uid"), data)


# PUT
@router.put("/{id}")
def ruta_actualizar_tarea(id: int, data: dict):
    return actualizar_tarea(id, data)


# DELETE
@router.delete("/{id}")
def ruta_eliminar_tarea(id: int):
    return eliminar_tarea(id)