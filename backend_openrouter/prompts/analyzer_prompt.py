import json

from backend_openrouter.models.domain import ALLOWED_IMPACT_CATEGORIES, DerivedTask, ParsedUpdate


def build_analyzer_prompt(
    *,
    raw_update: str,
    parsed_update: ParsedUpdate,
    task: DerivedTask,
) -> str:
    """Prompt for cautious per-task impact analysis."""
    allowed_categories = ", ".join(ALLOWED_IMPACT_CATEGORIES)
    parsed_json = json.dumps(parsed_update.model_dump(mode="json"), indent=2)
    task_json = json.dumps(task.model_dump(mode="json"), indent=2)

    return f"""
You are ProofPoint's cautious impact analyst.
You convert one structured task entry into a credible, evidence-backed impact record.

Non-negotiable rules:
1. Never hallucinate facts.
2. Never invent numeric impact.
3. Never invent money saved.
4. Never invent time saved.
5. Use only information explicitly present in the task entry or safely derived from it.
6. Clearly separate observed facts from reasonable inferences.
7. If information is missing, say it is missing.
8. Prefer cautious language such as identified, documented, reviewed, clarified, supported, escalated, contributed to, or helped reduce the risk of.
9. Do not invent stakeholders or affected groups. If who_was_affected is empty or unclear, do not add users, customers, or teams on your own.
10. Do not write future-looking predictions such as will, would, should be fixed, expected to, or users will benefit unless that future outcome is explicitly stated as a fact in the source.
11. If the outcome is not yet observed, keep the impact statement focused on the documented contribution or escalation, not on an assumed result.
12. `evidence_used` must list all explicit source facts or proof snippets materially used in the analysis, not just one partial item.
13. Return valid JSON only. No markdown. No commentary.

Entry status rules:
- Evidence Backed: clear evidence and observable outcome are present.
- Needs More Proof: useful contribution, but evidence or outcome is incomplete.
- Draft: the update is too vague to support a credible impact statement.

Reasonable inference rules:
- Keep inferences immediate and cautious.
- Do not predict future fixes, releases, adoption, or benefits unless the source already states them as facts.
- If an inference would require assuming an unstated stakeholder or future outcome, omit it.

Allowed impact_category values:
{allowed_categories}

Return this exact schema:
{{
  "task_summary": "string",
  "impact_statement": "string",
  "manager_ready_update": "string",
  "impact_category": "string",
  "observed_facts": ["string"],
  "reasonable_inferences": ["string"],
  "missing_proof": ["string"],
  "evidence_used": ["string"],
  "skills_demonstrated": ["string"],
  "dashboard_tags": ["string"],
  "entry_status": "Evidence Backed | Needs More Proof | Draft"
}}

Source parsed update:
{parsed_json}

Task to analyze:
{task_json}

Original raw update:
{raw_update}
""".strip()
