# Remote Work & Dispatch Ideas

> The key insight: know what tasks work well **away from the PC**, then build automations that handle them. Phone handles thinking, deciding, and reviewing. Desk handles building, refining, and shipping. Scheduled agents handle everything that doesn't need you at all.

---

## The Framework

Every automation has three layers:

### Trigger

The event, signal, or condition that kicks things off.

| Type | Examples |
|------|---------|
| **Manual** | Slash command from phone or desk (`/New_Idea`, `/Feature`) |
| **Scheduled** | Cron-based — runs at a set time (daily 7 AM, weekly Friday, monthly 1st) |
| **Event-driven** | Threshold crossed, PR merged, new email, build failed |

### Workflow

What actually runs. Two types:

| Type | Description | Example |
|------|------------|---------|
| **Static** | Fixed scripts/rules that execute the same way every time. Deterministic, cheap, fast. | Dependency audit, lint checks, link scanning |
| **Dynamic** | AI agents that adapt based on context. Read state, make decisions, produce tailored output. | Research sprint, idea refinement, draft replies |

Most workflows are **dynamic with static gates** — an AI agent drives the work, but deterministic checks (validators, tests, scans) anchor it to reality.

### Orchestration

Chaining automations so one's output becomes the next's trigger. Turns task-level automations into end-to-end systems.

```
Scheduled scan → finds issue → triggers triage → triage picks fix → triggers /Feature lock
```

Each link in the chain writes a **dispatch artifact** — a committed markdown file. If the chain breaks, you resume from the last artifact, not from scratch.

### The Three Pillars

Every workflow serves one of three business functions:

| Pillar | Question | Examples |
|--------|----------|---------|
| **Fulfill** | What do we deliver? | Building features, onboarding clients, shipping deliverables |
| **Maintain** | What keeps it running? | Code health, finance, systems, monitoring |
| **Grow** | What moves it forward? | Marketing, sales, outreach, retention, research |

---

# Dispatch

> You trigger it, you're in the loop, it's collaborative. Multi-phase workflows where the phone handles thinking and deciding, and the desk (or an autonomous agent) handles execution.

## Fulfill

### Idea Lab — `/New_Idea {description}`

Capture raw ideas and stress-test them before they touch the roadmap. Good ideas don't get lost, bad ideas don't cause scope creep.

| Layer | Details |
|-------|---------|
| **Trigger** | Manual — phone command when inspiration hits |
| **Workflow** | Dynamic — AI pressure-tests the idea against the live roadmap |
| **Phases** | Capture (phone) → Refine (phone) → Route (phone/desk) |
| **Artifacts** | `capture.md`, `refined.md` → feature spec if approved |
| **Orchestration** | Refined ideas with "proceed" feed into `/Feature` lock candidates |

**Capture:** Dump the raw idea in any form — sentence fragment, half-baked concept. No structure required.
**Refine:** AI pressure-tests: what problem does it solve, which project does it belong to, effort vs. impact, conflicts with anything in motion?
**Route:** If it passes, slot into the roadmap with dependencies. If not, park it with reasoning — not deleted, just archived.

**Status:** Implemented

---

### Feature Builder — `/Feature {program}/{module}/{feature}`

Front-load decisions and research to your phone so desk time is pure execution. By the time you sit down, there's already something built and waiting.

| Layer | Details |
|-------|---------|
| **Trigger** | Manual — phone command or bare `/Feature` to auto-pick |
| **Workflow** | Dynamic — AI assesses project state, explores codebase, builds code |
| **Phases** | Lock (phone) → Research (phone) → Execute (desk/autonomous) |
| **Artifacts** | `session-lock.md`, `research-sprint.md`, `build-log.md` |
| **Orchestration** | Lock reads from `/New_Idea` feature specs. Execute feeds into `/Release` milestone tracking. |

**Lock:** Assess project state, pick the single highest-leverage task, exclude everything else.
**Research:** Gather only the patterns, pitfalls, and approach needed for the locked task.
**Execute:** Build agent produces a working draft with incremental commits.

**Status:** Implemented

---

### Bug Triage — `/Triage`

