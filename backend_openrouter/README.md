# ProofPoint OpenRouter Backend

This backend is a parallel ProofPoint implementation that keeps the existing local LLM backend untouched and adds the same two-stage workflow on top of OpenRouter-hosted models.

## Clone And Run

If this repository is cloned from GitHub, start with:

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

Then set up the backend:

1. Create and activate a Python virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create `aliopenrouter.txt` in the repository root.
4. Paste only the OpenRouter API key into that file.
5. Optionally copy `backend_openrouter/.env.example` to `backend_openrouter/.env` and adjust settings.

Start the backend from the repository root:

```bash
python -m uvicorn backend_openrouter.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## Purpose

- Accept a raw work update.
- Parse it into structured accomplishments, next steps, blockers, derived tasks, and parsing notes.
- Analyze each derived task into a cautious, evidence-backed impact record.
- Return valid JSON only from backend endpoints.

## Folder Structure

- `backend_openrouter/main.py`: FastAPI app entry point.
- `backend_openrouter/api/routes/`: health, parse, and analyze endpoints.
- `backend_openrouter/controllers/`: thin controller layer.
- `backend_openrouter/services/`: parsing, task analysis, aggregation, and pipeline orchestration.
- `backend_openrouter/llm/openrouter_client.py`: dedicated OpenRouter HTTP client.
- `backend_openrouter/llm/structured_client.py`: schema validation and one-time repair flow.
- `backend_openrouter/prompts/`: stage 1 and stage 2 prompt templates.
- `backend_openrouter/models/`: strict Pydantic request and response schemas.
- `backend_openrouter/core/api_key_loader.py`: safe `aliopenrouter.txt` loading.
- `tests_openrouter/`: isolated tests for the OpenRouter backend.

## How It Differs From The Local Backend

- The existing `proofpoint_backend` package remains the local llama.cpp implementation.
- This package is a separate backend implementation that talks to OpenRouter over HTTP.
- The route layout and overall processing flow stay similar so API consumers can switch with minimal changes later.
- This backend uses entry-status counts in the summary instead of confidence counters.

## API Key Loading

- By default the backend reads the API key from `aliopenrouter.txt` at the project root.
- Override the path with `OPENROUTER_API_KEY_FILE` if needed.
- The loader trims whitespace and newlines.
- Missing or empty files raise a controlled backend error.
- The full key is never logged.

### Recommended setup

Create a plain text file named `aliopenrouter.txt` in the repository root and paste only the OpenRouter API key into it.

Example file contents:

```text
sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxx
```

Example project layout:

```text
your-repo-folder/
  aliopenrouter.txt
  backend_openrouter/
  frontend_openrouter/
```

### Use a different file path

If you want to keep the key in a different location, create any local `.txt` file and point the backend to it with `OPENROUTER_API_KEY_FILE`.

Example:

```bash
OPENROUTER_API_KEY_FILE=/full/path/to/my-openrouter-key.txt
```

Or in `backend_openrouter/.env`:

```bash
OPENROUTER_API_KEY_FILE=/full/path/to/my-openrouter-key.txt
```

The backend will read that file, strip whitespace, and use the remaining value as the API key.

### Important

- Do not commit `aliopenrouter.txt` or any other local key file.
- Do not paste extra labels, quotes, or comments into the key file.
- The file should contain only the key.

## Setup

1. Create and activate a Python virtual environment.
2. Install dependencies with `pip install -r requirements.txt`.
3. Create a local text file that contains the OpenRouter API key.
4. Recommended: create `aliopenrouter.txt` in the project root and paste only the key into that file.
5. If you prefer a different path, set `OPENROUTER_API_KEY_FILE` to that `.txt` file.
6. Copy `backend_openrouter/.env.example` to `backend_openrouter/.env` if you want file-based settings.
7. Adjust the OpenRouter model or timeout settings if needed.

## Run

Start only the OpenRouter backend with:

```bash
python -m uvicorn backend_openrouter.main:app --reload
```

The local backend remains available separately through:

```bash
uvicorn proofpoint_backend.main:app --reload
```

## Endpoints

### `GET /health`

Returns:

```json
{
  "status": "ok",
  "app_name": "ProofPoint OpenRouter Backend",
  "llm_backend": "openrouter"
}
```

### `POST /api/v1/updates/parse`

Request:

```json
{
  "raw_update": "Today I found a filter issue in the dashboard, reproduced it, documented it, and created a Jira ticket after a senior engineer confirmed the bug. It should be fixed before release."
}
```

Response shape:

```json
{
  "accomplishments": [],
  "next_steps": [],
  "blockers": [],
  "derived_tasks": [],
  "parsing_notes": []
}
```

### `POST /api/v1/updates/analyze`

Request:

```json
{
  "raw_update": "Reviewed the procedure to insert data into the changelog table and shared thoughts with the team. Had a call with Eugene to clarify questions about the stored procedure."
}
```

Response shape:

```json
{
  "raw_update": "string",
  "parsed_update": {
    "accomplishments": [],
    "next_steps": [],
    "blockers": [],
    "derived_tasks": [],
    "parsing_notes": []
  },
  "task_analyses": [
    {
      "task_summary": "string",
      "impact_statement": "string",
      "manager_ready_update": "string",
      "impact_category": "string",
      "observed_facts": [],
      "reasonable_inferences": [],
      "missing_proof": [],
      "evidence_used": [],
      "skills_demonstrated": [],
      "dashboard_tags": [],
      "entry_status": "Evidence Backed"
    }
  ],
  "summary": {
    "tasks_detected": 0,
    "top_categories": [],
    "top_skills": [],
    "evidence_backed_count": 0,
    "needs_more_proof_count": 0,
    "draft_count": 0
  }
}
```

## Configurable Model Settings

- `OPENROUTER_MODEL`: model identifier, for example `openai/gpt-4o-mini`.
- `OPENROUTER_TEMPERATURE`: defaults to a low value for stable structured output.
- `OPENROUTER_MAX_TOKENS_PARSE`: token budget for stage 1 parsing.
- `OPENROUTER_MAX_TOKENS_ANALYZE`: token budget for stage 2 analysis.
- `OPENROUTER_TIMEOUT_SECONDS`: per-request timeout.
- `OPENROUTER_MAX_RETRIES`: transient HTTP retry count.
- `OPENROUTER_REQUIRE_PARAMETERS`: requests provider support for structured outputs.

## Validation And Reliability

- Every model response is parsed into JSON and validated with strict Pydantic schemas.
- If validation fails, the backend retries once with a repair instruction.
- If repair fails, the backend returns a controlled backend error instead of raw model output.
- The prompts explicitly forbid invented business impact, time saved, money saved, and unsupported numbers.

## Known Limitations

- Output quality still depends on the selected OpenRouter model supporting structured responses well.
- Different models may vary in how strictly they follow cautious wording.
- This backend does not persist records or attach evidence artifacts yet.
- The default model in the settings file is only a starting point and may need to be changed for your OpenRouter account.
