# Alva Documentation

**@fileoverview** Central navigation hub for all Alva project documentation.

---

## Welcome

This directory contains comprehensive documentation for the Alva marketing platform. Documentation is organized into logical sections to support developers, designers, and stakeholders throughout the project lifecycle.

---

## Documentation Structure

### 📋 Overview

High-level project vision and comprehensive specifications.

- **[project-overview.md](overview/project-overview.md)** - Complete project definition including brand guide, user flows, data schemas, and technical architecture

### 📐 Project Definition

Core specifications that guide development.

- **[architecture.md](project-definition/architecture.md)** - Microservices architecture, service communication, and auth strategy
- **[user-flow.md](project-definition/user-flow.md)** - Complete user journey from landing to active plan management
- **[tech-stack.md](project-definition/tech-stack.md)** - Technology decisions, alternatives, and best practices
- **[ui-rules.md](project-definition/ui-rules.md)** - UI design principles, component patterns, and interaction guidelines
- **[theme-rules.md](project-definition/theme-rules.md)** - Design system: colors, typography, spacing, and visual language
- **[project-rules.md](project-definition/project-rules.md)** - Code organization, naming conventions, and NX patterns

### 🚀 Development Phases

Iterative development plan with detailed task breakdowns.

- **[01-setup-phase.md](phases/01-setup-phase.md)** - Foundation: NX workspace, database, auth, infrastructure
- **[02-mvp-phase.md](phases/02-mvp-phase.md)** - Core product: onboarding, plan generation, chat
- **[03-core-modules-phase.md](phases/03-core-modules-phase.md)** - Multi-channel: Blog, Email, Social modules + governance
- **[04-polish-phase.md](phases/04-polish-phase.md)** - Production: performance, testing, monitoring, launch

### 🛠️ Detailed Implementation Plans

Step-by-step implementation guides for each phase.

- **[01-phase-1-implementation-plan.md](phase-plans/01-phase-1-implementation-plan.md)** - Detailed setup instructions with commands, file structures, and validation steps

### 🛠️ Setup Guides

Resources for getting started.

- **[new-project-setup.md](setup/new-project-setup.md)** - Step-by-step guide for creating project documentation from scratch

### 🎨 Visual Design

Design assets and mockups for reference.

- **[mockups/](mockups/)** - Complete visual mockups for mobile and desktop interfaces
  - **[mobile/](mockups/mobile/)** - Mobile onboarding flow mockups (26 cards)
  - **[web/](mockups/web/)** - Desktop application mockups and UI designs

---

## Quick Links

### For Developers

