import type {
  ImpactAnalysis,
  ImpactCategory,
  CoachScenario,
  DashboardStats,
  LoggedTaskEntry,
  OneOnOneMeeting,
  OneOnOneStats,
} from "./types";

// ─── Impact Analysis Mock Responses ──────────────────────────────────────────

const bugFixMock: Omit<ImpactAnalysis, "taskId"> = {
  headline:
    "You prevented approximately 2,400 failed login attempts and reduced support ticket volume",
  businessMetric: "Cost Avoidance",
  estimatedValue: "$8,000",
  estimatedValueNumeric: 8000,
  currency: "USD",
  impactCategory: "Cost Avoidance" as ImpactCategory,
  details:
    "This authentication fix addressed a critical login flow issue affecting a client's production environment. Based on typical authentication failure rates and support ticket costs ($15–25 per ticket), this fix prevented an estimated 2,400 failed login attempts over the next 30 days. This translates to approximately 160 fewer support tickets, saving roughly $8,000 in direct support costs. Additionally, you reduced client-side frustration during a critical business period, protecting the account relationship. Impact category: Cost Avoidance + Customer Satisfaction.",
  skillsDemonstrated: [
    "Debugging",
    "Client-Critical Problem Solving",
    "Independent Decision-Making",
  ],
  confidenceLevel: "High",
  managerSummary:
    "Resolved critical authentication issue preventing ~2,400 failed logins and ~$8K in support costs",
};

const regressionTestMock: Omit<ImpactAnalysis, "taskId"> = {
  headline:
    "You validated a core integration used by 340+ customers, preventing potential cascade failures",
  businessMetric: "Risk Reduction",
  estimatedValue: "~$8,000–12,000",
  estimatedValueNumeric: 12000,
  currency: "USD",
  impactCategory: "Risk Reduction" as ImpactCategory,
  details:
    "Regression testing on the Azure connector ensures backward compatibility and stability for existing deployments. This connector serves approximately 340 customer environments. An undetected regression in this component could cascade into data pipeline failures, each requiring emergency support intervention (estimated cost: $500–2,000 per incident). Your thorough testing provides a quality gate that protects against these cascading failures. Conservative estimate of prevented incidents: 8–15 over the next quarter.",
  impactMetrics: {
    riskPrevented: "An undetected regression in this connector could cascade into data pipeline failures across 340+ customer environments",
    scopeOfWork: "Full regression suite across backward compatibility, edge cases, and data integrity",
    peopleUnblocked: "Release team was waiting on your sign-off before deploying to production",
    timeSaved: "Your testing caught 2 edge cases that would have required emergency support intervention per affected customer",
  },
  skillsDemonstrated: [
    "Systematic Testing",
    "Azure Cloud Knowledge",
    "Quality Assurance",
    "Risk Mitigation",
  ],
  confidenceLevel: "High",
  managerSummary:
    "Validated Azure connector backward compatibility across 340+ environments, catching 2 edge cases before production release",
};

const sapMock: Omit<ImpactAnalysis, "taskId"> = {
  headline:
    "You unblocked month-end processing for a Fortune 500 client through independent diagnostic testing",
  businessMetric: "Customer Satisfaction",
  estimatedValue: "~$10,000–15,000",
  estimatedValueNumeric: 15000,
  currency: "USD",
  impactCategory: "Customer Satisfaction" as ImpactCategory,
  details:
    "This SAP error was blocking a Fortune 500 client's critical month-end processing. You identified the root cause vector through independent parallel testing — running your own diagnostic by importing the job by JOBNAME and comparing parameters between failing and passing runs. This diagnostic approach gave the senior team the precise data they needed to identify a case-sensitive parameter issue (PDEST: locl vs LOCL). Without your intervention, the client's month-end close would have been delayed by an estimated 24–48 hours, affecting financial reporting deadlines. The resolution also reduced senior engineer escalation time by approximately 4 hours across 3 senior engineers. Total impact: client relationship protected, senior team time saved, root cause documented.",
  impactMetrics: {
    timeSaved: "~4 hours of senior engineer time across 3 engineers (Alex, Ann, Mark)",
    peopleUnblocked: "Client's entire finance team was blocked on month-end close",
    riskPrevented: "Month-end financial reporting deadline would have been missed by 24–48 hours",
    scopeOfWork: "P1 client issue — you identified the root cause vector through independent parallel testing",
    reliabilitySignal: "Resolved at 9 PM EAT while US team was in business hours, bridging the timezone gap",
    knowledgeCreated: "Root cause (case-sensitive PDEST parameter) was not documented — next consultant will hit this again",
  },
  skillsDemonstrated: [
    "Independent Diagnosis",
    "SAP Knowledge",
    "Cross-Timezone Collaboration",
    "Client-Critical Problem Solving",
  ],
  confidenceLevel: "High",
  managerSummary:
    "Independently diagnosed root cause of Fortune 500 client's SAP month-end failure, saving ~4hrs senior engineer time and protecting the reporting deadline",
};