Surface, prioritize, and prep bug fixes without sitting at a desk.

| Layer | Details |
|-------|---------|
| **Trigger** | Scheduled (daily) or event-driven (test failure, error spike) |
| **Workflow** | Static scan → Dynamic prioritization and fix planning |
| **Phases** | Scan (autonomous) → Prioritize (phone) → Prep Fix (phone) |
| **Artifacts** | `triage-report.md`, `fix-plan.md` |
| **Orchestration** | Top bug's fix plan can feed directly into `/Feature` lock as a `/Bug` entry |

**Scan:** Gather bug reports, error logs, failing tests, user-reported issues.
**Prioritize:** Rank by severity (P0-P3), group related issues, identify root causes vs. symptoms.
**Prep Fix:** For the top issue: locate relevant code, identify likely cause, draft approach.

**Status:** Idea

---

### Client Onboard — `/Onboard {client}`

Automate the kickoff-to-first-win pipeline so no client falls through the cracks in the first critical week.

| Layer | Details |
|-------|---------|
| **Trigger** | Manual — when a new client signs |
| **Workflow** | Dynamic — AI generates kickoff materials tailored to the client's specific engagement |
| **Phases** | Setup (phone) → Kickoff (desk) → First Win (desk) |
| **Artifacts** | `onboard-{client}.md` (kickoff agenda, input checklist, timeline, first-delivery target) |
| **Orchestration** | Creates the first `/Check-In` schedule. First delivery feeds into `/Win-Story` if successful. |

**Setup:** Generate kickoff call agenda, input gathering checklist, project timeline, and first-delivery target. Pre-fill from the signed proposal/scope.
**Kickoff:** Run the call with the generated materials. Capture notes, align expectations, confirm inputs needed.
**First Win:** Track time-to-first-value. Ship something tangible within 5 days (commit to 7 — under-promise, over-deliver).

**Status:** Idea

---

### Inbox Management — `/Inbox`

Go beyond summarizing — actually process your inbox. Draft replies, categorize threads, surface what needs your brain vs. what just needs a "sounds good."

| Layer | Details |
|-------|---------|
| **Trigger** | Scheduled (morning + afternoon) or manual |
| **Workflow** | Static classification (rules-based sorting) → Dynamic drafting (context-aware replies in your voice) |
| **Phases** | Classify (autonomous) → Draft (autonomous) → Review & Send (phone) |
| **Artifacts** | `inbox-{date}.md` with draft replies |
| **Orchestration** | Emails flagged as "action needed" become items in Daily Brief. Approved drafts get sent via Gmail MCP. |

**Status:** Idea — requires Gmail MCP integration

---

### Client Status — `/Status {client}`

Generate a quick progress update to send the client — where things stand, what's next, any blockers. Keeps clients informed without writing status emails from scratch.

| Layer | Details |
|-------|---------|
| **Trigger** | Manual — when a client needs an update, or weekly for active engagements |
| **Workflow** | Static gathering (project artifacts, git log, task board) → Dynamic drafting (client-friendly summary) |
| **Phases** | Gather (autonomous) → Draft (phone) → Send (phone) |
| **Artifacts** | `status-{client}-{date}.md` (progress summary, next steps, blockers) |
| **Orchestration** | Feeds into `/Check-In` cadence. Blockers surface in `/Brief`. Completed milestones trigger `/Win-Story`. |

**Gather:** Pull from project artifacts — recent commits, completed tasks, open items, timeline vs. plan.
**Draft:** Generate a client-facing update: what's done, what's next, anything that needs their input. Translate technical progress into outcomes they care about.
**Send:** Review on phone. Adjust tone, add personal notes, send.

**Status:** Idea

---

## Maintain

### Scope Check — `/Scope-Check {client}`

When a client starts asking for more than agreed, you need to respond in the moment — not scramble for words. AI drafts the change order conversation so you stay professional and protected.

