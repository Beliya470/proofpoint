from typing import Literal

from pydantic import BaseModel, ConfigDict

ALLOWED_IMPACT_CATEGORIES = (
    "Risk Reduction",
    "Customer Support",
    "Efficiency",
    "Quality Assurance",
    "Communication",
    "Documentation",
    "Collaboration",
    "Problem Solving",
    "Delivery Support",
    "Other",
)

ENTRY_STATUSES = ("Evidence Backed", "Needs More Proof", "Draft")


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class DerivedTask(StrictModel):
    task_performed: str
    problem_addressed: str
    actions_taken: str
    evidence_provided: str
    outcome_observed: str
    who_was_affected: str


class ParsedUpdate(StrictModel):
    accomplishments: list[str]
    next_steps: list[str]
    blockers: list[str]
    derived_tasks: list[DerivedTask]
    parsing_notes: list[str]


class TaskAnalysis(StrictModel):
    task_summary: str
    impact_statement: str
    manager_ready_update: str
    impact_category: Literal[
        "Risk Reduction",
        "Customer Support",
        "Efficiency",
        "Quality Assurance",
        "Communication",
        "Documentation",
        "Collaboration",
        "Problem Solving",
        "Delivery Support",
        "Other",
    ]
    observed_facts: list[str]
    reasonable_inferences: list[str]
    missing_proof: list[str]
    evidence_used: list[str]
    skills_demonstrated: list[str]
    dashboard_tags: list[str]
    entry_status: Literal["Evidence Backed", "Needs More Proof", "Draft"]


class AnalysisSummary(StrictModel):
    tasks_detected: int
    top_categories: list[str]
    top_skills: list[str]
    evidence_backed_count: int
    needs_more_proof_count: int
    draft_count: int
