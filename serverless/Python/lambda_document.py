import json
import base64
import boto3
import pymssql
import os
import jwt

s3 = boto3.client(
    "s3",
    endpoint_url=os.environ["AWS_ENDPOINT_URL"],
    aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
    aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    region_name=os.environ["AWS_REGION"]
)

def get_db_connection():
    return pymssql.connect(
        server=os.environ["DB_HOST"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        database=os.environ["DB_NAME"]
    )

def lambda_handler(event, context):
    try:
        body = json.loads(event["body"])

        file = body["file"]
        file_name = body["fileName"]
        content_type = body["contentType"]

        # Validar que NO sea imagen
        if content_type.startswith("image/"):
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Solo documentos permitidos"})
            }

        # JWT
        token = event["headers"].get("Authorization", "").split(" ")[-1]
        decoded = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=["HS256"])
        uid = decoded["uid"]

        file_bytes = base64.b64decode(file)
        key = f"documentos/{file_name}"

        # Subir a S3
        s3.put_object(
            Bucket=os.environ["AWS_BUCKET_NAME"],
            Key=key,
            Body=file_bytes,
            ContentType=content_type
        )

        file_url = f"{os.environ['AWS_ENDPOINT_URL']}/{os.environ['AWS_BUCKET_NAME']}/{key}"

        # Guardar en DB
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO files (uid, file_name, file_url, file_type)
            VALUES (%s, %s, %s, %s)
        """, (uid, file_name, file_url, "Documento"))

        conn.commit()
        conn.close()

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Documento subido correctamente",
                "url": file_url
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }