# Phase 3: Core Modules & Marketing Intelligence

**@fileoverview** Core modules phase for Alva - expanding beyond PPC to include Blog, Email, and Social modules with governance logic for unified plan generation.

---

## Phase Overview

**Goal**: Transform Alva from single-module (PPC) to multi-module marketing platform with intelligent task scheduling and prioritization

**Duration**: 4-5 weeks

**Deliverable**: Multi-channel marketing plans with governance-driven task coordination, advanced dashboard features, and comprehensive strategy coverage

**Success Criteria**:

- ✅ All modules implemented in API server
- ✅ Blog module generates content calendars
- ✅ Email module creates campaign schedules
- ✅ Social module plans platform-specific content
- ✅ Governance logic merges modules without conflicts
- ✅ Tasks scheduled based on capacity
- ✅ Web dashboard shows Quick Wins and streaks
- ✅ Web Action Board displays all tasks from API
- ✅ Plan quality meets user needs

---

## Features & Tasks

**Note**: All module implementations are built in the API server (`apps/api/src/services/plan-generation/`). The Web app consumes these via REST endpoints.

---

### 1. Blog Module Implementation (API Service)

**Objective**: Generate SEO-optimized blog content strategy

**Tasks**:

1. Create blog plan generator
   - Load base blog plan template
   - Use client profile for personalization
   - Call OpenAI with JSON mode
   - Structure: events → topics → briefs → outlines → drafts
2. Implement workflow logic per project-overview.md
   - W1: Collect inputs (profile, SEO requirements)
   - W2: Apply SEO rules (RankMath guidelines)
   - W3: Generate monthly events (3-5 per month)
   - W4: Map events to topics (1-2 per event)
   - W5: Create content briefs
   - W6: Generate outlines (H1, H2, H3)
   - W7: Draft articles
   - W8: Apply on-page SEO requirements
   - W9: Create interlinking plan
   - W10: Build publish schedule
3. Add SEO best practices
   - Single H1 enforcement
   - Focus keyword in title + first 100 words
   - Image ALT text requirements
   - OpenGraph metadata
   - Internal link targets (min 3 per post)
   - External authority links (min 1 per post)
4. Create blog task output
   - Convert plan to task format
   - Add channel: "blog"
   - Include estimated time (write, edit, publish)
   - Set suggested weeks based on seasonality

**Dependencies**: MVP plan generation system

**Acceptance Criteria**:

- Blog plan generates 3-12 month content calendar
- SEO requirements validated in output
- Topics align with client's audience and business
- Tasks include all necessary steps (research, write, publish)
- Output matches `module_output.schema.json`

---

### 2. Email Module Implementation (API Service)

**Objective**: Create email marketing campaign strategy

**Tasks**:

1. Build email campaign generator
   - Welcome sequence for new subscribers
   - Nurture campaigns based on customer journey
   - Promotional campaigns tied to seasonality
   - Re-engagement campaigns for inactive users
2. Implement email workflow
   - Determine email frequency (weekly, bi-weekly, monthly)
   - Map to client's capacity and list size
   - Create campaign themes from profile
   - Generate subject lines and preview text
   - Define segment targeting
3. Add personalization logic
   - Use `past_successes` to prioritize proven tactics
   - Avoid `past_failures` (e.g., skip FB ads if failed before)
   - Reference products/services from profile
   - Align with growth mode (online, in-person, both)
4. Create email task output
   - Campaign planning tasks
   - Email writing tasks
   - List segmentation tasks
   - A/B testing tasks
   - Channel: "email"

**Dependencies**: Client profile system

**Acceptance Criteria**:

- Email plan includes 2-4 campaigns per month
- Campaigns tied to business goals
- Frequency matches client capacity
- Tasks actionable with clear deliverables
- Integration points for Mailchimp/similar noted

---

### 3. Social Media Module Implementation (API Service)

**Objective**: Generate platform-specific social media content strategy

**Tasks**:

1. Create social module generator
   - Identify active platforms from profile
   - Generate posting cadence per platform
   - Create content pillar breakdown
   - Map content types to platforms
2. Implement platform-specific logic
   - Instagram: Reels, Stories, Posts (visual-first)
   - TikTok: Short-form video (trend-aware)
   - LinkedIn: Thought leadership, B2B content
   - Facebook: Community engagement, longer posts
   - Twitter/X: Quick updates, engagement