const documentationMock: Omit<ImpactAnalysis, "taskId"> = {
  headline:
    "You created onboarding documentation that will reduce new developer ramp-up time by an estimated 2–3 days",
  businessMetric: "Efficiency Gain",
  estimatedValue: "$3,500",
  estimatedValueNumeric: 3500,
  currency: "USD",
  impactCategory: "Efficiency Gain" as ImpactCategory,
  details:
    "Developer onboarding documentation directly reduces the 'time-to-first-commit' for new hires. Based on typical onboarding timelines (2–4 weeks) and the cost of developer time during unproductive onboarding days ($700–1,200/day for a mid-level developer), reducing ramp-up by even 2–3 days saves approximately $1,500–3,500 per new hire. More importantly, this documentation reduces the dependency on senior engineers for ad-hoc onboarding questions — a hidden cost that typically absorbs 5–10 hours of senior time per new hire. Your documentation becomes institutional knowledge that scales with every future hire.",
  skillsDemonstrated: [
    "Technical Writing",
    "Knowledge Transfer",
    "Process Improvement",
    "Initiative",
  ],
  confidenceLevel: "Medium",
  managerSummary:
    "Created onboarding docs estimated to save 2–3 days per new hire (~$3.5K each) and reduce senior engineer onboarding burden",
};

const weekendShiftMock: Omit<ImpactAnalysis, "taskId"> = {
  headline:
    "You provided critical overnight coverage for a strategic client migration — zero downtime achieved",
  businessMetric: "Customer Satisfaction",
  estimatedValue: "~$15,000–20,000",
  estimatedValueNumeric: 20000,
  currency: "USD",
  impactCategory: "Customer Satisfaction" as ImpactCategory,
  details:
    "Weekend migration support for enterprise clients is high-stakes: any downtime during the migration window directly impacts the client's operations and can jeopardize the account relationship. By covering the weekend shift (including overnight hours in your timezone), you ensured continuous monitoring and immediate response capability during the most critical phase of the migration. This is the kind of reliability that retains enterprise accounts. The estimated value reflects: migration success (account retention value), avoided emergency escalations ($5,000–10,000 per P1 incident), and the operational continuity provided across time zones.",
  impactMetrics: {
    reliabilitySignal: "Covered 9 PM – 2 AM EAT (overnight) on Saturday, bridging the gap between EU and US coverage",
    scopeOfWork: "Strategic enterprise client who had struggled with month-end processing for several months",
    riskPrevented: "Any downtime during the migration window would have directly impacted the client's operations and jeopardized the account",
    peopleUnblocked: "US and EU teams could hand off confidently knowing overnight coverage was in place",
  },
  skillsDemonstrated: [
    "Reliability",
    "Cross-Timezone Coverage",
    "Client Migration Support",
    "Crisis Readiness",
  ],
  confidenceLevel: "High",
  managerSummary:
    "Provided weekend overnight coverage for Bombardier migration, ensuring continuous monitoring across the timezone gap — zero-downtime outcome",
};

const trainingFeedbackMock: Omit<ImpactAnalysis, "taskId"> = {
  headline:
    "You identified 4 critical gaps in training materials that affect every new hire's onboarding quality",
  businessMetric: "Efficiency Gain",
  estimatedValue: "$5,000",
  estimatedValueNumeric: 5000,
  currency: "USD",
  impactCategory: "Efficiency Gain" as ImpactCategory,
  details:
    "Your structured feedback on the training course identified missing elements that impact learning outcomes: absence of closed captions (accessibility compliance), missing transcripts (async learning support), no checkpoint assessments (knowledge validation), and lack of interactive elements (engagement and retention). These gaps affect every new hire who goes through this course. Fixing them improves first-pass comprehension, reduces follow-up questions to senior staff, and shortens the time from 'course complete' to 'actually competent.' Over the next year, assuming 20+ new hires take this course, the cumulative time saved is estimated at 40–60 hours of reduced follow-up support.",
  skillsDemonstrated: [
    "Quality Feedback",
    "Instructional Design Awareness",
    "Initiative",
    "Attention to Detail",
    "Process Improvement",
  ],
  confidenceLevel: "Medium",
  managerSummary:
    "Identified 4 critical training content gaps affecting all new hire onboarding, estimated to save 40–60 hours annually in reduced support",
};

const kpiBugMock: Omit<ImpactAnalysis, "taskId"> = {
  headline: "You caught a critical analytics bug that would have shipped undetected to customer dashboards",
  businessMetric: "Risk Reduction",
  estimatedValue: "~$10,000–12,000",
  estimatedValueNumeric: 12000,
  currency: "USD",
  impactCategory: "Risk Reduction" as ImpactCategory,
  details:
    "You identified a KPI filter binding bug in the Job History Summary dashboard that was producing incorrect data for customer-facing analytics views. You created INSIGHTS-1878 to track it, preventing the bug from shipping to production. Customer-facing analytics bugs are high-severity: they erode trust, generate support tickets ($100–500 each), and can trigger SLA violations. This bug would have affected every customer using the Job History Summary dashboard. The estimated value reflects the cost of the support incidents, engineering remediation work, and customer trust impact that your discovery prevented.",
  impactMetrics: {
    riskPrevented: "KPI cards were not honoring filters — every customer using Job History Summary would have seen inaccurate data",
    scopeOfWork: "You found this independently during routine verification, not because anyone asked you to look",
    knowledgeCreated: "Documented exact reproduction steps and created the Jira ticket (INSIGHTS-1878), enabling a fast fix",
    peopleUnblocked: "Saved the QA and dev team from a post-release emergency patch",
  },
  skillsDemonstrated: [
    "Quality Assurance",
    "Attention to Detail",
    "Independent Discovery",
    "Bug Documentation",
  ],
  confidenceLevel: "High",
  managerSummary:
    "Independently discovered a filter binding bug affecting KPI accuracy across all customer dashboards — documented and filed before it reached production",
};