| Layer | Details |
|-------|---------|
| **Trigger** | Manual — when scope creep appears in a conversation |
| **Workflow** | Dynamic — AI reads the original scope/contract, compares to the new ask, drafts a response |
| **Phases** | Compare (phone) → Draft Response (autonomous) → Review & Send (phone) |
| **Artifacts** | `scope-check-{client}-{date}.md` (original scope, new ask, delta, draft response) |
| **Orchestration** | Repeated scope checks for the same client flag in `/Review` as a pattern. May trigger client re-evaluation. |

**Compare:** Read the original proposal/contract scope. Identify what's being asked for that falls outside it.
**Draft Response:** Generate a professional response: "I appreciate you want that added. Here's what we agreed to, and here's what a change order would look like with the associated fee."
**Review & Send:** Read on phone. Adjust firmness level, send.

**Status:** Idea

---

## Grow

### Validate Idea — `/Validate {idea}`

Walk through the full validation framework from your phone — hypothesis, market check, interview prep — before investing real time or money. Turns the Define → Research → Prove cycle into a guided dispatch workflow.

| Layer | Details |
|-------|---------|
| **Trigger** | Manual — when a new business idea or revenue stream needs testing |
| **Workflow** | Dynamic — AI guides you through hypothesis building, runs market checks, scores demand signals |
| **Phases** | Define (phone) → Research (autonomous) → Score (phone) |
| **Artifacts** | `validate-{slug}/hypothesis.md`, `validate-{slug}/market-check.md`, `validate-{slug}/score.md` |
| **Orchestration** | Green-light ideas feed into `/New_Idea` for product roadmap. Market research feeds into `/Scout` for early outreach. Interview scripts feed into `/Warm-Up` for scheduling. |

