from functools import lru_cache

from backend_openrouter.controllers.update_controller import UpdateController
from backend_openrouter.core.config import Settings, get_settings
from backend_openrouter.llm.openrouter_client import OpenRouterBackend
from backend_openrouter.llm.structured_client import StructuredLLMClient
from backend_openrouter.services.aggregation_service import AggregationService
from backend_openrouter.services.analyzer_service import TaskAnalyzerService
from backend_openrouter.services.parser_service import UpdateParserService
from backend_openrouter.services.proofpoint_service import ProofPointPipelineService


@lru_cache
def get_cached_settings() -> Settings:
    return get_settings()


@lru_cache
def get_text_generation_backend() -> OpenRouterBackend:
    return OpenRouterBackend(get_cached_settings())


@lru_cache
def get_structured_llm_client() -> StructuredLLMClient:
    return StructuredLLMClient(get_text_generation_backend())


@lru_cache
def get_update_parser_service() -> UpdateParserService:
    return UpdateParserService(get_structured_llm_client(), get_cached_settings())


@lru_cache
def get_task_analyzer_service() -> TaskAnalyzerService:
    return TaskAnalyzerService(get_structured_llm_client(), get_cached_settings())


@lru_cache
def get_aggregation_service() -> AggregationService:
    return AggregationService()


@lru_cache
def get_proofpoint_pipeline_service() -> ProofPointPipelineService:
    return ProofPointPipelineService(
        parser_service=get_update_parser_service(),
        analyzer_service=get_task_analyzer_service(),
        aggregation_service=get_aggregation_service(),
    )


def get_update_controller() -> UpdateController:
    return UpdateController(
        parser_service=get_update_parser_service(),
        pipeline_service=get_proofpoint_pipeline_service(),
    )
