# ArriBot 🚀

ArriBot is an AI-powered learning and career-assistance platform that combines a modern React interface with a Spring Boot backend and multiple LLM integrations.

It is designed as a **single workspace for students and early professionals** who need help with:
- understanding concepts quickly,
- generating practice material,
- tracking AI usage fairly,
- and analyzing resumes against target roles.

---

## Table of Contents
- [Why We Built ArriBot](#why-we-built-arribot)
- [Problems ArriBot Solves](#problems-arribot-solves)
- [Core Features](#core-features)
- [How the Product Works](#how-the-product-works)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [Security and Access Model](#security-and-access-model)
- [AI Usage Limits and Cost Control](#ai-usage-limits-and-cost-control)
- [Data Model Overview](#data-model-overview)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Roadmap / Future Scope](#roadmap--future-scope)
- [Known Gaps and Improvement Opportunities](#known-gaps-and-improvement-opportunities)
- [Contributing](#contributing)

---

## Why We Built ArriBot

AI tools are powerful, but they are often fragmented:
- one app for chat,
- one for quiz generation,
- one for flashcards,
- another for summarization,
- and separate tools for resume feedback.

ArriBot was built to unify these workflows into one coherent platform so users can move from **learning → practice → evaluation → career preparation** without context switching.

---

## Problems ArriBot Solves

1. **Information overload**
   - Long notes and documents are hard to process quickly.
   - ArriBot summarization helps users extract key points fast.

2. **Low retention after passive reading**
   - Reading alone is not enough for strong recall.
   - ArriBot generates flashcards and quizzes from topics to improve active learning.

3. **Lack of guided interview/job readiness**
   - Many learners don’t know whether their resume matches a role.
   - ArriBot resume analysis compares extracted resume content against target roles and recommends skill improvements.

4. **Uncontrolled AI usage and cost**
   - AI APIs can be expensive and easily abused.
   - ArriBot implements per-feature daily limits and per-minute rate control.

5. **Authentication friction and trust concerns**
   - Users expect secure onboarding.
   - ArriBot supports email OTP verification and JWT-based sessions.

---

## Core Features

### 1) Authentication and Account Flow
- Sign-up with email and password.
- OTP verification flow.
- Sign-in with JWT token session management.
- Resend OTP support.
- Contact form endpoint for inbound user communication.

### 2) AI Chat Assistant
- Topic-based chat experience for question answering.
- Chat session/history storage support in backend models/repositories.

### 3) Flashcard Generation
- Generate a configurable number of flashcards per topic.
- Structured JSON response expectation from model output.

### 4) Quiz Generation
- Generate multiple-choice quizzes with options, answer index, and explanation.
- Designed for quick self-assessment loops.

### 5) Summarization
- Summarize long text into concise key points.
- Useful for revision and faster comprehension.

### 6) Resume Analyzer
- Upload and store PDF resumes.
- Extract resume text using PDF parsing.
- Analyze role fit against a selected target role.
- Return skill gaps, recommendations, scores, suitability, and learning path guidance.

### 7) AI Usage Tracking
- Track usage by user/day/feature.
- Enforce daily feature caps and rate-limit windows.
- Expose usage stats for dashboard display.

### 8) Modern Frontend UX
- React + Tailwind + Framer Motion interface.
- Multi-page app with protected routes for authenticated modules.
- Holographic/void-style visual design language.

---

## How the Product Works

1. User opens frontend app.
2. User signs up / verifies OTP / signs in.
3. Frontend stores token and user metadata in local storage.
4. User accesses protected modules (dashboard, chat, flashcards, quiz, summarize, resume).
5. Module actions call backend REST APIs.
6. Backend validates request, checks usage limits for AI features, calls AI providers.
7. Results are returned as structured JSON and optionally persisted in MongoDB.
8. Frontend renders responses and usage statistics.

---

## Architecture

ArriBot follows a **client-server architecture** with service-oriented backend modules.

### Frontend (React + Vite)
- Handles routing, auth context, protected pages, and UI rendering.
- Uses Axios client utilities for all API communication.

### Backend (Spring Boot)
- Controller layer exposes REST endpoints.
- Service layer contains business logic (auth, AI operations, resume analysis, usage controls).
- Repository layer (Spring Data MongoDB) persists users, generated content, and usage records.

### External Services
- **Google Gemini API** for core content generation.
- **Groq API** for resume-focused analysis and alternative generation flows.
- **SendGrid** for email OTP/contact-related messaging.
- **MongoDB** as primary persistence layer.

---

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Axios

### Backend
- Java 17
- Spring Boot 3
- Spring Web / WebFlux
- Spring Security
- Spring Data MongoDB
- JWT (jjwt)
- Apache PDFBox
- OkHttp + Gson

### Infrastructure / DevOps
- Docker and Docker Compose
- Render deployment configuration
- Vercel frontend configuration

---

## Project Structure

```text
ArriBot/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── backend/
│   ├── src/main/java/com/arribot/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── service/
│   │   ├── exception/
│   │   └── util/
│   ├── src/main/resources/application.properties
│   └── pom.xml
├── docker-compose.yml
└── README.md
```

---

## API Overview

High-level backend route groups:

- `/api/auth/*` → signup, signin, verify OTP, resend OTP, contact
- `/api/chat/*` → chat and chat history
- `/api/flashcards/*` → flashcard generation and retrieval
- `/api/quiz/*` → quiz generation and retrieval
- `/api/summarize/*` → text summarization
- `/api/resume/*` → resume upload, fetch, delete, analyze
- `/api/ai/usage/*` → usage statistics

> For exact request/response contracts, refer to controller classes and frontend API helpers.

---

## Security and Access Model

- CORS configured via environment-based allowed origins.
- Stateless session policy via Spring Security.
- JWT utilities used for email extraction and identity linking in selected flows.
- OTP-based verification to validate email ownership during sign-up.

---

## AI Usage Limits and Cost Control

ArriBot includes built-in controls to keep AI usage sustainable:
- Per-feature daily limits (chat, flashcards, quiz, summarize).
- Rate limiting based on minimum interval between requests.
- Global AI enable/disable switch.
- Usage stats endpoint for real-time consumption visibility.

---

## Data Model Overview

Primary stored entities include:
- User
- ChatMessage
- Flashcard
- Quiz
- Summary
- Resume
- SkillAnalysis
- AIUsage

This design lets the platform both deliver responses and maintain historical data for user continuity and analytics.

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.8+
- MongoDB instance (local or cloud)
- Gemini API key
- Groq API key (for resume analysis)
- SendGrid key (for email flow)

### 1) Clone repository
```bash
git clone <your-fork-or-repo-url>
cd ArriBot
```

### 2) Backend setup
```bash
cd backend
mvn spring-boot:run
```
Default backend URL: `http://localhost:8080` (or configured `PORT`).

### 3) Frontend setup
```bash
cd frontend
npm install
npm run dev
```
Default frontend URL: `http://localhost:5173`.

### 4) Docker (optional)
From project root:
```bash
docker-compose up --build
```

---

## Environment Variables

Configure secrets and runtime settings using environment variables.

Common backend variables:
- `PORT`
- `MONGODB_URI`
- `GEMINI_API_KEY`
- `GROQ_API_KEY`
- `GROQ_MODEL`
- `CORS_ORIGINS`
- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`
- `JWT_SECRET`
- `FILE_UPLOAD_DIR`
- `ai.enabled` and usage limit properties

Common frontend variable:
- `VITE_API_URL`

> Recommended: keep credentials out of committed files and use `.env`/platform secret managers.

---

## Deployment

The repository already includes deployment-related manifests:
- Root `render.yaml`
- Backend `render.yaml`
- Frontend `vercel.json`
- Dockerfiles for frontend/backend

A typical production split:
- Frontend on Vercel (static hosting)
- Backend on Render (Spring service)
- MongoDB Atlas as managed database

---

## Roadmap / Future Scope

Planned and high-impact next steps:

1. **Role-based access control (RBAC)** for admin/mentor workflows.
2. **True JWT enforcement middleware/filter chain** for non-public APIs.
3. **Streaming chat responses** in UI for better conversational UX.
4. **Advanced analytics dashboard** (learning progress, weak-topic heatmaps).
5. **Document ingestion beyond PDF** (DOCX, PPT, web URLs).
6. **User collections/workspaces** for organizing generated content.
7. **Team/classroom mode** for educators and peer groups.
8. **Model routing layer** (cost/latency-aware provider fallback).
9. **Prompt/version audit logs** for debugging and compliance.
10. **Full testing suite** (unit, integration, e2e) with CI quality gates.
11. **Accessibility and i18n expansion** for broader adoption.
12. **Mobile-optimized experience / native app**.

---

## Known Gaps and Improvement Opportunities

- Some security routes are currently broadly permitted and should be tightened in production.
- Error contracts can be standardized further for all modules.
- Frontend-backend API documentation can be formalized via OpenAPI/Swagger.
- Upload and AI workflows can be instrumented with richer observability (tracing/metrics).

---

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make focused, tested changes.
4. Commit with clear messages.
5. Open a pull request with context, screenshots (for UI changes), and test evidence.

---

If you’re building in the AI learning + career preparation space, ArriBot is a strong foundation to extend into a full “personal learning and growth copilot.”
