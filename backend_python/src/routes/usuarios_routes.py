from fastapi import APIRouter
from pydantic import BaseModel
from src.controllers.archivos_controller import subir_foto_perfil
from src.controllers.usuarios_controller import registrar_usuario, login_usuario

router = APIRouter()

# --- MODELOS DE DATOS (Lo que se espera en el req.body) ---
class Base64Image(BaseModel):
    base64Image: str

class RegistroData(BaseModel):
    username: str
    email: str
    password: str
    confirmPassword: str
    profile_image_url: str

class LoginData(BaseModel):
    username: str
    password: str

# --- ENDPOINTS ---
@router.post("/subir-foto")
def ruta_subir_foto(data: Base64Image):
    return subir_foto_perfil(data.base64Image)

@router.post("/registro")
def ruta_registro(data: RegistroData):
    return registrar_usuario(data)

@router.post("/login")
def ruta_login(data: LoginData):
    return login_usuario(data)