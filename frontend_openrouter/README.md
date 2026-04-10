# ProofPoint Backend

ProofPoint is a backend-only AI service that turns natural work updates into structured, evidence-backed impact records. This implementation uses a local quantized GGUF model through `llama-cpp-python`, keeps the LLM isolated behind a structured JSON interface, and exposes a clean REST API that can be connected later to a separate Node.js frontend.

## Why FastAPI

FastAPI was chosen because it fits the local Python inference stack well, provides strong request and response typing through Pydantic, and keeps the REST API compact and easy to connect to from a future frontend.

## Architecture

The backend is split into clear modules:

- `proofpoint_backend/main.py`: FastAPI app entry point, CORS, exception handling.
- `proofpoint_backend/api/routes/`: HTTP endpoints for health, parse, and analyze.
- `proofpoint_backend/controllers/`: thin controller layer between routes and services.
- `proofpoint_backend/services/`: stage 1 parsing, stage 2 analysis, and aggregation.
- `proofpoint_backend/llm/`: local `llama-cpp-python` backend and JSON validation/repair wrapper.
- `proofpoint_backend/prompts/`: dedicated prompt templates for parsing and task analysis.
- `proofpoint_backend/models/`: strict Pydantic schemas for parser, analyzer, API, and summary outputs.
- `proofpoint_backend/utils/`: safe JSON extraction helpers for near-valid model output.
- `tests/`: backend tests with stubbed local model responses.

## Setup

1. Create and activate a Python virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and adjust values if needed.
4. Make sure the local GGUF model exists at `LOCAL_MODEL_PATH`.

## How the Local Model Is Used

- The backend does not call any cloud API.
- All generation goes through `proofpoint_backend/llm/local_backend.py`.
- The default implementation loads a local GGUF model with `llama-cpp-python`.
- If your runtime already exposes a different local generation function, replace only the backend implementation in `proofpoint_backend/llm/local_backend.py` and keep the rest of the code unchanged.

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `APP_NAME` | FastAPI service name |
| `APP_ENV` | Environment label such as `development` |
| `API_PREFIX` | API prefix, default `/api/v1` |
| `LOG_LEVEL` | Logging level |
| `CORS_ORIGINS` | Comma-separated allowed origins |
| `LLM_BACKEND` | Local backend selector, currently `llama_cpp` |
| `LOCAL_MODEL_PATH` | Path to the local GGUF model |
| `LOCAL_MODEL_N_CTX` | Llama context window |
| `LOCAL_MODEL_N_THREADS` | CPU thread count |
| `LOCAL_MODEL_N_GPU_LAYERS` | GPU layers to offload |
| `LLM_TEMPERATURE` | Generation temperature, kept low for JSON stability |
| `LLM_TOP_P` | Sampling top-p |
| `LLM_REPEAT_PENALTY` | Repeat penalty |
| `LLM_MAX_TOKENS_PARSE` | Token budget for stage 1 parsing |
| `LLM_MAX_TOKENS_ANALYZE` | Token budget for stage 2 analysis |
| `LLM_TIMEOUT_SECONDS` | Timeout for each local generation call |

## Running the API

```bash
uvicorn proofpoint_backend.main:app --reload
```

## API Endpoints

### `GET /health`

Returns service health and the configured backend type.

### `POST /api/v1/updates/parse`

Accepts:

```json
{
  "raw_update": "Accomplishments:\nReviewed the changelog procedure..."
}
```

Returns only the stage 1 parsed structure:

```json
{
  "accomplishments": ["Reviewed the changelog procedure and shared feedback with the team."],
  "next_steps": ["Discuss changelog feedback in the standup."],
  "blockers": ["Still waiting for clarification on one part of the stored procedure."],
  "derived_tasks": [
    {
      "task_performed": "Reviewed the changelog procedure and shared feedback.",
      "problem_addressed": "The team needed review feedback on a procedure.",
      "actions_taken": "Reviewed the procedure and shared feedback.",
      "evidence_provided": "Shared feedback with the team.",
      "outcome_observed": "",
      "who_was_affected": "The team"
    }
  ],
  "parsing_notes": ["Outcome is not yet explicit in the source update."]
}
```

### `POST /api/v1/updates/analyze`

Accepts the same request body, then runs stage 1 and stage 2 internally.

Returns:

```json
{
  "raw_update": "Accomplishments:\nReviewed the changelog procedure...",
  "parsed_update": {
    "accomplishments": [],
    "next_steps": [],
    "blockers": [],
    "derived_tasks": [],
    "parsing_notes": []
  },
  "task_analyses": [
    {
      "task_summary": "Reviewed a procedure and shared feedback.",
      "impact_statement": "Documented feedback on an existing procedure to support team alignment and reduce misunderstanding risk.",
      "manager_ready_update": "Reviewed the changelog procedure and shared feedback with the team for follow-up discussion.",
      "impact_category": "Collaboration",
      "confidence": "Medium",
      "confidence_reason": "The contribution is clear, but the update does not state a final outcome.",
      "observed_facts": [],
      "reasonable_inferences": [],
      "missing_proof": [],
      "evidence_used": [],
      "skills_demonstrated": [],
      "dashboard_tags": [],
      "entry_status": "Needs More Proof"
    }
  ],
  "summary": {
    "tasks_detected": 1,
    "high_confidence_count": 0,
    "medium_confidence_count": 1,
    "low_confidence_count": 0,
    "top_categories": ["Collaboration"],
    "top_skills": ["Communication"],
    "entries_needing_more_proof": 1
  }
}
```

## Validation and Reliability

- Every LLM response is parsed into JSON and validated against strict Pydantic models.
- If the model output is invalid, the backend retries once with a repair instruction.
- If the repair also fails, the API returns a controlled backend error instead of leaking raw model output.
- The service is intentionally conservative and never estimates time saved, money saved, or business value.

## Running Tests

```bash
pytest
```

## Known Limitations

- The quality of the final output depends on the local model and prompt fit.
- Timeout cancellation cannot fully stop a llama.cpp generation already running in a worker thread.
- The backend does not persist records yet; it only processes and returns them.
- Request-level tracing IDs and persistence are not implemented yet.

## Future Backend Improvements

- Add persistence for historical impact records and review status.
- Add request IDs and richer audit logging.
- Add batch processing endpoints and background jobs.
- Add prompt/version tracking for reproducibility.
- Add a pluggable storage layer for approvals, edits, and evidence attachments.