3. Add content type recommendations
   - Match to `content_preferences` from profile
   - If "shows_face_or_voice: No" → skip talking head content
   - If limited time → prioritize quick formats
   - Use `past_successes` to guide formats
4. Create social task output
   - Content creation tasks
   - Posting tasks (with best times)
   - Engagement tasks (respond to comments)
   - Analytics review tasks
   - Channel: "social"

**Dependencies**: Client profile, content preferences

**Acceptance Criteria**:

- Social plan covers all active platforms
- Content types match capabilities
- Posting frequency realistic for capacity
- Tasks include creation and engagement
- Platform best practices applied

---

### 4. Governance Logic & Plan Merging (API Service)

**Objective**: Combine all module outputs into unified, conflict-free master plan (in API server)

**Tasks**:

1. Implement task normalization
   - Ensure channel ∈ {ppc, social, email, blog, seo, ops}
   - Ensure effort ∈ {1, 2, 3} → minutes {30, 75, 210}
   - Generate unique IDs: sha1(client_id|module|module_task_id|title)
   - Standardize date formats (ISO 8601)
2. Build deduplication logic
   - Compare task titles (≥0.7 similarity → duplicate)
   - Compare module_task_id (exact match → duplicate)
   - Resolution: Keep higher priority or shorter duration
   - Log deduplication decisions
3. Implement scheduling algorithm
   - Place tasks by `suggested_week` relative to window_start
   - Reserve one Quick Win (effort 1) per weekday
   - Enforce weekly minutes cap from `weekly_capacity_hours`
   - Overflow pushes to next week
   - Honor `due_hint` (e.g., "before_first_launch")
4. Add priority system
   - Quick Win = priority 1
   - Launch/Seasonal = priority 1
   - Evergreen = priority 3
   - Default = priority 2
5. Create master plan output
   - Single `master.json` file
   - Includes: plan metadata, all tasks, resolution log
   - Conforms to `master_json.schema.json`
   - Store in database linked to user

**Dependencies**: All module implementations

**Acceptance Criteria**:

- All module tasks merge without errors
- No duplicate tasks in output
- Weekly capacity not exceeded
- Tasks scheduled in logical order
- Priority system works correctly
- Resolution log explains decisions

---

### 5. Task Scheduling & Capacity Management

**Objective**: Intelligently schedule tasks based on user capacity and priorities

**Tasks**:

1. Build capacity calculator
   - Read `weekly_marketing_time_hours` from profile
   - Convert to minutes per week
   - Reserve buffer (20%) for unexpected work
   - Calculate available minutes per day
2. Implement task distribution
   - Distribute tasks across planning window (default 90 days)
   - Balance workload week-over-week
   - Front-load high-priority tasks
   - Leave final week lighter (buffer)
3. Add Quick Win system
   - Identify tasks with effort=1 (30 min)
   - Prioritize high-impact, low-effort tasks
   - Assign one per weekday
   - Track completion for streak calculation
4. Create overflow handling
   - If week exceeds capacity, defer to next week
   - Log deferral with reason
   - Ensure critical deadlines still met
   - Provide warning if plan unrealistic

**Dependencies**: Governance logic

**Acceptance Criteria**:

- Tasks distributed evenly across weeks
- Capacity respected (no over-scheduling)
- Quick Wins assigned to weekdays
- Overflow handled gracefully
- User warned if plan ambitious

---

### 6. Enhanced Dashboard (Web Service)

**Objective**: Display comprehensive plan overview from API with actionable insights

**Tasks**:

1. Upgrade Quick Win card
   - Show task title, description, channel
   - Estimated time display
   - "Start Task" button
   - Streak counter with fire emoji
   - Confetti animation on completion (optional)
2. Build streak tracking system
   - Count consecutive weekdays with completed Quick Win
   - Reset on missed day
   - Store in user stats table
   - Display prominently on dashboard
3. Enhance upcoming deadlines
   - Show next 3-5 tasks by due date
   - Color-code by priority
   - Channel tags with icons
   - Click to view details or complete
4. Add plan overview widget
   - Window dates (start → end)
   - Total tasks: planned, in-progress, completed
   - Completion percentage
   - Active channels with task counts
   - Weekly capacity utilization
5. Create plan selector (if multiple plans)
   - Dropdown to switch between plans
   - Show plan date ranges
   - Highlight active plan
   - Archive old plans

**Dependencies**: Task scheduling, governance

**Acceptance Criteria**:

