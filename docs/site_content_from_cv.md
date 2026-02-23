---
# Content pack extracted from CV (for populating the personal website)
# Notes:
# - Phone number intentionally omitted (privacy choice: public contact via email + LinkedIn).
# - Keep this file as the single source of truth; Claude Code can convert these fields into typed TS modules.

profile:
  name: "Pedro Duarte"
  title: "Senior Software Engineer / Senior Product Engineer (Backend)"
  location: "Lisbon, Portugal"
  email: "pedroduartek@gmail.com"
  linkedin: "https://www.linkedin.com/in/pedroduartek/"
  summary: >
    Senior Product Engineer with 6 years of experience building scalable backend platforms in C#/.NET (8+),
    microservices, and event-driven architectures with Kafka. Proven track record as a Tech Lead, owning system design,
    delivery, and production reliability across SQL and NoSQL data stores. Passionate about developer productivity and
    automation, including running a self-hosted Home Assistant environment with 50+ Zigbee devices and custom automations.

technical_skills:
  backend:
    - "C#"
    - ".NET 6–10"
    - "ASP.NET Core"
    - "Microservices architecture"
    - "REST APIs"
    - "Event-driven systems"
    - "Domain-driven design"
  data_and_messaging:
    - "Kafka"
    - "SQL Server"
    - "PostgreSQL"
    - "Elasticsearch"
    - "Redis"
    - "NoSQL data modelling"
    - "High-volume indexing & query optimization"
  infrastructure_and_devops:
    - "Docker"
    - "Kubernetes"
    - "Azure DevOps Pipelines"
    - "Cloud-ready architectures"
    - "CI/CD migration (GoCD → Azure DevOps)"
  architecture_and_leadership:
    - "Tech Lead experience"
    - "System design for scalable services"
    - "Production reliability"
    - "Security & vulnerability reduction to zero in production"
  automation_and_iot_personal:
    - "Self-hosted Home Assistant server"
    - "Zigbee network integration (50+ devices)"
    - "Automation design and monitoring"
  modern_ai:
    - "Practical use of GitHub Copilot and agentic coding tools"

experience:
  - company: "Enhesa"
    role: "Senior Software Engineer - Tech Lead"
    start: "2023-03"
    end: "present"
    location: "Lisbon, Portugal"
    tech_stack:
      - "C# .NET 10"
      - "Kafka"
      - "Elasticsearch"
      - "Postgres"
      - "Entity Framework"
      - "Kubernetes"
      - "Redis"
    responsibilities:
      - "Maintenance, design, and development of core microservices: Identity Service, User Management, Export Service, Document Service, Home Page."
    highlights:
      - "Resolved a major performance bottleneck in Identity Service (/connect/token): reduced average latency from ~1.5s to <100ms (~93% improvement) by redesigning flow, adding distributed cache (Redis) with TTL aligned to token expiration, and adding a circuit breaker to improve resilience and scalability."
      - "Designed and delivered an Integrations Service enabling configuration-driven integrations without code changes; reduced integration setup time from weeks to hours/days."
      - "Led a cross-service initiative reducing production vulnerabilities to zero."
      - "Migrated CI/CD pipelines from GoCD to Azure DevOps Pipelines to standardize and automate deployments."

  - company: "Enhesa"
    role: "Software Engineer"
    start: "2022-05"
    end: "2023-05"
    location: "Lisbon, Portugal"
    notes:
      - "Same company; role prior to Tech Lead position."

  - company: "VORTAL"
    role: "Software Engineer"
    start: "2021-08"
    end: "2022-04"
    location: "Portugal"
    tech_stack:
      - "C# .NET Core"
      - "SQL Server"
      - "Entity Framework"
    highlights:
      - "Participated in building initial microservices during transition from monolith to microservices; helped establish patterns for future services."

  - company: "Closer Consulting"
    role: "Junior Software Engineer"
    start: "2020-09"
    end: "2021-08"
    location: "Portugal"
    tech_stack:
      - ".NET MVC"
      - "Razor"
      - "SQL Server"

  - company: "Closer Consulting"
    role: "Intern Software Engineer"
    start: "2020-06"
    end: "2020-09"
    location: "Portugal"
    tech_stack:
      - ".NET MVC"
      - "Razor"
      - "SQL Server"

education:
  - institution: "Polytechnic Institute of Setúbal"
    degree: "Management Information Systems"
    start: "2017-09"
    end: "2020-06"
    grade: "15"
    notes:
      - "Focused on management and technology across the full information system development lifecycle."
    key_courses:
      - "Application Development"
      - "Database Management"
      - "Information Systems (Analysis, Design, Architecture, Project Management, Quality, Security)"
      - "Mathematics"