const restDocumentationMock: Omit<ImpactAnalysis, "taskId"> = {
  headline: "You caught a documentation error that was actively confusing customers — triggered a rewrite",
  businessMetric: "Customer Satisfaction",
  estimatedValue: "~$3,000–5,000",
  estimatedValueNumeric: 5000,
  currency: "USD",
  impactCategory: "Customer Satisfaction" as ImpactCategory,
  details:
    "During a live client call, you identified and immediately escalated misleading REST Extension documentation that was causing the customer to misconfigure their integration. The error was in the official docs and had been there unnoticed. By catching it in real-time — while on the call — you prevented further customer confusion and triggered an urgent documentation rewrite. This kind of real-time catch is rare and high-value: it demonstrates product knowledge beyond your role, protects the customer relationship, and improves the product for all future customers facing the same issue.",
  impactMetrics: {
    riskPrevented: "Documentation made OAuth sound like the only auth method for 2026.1, which would have caused confusion for every client reading the docs",
    scopeOfWork: "Caught this during a live customer call and escalated immediately — not after the call, not the next day, in real time",
    knowledgeCreated: "Triggered the documentation team lead to rewrite the section, preventing future customer confusion",
    peopleUnblocked: "Customer on the call got immediate clarity instead of leaving confused",
  },
  skillsDemonstrated: [
    "Client Advocacy",
    "Attention to Detail",
    "Real-Time Problem Solving",
    "Documentation Quality",
  ],
  confidenceLevel: "High",
  managerSummary:
    "Identified misleading authentication documentation during a live client call and triggered immediate rewrite, preventing ongoing customer confusion",
};

const genericFallbackMock: Omit<ImpactAnalysis, "taskId"> = {
  headline:
    "You completed a task that contributes to team productivity and project momentum",
  businessMetric: "Efficiency Gain",
  estimatedValue: "$1,500",
  estimatedValueNumeric: 1500,
  currency: "USD",
  impactCategory: "Efficiency Gain" as ImpactCategory,
  details:
    "Every completed task contributes to the overall velocity of your team and project. While the specific business impact depends on downstream dependencies, tasks like this typically support team productivity by keeping work flowing, reducing bottlenecks, and maintaining project momentum. The estimated value reflects the cost of the delay that would have occurred if this task remained incomplete, based on average developer day rates and typical dependency chains in enterprise software teams.",
  skillsDemonstrated: ["Task Completion", "Team Contribution", "Reliability"],
  confidenceLevel: "Low",
  managerSummary:
    "Completed task on schedule, maintaining team velocity and project momentum",
};

export function getMockImpactAnalysis(
  taskDescription: string
): Omit<ImpactAnalysis, "taskId"> {
  const lower = taskDescription.toLowerCase();

  if (
    lower.includes("sap") ||
    lower.includes("exxon") ||
    lower.includes("month-end") ||
    lower.includes("month end")
  )
    return sapMock;

  if (
    lower.includes("bug") ||
    lower.includes("fix") ||
    lower.includes("auth") ||
    lower.includes("error") ||
    lower.includes("issue")
  )
    return bugFixMock;

  if (
    lower.includes("test") ||
    lower.includes("regression") ||
    lower.includes("qa") ||
    lower.includes("azure connector")
  )
    return regressionTestMock;

  if (
    lower.includes("doc") ||
    lower.includes("wiki") ||
    lower.includes("guide") ||
    lower.includes("onboarding")
  )
    return documentationMock;

  if (
    lower.includes("weekend") ||
    lower.includes("shift") ||
    lower.includes("migration") ||
    lower.includes("coverage")
  )
    return weekendShiftMock;

  if (
    lower.includes("training") ||
    lower.includes("course") ||
    lower.includes("feedback") ||
    lower.includes("review")
  )
    return trainingFeedbackMock;

  return genericFallbackMock;
}

// ─── Dashboard Stats Mock ─────────────────────────────────────────────────────

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalTasksLogged: 23,
  seniorTimeSaved: "~18 hrs",
  topSkills: [
    { skill: "Client-Critical Problem Solving", count: 8 },
    { skill: "Cross-Timezone Collaboration", count: 7 },
    { skill: "Quality Assurance", count: 6 },
    { skill: "Independent Decision-Making", count: 5 },
    { skill: "Technical Writing", count: 3 },
  ],
  impactByCategory: [
    { category: "Customer Satisfaction", value: 8 },
    { category: "Risk Reduction", value: 6 },
    { category: "Efficiency Gain", value: 4 },
    { category: "Cost Avoidance", value: 3 },
    { category: "Team Enablement", value: 2 },
  ],
  weeklyTrend: [
    { week: "Feb 24", value: 42 },
    { week: "Mar 3", value: 58 },
    { week: "Mar 10", value: 51 },
    { week: "Mar 17", value: 75 },
    { week: "Mar 24", value: 82 },
    { week: "Mar 31", value: 71 },
  ],
  currentStreak: 5,
};