- Dashboard loads in <1 second
- Quick Win card interactive
- Streak tracking accurate
- Plan overview informative
- Navigation intuitive

---

### 7. Action Board (Web Service - Kanban View)

**Objective**: Provide full task management UI consuming API data

**Tasks**:

1. Create Kanban board layout
   - Columns: Planned, In Progress, Completed, Deferred
   - Drag-and-drop between columns
   - Responsive (list view on mobile)
2. Build task card component
   - Title, description (truncated)
   - Channel tag (color-coded)
   - Priority indicator
   - Estimated minutes
   - Due date
   - External ref links (if connected)
3. Implement filtering system
   - By channel (multi-select)
   - By priority (high, medium, low)
   - By effort (30min, 75min, 210min)
   - By date range
   - Search by title/description
4. Add task actions
   - Click task → Open detail modal
   - Mark complete
   - Defer to later date
   - Edit task details
   - Delete task (with confirmation)
5. Implement drag-and-drop
   - Use dnd-kit or react-beautiful-dnd
   - Update task status on drop
   - Optimistic UI updates
   - Sync to database

**Backend Integration**:
- GET `/tasks` with query params (channel, priority, status, date range, search)
- PATCH `/tasks/:id` to update status on drag-and-drop
- PATCH `/tasks/:id/defer` to defer tasks
- DELETE `/tasks/:id` to delete tasks

**Dependencies**: Enhanced dashboard, API task endpoints

**Acceptance Criteria**:

- Board displays all tasks correctly from API
- Drag-and-drop updates via API
- Filters update results in real-time (client-side + API)
- Task cards show all relevant info
- Mobile view functional (list format)
- Optimistic UI updates before API confirms
- Persistence to database reliable via API

---

### 8. Module Configuration & Preferences (Web + API)

**Objective**: Allow users to enable/disable modules via Web UI, settings stored in API

**Tasks**:

1. Create module settings page
   - Toggle modules on/off (PPC, Blog, Email, Social)
   - Set module-specific preferences
   - Save to user settings
2. Implement module-specific configs
   - PPC: Budget, platforms, campaign types
   - Blog: Posting frequency, SEO level
   - Email: Send frequency, segment preferences
   - Social: Platforms, content types
3. Add regeneration capability
   - "Regenerate Plan" button
   - Select which modules to include
   - Preserve user customizations
   - Queue new generation job
4. Create plan comparison
   - Show before/after when regenerating
   - Highlight changes
   - Option to revert

**Dependencies**: All modules implemented

**Acceptance Criteria**:

- Users can enable/disable modules
- Settings persist and affect generation
- Regeneration works with new settings
- Comparison view helpful

---

### 9. Advanced Analytics & Insights

**Objective**: Provide actionable insights from plan and performance data

**Tasks**:

1. Build task completion analytics
   - Completion rate by channel
   - Average time vs estimated time
   - Tasks completed per week
   - Best completion days/times
2. Add plan health indicators
   - Capacity utilization (over/under)
   - Task distribution balance
   - Deadline pressure score
   - Module coverage balance
3. Create recommendation engine
   - Suggest adjusting capacity if consistently over
   - Recommend enabling modules if gaps exist
   - Highlight underused channels
   - Identify bottleneck tasks
4. Implement simple reporting
   - Weekly summary email (optional)
   - Monthly progress report
   - Export plan to PDF/CSV

**Dependencies**: Completed tasks data

**Acceptance Criteria**:

- Analytics display correctly
- Insights actionable
- Recommendations relevant
- Reports generate successfully

---

### 10. External Integrations (Basic)

**Objective**: Connect to external tools for task management

**Tasks**:

1. Implement Google Calendar integration
   - OAuth setup
   - Create calendar events for tasks
   - Sync task status updates
   - Handle disconnection gracefully
2. Add ClickUp integration (optional)
   - API key setup
   - Create tasks in ClickUp
   - Bi-directional sync
   - Map task fields correctly
3. Create webhook system
   - Allow users to set up webhooks
   - Trigger on task completion
   - Send task data as payload
   - Support custom integrations
4. Build export functionality
   - Export tasks to JSON
   - Export to CSV for spreadsheets
   - Export to iCal for calendars

**Dependencies**: Dashboard and Action Board

**Acceptance Criteria**:

- Google Calendar sync works
- ClickUp integration functional (if implemented)
- Webhooks fire correctly
- Exports include all data

---

## Technical Architecture

### Module System Design