certifications:
  - issuer: "Formabase"
    name: "Web Creation"
    credential_id: "3215"
    issued: "2017-02"
    topics:
      - "PHP"
      - "HTML"
      - "CSS"

conferences_and_events:
  - name: "Azure Dev Summit"
    role: "Attendee"
    start: "2025-10"
    duration: "4 days"
    notes:
      - "Microsoft technology focused conference; included a full-day workshop building an app with Aspire."

  - name: "Web Summit"
    role: "Volunteer"
    start: "2019-11"
    notes:
      - "Web Summit is a leading global technology conference, known for connecting professionals, startups, and industry leaders to discuss innovation and emerging trends. Helped organizing in the days prior to the event."

# Placeholders (to fill manually)
projects: []
blog_highlights: []
---

# Pedro Duarte

## Summary
Senior Product Engineer with 6 years of experience building scalable backend platforms in C#/.NET (8+), microservices, and event-driven architectures with Kafka. Proven track record as a Tech Lead, owning system design, delivery, and production reliability across SQL and NoSQL data stores. Passionate about developer productivity and automation, including running a self-hosted Home Assistant environment with 50+ Zigbee devices and custom automations.

## Technical Skills
### Backend
- C#, .NET 6–10, ASP.NET Core
- Microservices architecture, REST APIs
- Event-driven systems, Domain-driven design

### Data & Messaging
- Kafka
- SQL Server, PostgreSQL
- Elasticsearch, Redis
- NoSQL data modelling
- High-volume indexing & query optimization

### Infrastructure & DevOps
- Docker, Kubernetes
- Azure DevOps Pipelines
- Cloud-ready architectures
- CI/CD migration (GoCD → Azure DevOps)

### Architecture & Leadership
- Tech Lead experience
- System design for scalable services
- Production reliability
- Security & vulnerability reduction to zero in production

### Automation & IoT (Personal)
- Self-hosted Home Assistant server
- Zigbee network integration (50+ devices)
- Automation design and monitoring

### Modern AI
- Practical use of GitHub Copilot and agentic coding tools

## Professional Experience
### Enhesa — Senior Software Engineer (Tech Lead)
**Mar 2023 – Present**

**Tech stack:** C# .NET 10, Kafka, Elasticsearch, Postgres, Entity Framework, Kubernetes, Redis, Structurizr

- Maintenance, design, and development of core microservices: Identity Service, User Management, Export Service, Document Service, Home Page.
- Reduced `/connect/token` latency from ~1.5s to <100ms (~93% improvement) via Redis distributed cache (TTL aligned to token expiry) + circuit breaker; reduced DB load and improved resilience.
- Designed and delivered an Integrations Service enabling configuration-driven integrations without code changes; reduced setup time from weeks to hours/days.
- Led cross-service initiative reducing production vulnerabilities to zero.
- Led an initiative to adopt Stryker mutation testing to improve unit test quality beyond code coverage metrics; exposed low-quality tests that covered code without meaningful assertions.
- Led a company-wide platform domain migration initiative across all tech teams, coordinating synchronized changes addressing CORS, CSP, network configurations, WAF rules, and SSO integrations; managed cross-team dependencies and timing requirements.
- Migrated CI/CD from GoCD to Azure DevOps Pipelines to standardize and automate deployments.
- Used Structurizr to document and visualize the architecture of all services owned by the team, creating comprehensive diagrams that facilitate understanding of system design and service dependencies.

### Enhesa — Software Engineer
**May 2022 – Mar 2023**

### VORTAL — Software Engineer
**Aug 2021 – Apr 2022**

**Tech stack:** C# .NET Core, SQL Server, Entity Framework

- Contributed to initial microservices during monolith → microservices transition.
- Helped establish patterns for future microservices.

### Closer Consulting — Junior Software Engineer
**Sep 2020 – Aug 2021**

**Tech stack:** .NET MVC, Razor, SQL Server

### Closer Consulting — Intern Software Engineer
**Jun 2020 – Sep 2020**

**Tech stack:** .NET MVC, Razor, SQL Server

## Education
### Polytechnic Institute of Setúbal — Management Information Systems
**Sep 2017 – Jun 2020** — Grade: 15

Key courses: Application Development, Database Management, Information Systems (Analysis, Design, Architecture, Project Management, Quality, Security), Mathematics.

## Certifications
- Formabase — Web Creation (Credential ID: 3215, Issued Feb 2017) — PHP, HTML, CSS

## Conferences & Events
- Azure Dev Summit — Participant (Oct 2025, 4 days) — Workshop building an app with Aspire.
- Web Summit — Volunteer (Nov 2019)

## Links
- LinkedIn: https://www.linkedin.com/in/pedroduartek/
- Email: pedroduartek@gmail.com
