# ArriBot — AI-Powered Holographic Learning Companion 

<div align="center">

<div align="center">
  <img src="frontend/src/assets/arribot-logo-new.png" alt="ArriBot Logo" width="220"/>
  
  <br/>

**ArriBot** is a next-generation, AI-powered learning platform that combines a stunning holographic spatial UI with a robust Java Spring Boot backend and dual AI engines (Groq & Google Gemini). It delivers a fully immersive, personalized study environment — from adaptive chatting and smart flashcards to AI-generated quizzes, summarization, resume analysis, and structured learning path curricula.

<br/>

[![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=java&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=spring-boot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F54703?style=for-the-badge)](https://groq.com)
[![Gemini](https://img.shields.io/badge/Google-Gemini_2.0_Flash-4285F4?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)

</div>

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Observations & Motivation](#-observations--motivation)
3. [Problem Statement](#-problem-statement)
4. [Solution](#-solution)
5. [Features](#-features)
6. [Feature Deep Dive](#-feature-deep-dive)
7. [Project Workflow](#-project-workflow)
8. [Architecture](#-architecture)
9. [Tech Stack](#-tech-stack)
10. [Data Models](#-data-models)
11. [API Reference](#-api-reference)
12. [Getting Started](#-getting-started)
13. [Environment Variables](#-environment-variables)
14. [Deployment](#-deployment)
15. [AI Rate Limits & Usage Tracking](#-ai-rate-limits--usage-tracking)
16. [Security](#-security)
17. [Future Scope](#-future-scope)
18. [Contributing](#-contributing)
19. [License](#-license)

---

## 🌐 Project Overview

**ArriBot** is a full-stack, AI-augmented learning companion built for students, developers, and lifelong learners who want to study smarter — not harder. It wraps powerful generative AI capabilities inside a visually striking, space-age, holographic interface.

The platform is not just a chatbot. It is a **complete intelligent study ecosystem** with the following pillars:

| Pillar | What it Does |
|---|---|
| 🧠 Neural Chat | Conversational AI companion for any topic |
| 🃏 Flash Recall | AI-generated interactive flashcard decks |
| 🎯 Cognitive Quiz | Auto-generated MCQ assessments with explanations |
| 📝 Summarizer | Compress dense reading material into key insights |
| 📄 Resume Analyzer | AI-powered career gap detection & role suitability |
| 🗺️ Learning Path | Multi-week, day-by-day AI-generated curricula |

Every feature is gated behind a **JWT-secured authentication system** with OTP email verification, daily usage limits per feature, and real-time token consumption tracking.

---

## 🔭 Observations & Motivation

Modern students face a fragmented landscape of study tools:

- Flashcard apps (Anki, Quizlet) are great but require **manual content creation**, which is time-consuming.
- LLM chatbots (ChatGPT, Gemini) are powerful but give **unstructured, one-off answers** with no curriculum or progress tracking.
- Quiz generators exist, but they are **not personalized** to a user's topic or learning pace.
- Resume review tools are expensive and **not integrated** with the rest of a learner's workflow.
- Learning roadmaps (roadmap.sh) are static; they cannot adapt to **individual goals and timelines**.

Furthermore, traditional learning dashboards are visually bland and fail to inspire engagement, resulting in **high learner drop-off rates**.

We observed that:
1. **AI can eliminate the content-creation bottleneck** for study materials.
2. **An engaging, gamified UI** dramatically improves study session quality and frequency.
3. **Combining multiple AI study tools in one platform** eliminates context-switching and boosts productivity.
4. **Structured, daily milestones** (analogous to streaks in Duolingo) are more effective than open-ended sessions.

---

## ❗ Problem Statement

> **How can we build a single, unified, AI-powered platform that:**
> - generates high-quality study materials (flashcards, quizzes, summaries) instantly from any topic,
> - provides an intelligent conversation partner for learning,
> - analyzes a learner's career documents and identifies skill gaps,
> - constructs personalized, structured multi-week learning curricula,
> - tracks daily progress and enforces healthy usage limits,
> - and wraps all of this inside an interface so engaging that learners **actually want to return every day**?

Current solutions only solve one or two of these problems in isolation. No single platform integrates all of them with modern AI and an immersive UX.

---

## ✅ Solution

ArriBot addresses every pain point with a **tightly integrated, full-stack solution**:

1. **Dual AI Engine**: Primary AI calls use **Groq's LLaMA 3.3 70B** (for blazing-fast inference) with **Google Gemini 2.0 Flash** retained as a secondary engine. This gives fallback capability and leverages each model's strengths.

2. **One-Platform, Six Modules**: Users access Neural Chat, Flash Recall, Cognitive Quiz, Summarizer, Resume Analyzer, and Learning Path — all from a single authenticated dashboard with shared session context.

3. **Holographic Spatial UI**: A React + Framer Motion frontend with a "void-style" deep-space aesthetic (`#030014` background, cyan neon accents, glassmorphism cards, tilt effects, and particle backgrounds) makes studying feel like operating a spaceship command center.

4. **Smart Usage Governance**: A per-user, per-day AI usage tracking system (backed by MongoDB) prevents abuse, enforces fair quotas, and exposes a live token-consumption dashboard so users know exactly how much AI they are consuming.

5. **Secure Auth Flow**: OTP-verified email registration → JWT session tokens → protected route guards on the frontend. Passwords are BCrypt-hashed. No plain-text secrets persist.

6. **PDF-Native Resume Analysis**: Users upload PDF resumes for Groq-powered skill extraction, gap detection, role suitability scoring, and auto-generated learning path recommendations — all without leaving the platform.

---

## ✨ Features

### 🎨 Holographic UI (Frontend)
- **Spatial/Void Design**: Deep purple-black (`#030014`) base color with cyan and violet neon accents
- **Glassmorphism Cards**: `backdrop-blur` panels with `bg-white/5` and `border-white/10` for a frosted-glass effect
- **Tilt Cards**: 3D perspective tilt on hover via custom `TiltCard` component
- **Parallax Scrolling**: Layered depth effect on the landing page
- **Particle Background**: Animated canvas particle field for visual depth
- **Floating Dock**: macOS-style nav dock with icon magnification animation
- **Liquid Inputs**: Form fields with fluid focus animations
- **ScrambleText**: Animated character-scramble effect on headings
- **Spotlight Cursor**: Dynamic lighting effect tracking mouse position
- **Framer Motion Animations**: Enter/exit transitions, layout animations, stagger effects throughout

### 🧠 AI Modules
- **Neural Chat** — Groq-powered conversation with session awareness
- **Flash Recall** — AI generates N flashcards on any topic (JSON Q&A format)
- **Cognitive Quiz** — AI generates MCQ quizzes with answer explanations
- **Data Compression (Summarizer)** — Extracts key insights from long text
- **Resume Analyzer** — PDF upload → skill detection → gap analysis → role suitability → learning path
- **Learning Path Generator** — Custom multi-week curriculum with daily milestones (FLASHCARD / QUIZ / SUMMARY)

### 🛡️ Security & Auth
- **OTP Verification**: 4-digit codes with 10-minute expiry, sent via Brevo email API
- **BCrypt Passwords**: Industry-standard bcrypt hashing (Spring Security)
- **JWT Sessions**: Stateless token-based auth (`HS256`, 24h expiry)
- **Protected Routes**: Frontend React guards redirect unauthenticated users
- **CORS Policy**: Configurable allowed origins via environment variable

### 📊 Usage Intelligence
- Per-user, per-day request tracking for all 4 AI features (Chat / Flashcards / Quiz / Summary)
- Real-time token consumption (prompt tokens, completion tokens, total) pulled from Groq API response
- Live dashboard with progress bars, limit gauges, and token meters
- Rate limiting: max N requests per user per minute (configurable)

---

## 🔍 Feature Deep Dive

### 1. 🧠 Neural Chat (`/chat`)
The chatbot page provides a full-screen conversational interface. Each session gets a unique `session-${Date.now()}` ID. Messages alternate between user (cyan bubble, right-aligned) and AI (violet bubble, left-aligned) with animated typing indicators (bouncing dots). The Groq `llama-3.3-70b-versatile` model returns responses in under ~1 second. Usage is counted against the daily **chat limit (30/day)** from the AI limits service.

### 2. 🃏 Flash Recall (`/flashcards`)
Users enter a topic and card count. The backend calls Groq with a strictly-formatted JSON prompt instructing the LLM to return **exactly N flashcard objects** (`[{"question": "...", "answer": "..."}]`). The frontend renders them as flippable cards. Counted against **flashcard limit (10/day)**.

### 3. 🎯 Cognitive Quiz (`/quiz`)
Users choose a topic and the number of questions. Groq returns a JSON array of multiple-choice questions: `{ question, options[4], correctAnswerIndex, explanation }`. The UI renders a step-by-step quiz with immediate feedback and explanations. Counted against **quiz limit (5/day)**.

### 4. 📝 Summarizer (`/summarize`)
Users paste or type long text. The backend sends it to Groq with a structured summarization prompt. The response extracts key points and returns a well-organized summary. Counted against **summary limit (10/day)**.

### 5. 📄 Resume Analyzer (`/resume`)
The full pipeline:
1. User uploads a PDF → `PDFProcessorService` reads text with **Apache PDFBox**
2. Raw text is sent to `GroqResumeAnalyzer` with a detailed analysis prompt
3. Groq returns a rich JSON: `overallScore`, `skillMatchScore`, `experienceScore`, `resumeQualityScore`, `detectedSkills[]`, `missingSkills[]`, `isSuitable`, `suitabilityScore`, `keyStrengths[]`, `criticalGaps[]`, `learningPath[]`
4. The frontend renders animated quality bars, skill tag clouds (green = detected, red = missing), role suitability verdict card, and a step-by-step learning path with priority tags and time estimates.

Multiple resumes can be stored per user (MongoDB). Previously analyzed results are cached — re-analysis is only triggered if the target role changes.

### 6. 🗺️ Learning Path Generator (`/learning-path`)
Users enter a **learning goal** (e.g., "Master Data Structures") and choose a **duration in weeks** (1–12). Groq produces a structured JSON curriculum:
```json
{
  "goal": "Master Data Structures",
  "totalWeeks": 4,
  "difficultyLevel": "Intermediate",
  "weeks": [
    {
      "weekNumber": 1,
      "weekTitle": "Foundations",
      "weekGoal": "Understand arrays, linked lists, and big-O notation",
      "days": [
        {
          "dayNumber": 1,
          "topic": "Arrays & Dynamic Arrays",
          "description": "Study array internals and implement a dynamic array.",
          "scheduledTasks": ["FLASHCARD", "SUMMARY"]
        }
      ]
    }
  ]
}
```
The UI renders this as collapsible `WeekAccordion` panels with `DayCard` checklist items. Each day tracks completion state — users can check off days to track real progress. Overall and per-week progress bars update in real time. Paths persist in MongoDB per user.

---

## 🔄 Project Workflow

```
┌─────────────────────────────────────────────────────────┐
│                      USER JOURNEY                       │
└─────────────────────────────────────────────────────────┘

1. LANDING PAGE (/)
   └── Hero section with animated particle background,
       feature showcase, live demo, and animated stats.
       CTA → Sign Up

2. AUTHENTICATION (/auth → /verify-otp)
   ├── Sign Up: name + email + password
   │   └── Backend: BCrypt hash → save User → generate 4-digit OTP
   │            → send OTP via Brevo email API (10-min expiry)
   ├── Verify OTP (/verify-otp)
   │   └── Backend: validate OTP + expiry → mark verified
   │            → send Welcome Email → issue JWT token
   │            → Frontend auto-logs user in
   └── Sign In: email + password
       └── Backend: find user → check verified → validate BCrypt
                → update lastLogin → return JWT

3. DASHBOARD (/dashboard)
   ├── Personalized greeting with ScrambleText name animation
   ├── Real-time clock display
   ├── Stats: Daily Streak, Knowledge Points, System Level, Total Requests
   ├── AI Resource Limits: animated progress bars per feature
   ├── Groq Token Usage: prompt vs completion breakdown
   ├── Activity Log: live event stream (Login, Neural Link, Workspace)
   └── Module Grid: 6 clickable widgets → route to each module

4. AI MODULE USAGE
   ├── User submits request in any module
   ├── Frontend calls REST API with JWT header
   ├── Backend JWT filter validates token → extracts userId
   ├── AILimitsService:
   │   ├── Rate limit check (requests/minute)
   │   ├── Daily feature limit check
   │   └── Increment usage counter in MongoDB
   ├── Groq/Gemini API call with structured prompt
   ├── AILimitsService.recordTokenUsage() → update token tallies
   └── Response JSON → Frontend renders module-specific UI

5. RESUME ANALYSIS (/resume)
   ├── Upload PDF → PDFBox extracts text
   ├── Store Resume document in MongoDB
   ├── Select resume → enter target role → click INITIATE
   ├── GroqResumeAnalyzer processes raw text + target role
   └── Render: scores, skill matrix, suitability verdict, learning path

6. LEARNING PATH (/learning-path)
   ├── Click "New Path" → GenerateModal
   ├── Enter goal + drag duration slider (1–12 weeks)
   ├── Groq generates full curriculum JSON
   ├── PathCard list view → click to open detail view
   ├── WeekAccordion → DayCard checklist
   └── Toggle days complete → progress % updates live
```

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        ArriBot Architecture                          │
└──────────────────────────────────────────────────────────────────────┘

 ┌─────────────────────────────────────────────────────────┐
 │                  FRONTEND (React + Vite)                 │
 │                 Port 5173 (dev) / 80 (prod)              │
 │                                                          │
 │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
 │  │  Pages   │ │Components│ │ Context  │ │ Services  │  │
 │  │          │ │          │ │          │ │           │  │
 │  │ Home     │ │TiltCard  │ │AuthCtx   │ │api.js     │  │
 │  │ Auth     │ │ScrambleTx│ │           │ │resumeSvc  │  │
 │  │ Dashboard│ │Layout    │ │           │ │learnSvc   │  │
 │  │ ChatBot  │ │Particle  │ │           │           │  │
 │  │ Flashcrd │ │ProtectedR│ │           │           │  │
 │  │ Quiz     │ │          │ │           │           │  │
 │  │ Summarize│ └──────────┘ └──────────┘ └───────────┘  │
 │  │ Resume   │                                           │
 │  │ LrnPath  │         Framer Motion Animations          │
 │  └──────────┘         TailwindCSS Utility Classes       │
 └────────────────────────────┬────────────────────────────┘
                              │ HTTPS REST (JWT Bearer)
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │              BACKEND (Java Spring Boot 3.2)              │
 │                  Port 8080 / 10000                       │
 │                                                          │
 │  ┌───────────────────────────────────────────────────┐  │
 │  │              Security Layer                        │  │
 │  │  CORS Filter → JWT Auth Filter → Spring Security   │  │
 │  └───────────────────────────────────────────────────┘  │
 │                                                          │
 │  ┌──────────────┐  REST Controllers:                    │
 │  │  Controllers │  AuthController       /api/auth/**    │
 │  │              │  ChatController       /api/chat/**    │
 │  │              │  FlashcardController  /api/flashcards │
 │  │              │  QuizController       /api/quiz/**    │
 │  │              │  SummaryController    /api/summary/** │
 │  │              │  ResumeController     /api/resume/**  │
 │  │              │  LearningPathCntrl    /api/learning-path│
 │  │              │  AIUsageController    /api/ai-usage/  │
 │  └──────┬───────┘                                       │
 │         │                                               │
 │  ┌──────▼───────────────────────────────────────────┐  │
 │  │                 Service Layer                     │  │
 │  │  AuthService     GeminiService   GroqService      │  │
 │  │  AILimitsService EmailService    FlashcardService │  │
 │  │  QuizService     SummaryService  ResumeService    │  │
 │  │  LearningPathService  GroqResumeAnalyzer          │  │
 │  │  PDFProcessorService  SkillAnalysisService        │  │
 │  └──────┬───────────────────────────────────────────┘  │
 │         │                                               │
 │  ┌──────▼──────────────────────────────────────────┐   │
 │  │             Repository Layer (Spring Data)       │   │
 │  │  UserRepository  AIUsageRepository               │   │
 │  │  ResumeRepository  LearningPathRepository        │   │
 │  └──────┬──────────────────────────────────────────┘   │
 └─────────┼───────────────────────────────────────────────┘
           │
    ┌──────┴──────────────────────────────────┐
    │         External Services               │
    │                                         │
    │  ┌─────────────┐  ┌──────────────────┐  │
    │  │ MongoDB Atlas│  │  Groq AI API     │  │
    │  │  (Primary DB)│  │  LLaMA 3.3 70B   │  │
    │  └─────────────┘  └──────────────────┘  │
    │                                         │
    │  ┌─────────────┐  ┌──────────────────┐  │
    │  │Google Gemini │  │  Brevo Email API │  │
    │  │ 2.0 Flash    │  │  (SMTP via REST) │  │
    │  └─────────────┘  └──────────────────┘  │
    └─────────────────────────────────────────┘
```

### Key Architectural Decisions

| Decision | Rationale |
|---|---|
| **Groq as primary AI** | Ultra-low latency (~1s) for LLaMA 3.3 70B — far faster than self-hosted alternatives |
| **Gemini retained as bean** | Fallback capability and future multi-model routing |
| **MongoDB Atlas** | Schema-flexible NoSQL fits rapidly evolving learning data models (nested weeks/days structures) |
| **Spring Boot + Spring Security** | Battle-tested authentication, CORS handling, and filter chain configuration |
| **OkHttp instead of RestTemplate** | Fine-grained HTTP timeout control (30s connect, 120s read) needed for large AI prompts |
| **WebFlux dependency** | Enables reactive/streaming response patterns for future streaming AI output |
| **Lombok** | Reduces Java boilerplate on model classes without sacrificing readability |
| **Apache PDFBox** | Pure Java PDF text extraction — no native binary dependencies, compatible with cloud deployment |
| **Brevo (Sendinblue)** | More generous free tier than SendGrid for transactional OTP/welcome emails |
| **JWT (JJWT 0.11.5)** | Stateless auth — no server-side session storage needed, scales horizontally |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5+ | Build tool & dev server |
| React Router DOM | 6 | Client-side routing |
| Framer Motion | 11+ | Animations & transitions |
| TailwindCSS | 3 | Utility-first styling |
| Lucide React | latest | Icon library |
| React Hot Toast | latest | Notification toasts |
| Axios | latest | HTTP client |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Language |
| Spring Boot | 3.2.0 | Application framework |
| Spring Security | 6 | Authentication & authorization |
| Spring Data MongoDB | — | Database ORM |
| Spring Boot WebFlux | — | Reactive/streaming support |
| OkHttp | 4.12.0 | HTTP client for AI APIs |
| JJWT | 0.11.5 | JWT token generation & validation |
| Lombok | latest | Boilerplate reduction |
| Gson | — | JSON serialization |
| Apache PDFBox | 2.0.29 | PDF text extraction |
| Spring Boot Mail | — | Email infrastructure |

### Infrastructure & Services
| Service | Purpose |
|---|---|
| MongoDB Atlas | Primary NoSQL database |
| Groq Cloud API | Primary LLM inference (LLaMA 3.3 70B Versatile) |
| Google Gemini 2.0 Flash | Secondary AI engine |
| Brevo (Sendinblue) | Transactional email (OTP, Welcome) |
| Docker + Docker Compose | Local multi-service orchestration |
| Render | Cloud deployment platform |
| Vercel | Frontend hosting |
| Nginx | Reverse proxy for production frontend container |

---

## 📦 Data Models

### User
```json
{
  "id": "mongo_objectid",
  "fullName": "Ishaan Verma",
  "email": "ishaan@example.com",
  "password": "$2a$10$...",
  "verified": true,
  "otp": null,
  "otpExpiry": null,
  "lastLogin": "2026-04-23T00:00:00"
}
```

### AIUsage (per user per day)
```json
{
  "userId": "...",
  "date": "2026-04-23",
  "chatMessages": 5,
  "flashcardsGenerated": 3,
  "quizzesGenerated": 1,
  "summariesGenerated": 2,
  "learningPathsGenerated": 1,
  "totalRequests": 12,
  "lastRequestTime": "...",
  "promptTokensUsed": 12400,
  "completionTokensUsed": 3200,
  "totalTokensUsed": 15600
}
```

### Resume
```json
{
  "id": "...",
  "userId": "...",
  "fileName": "resume_2026.pdf",
  "rawText": "...",
  "uploadedAt": "2026-04-23T00:00:00",
  "analysis": { ... }
}
```

### SkillAnalysis
```json
{
  "targetRole": "Software Engineer",
  "overallScore": 82,
  "skillMatchScore": 75,
  "experienceScore": 88,
  "resumeQualityScore": 79,
  "detectedSkills": ["JavaScript", "React", "Java"],
  "missingSkills": ["Kubernetes", "Go"],
  "isSuitable": true,
  "suitabilityScore": 78,
  "suitabilityReason": "Strong frontend experience...",
  "keyStrengths": ["React expertise", "Full-stack experience"],
  "criticalGaps": ["No cloud deployment experience"],
  "learningPath": "[{\"skill\":\"Kubernetes\",\"priority\":\"high\",\"estimatedTime\":\"4 weeks\"}]"
}
```

### LearningPath
```json
{
  "id": "...",
  "userId": "...",
  "goal": "Master Data Structures",
  "totalWeeks": 4,
  "difficultyLevel": "Intermediate",
  "description": "...",
  "weeks": [
    {
      "weekNumber": 1,
      "weekTitle": "Foundations",
      "weekGoal": "...",
      "days": [
        {
          "dayNumber": 1,
          "topic": "Arrays",
          "description": "...",
          "scheduledTasks": ["FLASHCARD", "SUMMARY"],
          "completed": false
        }
      ]
    }
  ]
}
```

---

## 📡 API Reference

### Auth Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user, trigger OTP email |
| POST | `/api/auth/verify-otp` | Verify OTP → receive JWT token |
| POST | `/api/auth/signin` | Login with credentials → JWT token |
| POST | `/api/auth/resend-otp` | Resend OTP to email |
| GET | `/api/auth/me` | Get current user profile (JWT required) |

### AI Module Endpoints (JWT required)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat/send` | Send message → AI response |
| POST | `/api/flashcards/generate` | Generate flashcard deck by topic |
| POST | `/api/quiz/generate` | Generate MCQ quiz by topic |
| POST | `/api/summary/generate` | Summarize input text |
| POST | `/api/resume/upload` | Upload PDF resume |
| GET | `/api/resume/list` | List user's uploaded resumes |
| POST | `/api/resume/{id}/analyze` | Analyze resume against target role |
| GET | `/api/resume/{id}/analysis` | Fetch stored analysis result |
| DELETE | `/api/resume/{id}` | Delete a resume |
| POST | `/api/learning-path/generate` | Generate multi-week learning path |
| GET | `/api/learning-path/list` | List all user learning paths |
| PATCH | `/api/learning-path/{id}/milestone` | Toggle day completion status |
| DELETE | `/api/learning-path/{id}` | Delete a learning path |

### Usage & Stats
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/ai-usage/stats/{userId}` | Get today's usage stats & token counts |

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | v18+ |
| npm | v9+ |
| Java JDK | 17+ |
| Maven | 3.8+ (or use `./mvnw`) |
| MongoDB | Atlas URI or local instance |

### 1. Clone the Repository
```bash
git clone https://github.com/ishaanv18/ArriBot.git
cd ArriBot
```

### 2. Configure Environment Variables

Copy the example env files and fill in your keys:
```bash
# Root level
cp .env.example .env

# Backend
cp backend/.env.example backend/.env.local
```

See the [Environment Variables](#-environment-variables) section for all required keys.

### 3. Setup & Run Backend
```bash
cd backend

# Option A: Maven wrapper (no global Maven required)
./mvnw spring-boot:run

# Option B: With explicit env vars
GROQ_API_KEY=your_key MONGODB_URI=your_uri ./mvnw spring-boot:run
```

> Backend runs on **Port 8080** (or `PORT` env var, defaulting to `10000` on Render)

### 4. Setup & Run Frontend
```bash
cd frontend
npm install
npm run dev
```

> Frontend dev server runs on **Port 5173**

### 5. (Optional) Run with Docker Compose

Run all three services (MongoDB + Backend + Frontend) with a single command:
```bash
# From project root
docker-compose up --build
```

Services:
- MongoDB: `localhost:27017`
- Backend: `localhost:8080`
- Frontend: `localhost:80`

---

## 🔧 Environment Variables

### Backend (`application.properties` / environment)

| Variable | Description | Example |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/arribot` |
| `GROQ_API_KEY` | Groq Cloud API key | `gsk_...` |
| `GROQ_MODEL` | Groq model name | `llama-3.3-70b-versatile` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `JWT_SECRET` | Secret for JWT signing (min 32 chars) | `your-super-secret-key-here` |
| `BREVO_API_KEY` | Brevo transactional email API key | `xkeysib-...` |
| `BREVO_FROM_EMAIL` | Sender email address | `noreply@arribot.app` |
| `PORT` | Server port override | `10000` |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins | `https://arribot.vercel.app` |

### AI Limits (configurable in `application.properties`)

| Property | Default | Description |
|---|---|---|
| `ai.limits.chat.daily` | `30` | Max chat messages per user per day |
| `ai.limits.flashcards.daily` | `10` | Max flashcard sets per user per day |
| `ai.limits.quiz.daily` | `5` | Max quiz generations per user per day |
| `ai.limits.summary.daily` | `10` | Max summarizations per user per day |
| `ai.ratelimit.requests.per.minute` | `5` | Max AI requests per user per minute |

### Frontend (`.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (e.g., `http://localhost:8080`) |

---

## ☁️ Deployment

### Backend (Render)
The `render.yaml` in the backend folder configures auto-deploy:
```yaml
# backend/render.yaml
services:
  - type: web
    name: arribot-backend
    runtime: java
    buildCommand: ./mvnw -B package -DskipTests
    startCommand: java -jar target/arribot-backend-1.0.0.jar
```

Set all environment variables in the Render dashboard. The `system.properties` file also pins Java 17:
```properties
java.runtime.version=17
```

### Frontend (Vercel)
The `vercel.json` configures SPA routing and API proxying:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Connect the `/frontend` directory to a Vercel project. Set `VITE_API_URL` to your backend Render URL.

### Full Docker Deployment
```bash
docker-compose up -d
```
All three containers start in the `arribot-network` bridge network. The frontend Nginx container serves static files and proxies `/api` calls to the backend.

---

## 📊 AI Rate Limits & Usage Tracking

ArriBot implements a two-layer protection system:

### Layer 1: Per-Minute Rate Limiting
```
Requests allowed = ai.ratelimit.requests.per.minute (default: 5)
Minimum seconds between requests = 60 / 5 = 12 seconds
```

If a user makes a request within the cooldown window, a `429 Too Many Requests` equivalent exception is thrown.

### Layer 2: Per-Feature Daily Limits

| Feature | Default Limit |
|---|---|
| Neural Chat | 30/day |
| Flash Recall | 10/day |  
| Cognitive Quiz | 5/day |
| Summarizer | 10/day |

Limits reset at **midnight UTC** (new date key in MongoDB).

### Token Tracking Dashboard
Every successful Groq API call returns a `usage` object in the response. ArriBot parses and stores:
- `prompt_tokens` — tokens in the input
- `completion_tokens` — tokens in the AI response
- `total_tokens` — sum

These are displayed on the Dashboard as an interactive meter with per-feature breakdown and total.

---

## 🔐 Security

### Authentication Flow
```
Sign Up → BCrypt hash password → save to MongoDB
       → generate 4-digit OTP → store with 10min expiry
       → send OTP via Brevo email

OTP Verification → check OTP match → check expiry
                → mark user.verified = true
                → generate JWT (24h, HS256)
                → return JWT to frontend

Every Protected Request → Authorization: Bearer <jwt>
                       → JwtAuthFilter validates signature + expiry
                       → extracts email → loads UserDetails
                       → passes to SecurityContext
```

### Security Hardening Checklist
- ✅ Passwords hashed with BCrypt (cost factor 10)
- ✅ JWT signed with a secret ≥ 256-bit key
- ✅ JWT has 24-hour expiry (`jwt.expiration=86400000` ms)
- ✅ OTP expires in 10 minutes
- ✅ CORS restricted to configured origins only
- ✅ File uploads limited to PDF format + 5MB max
- ✅ No passwords or OTPs logged in production output

---

## 🔮 Future Scope

| Feature | Description |
|---|---|
| **Streaming AI Responses** | Use Spring WebFlux SSE to stream Groq responses token-by-token, eliminating waiting time |
| **Voice Interface** | Web Speech API integration for voice-to-text input and text-to-speech AI responses |
| **Collaborative Study Rooms** | Real-time shared study sessions using WebSockets (Spring WebSocket + STOMP) |
| **Spaced Repetition Engine** | SM-2 algorithm integration for flashcard scheduling based on recall accuracy |
| **Progress Analytics** | Weekly/monthly learning trend charts, heatmaps (like GitHub contributions), and streak gamification |
| **Multi-modal Input** | Accept images (diagrams, textbook pages) alongside text — using Gemini's vision capabilities |
| **Export Features** | Export flashcards to Anki-compatible `.apkg` format, quizzes to PDF, and learning paths to calendar (iCal) |
| **Mobile App** | React Native companion app with offline flashcard review |
| **Premium Tier** | Subscription-based higher limits (100 chats/day, unlimited flashcards) with Stripe integration |
| **Plugin System** | Allow third-party integrations (Notion sync, GitHub topic extraction, YouTube transcript summarization) |
| **Social Learning** | Share generated learning paths publicly, upvote community paths, and fork them |
| **AI Model Router** | Automatically route queries to the optimal model (Groq for speed, Gemini for vision, Claude for reasoning) |

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'feat: add your feature description'`
4. **Push** to the branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request with a clear description

### Commit Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):
```
feat:     New feature
fix:      Bug fix
docs:     Documentation change
style:    Code style (no logic change)
refactor: Code refactoring
test:     Adding tests
chore:    Build/config changes
```

### Development Notes
- Backend Java code follows standard Spring Boot layered architecture (Controller → Service → Repository)
- Frontend uses React functional components with hooks exclusively
- All AI prompts are carefully engineered to return valid JSON — avoid changing prompt formats without testing
- New AI features must register with `AILimitsService` for rate limiting and usage tracking

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

**Built with ❤️ by the ArriBot Team**

*Transforming the way the world learns — one neural link at a time.*

⭐ If ArriBot helped you, consider giving the repository a star!

</div>
