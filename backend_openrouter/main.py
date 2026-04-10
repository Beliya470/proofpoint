from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend_openrouter.api.dependencies import get_text_generation_backend
from backend_openrouter.api.routes.health import router as health_router
from backend_openrouter.api.routes.updates import router as updates_router
from backend_openrouter.core.config import get_settings
from backend_openrouter.core.errors import ProofPointError
from backend_openrouter.core.logging import configure_logging, get_logger

configure_logging()
logger = get_logger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    if settings.openrouter_preload_key_on_startup:
        logger.info("Preloading OpenRouter API key at startup")
        get_text_generation_backend().warmup()
    yield

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(updates_router, prefix=settings.api_prefix)


@app.exception_handler(ProofPointError)
async def proofpoint_error_handler(_: Request, exc: ProofPointError) -> JSONResponse:
    logger.warning("Controlled backend error: %s", exc.message)
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message, "error_code": exc.error_code},
    )


@app.get("/", include_in_schema=False)
async def root() -> dict[str, str]:
    return {"status": "ok", "service": settings.app_name}
