
import os
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

app = FastAPI()

# Check for critical environment variables at startup
CRITICAL_VARS = [
    "API_KEY",
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
]

@app.get("/api/health")
async def health_check():
    """Returns the status of environment variables for debugging."""
    status = {var: "Set" if os.environ.get(var) else "Missing" for var in CRITICAL_VARS}
    return {"status": "ok", "environment": status}

@app.get("/")
async def read_index():
    return FileResponse("index.html")

# Serve other static files (like index.tsx)
# Note: In a real production build you'd serve the build folder, 
# but for this ESM-based environment, we serve the root.
app.mount("/", StaticFiles(directory=".", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
