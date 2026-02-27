# AI Chat API

A lightweight C#/.NET 10 API for conversational AI integrations • February 2026

Repository: https://github.com/pedroduartek/ai-chat-api

Tags: C#, .NET 10, ASP.NET Core, xUnit, Docker, REST API

## Overview

This repository contains a minimal, production-oriented backend API for powering chat-style AI integrations. It focuses on simple, testable C#/.NET patterns, containerization, and clear HTTP-based endpoints that a frontend or chatbot client can call.

The project emphasizes maintainability: typed request/response models, small and testable services, health checks, and CI-ready patterns so the API can be extended to different model backends or hosted environments.

## What you'll find

- ASP.NET Core controllers for chat and health endpoints
- Service abstraction for model providers (`IChatService`)
- Unit tests covering controller and service behaviors
- Dockerfile and compose files for local development

## Design goals

- Keep the HTTP API small and well-documented
- Make the chat service pluggable (swap model providers)
- Fast local iteration with Docker and sensible defaults
- Deliver reliable behavior with unit tests

## Tech Details

- **Language:** C# targeting .NET 10
- **Framework:** ASP.NET Core minimal APIs and MVC controllers
- **Testing:** xUnit (tests under `Api.Tests`)
- **Containers:** Dockerfiles and docker-compose for development and production
- **Structure:** `Controllers`, `Services`, `Models`, and test projects

## Key Endpoints

- **POST /api/chat:** Send a chat request with messages and receive a model-generated reply.
- **GET /health:** Basic health check used for readiness and liveness probes.

## Development Notes

- Run tests with the solution's test runner (xUnit)
- Build and run locally via `dotnet run` in the `src/Api` folder
- Use Docker for consistent local environments via provided compose files
- Swap or extend `IChatService` to integrate different model providers

## Next Steps

- Add OpenAPI/Swagger documentation for the endpoints
- Integrate authentication and request quotas if exposing publicly
- Add optional streaming responses for lower-latency clients
- Improve CI to run tests and build Docker images on push
