from typing import Any

PLACEHOLDER_STRINGS = {
    "",
    "n/a",
    "na",
    "none",
    "none.",
    "null",
    "unknown",
    "unknown.",
    "not specified",
    "not specified.",
    "not provided",
    "not provided.",
    "no evidence",
    "no evidence.",
}


def _clean_text(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip()


def _clean_optional_task_field(value: Any) -> str:
    cleaned = _clean_text(value)
    if cleaned.lower() in PLACEHOLDER_STRINGS:
        return ""
    return cleaned


def _clean_string_list(value: Any) -> list[str]:
    if value is None:
        return []
    if isinstance(value, list):
        return [item for item in (_clean_text(entry) for entry in value) if item]
    if isinstance(value, str):
        cleaned = value.strip()
        return [cleaned] if cleaned else []
    return []


def _build_conservative_task(task_text: str) -> dict[str, str]:
    cleaned = _clean_text(task_text)
    return {
        "task_performed": cleaned,
        "problem_addressed": "",
        "actions_taken": cleaned,
        "evidence_provided": cleaned,
        "outcome_observed": "",
        "who_was_affected": "",
    }


def _normalize_derived_task(value: Any) -> dict[str, str]:
    if isinstance(value, str):
        return _build_conservative_task(value)

    if not isinstance(value, dict):
        return _build_conservative_task("")

    task_performed = (
        _clean_optional_task_field(value.get("task_performed"))
        or _clean_optional_task_field(value.get("actions_taken"))
        or _clean_optional_task_field(value.get("evidence_provided"))
    )
    actions_taken = _clean_optional_task_field(value.get("actions_taken")) or task_performed
    evidence_provided = _clean_optional_task_field(value.get("evidence_provided"))

    return {
        "task_performed": task_performed,
        "problem_addressed": _clean_optional_task_field(value.get("problem_addressed")),
        "actions_taken": actions_taken,
        "evidence_provided": evidence_provided,
        "outcome_observed": _clean_optional_task_field(value.get("outcome_observed")),
        "who_was_affected": _clean_optional_task_field(value.get("who_was_affected")),
    }


def normalize_parsed_update_payload(payload: Any) -> Any:
    """Conservatively normalize parser output before strict validation."""
    if not isinstance(payload, dict):
        return payload

    normalized = {
        "accomplishments": _clean_string_list(payload.get("accomplishments")),
        "next_steps": _clean_string_list(payload.get("next_steps")),
        "blockers": _clean_string_list(payload.get("blockers")),
        "parsing_notes": _clean_string_list(payload.get("parsing_notes")),
    }

    raw_tasks = payload.get("derived_tasks", [])
    if isinstance(raw_tasks, dict):
        raw_tasks = [raw_tasks]
    if not isinstance(raw_tasks, list):
        raw_tasks = []

    derived_tasks: list[dict[str, str]] = []
    for item in raw_tasks:
        normalized_task = _normalize_derived_task(item)
        if normalized_task["task_performed"]:
            derived_tasks.append(normalized_task)

    if not derived_tasks and normalized["accomplishments"]:
        derived_tasks = [
            _build_conservative_task(accomplishment)
            for accomplishment in normalized["accomplishments"]
        ]
        note = (
            "The backend generated conservative derived_tasks from accomplishments "
            "because the model omitted or underfilled them."
        )
        if note not in normalized["parsing_notes"]:
            normalized["parsing_notes"].append(note)

    normalized["derived_tasks"] = derived_tasks
    return normalized


def normalize_task_analysis_payload(payload: Any) -> Any:
    """Normalize common list or string variations without weakening schema guarantees."""
    if not isinstance(payload, dict):
        return payload

    return {
        "task_summary": _clean_text(payload.get("task_summary")),
        "impact_statement": _clean_text(payload.get("impact_statement")),
        "manager_ready_update": _clean_text(payload.get("manager_ready_update")),
        "impact_category": _clean_text(payload.get("impact_category")),
        "observed_facts": _clean_string_list(payload.get("observed_facts")),
        "reasonable_inferences": _clean_string_list(payload.get("reasonable_inferences")),
        "missing_proof": _clean_string_list(payload.get("missing_proof")),
        "evidence_used": _clean_string_list(payload.get("evidence_used")),
        "skills_demonstrated": _clean_string_list(payload.get("skills_demonstrated")),
        "dashboard_tags": _clean_string_list(payload.get("dashboard_tags")),
        "entry_status": _clean_text(payload.get("entry_status")),
    }
