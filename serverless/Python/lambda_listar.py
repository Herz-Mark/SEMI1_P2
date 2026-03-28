from fastapi import APIRouter, Header, HTTPException
import jwt
import os
import pymssql

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY")

def get_db_connection():
    return pymssql.connect(
        host=os.environ["DB_HOST"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        database=os.environ["DB_NAME"]
    )

@router.get("/archivos")
def listar_archivos(authorization: str = Header(None)):
    #  Validar token
    if not authorization:
        raise HTTPException(status_code=401, detail="Token requerido")

    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload["user_id"]
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido")

    # Conexión BD
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT file_name, file_type, file_url
        FROM archivos
        WHERE user_id = %s
    """, (user_id,))

    rows = cursor.fetchall()

    archivos = []

    for row in rows:
        file_name = row[0]
        file_type_db = row[1]
        file_url = row[2]

        # NORMALIZACIÓN DEL TIPO (CLAVE PARA LOS FILTROS)
        tipo = str(file_type_db).lower()

        if tipo in ["jpg", "jpeg", "png", "gif", "webp"]:
            tipo_normalizado = "Imagen"
        elif tipo in ["pdf", "doc", "docx", "xls", "xlsx", "txt"]:
            tipo_normalizado = "Documento"
        elif tipo in ["imagen", "image"]:
            tipo_normalizado = "Imagen"
        elif tipo in ["documento", "document"]:
            tipo_normalizado = "Documento"
        else:
            # fallback por seguridad
            tipo_normalizado = "Documento"

        archivos.append({
            "file_name": file_name,
            "file_type": tipo_normalizado,
            "file_url": file_url
        })

    cursor.close()
    conn.close()

    return archivos