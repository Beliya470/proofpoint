from fastapi import APIRouter, Depends

from backend_openrouter.api.dependencies import get_update_controller
from backend_openrouter.controllers.update_controller import UpdateController
from backend_openrouter.models.api import AnalyzeUpdateResponse, RawUpdateRequest
from backend_openrouter.models.domain import ParsedUpdate

router = APIRouter(prefix="/updates", tags=["updates"])


@router.post("/parse", response_model=ParsedUpdate)
async def parse_update(
    request: RawUpdateRequest,
    controller: UpdateController = Depends(get_update_controller),
) -> ParsedUpdate:
    return controller.parse_update(request)


@router.post("/analyze", response_model=AnalyzeUpdateResponse)
async def analyze_update(
    request: RawUpdateRequest,
    controller: UpdateController = Depends(get_update_controller),
) -> AnalyzeUpdateResponse:
    return controller.analyze_update(request)
