# Pedro Duarte

## Profile Summary

**Role:** Senior Software Engineer  
**Location:** Lisbon, Portugal  
**Experience:** 5+ years (since June 2020)

Senior Software Engineer with 5+ years of experience building scalable platforms in C#/.NET (8+), microservices, and event-driven architectures with Kafka. Proven track record as a Tech Lead, owning system design, delivery, and production reliability across SQL and NoSQL data stores. Passionate about developer productivity and automation, including running a self-hosted Home Assistant environment with 50+ Zigbee devices and custom automations.

---

## Contact Information

- **Email:** pedroduartek@gmail.com
- **LinkedIn:** [linkedin.com/in/pedroduartek](https://www.linkedin.com/in/pedroduartek/)
- **GitHub:** [github.com/pedroduartek](https://github.com/pedroduartek)
- **Website:** [pedroduartek.com](https://www.pedroduartek.com)

---

## Professional Experience

### Senior Software Engineer - Tech Lead @ Enhesa
**March 2023 – Present** | Lisbon, Portugal

- Maintenance, design, and development of core microservices: Identity Service, User Management, Export Service, Document Service, Home Page
- Resolved a major performance bottleneck in Identity Service (/connect/token): reduced average latency from ~1.5s to <100ms (~93% improvement) by redesigning flow, adding distributed cache (Redis) with TTL aligned to token expiration, and adding a circuit breaker to improve resilience and scalability
- Designed and delivered an Integrations Service enabling configuration-driven integrations without code changes; reduced integration setup time from weeks to hours/days
- Led a cross-service initiative reducing production vulnerabilities to zero
- Led an initiative to adopt Stryker mutation testing to improve unit test quality beyond code coverage metrics; exposed low-quality tests that covered code without meaningful assertions
- Led a company-wide platform domain migration initiative across all tech teams, coordinating synchronized changes addressing CORS, CSP, network configurations, WAF rules, and SSO integrations; managed cross-team dependencies and timing requirements
- Migrated CI/CD pipelines from GoCD to Azure DevOps Pipelines to standardize and automate deployments
- Used Structurizr to document and visualize the architecture of all services owned by the team, creating comprehensive diagrams that facilitate understanding of system design and service dependencies
- Collaborated with international teams across multiple time zones, working in English as the primary communication language

**Technologies:** C# .NET 10, Kafka, Elasticsearch, PostgreSQL, Entity Framework, Kubernetes, Redis, Structurizr

### Software Engineer @ Enhesa
**May 2022 – March 2023** | Lisbon, Portugal

- Developed and maintained backend services for the Enhesa platform
- Contributed to microservices architecture and event-driven systems
- Worked with C#/.NET, Kafka, and various data stores

**Technologies:** C# .NET, Kafka, SQL Server, Microservices

### Software Engineer @ VORTAL
**August 2021 – April 2022** | Portugal

- Participated in building initial microservices during transition from monolith to microservices
- Helped establish patterns for future services
- Developed backend services using C# .NET Core and SQL Server

**Technologies:** C# .NET Core, SQL Server, Entity Framework

### Junior Software Engineer @ Closer Consulting
**September 2020 – August 2021** | Portugal

- Developed web applications using .NET MVC and Razor
- Worked with SQL Server for data management
- Contributed to various client projects

**Technologies:** .NET MVC, Razor, SQL Server

### Intern Software Engineer @ Closer Consulting
**June 2020 – September 2020** | Portugal

- Learned .NET MVC framework and web development best practices
- Worked on small features and bug fixes
- Gained experience with SQL Server and Razor views

**Technologies:** .NET MVC, Razor, SQL Server

---

## Education

### Bachelor's Degree in Management Information Systems
**Polytechnic Institute Of Setúbal** | September 2017 – June 2020 | Setúbal, Portugal

- GPA: 15/20
- Focused on management and technology across the full information system development lifecycle
- Key courses: Application Development, Database Management, Information Systems (Analysis, Design, Architecture, Project Management, Quality, Security), Mathematics

### Certificate in Web Creation
**Formabase** | October 2016 – February 2017 | Lisbon, Portugal

- PHP, HTML, CSS

---

## Technical Skills

### Backend
- C# (since 2020)
- .NET 6–10 (since 2020)
- REST APIs (since 2020)
- ASP.NET Core (since 2021)
- Microservices architecture (since 2021)
- Event-driven systems (since 2022)
- Domain-driven design (since 2022)

### Data & Messaging
- SQL Server (since 2020)
- Kafka (since 2022)
- PostgreSQL (since 2023)
- Elasticsearch (since 2023)
- Redis (since 2023)

### Infrastructure & DevOps
- Docker (since 2021)
- Kubernetes (since 2023)
- Azure DevOps Pipelines (since 2023)
- Structurizr (since 2026)

### Other
- Tech Lead experience (since 2023)
- Home Assistant (since 2021)
- Zigbee (since 2021)
- GitHub Copilot (since 2024)

---

## Personal Projects

### AI-Assisted Personal Website
**Started:** February 2026 | **Featured Project**

Modern portfolio website built using AI-assisted development as a backend engineer learning frontend technologies.

**Problem:** As a backend engineer with 5+ years of C#/.NET experience but minimal frontend knowledge, wanted to build a professional portfolio website while learning modern frontend development. Traditional learning approaches would take months, and wanted to experiment with AI as a productivity multiplier.

**Approach:** Used AI-assisted development tools to build a production-ready React + TypeScript website from scratch. Leveraged AI for code generation, best practices, and real-time problem-solving while maintaining full ownership of architectural decisions. Focused on learning by doing: implementing features, understanding the patterns, and iterating based on AI guidance.

**Technologies:** React 18.3, TypeScript 5.7, Vite 6.0, Tailwind CSS 3.4, React Router 6.28, Biome 1.9, Vitest 2.1, pnpm

### Home Assistant: Local-First Smart Home
**Started:** September 2023 | **Featured Project**

Self-hosted Home Assistant OS setup with 50+ Zigbee devices for automation, energy awareness, and comfort optimization.

**Problem:** Wanted to improve day-to-day comfort and reduce friction at home while maintaining a local-first approach that works without internet. Needed a system simple enough for non-technical users while being powerful enough for complex automations.

**Approach:** Built a robust Zigbee mesh network using Home Assistant OS with ZHA coordinator and 50+ devices. Focused on reliability through strategic placement of routing devices and weekly updates. Designed automations as event-driven systems with location-based routines, energy monitoring, and security integrations.

**Goals:**
- **Comfort:** routines that reduce manual steps (arriving/leaving, sleep routine)
- **Energy awareness:** use smart plugs and measurements to understand consumption patterns
- **Security:** window sensors + alarm state awareness
- **Learning:** treat the house like a living lab for automation reliability

**Constraints:**
- **Local-first:** core functionality should keep working even if the internet is down
- **Simple UX:** must be usable by non-technical users (wife is the primary tester and quality gate)

**Stack:** Home Assistant OS running on a used mini-PC, Zigbee with ZHA + SkyConnect coordinator, Nabu Casa for remote access, Grafana + VS Code add-on for observability

**Technologies:** Home Assistant OS, Zigbee (ZHA), SkyConnect Coordinator, Nabu Casa, Grafana, IoT Automation

### AI Chat API
**Started:** February 2026 | **Featured Project**

A lightweight C#/.NET 10 API for conversational AI integrations.

**Problem:** Needed a minimal, production-ready backend to power chat-style AI integrations with clear patterns for testing, containerization, and extensibility across model providers.

**Approach:** Implemented a small, well-structured ASP.NET Core API with typed request/response models, service abstractions for model providers, health checks, and CI-friendly patterns. Focused on testability, container-based local development, and clear HTTP semantics for clients.

**Technologies:** C#, .NET 10, Llama 3, Docker, REST API

**GitHub:** [github.com/pedroduartek/ai-chat-api](https://github.com/pedroduartek/ai-chat-api)

---

## Conferences & Events

### Azure Dev Summit
**October 2025** | Participant | Lisbon, Portugal

Microsoft technology focused conference spanning 4 days. Included a full-day workshop building an app with Aspire.

Website: [azuredevsummit.com](https://azuredevsummit.com/)

### Web Summit
**November 2019** | Volunteer | Lisbon, Portugal

Web Summit is a leading global technology conference, known for connecting professionals, startups, and industry leaders to discuss innovation and emerging trends. Helped organizing in the days prior to the event.

Website: [websummit.com](https://websummit.com/)

---

## Personal Interests & Philosophy

### Engineering Philosophy
- Passionate about building **reliable, scalable systems** that solve real problems
- Believes in writing clean, maintainable code and treating production reliability as a first-class concern
- Deeply interested in **user experience** despite being a backend engineer; makes it a point to participate in UX discussions whenever possible
- Believes great software isn't just about what happens on the backend - it's about how users interact with and experience the system as a whole

### Personal Hobbies
- **Fishing**
- **Motorcycle riding**
- **Cooking**
- Running a self-hosted **Home Assistant setup with 50+ Zigbee devices** as a personal lab for experimenting with automation reliability and applying event-driven thinking to real-world scenarios

---

## Key Achievements

- **93% performance improvement** on Identity Service authentication endpoint (from ~1.5s to <100ms)
- **Zero production vulnerabilities** through cross-service security initiative
- **Reduced integration setup time** from weeks to hours/days with configuration-driven Integrations Service
- Built and maintains **50+ Zigbee device** smart home network
- Successfully **learning modern frontend development** (React, TypeScript) using AI-assisted tools as a backend engineer

---

*This profile was extracted from Pedro Duarte's personal website repository.*
