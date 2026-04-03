from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from api.Admin import router as admin_router
from api.Auth import router as auth_router
from api.Order import router as order_router
from api.User import router as user_router
from data.db import close_db, init_db
from data.adam import adam
from services.OrderServ import UPLOAD_DIR


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    await init_db()
    await adam()
    yield
    await close_db()


app = FastAPI(
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.include_router(auth_router, prefix="/api")
app.include_router(user_router, prefix="/api")
app.include_router(order_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
