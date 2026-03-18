## PersonaOps

**PersonaOps** is a hackathon-ready control plane for AI agent personas built on **DigitalOcean Gradient™ AI** using the **Agent Development Kit (ADK)**.

Instead of a generic chatbot, PersonaOps focuses on **persona quality and observability**:

- **Three production-style personas**: Compliance Copilot, Sales Closer, Research Analyst.
- **One prompt, three answers** – compare tone, structure, and usefulness.
- **Observability surface**: traces, logs, and evaluation scorecards.
- **Backed by Gradient AI ADK + LangGraph** and deployable as a managed agent.

### Why it matters

Teams need a way to **validate whether an AI persona is useful, safe, and effective before shipping**. PersonaOps turns that into a concrete, demoable workflow using:

- DigitalOcean Gradient **Agent Development Kit (ADK)**.
- Hosted ADK agent deployments.
- **Traces, logs, and evaluations** to measure persona behavior.

Think of it as a **control plane for production AI personas**.

---

## Architecture Overview

### High level

- **Frontend** (`frontend/`):
  - Next.js App Router, TypeScript, Tailwind CSS, lucide-react.
  - Dark, SaaS-style dashboard UI (Vercel/Linear/Warp inspired).
  - `/api/run` and `/api/compare` routes (priority order):
    1. `DEPLOYED_AGENT_URL` → Gradient ADK deployed agent.
    2. `OPENAI_API_KEY` → OpenAI Chat Completions with the same persona system prompts (server-side only).
    3. Otherwise → mock responses for offline demos.

- **Agent** (`agent/`):
  - Python, **DigitalOcean Gradient ADK**, **LangGraph**, and `gradient` client.
  - Single `@entrypoint` function in `main.py`.
  - Accepts payload:
    ```json
    {
      "prompt": "string",
      "persona": "compliance" | "sales" | "research"
    }
    ```
  - Routes through LangGraph with persona-specific **system prompts**.
  - Returns:
    ```json
    {
      "persona": "research",
      "response": "...",
      "meta": {
        "latency_ms": 0,
        "model": "...",
        "trace_hint": "..."
      }
    }
    ```
  - Uses tools:
    - `calculator_tool` for simple math.
    - `product_lookup_tool` as a mock retrieval/lookup.

- **Evaluations**:
  - `agent/evaluations/persona_eval.csv` – ADK-friendly evaluation dataset.
  - Targets:
    - Instruction following
    - Correctness
    - Model fit
    - Safety & security

---

## Project Structure

```text
.
  README.md
  LICENSE
  .gitignore
  .env.example

  frontend/          # Next.js dashboard
    app/             # App Router, pages + API routes
    components/      # UI components
    lib/             # types, personas, mock data, API helper
    .env.example

  agent/             # Gradient ADK agent
    main.py          # @entrypoint with LangGraph workflow
    agents/          # persona prompts + workflow
    tools/           # calculator + product lookup tool
    evaluations/     # CSV dataset for `gradient agent evaluate`
    requirements.txt
    .env.example
    .gradient/agent.yml  # placeholder; ADK will manage this
```

---

## Setup Instructions

### 1. Frontend setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

- **OpenAI (real answers without Gradient):** set `OPENAI_API_KEY` in `.env.local` (never commit). Default model is **GPT-5.3 Instant** (`gpt-5.3-chat-latest`); override with `OPENAI_MODEL` if needed.
- **Gradient ADK:** set `DEPLOYED_AGENT_URL` (and token); that path overrides OpenAI.
- **Mocks only:** leave both unset.

On **DigitalOcean App Platform**, add `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`) as encrypted app-level environment variables.

### Deploy to DigitalOcean App Platform

DigitalOcean does **not** receive code from `git push` directly—it pulls from **GitHub** after you connect the repo.

1. **Push to GitHub** (e.g. `main`): `git push origin main`
2. In [App Platform](https://cloud.digitalocean.com/apps) → **Create App** (or open your existing app).
3. Connect **GitHub** → repo **`LightLLM/PersonOPS`**, branch **`main`**.
4. **Source directory:** `frontend` (required—root has no `package.json`).
5. Enable **Autodeploy** so every push to `main` triggers a new deployment.
6. **Environment** → add **`OPENAI_API_KEY`** (Encrypt). Redeploy.

Optional: create/update from spec using [`.do/app.yaml`](./.do/app.yaml) (`doctl apps create --spec .do/app.yaml` or paste spec in **Settings → App Spec**).

### 2. Agent setup (Gradient ADK)

```bash
cd agent
cp .env.example .env
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Set your keys in `.env`:

- `GRADIENT_MODEL_ACCESS_KEY` – **Model access key** from DigitalOcean.
- `DIGITALOCEAN_API_TOKEN` – Personal access token with:
  - CRUD `genai` scopes
  - Read `project` scope
- `MODEL_ID` – e.g. `openai-gpt-oss-120b` or any supported Gradient model.

Initialize Gradient ADK project (if not already):

```bash
gradient agent configure
```

Point it at `main.py` when prompted.

---

## Running the Agent Locally

```bash
cd agent
source .venv/bin/activate
gradient agent run
```

Test locally:

```bash
curl -X POST http://localhost:8080/run \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Give me a launch strategy for PersonaOps.", "persona": "research"}'
```

---

## Deploying the Agent to DigitalOcean Gradient AI

```bash
cd agent
export DIGITALOCEAN_API_TOKEN=your_token
gradient agent deploy
```

After deployment, set `DEPLOYED_AGENT_URL` in `frontend/.env` to the printed URL and restart the frontend dev server.

---

## Running Evaluations

```bash
cd agent
gradient agent evaluate \
  --test-case-name "personaops-baseline-v1" \
  --dataset-file evaluations/persona_eval.csv \
  --categories correctness,model_fit,safety_and_security,instruction_following \
  --star-metric-name "Correctness (general hallucinations)" \
  --success-threshold 85.0
```

---

## License

This project is licensed under the Apache License 2.0. See `LICENSE` for details.

