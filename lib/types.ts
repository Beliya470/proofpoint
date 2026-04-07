export type ImpactCategory =
  | "Cost Avoidance"
  | "Revenue Impact"
  | "Efficiency Gain"
  | "Risk Reduction"
  | "Customer Satisfaction"
  | "Team Enablement"
  | "Knowledge Building";

export interface Task {
  id: string;
  description: string;
  date: string;
  timestamp: number;
}

export interface ImpactMetrics {
  timeSaved?: string | null;
  peopleUnblocked?: string | null;
  riskPrevented?: string | null;
  scopeOfWork?: string | null;
  reliabilitySignal?: string | null;
  knowledgeCreated?: string | null;
}

export interface ImpactAnalysis {
  taskId: string;
  headline: string;
  businessMetric: string;
  estimatedValue: string;
  estimatedValueNumeric: number;
  currency: string;
  impactCategory: ImpactCategory;
  details: string;
  impactMetrics?: ImpactMetrics;
  skillsDemonstrated: string[];
  confidenceLevel: "High" | "Medium" | "Low";
  managerSummary: string;
}

export interface ContextReport {
  id: string;
  taskIds: string[];
  period: string;
  professionalSummary: string;
  keyHighlights: string[];
  totalEstimatedValue: string;
  timezoneContext: string;
  growthIndicators: string[];
  generatedAt: string;
}

export interface CoachMessage {
  id: string;
  role: "user" | "coach";
  content: string;
  timestamp: number;
}

export interface CoachScenario {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  icon: string;
}

export interface UserProfile {
  name: string;
  role: string;
  company: string;
  timezone: string;
  managerTimezone: string;
  startDate: string;
}

export interface DashboardStats {
  totalTasksLogged: number;
  seniorTimeSaved: string;
  topSkills: { skill: string; count: number }[];
  impactByCategory: { category: ImpactCategory; value: number }[];
  weeklyTrend: { week: string; value: number }[];
  currentStreak: number;
}

export interface LoggedTaskEntry {
  task: Task;
  analysis: ImpactAnalysis;
}

// ─── 1:1 Tracker Types ────────────────────────────────────────────────────────

export type GoalCategory =
  | "Technical Skill"
  | "Soft Skill"
  | "Certification"
  | "Project Milestone"
  | "Career Development"
  | "Process Improvement"
  | "Client Relationship"
  | "Leadership";

export interface ProgressNote {
  id: string;
  date: string;
  note: string;
  percentComplete: number;
}

export interface Goal {
  id: string;
  meetingId: string;
  title: string;
  description: string;
  category: GoalCategory;
  priority: "High" | "Medium" | "Low";
  status: "Not Started" | "In Progress" | "Completed" | "Blocked" | "Deferred";
  targetDate: string;
  completedDate?: string;
  progressNotes: ProgressNote[];
  linkedTaskIds: string[];
  setBy: "Self" | "Team Lead" | "Both";
}

export interface FeedbackItem {
  id: string;
  meetingId: string;
  type: "Praise" | "Constructive" | "Observation" | "Suggestion";
  content: string;
  area: string;
  actionable: boolean;
  followUpNeeded: boolean;
  resolvedDate?: string;
}

export interface ActionItem {
  id: string;
  meetingId: string;
  description: string;
  owner: "Self" | "Team Lead";
  dueDate: string;
  status: "Pending" | "Done" | "Overdue" | "Cancelled";
  completedDate?: string;
}

export interface OneOnOneMeeting {
  id: string;
  date: string;
  teamLead: string;
  teamLeadRole: string;
  teamLeadTimezone: string;
  duration: number;
  meetingType: "Scheduled" | "Ad-hoc" | "Performance Review" | "Career Chat";
  mood: "Positive" | "Neutral" | "Challenging" | "Mixed";
  topicsDiscussed: string[];
  notes: string;
  feedbackReceived: FeedbackItem[];
  goalsSet: Goal[];
  actionItems: ActionItem[];
  questionsRaised: string[];
  wins: string[];
  aiSummary: string;
  aiInsights: string[];
  aiPrepForNext: string;
}

export interface OneOnOneStats {
  totalMeetings: number;
  totalGoalsSet: number;
  goalsCompleted: number;
  goalsInProgress: number;
  goalCompletionRate: number;
  totalActionItems: number;
  actionItemsCompleted: number;
  actionItemCompletionRate: number;
  totalFeedbackItems: number;
  positiveFeedbackCount: number;
  constructiveFeedbackCount: number;
  averageMeetingFrequency: string;
  longestGoalStreak: number;
  nextScheduledMeeting?: string;
}