// ─── Seed Tasks for Demo ──────────────────────────────────────────────────────

export const SEED_TASKS: LoggedTaskEntry[] = [
  {
    task: {
      id: "seed-1",
      description: "Resolved SAP error blocking end-of-month processing for ExxonMobil",
      date: "2026-03-31",
      timestamp: new Date("2026-03-31").getTime(),
    },
    analysis: { ...sapMock, taskId: "seed-1" },
  },
  {
    task: {
      id: "seed-2",
      description: "Discovered KPI filter binding bug in Job History Summary dashboard — created INSIGHTS-1878",
      date: "2026-02-10",
      timestamp: new Date("2026-02-10").getTime(),
    },
    analysis: { ...kpiBugMock, taskId: "seed-2" },
  },
  {
    task: {
      id: "seed-3",
      description: "Completed regression testing on Azure connector update for 340+ customer environments",
      date: "2026-03-15",
      timestamp: new Date("2026-03-15").getTime(),
    },
    analysis: { ...regressionTestMock, taskId: "seed-3" },
  },
  {
    task: {
      id: "seed-4",
      description: "Covered weekend overnight shift for Bombardier month-end migration support",
      date: "2026-03-01",
      timestamp: new Date("2026-03-01").getTime(),
    },
    analysis: { ...weekendShiftMock, taskId: "seed-4" },
  },
  {
    task: {
      id: "seed-5",
      description: "Identified and escalated misleading REST Extension documentation during live client call",
      date: "2026-03-17",
      timestamp: new Date("2026-03-17").getTime(),
    },
    analysis: { ...restDocumentationMock, taskId: "seed-5" },
  },
];

// ─── Advocacy Coach Scenarios ─────────────────────────────────────────────────

export const COACH_SCENARIOS: CoachScenario[] = [
  {
    id: "meeting-impact",
    title: "Presenting your impact in a team meeting",
    description:
      "Your manager asks for a status update in the weekly team meeting. You need to share what you accomplished this week in a way that highlights real business impact, not just tasks completed.",
    difficulty: "Beginner",
    category: "Meetings",
    icon: "Users",
  },
  {
    id: "async-update",
    title: "Writing an async status update for your remote manager",
    description:
      "Your manager in San Francisco needs a weekly update. You need to communicate your work, blockers, and impact across a 10-hour timezone gap in writing.",
    difficulty: "Beginner",
    category: "Written Communication",
    icon: "Mail",
  },
  {
    id: "propose-idea",
    title: "Proposing a new approach to your team",
    description:
      "You've identified a better way to handle testing, but you're the most junior person on the team. You need to present your idea convincingly without being dismissed.",
    difficulty: "Intermediate",
    category: "Stakeholder Management",
    icon: "Lightbulb",
  },
  {
    id: "push-back",
    title: "Pushing back on an unrealistic deadline",
    description:
      "Your team lead assigned you a task with a deadline you know is unrealistic. You need to push back professionally without seeming incapable.",
    difficulty: "Intermediate",
    category: "Stakeholder Management",
    icon: "Clock",
  },
  {
    id: "behind-schedule",
    title: "Giving an update when you're behind schedule",
    description:
      "You're behind on a deliverable and your manager asks for a status update. You need to communicate honestly while demonstrating ownership and a recovery plan.",
    difficulty: "Intermediate",
    category: "Meetings",
    icon: "AlertTriangle",
  },
  {
    id: "ask-for-help",
    title: "Asking for help without seeming lost",
    description:
      "You're stuck on a technical problem and need senior help, but you want to show you've done your own research first and you're not just offloading work.",
    difficulty: "Beginner",
    category: "Communication",
    icon: "HelpCircle",
  },
  {
    id: "performance-review",
    title: "Preparing for your performance review",
    description:
      "Your 6-month review is coming up. You need to articulate your impact, growth, and goals in a way that makes a compelling case for your progression.",
    difficulty: "Advanced",
    category: "Career Growth",
    icon: "TrendingUp",
  },
  {
    id: "mistake-recovery",
    title: "Communicating after making a mistake",
    description:
      "You pushed a change that caused a minor issue in production. You need to communicate what happened, what you did to fix it, and what you learned.",
    difficulty: "Advanced",
    category: "Crisis Communication",
    icon: "ShieldAlert",
  },
  {
    id: "one-on-one-prep",
    title: "Preparing for your 1:1 with your team lead",
    description:
      "Your weekly 1:1 is tomorrow. You want to make the most of it — sharing your impact, raising a concern about workload, and asking about growth opportunities. Practice how to structure the conversation.",
    difficulty: "Intermediate",
    category: "Career Growth",
    icon: "MessageSquare",
  },
  {
    id: "ask-for-opportunity",
    title: "Asking your team lead for a stretch project",
    description:
      "You've been doing solid work and want to take on something more challenging. You need to make the case to your team lead that you're ready, using evidence from your recent impact.",
    difficulty: "Advanced",
    category: "Career Growth",
    icon: "Rocket",
  },
];

// ─── Mock Coach Responses ─────────────────────────────────────────────────────

