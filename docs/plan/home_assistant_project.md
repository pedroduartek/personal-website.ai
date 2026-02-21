---
slug: "home-assistant"
title: "Home Assistant: Local-First Smart Home (HAOS + ZHA, 50+ Zigbee Devices)"
date: "TBD"
started: "2023-09"
tags:
  - home-assistant
  - iot
  - zigbee
  - zha
  - haos
  - self-hosted
  - automation
  - reliability
status: "draft"
---

# Home Assistant Project

> **Type:** Personal smart home project  
> **Started:** Sep 2023  
> **Scope:** Comfort + energy awareness + security + learning, built on a local-first approach with 50+ Zigbee devices.

## 1) Overview
I run a self-hosted Home Assistant setup to improve day-to-day comfort, reduce friction at home, and experiment with automation as an event-driven system in the real world.

**Goals**
- **Comfort:** routines that reduce manual steps (arriving/leaving, sleep routine).
- **Energy awareness:** use smart plugs and measurements to understand consumption patterns.
- **Security:** window sensors + alarm state awareness (details intentionally high-level).
- **Learning:** treat the house like a living lab for automation reliability.

**Constraints**
- **Local-first:** core functionality should keep working even if the internet is down.
- **Simple UX:** must be usable by non-technical users (my wife is the primary tester and quality gate).

## 2) Stack choices
- **Home Assistant OS (HAOS)** running on a used mini-PC.
- **Zigbee:** ZHA with a Home Assistant **SkyConnect** coordinator.
- **Remote access:** Nabu Casa (used only for access from anywhere).
- **Observability/tools:** Grafana + VS Code add-on (kept optional in the story).

## 3) High-level architecture
**Components**
- Home Assistant OS (core runtime)
- ZHA (Zigbee network + device entities)
- Dashboards (Lovelace UI)
- Nabu Casa (remote access)
- Optional tooling: Grafana, VS Code add-on

**Typical flow**
1. A Zigbee device changes state (motion, temp, window, plug).
2. Home Assistant updates entity state.
3. An automation evaluates triggers/conditions.
4. Actions execute (lights, covers, routines, notifications).

## 4) Hardware & hosting
- **Host machine:** used mini-PC (bought second-hand).
- **Install method:** HAOS.
- **Note:** I deliberately keep hardware details generic in the public version.

## 5) Zigbee network design (53 devices)
- **Device count:** 53 Zigbee devices.
- **Primary challenge:** range.
- **Mitigation strategy:**
  - Add multiple Zigbee smart sockets around the house to act as routers.
  - Prefer relays with **neutral** where possible so they can operate reliably as routers.

This produced a stronger mesh by increasing the number and distribution of routing-capable devices.

## 6) What’s connected (device categories)
Ordered by “what I use most”:
1. Temperature / humidity sensors
2. Smart plugs
3. Window sensors
4. Window covers (blinds/shutters)
5. Alarm integration (kept high-level)
6. Watering system

## 7) Automations (kept for future expansion)
I’ll keep this section as a placeholder for now and expand it later with a curated set of 8–12 automations described in a “production feature” style.

### 7.1 Placeholder structure (to fill later)
For each automation, I want to document:
- Trigger(s)
- Conditions
- Actions
- Edge cases
- Why it matters (comfort/safety/cost/reliability)

### 7.2 Known examples to include later
- **Location-based routines** that run when I arrive/leave home.
- **Gym indicator light** that reflects gym frequency.
- **Automatic sleep routine** that triggers at bedtime to shut down/close everything.

## 8) Dashboards & UX
- **Dashboards:** one main dashboard built by me + multiple sub-views.
- **Quality gate:** my wife uses it daily and is the ultimate tester—if the UX is confusing, it doesn’t ship.

## 9) Backups, updates, and operational practices
- **Backups:** handled by Nabu Casa.
- **Update cadence:** weekly.

## 10) Security & privacy (intentionally brief)
I avoid sharing sensitive operational/security details publicly. The setup is local-first; remote access is via Nabu Casa.

## 11) Incident story (learning moment)
I tried to install **Frigate** for local video analytics, but the mini-PC did not have a sufficiently powerful GPU. The attempt led to enough system churn that I nearly had to reinstall HAOS from scratch.

**What I took from it**
- Validate hardware requirements up front for compute-heavy add-ons.
- Treat major add-on experiments like risky migrations: snapshot/back up, test incrementally, and have a rollback plan.

## 12) Roadmap
- Add a well-documented “automation catalog” (8–12 best automations).
- Explore local camera/NVR options that match the available hardware.
- Improve observability dashboards (device health, availability trends) without exposing sensitive details.

## 13) What I’m not publishing
- Exact security topology / detailed security configuration.
- Photos/screenshots (not needed for now).

---

## Appendix — Questions still open (optional)
If you later want to enrich this page, the most valuable additions would be:
- A curated automation list (8–12), written like shipped features.
- A few measurable outcomes (e.g., automations count, hours saved/month, avoided incidents).
