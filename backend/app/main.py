from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

# Import routers
from .routers import predictions, machines, dashboard, settings

# Initialize FastAPI app
app = FastAPI(
    title="PRESAGE API",
    description="A production-grade unified API for predictive maintenance, anomaly detection, and dashboard analytics.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your actual frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add GZip compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

@app.get("/")
def read_root():
    return {"message": "Welcome to the PRESAGE API"}

# Include routers
app.include_router(predictions.router, tags=["Predictions"])
app.include_router(machines.router, tags=["Machines"])
app.include_router(dashboard.router, tags=["Dashboard"])
app.include_router(settings.router, tags=["Settings"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