export function getMockCoachFeedback(
  userResponse: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _scenarioId: string
): string {
  const lower = userResponse.toLowerCase();
  const isWeak =
    lower.length < 80 ||
    (!lower.includes("$") &&
      !lower.includes("%") &&
      !lower.includes("prevent") &&
      !lower.includes("save") &&
      !lower.includes("impact") &&
      !lower.includes("result"));

  if (isWeak) {
    return `I notice your response focuses on what you did but doesn't quantify the impact. Let me show you the difference:

**Your version:** "${userResponse.slice(0, 100)}${userResponse.length > 100 ? "..." : ""}"

**Stronger version:** "This week I completed regression testing on the Azure connector, validating backward compatibility across 340+ customer environments. This testing caught edge cases that would have caused data pipeline failures — estimated cost avoidance of $4,000–8,000."

**The key shifts:**
• Specific numbers instead of vague descriptions
• Business impact (what it prevented) instead of just activity (what you did)
• Confidence in your contribution — you earned this, own it

Try again with more specifics about what your work actually prevented or enabled.`;
  }

  return `That's strong. You led with impact, included specific numbers, and connected your work to business outcomes. A few refinements:

1. Your opening line could be even more direct — lead with the biggest number
2. Consider adding the timezone context — "delivered across a 10-hour timezone gap" signals reliability
3. End with a forward-looking statement about what you're tackling next — it shows strategic thinking

**Overall score: 8/10.** You're communicating like a mid-level professional. The biggest upgrade from here is consistency — doing this every week builds a track record that's impossible to ignore.`;
}

export function getMockScenarioOpener(scenario: CoachScenario): string {
  const openers: Record<string, string> = {
    "meeting-impact": `Welcome to this scenario! Here's the setup:

It's Monday standup. Your manager looks at you and says, "Anne, can you give us a quick update on what you got done last week?"

The team is listening. This is your moment.

Go ahead — give your status update. Don't overthink it, just respond naturally. I'll give you feedback on how to make it stronger.`,

    "async-update": `Here's your scenario:

It's Friday evening in Nairobi (4pm your time, 6am in San Francisco). Your manager just sent a Slack message: "Hey Anne, can you drop a quick update on what you accomplished this week before EOD? Nothing formal, just want to know where things stand."

Write your async update below. Imagine you completed regression testing, helped with a client SAP issue, and reviewed some training materials this week.`,

    "propose-idea": `Your scenario:

You've noticed that the team's current approach to regression testing is inefficient — you're running full test suites even for minor config changes. You have an idea for a smarter, risk-based approach that could save 30% of testing time.

You're in a team meeting and there's a natural pause. Your tech lead says, "Does anyone have anything else to raise?"

This is your moment. How do you propose your idea?`,

    "push-back": `Here's the setup:

Your team lead just dropped a task in your queue: "Can you complete the full integration test suite for the new connector by tomorrow EOD?"

You know this realistically takes 3 days to do properly. Rushing it means missing edge cases.

You need to push back without seeming like you're making excuses or can't handle the workload. What do you say?`,

    "behind-schedule": `Your scenario:

You were supposed to deliver a testing report by today. It's 2pm and you're about 60% done — you hit an unexpected issue with the test environment setup that cost you half a day.

Your manager pings you: "Hey, how's the testing report coming along? Was expecting it this morning."

What do you reply?`,

    "ask-for-help": `Here's the setup:

You've been stuck on a tricky SAP configuration issue for 3 hours. You've read the documentation, tried 4 different approaches, and searched the internal knowledge base. No luck.

You need to ask your senior colleague Marcus for help, but you don't want to seem like you're just offloading the problem.

How do you ask for help?`,

    "performance-review": `Your scenario:

Your 6-month performance review is in 2 days. Your manager has asked you to come prepared to discuss: your impact over the last 6 months, your growth areas, and your goals for the next 6 months.

Let's practice your opening statement — how you'd begin the self-assessment portion. What do you say when your manager asks, "So Anne, how do you think the last 6 months have gone?"`,

    "mistake-recovery": `Here's the setup:

Yesterday you pushed a configuration change that caused a 20-minute service disruption for one client. You caught it quickly, rolled back, and the client is back online. Your manager just messaged you: "Can you explain what happened with the incident yesterday?"

How do you respond?`,

    "one-on-one-prep": `Here's your scenario:

Your 1:1 with Anders is tomorrow at 8:30am EST. You want to:
- Share your impact from the past 2 weeks (SAP fix, regression testing, weekend migration)
- Update him on your Playwright coverage progress toward the 80% goal
- Raise your product development goal — ask what the first concrete step looks like

You have 30 minutes. How do you structure your talking points? Walk me through how you'd open the 1:1 and what you'd cover first.`,

    "ask-for-opportunity": `Here's your scenario:

You've been at Redwood for 6 months now. Your impact data shows strong contributions across 23 logged tasks. You feel ready to take on something more challenging — maybe leading the QA process for a new product integration or taking an active role in the product development track Anders mentioned.

Your next 1:1 with Anders is tomorrow. You want to ask for a more senior opportunity.

How do you make that ask? Give me your actual words — how would you bring this up?`,
  };

  return (
    openers[scenario.id] ||
    `Let's practice the scenario: "${scenario.title}"\n\n${scenario.description}\n\nGo ahead and respond naturally — I'll give you specific feedback on how to communicate more effectively.`
  );
}

// ─── Custom Scenario Coaching ─────────────────────────────────────────────────

