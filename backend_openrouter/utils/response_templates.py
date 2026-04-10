def get_parsed_update_template() -> str:
    return """{
  "accomplishments": ["string"],
  "next_steps": ["string"],
  "blockers": ["string"],
  "derived_tasks": [
    {
      "task_performed": "string",
      "problem_addressed": "string",
      "actions_taken": "string",
      "evidence_provided": "string",
      "outcome_observed": "string",
      "who_was_affected": "string"
    }
  ],
  "parsing_notes": ["string"]
}"""


def get_task_analysis_template() -> str:
    return """{
  "task_summary": "string",
  "impact_statement": "string",
  "manager_ready_update": "string",
  "impact_category": "Risk Reduction | Customer Support | Efficiency | Quality Assurance | Communication | Documentation | Collaboration | Problem Solving | Delivery Support | Other",
  "observed_facts": ["string"],
  "reasonable_inferences": ["string"],
  "missing_proof": ["string"],
  "evidence_used": ["string"],
  "skills_demonstrated": ["string"],
  "dashboard_tags": ["string"],
  "entry_status": "Evidence Backed | Needs More Proof | Draft"
}"""
