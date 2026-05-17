from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.app.core.database import init_database
from src.routers import chat


app = FastAPI(
    title="DeepMemo API",
    description="智能问答助手后端 API",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)


@app.on_event("startup")
async def startup_event():
    init_database()


@app.get("/health")
async def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.app.main:app", host="0.0.0.0", port=8000, reload=True)