export function getMockCustomScenarioOpener(text: string): string {
  const lower = text.toLowerCase();

  if (
    lower.includes("present") ||
    lower.includes("presentation") ||
    lower.includes("director")
  ) {
    return `Presenting to senior leadership for the first time is a big moment — and the fact that you're preparing for it shows maturity. Here's how to approach this:

**Strategy:** Lead with impact, not activity. A director doesn't want to hear "we ran 47 tests." They want to hear "our testing prevented 3 critical bugs from reaching 340+ customer environments."

**What to say — structure your presentation like this:**
1. One sentence on what your team does (context)
2. Three biggest impacts this quarter (with numbers)
3. One risk you identified and prevented
4. One recommendation for next quarter

Keep it under 5 minutes. Directors respect brevity.

**What to avoid:**
- Don't apologize for being junior
- Don't say "I think" — say "The data shows"
- Don't read from slides — know your three numbers cold

**The Magic Four for this:**
- Progress: Our testing caught X bugs across Y environments
- Risk: We identified a critical filter issue that would have affected customer analytics
- Blocker: None currently — we're on track
- Ask: I'd like to expand our automated coverage to 80% next quarter

Want to rehearse? I'll play the director. Give me your opening line.`;
  }

  if (
    lower.includes("client") ||
    lower.includes("customer") ||
    lower.includes("escalat")
  ) {
    return `Client escalations feel high-pressure, but they're actually opportunities to demonstrate calm, competence, and ownership. Here's the approach:

**Strategy:** Acknowledge, own, action. Don't explain why it happened (they don't care yet). Show them you're already on it.

**What to say:**
"Thank you for flagging this. I've identified the issue — [one sentence on what it is]. Here's what I've done so far: [action taken]. Here's what happens next: [next step with timeline]. I'll send you a confirmation once it's resolved."

**What to avoid:**
- Don't blame other teams or tools
- Don't say "I'm not sure" — if you're not sure, say "I'm investigating and will update you by [time]"
- Don't over-explain the technical details unless they ask

**The Magic Four for this:**
- Progress: I've identified the root cause
- Risk: If unresolved, it would affect [scope]
- Blocker: Waiting on [specific thing] to complete the fix
- Ask: I'll have this resolved by [time] — I'll confirm when it's done

Want to rehearse? I'll play the client. They're frustrated. Go.`;
  }

  if (
    lower.includes("salary") ||
    lower.includes("raise") ||
    lower.includes("promotion") ||
    lower.includes("compensation")
  ) {
    return `Asking for a raise or promotion requires preparation and evidence. This is where your ProofPoint data becomes your strongest tool.

**Strategy:** Frame it as a business case, not a personal request. You're not asking for a favour — you're presenting evidence that your contribution has outgrown your current level.

**What to say:**
"Anders, I'd like to discuss my progression. Over the past [X months], I've [top 3 impacts with metrics]. I've also taken on responsibilities beyond my current role, including [examples]. Based on this trajectory, I'd like to discuss what the path to [next level/raise] looks like and what specific milestones you'd want to see."

**What to avoid:**
- Don't compare yourself to colleagues
- Don't make it emotional ("I feel I deserve...")
- Don't ambush — give your lead time to prepare by saying "I'd like to discuss my growth in our next 1:1"

**The Magic Four for this:**
- Progress: Here's my impact data for the past X months
- Risk: Without progression, there's a retention risk (say this subtly)
- Blocker: I need clarity on what specific milestones get me to the next level
- Ask: Can we set a timeline and review criteria together?

Want to rehearse? I'll play Anders. Start the conversation.`;
  }

  return `Let me help you prepare for this. Based on what you've described, here's my approach:

First, let's break down the situation:
- Who has the power in this interaction?
- What's the outcome you want?
- What's the worst case if it goes wrong?

**General framework for any tough workplace conversation:**
1. Open with context (one sentence on why you're raising this)
2. State your position clearly (what you want or what you've observed)
3. Provide evidence (use your ProofPoint impact data)
4. Make a specific ask (not vague — concrete next step)

**The Magic Four:**
- Progress: What have you accomplished that gives you credibility here?
- Risk: What's at stake if this isn't addressed?
- Blocker: What's preventing the outcome you want?
- Ask: What specifically do you need from the other person?

Want to rehearse? Describe who you're talking to and I'll role-play them.`;
}

// ─── Mock Context Bridge Report ───────────────────────────────────────────────

