import bcrypt
import jwt
import os
import datetime
from fastapi import HTTPException
from src.config.db import get_connection

JWT_SECRET = os.getenv("JWT_SECRET")

def registrar_usuario(data):
    if data.password != data.confirmPassword:
        raise HTTPException(status_code=400, detail="Las contraseñas no coinciden")

    conn = get_connection()
    cursor = conn.cursor()

    try:
        # 1. Validar que no exista
        cursor.execute(
            "SELECT uid FROM users WHERE username = %s OR email = %s", 
            (data.username, data.email)
        )
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="El nombre de usuario o correo ya está en uso")

        # 2. Encriptar contraseña
        hashed_password = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt())

        # 3. Insertar
        cursor.execute("""
            INSERT INTO users (username, email, password, profile_image_url)
            VALUES (%s, %s, %s, %s)
        """, (data.username, data.email, hashed_password.decode('utf-8'), data.profile_image_url))
        
        conn.commit()
        return {"mensaje": "Usuario registrado exitosamente"}

    except Exception as e:
        print(f"Error registro: {e}")
        # Re-lanzar HTTPExceptions, capturar el resto
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail="Error interno del servidor")
    finally:
        conn.close()

def login_usuario(data):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM users WHERE username = %s", (data.username,))
        user = cursor.fetchone()

        if not user:
            raise HTTPException(status_code=401, detail="Credenciales inválidas")

        # Comparar contraseñas
        if not bcrypt.checkpw(data.password.encode('utf-8'), user['password'].encode('utf-8')):
            raise HTTPException(status_code=401, detail="Credenciales inválidas")

        # Generar Token JWT (Expira en 24h)
        payload = {
            "uid": user['uid'],
            "username": user['username'],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

        return {
            "mensaje": "Login exitoso",
            "token": token,
            "usuario": {
                "uid": user['uid'],
                "username": user['username'],
                "profile_image_url": user['profile_image_url']
            }
        }

    except Exception as e:
        print(f"Error login: {e}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail="Error interno del servidor")
    finally:
        conn.close()