from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import auth, ingest, search, analytics, admin

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Data Ingestion & Analytics Platform",
    description="Advanced AI/ML Data Platform with Security Simulations",
    version="1.0.0"
)

# CORS Simulation (Allow all for local dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(ingest.router)
app.include_router(search.router)
app.include_router(analytics.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"status": "active", "system": "DIAP-v1", "mode": "secure"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