export const MOCK_CONTEXT_REPORT = {
  professionalSummary: `This week, Anne Anziya prevented two critical issues from reaching production, saved approximately 4 hours of senior engineer time, and provided overnight coverage for a strategic client migration that achieved zero downtime. Working across a 10-hour timezone gap (EAT to PST), she independently diagnosed the root cause of a Fortune 500 client's month-end processing failure — a case-sensitive SAP parameter discrepancy that senior engineers had not identified — and validated a core Azure connector integration used by 340+ customer environments.

Her diagnostic approach to the SAP issue demonstrated advanced problem-solving methodology: running independent parallel tests and using systematic comparison to isolate the root cause. This level of initiative and technical judgment is typically associated with mid-level engineers. The weekend migration coverage for Bombardier demonstrated the kind of reliability that protects enterprise client relationships and is rarely tracked by early career professionals.

Conservative estimated financial impact: $35,000–50,000 across Customer Satisfaction, Risk Reduction, and Efficiency Gain.`,

  keyHighlights: [
    "Independently diagnosed and resolved Fortune 500 client SAP month-end failure — saved ~4 hours of senior engineer time across 3 people",
    "Validated Azure connector across 340+ customer environments — caught 2 edge cases before production release",
    "Provided weekend overnight coverage for Bombardier enterprise migration — zero downtime achieved",
    "Demonstrated cross-timezone reliability across a 10-hour gap: critical contributions made during EAT evening/night hours",
  ],

  timezoneContext: `All work was performed from Nairobi (EAT, UTC+3) in collaboration with teams based in US Pacific (PST, UTC-8) and US Eastern (EST, UTC-5) time zones. Several critical contributions were made during EAT evening/night hours to align with US business hours, demonstrating strong async work discipline and timezone flexibility.`,

  growthIndicators: [
    "Moving from supervised to independent diagnostic methodology",
    "Expanding from QA focus to cross-functional client support",
    "Building SAP domain knowledge through hands-on problem solving",
    "Demonstrating leadership-level reliability in high-stakes client situations",
  ],
};

// ─── 1:1 Mock Meetings ────────────────────────────────────────────────────────

export const MOCK_MEETINGS: OneOnOneMeeting[] = [
  {
    id: "meeting-1",
    date: "2026-03-31T14:00:00Z",
    teamLead: "Anders",
    teamLeadRole: "Team Lead",
    teamLeadTimezone: "PST (UTC-8)",
    duration: 30,
    meetingType: "Scheduled",
    mood: "Positive",
    topicsDiscussed: ["Weekly check-in", "Productivity review", "Playwright codex bot", "Meeting cadence"],
    notes: "Discussed the Playwright codex bot — Anders showed me the PR at github.com/redwood-main/rmj-playwright/pull/59. This could change how we approach test automation. Also agreed to move our 1:1s to bi-weekly going forward since things are going well and I'm becoming more independent.",
    feedbackReceived: [
      {
        id: "fb-1",
        meetingId: "meeting-1",
        type: "Observation",
        content: "The move to bi-weekly 1:1s signals Anders trusts my ability to work more independently. This is a positive progression marker.",
        area: "Autonomy & Trust",
        actionable: false,
        followUpNeeded: false,
      },
    ],
    goalsSet: [],
    actionItems: [],
    questionsRaised: [
      "How can I contribute to the Playwright codex bot work?",
    ],
    wins: [
      "1:1 cadence moving to bi-weekly — a sign of growing trust and independence",
    ],
    aiSummary: "Short, positive check-in. Anders shared the Playwright codex bot PR, which could be relevant to Anne's test automation ownership goal. The decision to move 1:1s to bi-weekly is a clear trust signal — Anders sees Anne operating with enough independence that weekly check-ins are no longer necessary. This is a meaningful career progression marker worth documenting.",
    aiInsights: [
      "Your 1:1s moving from weekly to bi-weekly is a concrete indicator of growing trust. This is exactly the kind of progression that's easy to overlook but matters in performance reviews. ProofPoint has logged it.",
      "The Playwright codex bot (PR #59) directly relates to your goal of taking ownership of Playwright tests with 80% coverage. Explore whether the codex bot could accelerate your path to that target.",
      "This was a light meeting with no new goals or action items. That's fine — it reflects stability. But consider using your next 1:1 to proactively raise your product development progression goal.",
    ],
    aiPrepForNext: "For your next 1:1 (now bi-weekly, so make it count):\n1. Update Anders on Playwright test coverage progress — where are you vs the 80% target?\n2. Follow up on the codex bot PR — did you explore it? Do you have ideas for how to use it?\n3. Raise your product development goal explicitly — ask Anders what specific steps or projects would move you closer\n4. Since meetings are now bi-weekly, consider sending a brief async update in the off-weeks to maintain visibility",
  },
  {
    id: "meeting-2",
    date: "2026-03-23T14:00:00Z",
    teamLead: "Anders",
    teamLeadRole: "Team Lead",
    teamLeadTimezone: "PST (UTC-8)",
    duration: 30,
    meetingType: "Scheduled",
    mood: "Positive",
    topicsDiscussed: ["Weekly check-in", "Productivity review", "Career goals", "Playwright ownership", "Product development path", "Meeting logistics"],
    notes: "This was a meaningful goal-setting conversation. Anders and I agreed on two clear goals: (1) Take ownership of Playwright tests and push toward 80% coverage, and (2) Progress into product development — moving beyond QA into contributing to the actual product. These are the two things that will define my next 6 months. Also sorted out logistics — Anders will add a comment to the devops ticket (I need to provide him the details), and we're moving 1:1s to Tuesday mornings at 8:30am EST.",
    feedbackReceived: [
      {
        id: "fb-2",
        meetingId: "meeting-2",
        type: "Suggestion",
        content: "Anders sees a path for me to move from QA into product development. He's actively supporting this progression.",
        area: "Career Development",
        actionable: true,
        followUpNeeded: true,
      },
    ],
    goalsSet: [
      {
        id: "goal-1",
        meetingId: "meeting-2",
        title: "Take ownership of Playwright tests — target 80% coverage",
        description: "Own the Playwright test suite end-to-end. Drive coverage from current level to 80%. This means writing new tests, maintaining existing ones, and being the go-to person for test automation on the team.",
        category: "Technical Skill",
        priority: "High",
        status: "In Progress",
        targetDate: "2026-06-30",
        progressNotes: [
          { id: "pn-1", date: "2026-03-23", note: "Goal set with Anders. Starting to map current coverage gaps.", percentComplete: 10 },
          { id: "pn-2", date: "2026-03-31", note: "Explored Playwright codex bot (PR #59) — could accelerate test generation.", percentComplete: 15 },
        ],
        linkedTaskIds: [],
        setBy: "Both",
      },
      {
        id: "goal-2",
        meetingId: "meeting-2",
        title: "Progress into product development",
        description: "Move beyond QA-only work into contributing to product features. This is the key career development goal — transitioning from testing to building.",
        category: "Career Development",
        priority: "High",
        status: "Not Started",
        targetDate: "2026-09-30",
        progressNotes: [
          { id: "pn-3", date: "2026-03-23", note: "Goal set with Anders. Need to identify first opportunity for product contribution.", percentComplete: 5 },
        ],
        linkedTaskIds: [],
        setBy: "Both",
      },
    ],
    actionItems: [
      {
        id: "ai-1",
        meetingId: "meeting-2",
        description: "Add comment to devops ticket — Anne to provide ticket details to Anders",
        owner: "Team Lead",
        dueDate: "2026-03-28",
        status: "Pending",
      },
      {
        id: "ai-2",
        meetingId: "meeting-2",
        description: "Provide Anders the devops ticket reference for his comment",
        owner: "Self",
        dueDate: "2026-03-26",
        status: "Done",
        completedDate: "2026-03-25",
      },
      {
        id: "ai-3",
        meetingId: "meeting-2",
        description: "Move 1:1s to Tuesday mornings at 8:30am EST",
        owner: "Team Lead",
        dueDate: "2026-03-25",
        status: "Done",
        completedDate: "2026-03-25",
      },
    ],
    questionsRaised: [
      "What does the path from QA to product development look like concretely?",
      "Which product area would be the best entry point for my first development contribution?",
    ],
    wins: [
      "Anders is actively supporting my transition from QA to product development",
      "Clear, measurable goal set: Playwright 80% coverage ownership",
    ],
    aiSummary: "This was a pivotal 1:1. Two major career goals were established: Playwright test ownership at 80% coverage (technical growth) and progression into product development (career trajectory). Anders is actively sponsoring Anne's transition from QA into product work, which is a significant signal of confidence. Action items were practical and logistics-focused. This meeting establishes the clearest career development roadmap Anne has had since joining.",
    aiInsights: [
      "This is a defining moment in your career at Redwood. You now have two documented, agreed-upon goals with your team lead's explicit support. Most early career professionals don't have this level of clarity — ProofPoint has captured it as evidence.",
      "The Playwright 80% coverage goal is measurable and time-bound. Every test you write from now on is trackable progress. Log your test contributions as tasks in ProofPoint so the Impact Analysis Engine can quantify your path to 80%.",
      "The product development goal is bigger and less defined. Your next step should be identifying a specific, small product contribution opportunity. Ask Anders directly in your next 1:1: 'What's one feature or ticket I could pick up to start building product development experience?'",
      "Anders' action item on the devops ticket is still pending. Follow up if it hasn't been done by the next 1:1.",
    ],
    aiPrepForNext: "For your next 1:1:\n1. Report on Playwright coverage: what's the current percentage? What tests have you written or planned since setting the goal?\n2. Ask about the Playwright codex bot and whether it changes the approach to hitting 80%\n3. Ask specifically: 'What's one product ticket I could take on in the next sprint to start my development progression?'\n4. Follow up on the devops ticket — has Anders added the comment?\n5. Bring your ProofPoint impact data to show the value of your QA work as a foundation for the product development conversation",
  },
];

