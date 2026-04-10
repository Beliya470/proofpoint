from collections import Counter

from backend_openrouter.models.domain import AnalysisSummary, ParsedUpdate, TaskAnalysis


class AggregationService:
    """Aggregate per-task analyses into summary metadata."""

    def build_summary(
        self,
        *,
        parsed_update: ParsedUpdate,
        task_analyses: list[TaskAnalysis],
    ) -> AnalysisSummary:
        category_counts = Counter(analysis.impact_category for analysis in task_analyses)
        skill_counts = Counter(
            skill
            for analysis in task_analyses
            for skill in analysis.skills_demonstrated
            if skill
        )

        return AnalysisSummary(
            tasks_detected=len(parsed_update.derived_tasks),
            top_categories=[name for name, _ in category_counts.most_common(5)],
            top_skills=[name for name, _ in skill_counts.most_common(8)],
            evidence_backed_count=sum(
                1 for analysis in task_analyses if analysis.entry_status == "Evidence Backed"
            ),
            needs_more_proof_count=sum(
                1 for analysis in task_analyses if analysis.entry_status == "Needs More Proof"
            ),
            draft_count=sum(1 for analysis in task_analyses if analysis.entry_status == "Draft"),
        )
