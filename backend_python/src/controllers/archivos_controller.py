import boto3
import base64
import re
import time
import os
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

# 1. Configuración dinámica
s3_client = boto3.client(
    's3',
    region_name=os.getenv("AWS_REGION"),
    endpoint_url=os.getenv("AWS_ENDPOINT_URL"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

def subir_foto_perfil(base64_image: str):
    if not base64_image:
        raise HTTPException(status_code=400, detail="No se proporcionó ninguna imagen")

    # 2. Limpieza robusta del Base64
    match = re.match(r"^data:(image/[A-Za-z-+\/]+);base64,(.+)$", base64_image)
    
    if not match:
        raise HTTPException(status_code=400, detail="Formato de imagen inválido")

    content_type = match.group(1)
    base64_data = match.group(2)
    image_buffer = base64.b64decode(base64_data)

    # 3. Crear nombre único
    extension = content_type.split('/')[1] if '/' in content_type else 'jpg'
    file_name = f"perfil-{int(time.time() * 1000)}.{extension}"
    bucket_name = os.getenv("AWS_BUCKET_NAME")

    try:
        # 4. Subir a MinIO / S3
        s3_client.put_object(
            Bucket=bucket_name,
            Key=file_name,
            Body=image_buffer,
            ContentType=content_type
        )

        # 5. Construir la URL
        image_url = f"{os.getenv('AWS_ENDPOINT_URL')}/{bucket_name}/{file_name}"
        
        return {"mensaje": "Imagen subida con éxito", "url": image_url}
    
    except Exception as e:
        print(f"Error S3: {e}")
        raise HTTPException(status_code=500, detail="Error interno al guardar la imagen")