export const MOCK_ONE_ON_ONE_STATS: OneOnOneStats = {
  totalMeetings: 2,
  totalGoalsSet: 2,
  goalsCompleted: 0,
  goalsInProgress: 2,
  goalCompletionRate: 0,
  totalActionItems: 3,
  actionItemsCompleted: 2,
  actionItemCompletionRate: 67,
  totalFeedbackItems: 2,
  positiveFeedbackCount: 2,
  constructiveFeedbackCount: 0,
  averageMeetingFrequency: "Weekly → Moving to bi-weekly",
  longestGoalStreak: 1,
  nextScheduledMeeting: "2026-04-14T14:00:00Z",
};

export function getMockMeetingSummary(): {
  summary: string;
  insights: string[];
  prepForNext: string;
} {
  return {
    summary: "Productive 1:1 covering recent work progress and upcoming priorities. Your team lead acknowledged your contributions and provided actionable feedback on areas for development. Goals and action items were set with clear ownership and deadlines.",
    insights: [
      "Your consistent delivery and initiative are building trust with your team lead.",
      "The communication feedback is a recurring theme — address it with structured async updates.",
      "Follow through on action items before the next meeting to demonstrate reliability.",
    ],
    prepForNext: "For your next 1:1:\n\n1. Show progress on goals set in this meeting\n2. Come with specific examples of work impact\n3. Follow up on any outstanding action items from your team lead\n4. Bring one new idea or proposal to show strategic thinking",
  };
}