- [Getting Started](../README.md#getting-started) - Installation and setup
- [Project Structure](project-definition/project-rules.md#directory-structure) - Monorepo organization
- [Coding Standards](project-definition/project-rules.md#code-organization) - Conventions and patterns
- [Tech Stack](project-definition/tech-stack.md) - Technology choices and usage

### For Designers

- [Design System](project-definition/theme-rules.md) - Colors, typography, spacing
- [UI Components](project-definition/ui-rules.md) - Component guidelines and patterns
- [User Flows](project-definition/user-flow.md) - Complete user journeys
- [Brand Guide](overview/project-overview.md#alva-brand-guide) - Brand identity and voice

### For Product/Business

- [Project Overview](overview/project-overview.md) - Vision, mission, strategy
- [User Flow](project-definition/user-flow.md) - User experience mapping
- [Development Roadmap](phases/) - Phased development plan
- [Success Metrics](phases/02-mvp-phase.md#success-metrics) - KPIs and targets

---

## Documentation by Topic

### Architecture & Infrastructure

- [Architecture Overview](project-definition/architecture.md)
- [Tech Stack](project-definition/tech-stack.md)
- [Project Structure](project-definition/project-rules.md#monorepo-structure)
- [Database Schema](overview/project-overview.md#client-information-reference-schema-json)
- [API Design](project-definition/architecture.md#service-communication)
- [Auth Strategy](project-definition/architecture.md#authentication-strategy)

### User Experience

- [User Flow](project-definition/user-flow.md)
- [Onboarding Cards](overview/project-overview.md#onboarding-cards)
- [UI Patterns](project-definition/ui-rules.md)
- [Accessibility](project-definition/ui-rules.md#accessibility-requirements)
- [Mobile Mockups](mockups/mobile/) - Complete onboarding flow
- [Desktop Mockups](mockups/web/) - Application interface designs

### Design System

- [Theme & Brand](project-definition/theme-rules.md)
- [Color System](project-definition/theme-rules.md#color-system)
- [Typography](project-definition/theme-rules.md#typography)
- [Components](project-definition/ui-rules.md#component-architecture)

### Development Process

- [Setup Phase](phases/01-setup-phase.md)
- [MVP Phase](phases/02-mvp-phase.md)
- [Core Modules](phases/03-core-modules-phase.md)
- [Polish Phase](phases/04-polish-phase.md)

### Implementation Guides

- [Phase 1 Implementation Plan](phase-plans/01-phase-1-implementation-plan.md) - Step-by-step setup instructions

### AI & Marketing Logic

- [Plan Generation](overview/project-overview.md#ppc-marketing-plan-json)
- [Module System](overview/project-overview.md#governance-logic-for-merging-modules)
- [LLM Integration](project-definition/tech-stack.md#ai--llm-integration)
- [Prompt Templates](overview/project-overview.md#deterministic-prompt-templates)

---

## Documentation Standards

All documentation in this repository follows these standards:

### File Headers

Every Markdown file starts with:

```markdown
# Title

**@fileoverview** Brief description of the document's purpose.
```

### Structure

- Clear hierarchy with heading levels (H1 → H2 → H3)
- Table of contents for long documents
- Code examples in fenced code blocks with language tags
- Links to related documents

### Style

- **Concise**: Get to the point quickly
- **Specific**: Include examples and concrete details
- **Actionable**: Provide clear next steps
- **Searchable**: Use descriptive headings and keywords

---

## How to Use This Documentation

### For New Team Members

1. Start with [README.md](../README.md) - Overview and setup
2. Read [project-overview.md](overview/project-overview.md) - Understand the vision
3. Review [user-flow.md](project-definition/user-flow.md) - Learn the product
4. Study [tech-stack.md](project-definition/tech-stack.md) - Understand the stack
5. Follow [setup-phase.md](phases/01-setup-phase.md) - Begin development

### For Design Work

1. Review [theme-rules.md](project-definition/theme-rules.md) - Design system
2. Study [ui-rules.md](project-definition/ui-rules.md) - Component patterns
3. Reference [user-flow.md](project-definition/user-flow.md) - User journeys
4. Check [project-overview.md](overview/project-overview.md) - Brand guide
5. View [mockups/](mockups/) - Visual designs for mobile and desktop

### For Development

1. Follow [project-rules.md](project-definition/project-rules.md) - Coding standards
2. Reference [tech-stack.md](project-definition/tech-stack.md) - Implementation details
3. Consult phase docs for task breakdowns
4. Use [project-overview.md](overview/project-overview.md) for schemas

---

## Updating Documentation

When adding or modifying documentation:

1. **Keep it Current**: Update docs alongside code changes
2. **Link Related Docs**: Cross-reference related content
3. **Update This Index**: Add new docs to appropriate sections above
4. **Use Templates**: Follow existing document structure
5. **Review**: Have documentation changes reviewed like code

---

## Document Maintenance

### Regular Reviews

- **Weekly**: Check for broken links
- **Monthly**: Verify accuracy against codebase
- **Quarterly**: Update with new learnings and patterns

### Version Control

- Documentation lives in the repository
- Track changes with git
- Use PRs for significant doc updates
- Keep README.md synchronized

---

## Additional Resources

### External Links

- [NX Documentation](https://nx.dev/getting-started/intro)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)

### Related Files

- [Root README](../README.md) - Main project README
- [Contributing Guide](../CONTRIBUTING.md) - Contribution guidelines (when created)
- [Changelog](../CHANGELOG.md) - Version history (when created)

---

## Contact & Support

For questions about documentation:

- Open an issue on GitHub
- Contact the development team
- Suggest improvements via PR

---

**Last Updated**: Initial documentation complete
**Maintained By**: Alva Development Team

---

## Document Status

| Document                 | Status      | Last Updated | Reviewer |
| ------------------------ | ----------- | ------------ | -------- |
| project-overview.md      | ✅ Complete | [Date]       | -        |
| user-flow.md             | ✅ Complete | [Date]       | -        |
| tech-stack.md            | ✅ Complete | [Date]       | -        |
| ui-rules.md              | ✅ Complete | [Date]       | -        |
| theme-rules.md           | ✅ Complete | [Date]       | -        |
| project-rules.md         | ✅ Complete | [Date]       | -        |
| 01-setup-phase.md        | ✅ Complete | [Date]       | -        |
| 02-mvp-phase.md          | ✅ Complete | [Date]       | -        |
| 03-core-modules-phase.md | ✅ Complete | [Date]       | -        |
| 04-polish-phase.md       | ✅ Complete | [Date]       | -        |

---

**Welcome to the Alva documentation!** This living documentation will evolve as the project grows. Start with the sections most relevant to your role and dive deeper as needed.
