import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from src.routes.usuarios_routes import router as usuarios_router
from src.routes.tareas_routes import router as tareas_router

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"mensaje": "¡Backend de Python + FastAPI funcionando correctamente!"}

app.include_router(usuarios_router, prefix="/api/usuarios")
app.include_router(tareas_router, prefix="/api/tareas")

# Health Check para Azure / AWS Load Balancer
@app.get("/health")
def health_check():
    import datetime
    return {
        "status": "OK", 
        "entorno": "Python",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT"))
    # Al estar en la raíz, el módulo es simplemente "main"
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)