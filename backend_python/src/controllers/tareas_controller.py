from src.config.db import get_connection
from fastapi import HTTPException



# OBTENER
def obtener_tareas(uid):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM tasks WHERE uid = %s", (uid,))
    tareas = cursor.fetchall()

    conn.close()
    return tareas



# CREAR
def crear_tarea(uid, data):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO tasks (uid, titulo, descripcion, estado)
        VALUES (%s, %s, %s, %s)
    """, (uid, data.get("titulo"), data.get("descripcion"), "pendiente"))

    conn.commit()
    conn.close()

    return {"mensaje": "Tarea creada"}



# ACTUALIZAR
def actualizar_tarea(id, data):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE tasks
        SET titulo=%s, descripcion=%s, estado=%s
        WHERE task_id=%s
    """, (
        data.get("titulo"),
        data.get("descripcion"),
        data.get("estado"),
        id
    ))

    conn.commit()
    conn.close()

    return {"mensaje": "Actualizada"}


# ELIMINAR

def eliminar_tarea(id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM tasks WHERE task_id=%s", (id,))

    conn.commit()
    conn.close()

    return {"mensaje": "Eliminada"}