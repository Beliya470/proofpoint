from pydantic import BaseModel, ConfigDict, Field

from backend_openrouter.models.domain import AnalysisSummary, ParsedUpdate, TaskAnalysis


class RawUpdateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    raw_update: str = Field(..., min_length=1)


class AnalyzeUpdateResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")
    raw_update: str
    parsed_update: ParsedUpdate
    task_analyses: list[TaskAnalysis]
    summary: AnalysisSummary


class HealthResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")
    status: str
    app_name: str
    llm_backend: str
