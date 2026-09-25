# 🤖 ASE Multi-Agent Web App

**Describe the app you want. Watch a crew of AI agents architect, design, and build it for you.**

ASE Multi-Agent Web App is a full-stack playground that pairs a Next.js chat interface with a CrewAI-powered microservice. Type a plain-English software request, and a sequential crew of three specialized AI agents — an **Architect**, a **Frontend Engineer**, and a **Backend Engineer** — collaborate to turn it into a real, structured software plan and codebase.

---

## ✨ Features

- **💬 Conversational build requests** — Sign in, open a conversation, and describe the app you want in natural language.
- **🧠 A real agent pipeline, not a single prompt** — Each request runs through three CrewAI agents in sequence, each building on the previous agent's output:
  1. **Architect** — turns your request into a full architecture document (requirements, stack choices, API design, database design, security, deployment, and cost considerations).
  2. **Frontend Engineer** — writes a complete, runnable Vite + React + TypeScript frontend based on that architecture.
  3. **Backend Engineer** — writes a complete backend that matches the frontend's expected API contracts exactly.
- **📄 Structured, extractable output** — Agents emit code using a strict `### FILE: path` convention, which the backend can parse and repackage into a downloadable ZIP with real files and folders.
- **🔐 Authentication built in** — Email/password and Google OAuth sign-in via NextAuth, with sessions persisted through Prisma.
- **🗂️ Conversation history** — Every request and AI response is saved to Postgres, so past builds are never lost.

---

## 🏗️ Architecture

```mermaid
flowchart LR
    U([User]) -->|Describes an app| FE[Next.js Frontend]
    FE -->|Auth via NextAuth| DB[(PostgreSQL + Prisma)]
    FE -->|POST /api/app-build-req| API[Next.js API Route]
    API -->|POST /run-agent| MS[FastAPI Microservice]

    subgraph Crew["CrewAI Agent Pipeline (sequential)"]
        A[🏛️ Architect Agent] --> B[🎨 Frontend Agent]
        B --> C[⚙️ Backend Agent]
    end

    MS --> Crew
    Crew -->|Architecture + Frontend + Backend code| MS
    MS -->|JSON result| API
    API -->|Saves chat| DB
    API -->|Renders result| FE
```

The **frontend** is the product surface: chat UI, auth, and conversation history. The **crewMicroService** is the brain: a FastAPI service that spins up a CrewAI crew, runs the three agents one after another (each one receiving the prior agent's output as context), and returns the combined result.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | [Next.js 16](https://nextjs.org) (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Auth | NextAuth (Credentials + Google OAuth) |
| Database / ORM | PostgreSQL via Prisma 7 |
| Agent microservice | FastAPI (Python) |
| Multi-agent orchestration | [CrewAI](https://www.crewai.com/) |
| LLM | Google Gemini 2.5 Flash |
| Markdown rendering | `react-markdown` + `remark-gfm` |

---

## 📁 Project Structure

```
ase-multi-agent-web-app/
├── frontend/                     # Next.js application (chat UI, auth, DB)
│   ├── src/app/                  # App Router pages & API routes
│   │   ├── api/auth/[...nextauth]   # NextAuth config
│   │   ├── api/app-build-req/       # Kicks off a build request → calls the crew
│   │   ├── api/sign-up/             # Credentials sign-up
│   │   ├── conversation/[id]/       # Single conversation view
│   │   ├── conversations/           # Conversation list
│   │   ├── sign-in/ & sign-up/      # Auth pages
│   │   └── home/                    # Landing / hero page
│   ├── components/                # ChatSection, Sidebar, Navbar, HeroSection, etc.
│   ├── prisma/schema.prisma       # Users, Accounts, Conversations, Chats
│   └── proxy.ts                   # Route protection middleware
│
└── crewMicroService/              # FastAPI + CrewAI backend
    ├── main.py                    # FastAPI app — exposes /run-agent
    ├── crew/
    │   ├── config.py              # LLM configuration (Gemini)
    │   ├── softwareCrew.py        # Assembles the sequential crew
    │   ├── agents/                # Architect, FrontendAgent, backendAgent
    │   └── tasks/                 # architecture, frontEndTask, backendTask
    ├── extract_files.py           # Parses agent output into real files on disk
    └── file_extractor_zip.py      # Parses agent output into an in-memory ZIP
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+ (a Conda environment named `crewenvironment` is used in development, but any virtual environment works)
- **PostgreSQL** database
- A **Google Gemini API key**
- (Optional) **Google OAuth** credentials, if you want Google sign-in

### 1. Clone the repo

```bash
git clone https://github.com/Mueez-khan/ase-multi-agent-web-app.git
cd ase-multi-agent-web-app
```

### 2. Set up the agent microservice

```bash
cd crewMicroService
pip install fastapi uvicorn crewai python-dotenv pydantic
```

Create a `.env` file inside `crewMicroService/`:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Run the service:

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://127.0.0.1:8000`, with interactive docs at `http://127.0.0.1:8000/docs`.

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/your_db
NEXTAUTH_SECRET=a_random_secret_string
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Run the Prisma migrations and start the dev server:

```bash
npx prisma migrate deploy
npm run dev
```

Visit `http://localhost:3000` — sign up, start a conversation, and describe the app you want built.

> **Note:** The frontend calls the agent microservice at `http://127.0.0.1:8000/run-agent`, so make sure both services are running at the same time during local development.

---

## 🔌 API Reference

### FastAPI microservice

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `GET` | `/info` | Basic service info |
| `POST` | `/run-agent` | Runs the full agent crew on a `{ "query": "..." }` request and returns the architecture, frontend, and backend output |

### Next.js API routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/sign-up` | Create a new account |
| `POST` | `/api/app-build-req/[conversationId]` | Saves the user's message, calls the agent microservice, and saves the AI's response |
| `GET` | `/api/conversations` | List a user's conversations |
| `GET` | `/api/user-chats/[conversationId]` | Fetch messages for a conversation |

---

## 🗺️ Roadmap

- [ ] Wire up the ZIP export (`file_extractor_zip.py`) so generated projects can be downloaded directly from the UI
- [ ] Stream agent progress to the frontend instead of waiting for the full crew to finish
- [ ] Add support for additional LLM providers
- [ ] Containerize both services with Docker Compose for one-command local setup

---

## 📄 License

No license has been specified yet for this project. Add a `LICENSE` file to define how others can use, modify, or distribute this code.

---

<p align="center">Built by <a href="https://github.com/Mueez-khan">Mueez Khan</a></p>