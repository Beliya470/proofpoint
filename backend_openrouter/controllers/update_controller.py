from backend_openrouter.core.logging import get_logger
from backend_openrouter.models.api import AnalyzeUpdateResponse, RawUpdateRequest
from backend_openrouter.models.domain import ParsedUpdate
from backend_openrouter.services.parser_service import UpdateParserService
from backend_openrouter.services.proofpoint_service import ProofPointPipelineService


class UpdateController:
    """Thin controller layer for parse and analyze endpoints."""

    def __init__(
        self,
        *,
        parser_service: UpdateParserService,
        pipeline_service: ProofPointPipelineService,
    ) -> None:
        self._parser_service = parser_service
        self._pipeline_service = pipeline_service
        self._logger = get_logger(__name__)

    def parse_update(self, request: RawUpdateRequest) -> ParsedUpdate:
        self._logger.info("Received parse request with %s characters", len(request.raw_update))
        return self._parser_service.parse_update(request.raw_update)

    def analyze_update(self, request: RawUpdateRequest) -> AnalyzeUpdateResponse:
        self._logger.info("Received analyze request with %s characters", len(request.raw_update))
        return self._pipeline_service.analyze_update(request.raw_update)