**Define:** Walk through the hypothesis template: who, problem, current workaround, desired outcome, solution, why now, price guess. AI pushes back on vague answers.
**Research:** Run automated market checks — search intent (are people Googling this?), competitors (who's selling something similar?), communities (are people complaining about this problem?), existing purchases (are people already spending money?).
**Score:** Present findings against the green/yellow/red flag framework. Recommend: go (build MVP), tweak (adjust niche/offer), or kill (move on). If go, generate interview questions for the next phase.

**Status:** Idea

---

### Lead Scouting — `/Scout {criteria}`

Find potential clients or collaborators matching your criteria, then generate tailored outreach — not generic cold emails.

| Layer | Details |
|-------|---------|
| **Trigger** | Scheduled — weekly, or manual when entering a new market |
| **Workflow** | Static search (criteria matching) → Dynamic profiling and outreach drafting (personalized per lead) |
| **Phases** | Search (autonomous) → Profile (autonomous) → Outreach (phone — review & send) |
| **Artifacts** | `leads-{date}.md`, individual `outreach-{lead}.md` drafts |
| **Orchestration** | Approved outreach feeds into `/Inbox` for reply tracking. Lead profiles accumulate over time as a CRM artifact. |

**Search:** Scan for leads matching criteria: industry, size, tech stack, signals (hiring, funding, pain points).
**Profile:** For each lead: who they are, what they need, why you're relevant. Score fit.
**Outreach:** Draft tailored emails, case study snippets, or helpful content. Personalized, not templated.

**Status:** Idea — requires web search + email integration

---

### Lead Enrich — `/Enrich {url or name}`

A lead is found, but you lack the context to draft a high-leverage, personalized pitch. Turn a name or URL into a full profile with hooks.

| Layer | Details |
|-------|---------|
| **Trigger** | Manual — when you find a promising lead and need depth before reaching out |
| **Workflow** | Static scraping (site, LinkedIn) → Dynamic analysis (pain points, stack, hooks for your services) |
| **Phases** | Scrape (autonomous) → Analyze (phone) → Draft Outreach (phone) |
| **Artifacts** | `lead-{slug}.md` (tech data, pain points, hooks), `outreach-{slug}.md` |
| **Orchestration** | Feeds enriched profile into `/Scout` outreach phase. Profile accumulates into CRM artifact. |

**Scrape:** Pull data from their website, LinkedIn, tech stack detectors, recent activity.
**Analyze:** Identify pain points, map to your services, find personalization hooks.
**Draft Outreach:** Generate a tailored pitch using their language and situation, not a template.

**Status:** Idea — requires web search

---

### Referral Ask — `/Referral {client}`

After a client win, strike while the iron is hot. Draft a referral ask timed to the moment of satisfaction — not randomly months later.

| Layer | Details |
|-------|---------|
| **Trigger** | Manual — after delivering a win or completing a milestone |
| **Workflow** | Dynamic — AI drafts referral ask personalized to the client relationship and results delivered |
| **Phases** | Assess (phone) → Draft (autonomous) → Send (phone) |
| **Artifacts** | `referral-{client}.md` (personalized ask, shareable one-pager or link) |
| **Orchestration** | Referred leads feed into `/Scout` or `/Enrich`. Tracks referral source for attribution. |

**Assess:** Confirm the client is satisfied — check recent communication tone, delivery status, any open issues.
**Draft:** Generate a referral ask using the script pattern: affirm the relationship, then "Who are one or two people you know who would be a good fit?"
**Send:** Review and send from phone. Include something easy to forward — a link, one-pager, or discount code for the referral.

**Status:** Idea

---

### Content Nurture — `/Nurture`

Draft value-first content drops for your email list or social channels. The 80/20 rule: 80% value, 20% promotion. Queue up a week from your phone.

| Layer | Details |
|-------|---------|
| **Trigger** | Manual — weekly content planning session from phone |
| **Workflow** | Dynamic — AI drafts content aligned to your brand voice, funnel stage, and current offers |
| **Phases** | Plan (phone) → Draft (autonomous) → Review & Queue (phone) |
| **Artifacts** | `nurture-{date}.md` (content drafts with funnel stage tags: awareness/consideration/decision) |
| **Orchestration** | Draws from `/Research` digests for timely topics. Bottom-of-funnel content references current offers. Engagement data feeds back into `/Review`. |

**Plan:** Pick the week's theme or topics. AI suggests based on what's performing, what's timely from `/Research`, and gaps in your funnel.
**Draft:** Generate 3-5 pieces using the PSL framework (Point, Story, Lesson). Tag each by funnel stage.
**Review & Queue:** Read drafts on phone. Edit, approve, schedule. Rejected drafts get notes for iteration.

**Status:** Idea

---

### Win Story — `/Win-Story {client}`

After a successful delivery, capture the case study or testimonial while results are fresh. Waiting kills specificity — the best stories come right after the win.

| Layer | Details |
|-------|---------|
| **Trigger** | Manual — after a successful delivery or milestone |
| **Workflow** | Dynamic — AI drafts case study from project artifacts, results, and client context |
| **Phases** | Gather (autonomous) → Draft (autonomous) → Review (phone) |
| **Artifacts** | `win-story-{client}.md` (case study draft), `testimonial-request-{client}.md` (email to client) |
| **Orchestration** | Published stories feed into `/Scout` outreach as social proof. Testimonial quotes feed into website and proposals. |

**Gather:** Pull from project artifacts — deliverables, timeline, results metrics, client communication.
**Draft:** Generate a case study (problem → approach → result) and a testimonial request email asking the client to confirm or add to the story.
**Review:** Read on phone. Adjust framing, approve testimonial request, decide where to publish.

**Status:** Idea

---

# Remote

> Runs autonomously on a schedule. You review the output later — on your phone, at your desk, or not at all if nothing needs attention. The value is in things happening without you.

## Fulfill

### Client Check-In — `/Check-In`

Proactive client check-ins before they have to ask. Scheduled at 7, 30, and 90 days post-delivery — the three moments where loyalty is built or lost.

| Layer | Details |
|-------|---------|
| **Trigger** | Scheduled — 7/30/90 days after delivery milestones (tracked from `/Onboard`) |
| **Workflow** | Static timing (milestone calendar) → Dynamic drafting (personalized check-in based on what was delivered) |
| **Phases** | Detect (autonomous) → Draft (autonomous) → Review & Send (phone) |
| **Artifacts** | `checkin-{client}-{day}.md` (personalized message, tips for getting more value) |
| **Orchestration** | Positive responses trigger `/Referral` or `/Win-Story`. Issues surface in `/Brief`. Chronic silence flags in `/Review`. |

**Detect:** Scan delivery dates, identify clients hitting 7/30/90 day marks this week.
**Draft:** Generate a personalized check-in: "How's everything going with [the thing we delivered]? Here's a tip for getting more from it."
**Review & Send:** Read on phone. Adjust tone, approve, send.

**Status:** Idea

---

### Satisfaction Radar — `/Satisfaction`

Watch for signals across all active clients that something's off — response tone shifts, slower replies, complaints in threads. Flag at-risk relationships before they churn. A recovered complaint builds more loyalty than no complaint at all, but only if you catch it early.

| Layer | Details |
|-------|---------|
| **Trigger** | Scheduled — weekly |
| **Workflow** | Static scanning (email reply times, thread sentiment) → Dynamic assessment (risk scoring, recommended action) |
| **Phases** | Scan (autonomous) → Assess (autonomous) → Act (phone) |
| **Artifacts** | `satisfaction-{date}.md` (client health scores, at-risk flags, recommended actions) |
| **Orchestration** | At-risk clients surface in `/Brief`. Positive signals trigger `/Referral` or `/Win-Story`. Issues feed into `/Status` for proactive outreach. |

**Scan:** Check email threads with active clients for sentiment signals — slower response times, shorter replies, complaint language, unresolved questions.
**Assess:** Score each client's health: green (engaged, positive), yellow (cooling, neutral), red (at-risk, negative). Flag the reds with specific evidence.
**Act:** Review on phone. For reds: draft a proactive check-in addressing the likely concern. For yellows: schedule a `/Status` update. Greens: consider `/Referral` timing.

**Status:** Idea — requires Gmail MCP integration

---

## Maintain

### Daily Brief — `/Brief`

A morning digest that replaces 30 minutes of context-loading across 5 apps with one document.

| Layer | Details |
|-------|---------|
| **Trigger** | Scheduled — daily at 7:00 AM |
| **Workflow** | Static gathering (API pulls) → Dynamic synthesis (prioritized briefing) |
| **Phases** | Gather (autonomous) → Synthesize (autonomous) → Act (phone) |
| **Artifacts** | `brief-{date}.md` |
| **Orchestration** | Action items from brief can trigger `/Inbox` drafts, `/Feature` locks, or calendar blocks |

**Gather:** Pull from Gmail (unread/flagged), calendar (today's events), GitHub (PR activity, issues), project roadmaps.
**Synthesize:** Compress into an Action/Context table: needs response, FYI, blocked. Draft suggested replies for routine items.
**Act:** Read on phone. Approve drafts, flag items for desk time, dismiss noise.

**Status:** Idea

---

### Code Health Audit — `/Audit`

Scheduled scans that surface tech debt, dead code, outdated dependencies, and architecture drift before they become emergencies.

| Layer | Details |
|-------|---------|
| **Trigger** | Scheduled — weekly |
| **Workflow** | Static scans (dependency audit, dead code, complexity) → Dynamic synthesis (health card) |
| **Phases** | Scan (autonomous) → Report (autonomous) → Review (phone) |
| **Artifacts** | `health-card.md` |
| **Orchestration** | Flagged items become `/New_Idea` entries or `/Bug` reports |

**Scan:** Run dependency checks, dead code detection, complexity analysis, architecture boundary checks.
**Report:** Summarize into a prioritized health card — urgent, creeping, fine.
**Review:** Read on phone. Park items, create tickets for things worth fixing, or ignore.

**Status:** Idea

---

### Maintenance Monitor — `/Monitor`

Catch problems before users do. Dependency vulnerabilities, expiring certs, broken links, failing health checks.

| Layer | Details |
|-------|---------|
| **Trigger** | Scheduled — daily or weekly per check type |
| **Workflow** | Static checks (deterministic scans) → Dynamic alerting (severity assessment, auto-fix proposals) |
| **Phases** | Check (autonomous) → Alert (autonomous) → Resolve (phone) |
| **Artifacts** | `monitor-{date}.md` |
| **Orchestration** | Urgent alerts can auto-create `/Bug` entries. Routine items feed into `/Audit` health card. |

**Status:** Idea

---

### Cash Flow Pulse — `/Cash-Flow`

Weekly finance pulse — revenue in, expenses out, margin check. Track 3 numbers weekly — this automates the gathering so you just review.

| Layer | Details |
|-------|---------|
| **Trigger** | Scheduled — weekly (Monday morning, before `/Brief`) |
| **Workflow** | Static gathering (invoice/expense data) → Dynamic analysis (trend detection, margin warnings) |
| **Phases** | Gather (autonomous) → Analyze (autonomous) → Review (phone) |
| **Artifacts** | `cashflow-{date}.md` (revenue, expenses, margin, trend vs. last 4 weeks) |
| **Orchestration** | Margin below 70% triggers a flag in `/Brief`. Feeds into `/Review` for weekly pattern tracking. |

**Gather:** Pull invoice data, expense records, outstanding receivables.
**Analyze:** Calculate revenue, expenses, profit margin. Compare to last 4 weeks. Flag anything below 70% margin for immediate attention.
**Review:** Read on phone. Three numbers in 30 seconds — if something's off, dig in at desk.

**Status:** Idea — requires finance data source

---

### Process Scorer — `/Systemize`

Score your un-automated processes using the frequency/time-cost/error-risk matrix. Surface the highest-scoring candidate and suggest what to build next.

| Layer | Details |
|-------|---------|
| **Trigger** | Scheduled — monthly |
| **Workflow** | Dynamic — AI reviews current processes, scores them, identifies automation candidates |
| **Phases** | Inventory (autonomous) → Score (autonomous) → Recommend (phone) |
| **Artifacts** | `systemize-{date}.md` (scored process list, top recommendation with implementation sketch) |
| **Orchestration** | Top recommendation becomes a `/New_Idea` entry. Completed automations get removed from next month's inventory. |

**Inventory:** Scan SOPs, recurring tasks, manual workflows. List what you're still doing by hand.
**Score:** Rate each on frequency (daily=3, weekly=2, monthly=1), time cost (1hr+=3, 15-60min=2, <15min=1), and error risk (often=3, sometimes=2, rarely=1). Sort by total.
**Recommend:** Present the top 2-3 candidates with a sketch of what automation would look like.

**Status:** Idea

---

### Week Review — `/Review`

End-of-week reflection that tracks what shipped, what slipped, and what to focus next. Prevents "where did the week go?"

| Layer | Details |
|-------|---------|
| **Trigger** | Scheduled — Friday 4:00 PM |
| **Workflow** | Static gathering (git logs, calendar, issues) → Dynamic synthesis (wins/stalls/patterns) |
| **Phases** | Gather (autonomous) → Summarize (autonomous) → Plan (phone) |
| **Artifacts** | `review-{date}.md` |
| **Orchestration** | Next-week priorities feed into Monday's `/Brief`. Patterns over multiple weeks surface in monthly retrospectives. |

**Gather:** Scan git logs, completed features, closed issues, dispatch artifacts, calendar across all projects.
**Summarize:** What shipped, what's in progress, what got blocked or parked. Highlight wins and stalls.
**Plan:** Review on phone. Adjust next week's priorities based on what actually happened vs. planned.

**Status:** Idea

---

## Grow

### Topic Tracking — `/Research {topic}`

Weekly insights gathered automatically so you stay current without doomscrolling. Pick topics once, get curated digests on schedule.

| Layer | Details |
|-------|---------|
| **Trigger** | Scheduled — weekly |
| **Workflow** | Static gathering (web search) → Dynamic synthesis (relevance filtering, impact analysis) |
| **Phases** | Gather (autonomous) → Synthesize (autonomous) → Review (phone) |
| **Artifacts** | `digest-{topic}-{date}.md` |
| **Orchestration** | Findings that affect active projects can trigger `/New_Idea` entries or update feature specs |

**Gather:** Search for recent developments, articles, papers, releases on tracked topics.
**Synthesize:** Distill into a digest: what changed, why it matters, how it affects your work.
**Review:** Read on phone. Bookmark for deep reading, flag project-affecting items, discard noise.

**Status:** Idea

---

### SEO Audit — `/SEO {site}`

Periodic checks that surface what's slipping — broken meta, thin content, keyword drift — without hiring an agency.

| Layer | Details |
|-------|---------|
| **Trigger** | Scheduled — monthly |
| **Workflow** | Static crawling (page scanning) → Dynamic analysis (competitor comparison, content gap identification) |
| **Phases** | Crawl (autonomous) → Analyze (autonomous) → Prioritize (phone) |
| **Artifacts** | `seo-report-{date}.md` |
| **Orchestration** | Quick-win fixes (meta tags, alt text) can generate PRs directly. Strategic items become `/New_Idea` entries. |

**Status:** Idea — requires web crawling capability

---

### Follow-Up Radar — `/Follow-Up`

Important conversations quietly dying in your inbox. Catches stale threads, unanswered questions, and post-meeting silence before relationships cool off.

| Layer | Details |
|-------|---------|
| **Trigger** | Scheduled — every weekday afternoon |
| **Workflow** | Static scanning (Gmail thread age, reply status) → Dynamic drafting (value-based nudges, not "just checking in") |
| **Phases** | Scan (autonomous) → Rank (autonomous) → Draft & Review (phone) |
| **Artifacts** | `followup-{date}.md` (ranked queue with draft nudges per thread) |
| **Orchestration** | Feeds review-ready replies into `/Inbox`. Revives warm leads for `/Scout`. Highest-risk threads surface in `/Brief`. |

**Scan:** Check Gmail and calendar for stale threads (no reply in 3+ days), unanswered questions, and post-meeting silence.
**Rank:** Score by relationship value, time decay, and urgency. A prospect who went silent after a proposal outranks a newsletter reply.
**Draft:** Generate value-based follow-ups — an insight, a resource, a result — not "just circling back." Matches the Day 1/3/7/14/30 sequence from the sales playbook.

**Status:** Idea — requires Gmail MCP integration

---

### Outreach Warm-Up — `/Warm-Up`

Pre-research prospects and contacts you're meeting this week so you walk into every conversation prepared, not scrambling.

| Layer | Details |
|-------|---------|
| **Trigger** | Scheduled — every Monday 8:00 AM |
| **Workflow** | Static gathering (calendar pull) → Dynamic profiling (web research, pain point mapping, talking points) |
| **Phases** | Pull Calendar (autonomous) → Research Contacts (autonomous) → Review (phone) |
| **Artifacts** | `warmup-{contact}-{date}.md` (background, recent news, talking points, service alignment) |
| **Orchestration** | Today's briefs surface in `/Brief` action table. If meeting converts to opportunity, feeds into `/Enrich` or `/Scout`. |

**Pull Calendar:** Identify all external meetings this week from Google Calendar.
**Research Contacts:** For each contact: LinkedIn profile, company news, recent activity, shared context. Map their likely pain points to your services.
**Review:** Read one-pagers on phone before each meeting. Add personal notes.

**Status:** Idea — requires Calendar MCP + web search

---

### Opportunity Radar — `/Opportunities`

Surface relevant opportunities — markets, partnerships, events, applications — before they expire.

| Layer | Details |
|-------|---------|
| **Trigger** | Scheduled — weekly |
| **Workflow** | Static scanning (web, Gmail, calendar) → Dynamic scoring (fit against roadmap and bandwidth) |
| **Phases** | Scan (autonomous) → Score (autonomous) → Review (phone) |
| **Artifacts** | `opportunities-{date}.md` (shortlist with deadlines, fit scores, first moves) |
| **Orchestration** | Promising opportunities feed into `/Scout` or `/Enrich`. Imminent deadlines surface in `/Brief`. New opportunities route through `/New_Idea` for deliberate evaluation. |

**Scan:** Search web, Gmail, and calendar for markets, partnerships, grant applications, speaking opportunities, events.
**Score:** Rate each against your current roadmap, bandwidth, and strategic fit.
**Review:** Read shortlist on phone. Act on high-fit items, park the rest.

**Status:** Idea — requires web search

---

### Client Reactivation — `/Reactivate`

Re-engage past clients who haven't been in touch for 90+ days. Draft a re-engagement message with something new you've built since they left — not a generic "we miss you."

| Layer | Details |
|-------|---------|
| **Trigger** | Scheduled — monthly |
| **Workflow** | Static scanning (last contact dates) → Dynamic drafting (personalized re-engagement based on what's changed) |
| **Phases** | Scan (autonomous) → Draft (autonomous) → Review & Send (phone) |
| **Artifacts** | `reactivate-{date}.md` (dormant client list with draft messages) |
| **Orchestration** | Reactivated clients feed back into `/Onboard` or `/Check-In`. Responses feed into `/Inbox`. No-response after 2 attempts → archive. |

**Scan:** Identify past clients with no email, call, or project activity in 90+ days.
**Draft:** For each, generate a personalized re-engagement: reference their last project, highlight something new you've built or learned since, offer a specific reason to reconnect — not "just checking in."
**Review & Send:** Read on phone. Skip clients you've intentionally parted ways with. Send the rest.

**Status:** Idea — requires Gmail MCP integration

---

### Market Intel — `/Intel {brand}`

Track your competitive landscape so you're not blindsided by pricing changes, new entrants, or shifting demand.

| Layer | Details |
|-------|---------|
| **Trigger** | Scheduled — weekly (mid-week) |
| **Workflow** | Static gathering (web search, price monitoring) → Dynamic analysis (comparison to your baseline, trend detection) |
| **Phases** | Gather (autonomous) → Compare (autonomous) → Review (phone) |
| **Artifacts** | `intel-{brand}-{date}.md` (competitor activity, pricing data, trend notes), `pricing-baseline.md` (your reference sheet, updated over time) |
| **Orchestration** | Intel informs pricing decisions in `/Cash-Flow`. New competitor moves can trigger `/New_Idea` for strategic response. |

**Gather:** Search for competitors, pricing trends, market shifts, seasonal patterns in your space.
**Compare:** Benchmark against your current pricing and positioning. Flag anything notable.
**Review:** Read on phone. Adjust strategy if needed, or file as context.

**Status:** Idea — requires web search

---

# Orchestration Chains

The real power is when dispatch and remote connect across pillars.

```
Monday 7 AM [Maintain]
  /Brief (remote)
    → surfaces 3 emails needing replies
    → triggers /Inbox (dispatch — Fulfill)
    → drafts sent by 8 AM

Weekly Friday [Maintain]
  /Review (remote)
    → identifies feature that stalled
    → next Monday's /Brief includes it as priority
    → /Feature lock (dispatch — Fulfill) picks it up

Weekly [Maintain → Fulfill]
  /Audit (remote)
    → finds outdated dependency with CVE
    → auto-creates /Bug entry
    → next /Triage (dispatch) surfaces it as P1
    → /Feature lock picks fix as highest-leverage task

New client signs [Fulfill → Grow]
  /Onboard (dispatch)
    → generates kickoff materials, schedules first delivery
    → /Check-In (remote) auto-schedules at 7/30/90 days
    → positive 30-day check-in triggers /Referral (dispatch — Grow)
    → referral ask leads to /Scout for new pipeline

Weekly Monday [Grow]
  /Warm-Up (remote)
    → researches this week's meeting contacts
    → briefs surface in /Brief action table
    → meeting converts → /Enrich (dispatch) deepens the lead
    → /Follow-Up (remote) catches if they go silent after

Monthly [Maintain → Fulfill]
  /Systemize (remote)
    → scores un-automated processes
    → top candidate becomes /New_Idea entry (dispatch — Fulfill)
    → /Feature builds the automation
    → next month's /Systemize score drops — progress visible
```

---

## What's Next

Ideas to flesh out:
- **Content Pipeline** — blog post drafts, social media scheduling, newsletter curation
- **Learning Sprints** — structured study sessions on new tech, with spaced repetition
- **Client Reporting** — automated project status reports for stakeholders
- **Meeting Prep** — pre-meeting briefings with attendee context and agenda suggestions
- **Retrospective** — monthly pattern analysis across multiple `/Review` artifacts