```
Client Profile
    ↓
┌─────────────────────────────────────┐
│  Module Orchestrator                │
├─────────────────────────────────────┤
│  • Reads client profile             │
│  • Determines enabled modules       │
│  • Queues generation jobs           │
└─────────────────────────────────────┘
    ↓           ↓           ↓           ↓
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│   PPC   │ │  Blog   │ │  Email  │ │ Social  │
│ Module  │ │ Module  │ │ Module  │ │ Module  │
└─────────┘ └─────────┘ └─────────┘ └─────────┘
    ↓           ↓           ↓           ↓
        modules.json (combined outputs)
                    ↓
          ┌─────────────────┐
          │   Governance    │
          │  • Normalize    │
          │  • Dedupe       │
          │  • Schedule     │
          │  • Prioritize   │
          └─────────────────┘
                    ↓
            master.json (final plan)
                    ↓
                Dashboard
```

### Governance Algorithm

```typescript
/**
 * @description Merges module outputs into master plan
 */
async function mergeModules(moduleOutputs: ModuleOutput[], clientProfile: ClientProfile): Promise<MasterPlan> {
  // 1. Normalize all tasks
  const normalized = moduleOutputs.flatMap((m) => normalizeTasks(m.tasks, m.module_key));

  // 2. Deduplicate
  const deduped = deduplicateTasks(normalized);

  // 3. Schedule within capacity
  const scheduled = scheduleTasks(deduped, clientProfile.constraints);

  // 4. Build master plan
  return {
    plan: buildPlanMetadata(clientProfile),
    tasks: scheduled,
    meta: buildMeta(),
  };
}
```

---

## Testing Strategy

### Unit Tests

- Module generators (mocked LLM responses)
- Governance deduplication logic
- Task scheduling algorithm
- Priority calculation
- Capacity management

### Integration Tests

- End-to-end module generation
- Plan merging with all modules
- Database persistence
- API endpoints

### E2E Tests

- Enable modules → generate plan → view dashboard
- Filter tasks on Action Board
- Complete tasks and track streak
- Export plan to external tools

---

## Performance Considerations

- **Parallel Module Generation**: Run all modules concurrently
- **Caching**: Cache LLM responses for identical inputs
- **Incremental Updates**: Only regenerate changed modules
- **Lazy Loading**: Load Action Board data on demand
- **Optimistic UI**: Update UI before server confirms

---

## Dependencies on Other Phases

**Requires**:

- Phase 1 (Setup) - infrastructure
- Phase 2 (MVP) - PPC module, plan generation system

**Blocks**:

- Phase 4 (Polish) - needs complete module system to refine

---

## Risks & Mitigations

### Risk 1: Module Conflict in Scheduling

**Mitigation**: Robust governance logic with conflict resolution, thorough testing

### Risk 2: LLM Consistency Across Modules

**Mitigation**: Standardized prompts, temperature=0, validation schemas

### Risk 3: Performance with Multiple Modules

**Mitigation**: Parallel processing, caching, background jobs

### Risk 4: User Overwhelm with Tasks

**Mitigation**: Smart prioritization, Quick Wins, capacity management

---

## Definition of Done

- [ ] All modules (Blog, Email, Social) implemented
- [ ] Governance logic merges plans successfully
- [ ] Task scheduling respects capacity
- [ ] Dashboard shows Quick Wins and streaks
- [ ] Action Board fully functional
- [ ] Module settings configurable
- [ ] Analytics provide insights
- [ ] External integrations working
- [ ] All acceptance criteria met
- [ ] Integration tests passing
- [ ] E2E tests covering main flows
- [ ] Performance benchmarks met
- [ ] Deployed to staging
- [ ] User testing complete

---

## Success Metrics

**Plan Quality**:

- Module coverage: All enabled modules generate tasks
- Task distribution: Even workload across weeks
- Completion rate: 40%+ of tasks marked complete

**User Engagement**:

- Daily Quick Win completion: 40%+
- Streak achievement: 50%+ reach 7-day streak
- Action Board usage: 60%+ use filters/sorting

**Technical**:

- Plan generation time: <2 minutes (all modules)
- Module success rate: 95%+ generate without errors
- Dashboard load time: <1.5s with 100+ tasks

---

## Next Steps

After Core Modules are complete, proceed to **Phase 4: Polish & Production Ready** to add:

- Calendar integrations
- Advanced task management features
- Performance optimization
- Error handling and monitoring
- Full test coverage
- Production hardening
