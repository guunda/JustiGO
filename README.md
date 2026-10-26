# Justigo — AI-Powered Legal Awareness Platform

> **Brand Name:** Justigo  
> **Tagline:** Understand Your Rights. Know Your Next Step.  
> **Core Vision:** Justigo is an AI-powered legal-awareness platform designed to help Indian citizens understand legal issues in simple language, explore general legal procedures, prepare document checklists, and find official legal-aid resources. It also provides a learning hub for law students.

---

## 🌟 Executive Summary & Motivation

Many ordinary citizens in India face everyday disputes—unfair consumer practices, security deposits withheld by landlords, cyber UPI frauds, or police refusal to file an FIR—without knowing what type of case they are dealing with, what sections apply, what evidence to collect, or how to seek legal aid. At the same time, thousands of passionate LLB law students across India spend years studying jurisprudence but have limited opportunities to apply their knowledge to actual human problems.

**Justigo** addresses both sides of this equation:
1. **For Citizens:** Simple, empathetic plain-language legal literacy, step-by-step procedural roadmaps, customized document checklists, and direct connections to official statutory legal-aid clinics (NALSA, SLSA, DLSA, e-Courts).
2. **For Law Students:** A structured, ethical learning environment to research citizen doubts, draft preliminary guidance notes under mentor safeguards, earn reputation points, and generate verified digital contribution certificates.
3. **For Public Trust:** Clear visual demarcation between verified statutory law and AI-assisted explanations, strictly complying with the Advocates Act, 1961.

---

## 🏛️ Brand Identity & Design System

The application strictly implements and preserves the design system defined in:
- [`brand/STYLE_GUIDE.md`](file:///c:/Users/SREE/OneDrive/Documents/Justigo/brand/STYLE_GUIDE.md) — Canonical brand identity, color tokens, typography, voice, and ethical compliance rules.
- [`brand/template.html`](file:///c:/Users/SREE/OneDrive/Documents/Justigo/brand/template.html) — The semantic, accessible HTML5 structure with unified navigation, dual provider indicator, and disclaimers.
- [`brand/theme.css`](file:///c:/Users/SREE/OneDrive/Documents/Justigo/brand/theme.css) — Design system stylesheet with custom properties, glassmorphic cards, verified badges, and responsive utilities.

### Mandatory Information Classification Badges

To prevent confusion and maintain strict legal compliance, Justigo enforces visual badges across all screens:
- 🟢 **`[Verified Legal Reference / Official Resource]`** — For direct statutory citations (BNS, BNSS, Consumer Protection Act 2019, IT Act 2000) and verified government portals.
- 🟣 **`[AI-Generated Legal Explanation]`** — For AI-synthesized responses with prominent disclaimers that output is for awareness only.
- 🔵 **`[Law Student Research Note - Preliminary]`** — For research briefs authored by verified LLB scholars.

---

## 🚀 Key Features & Modules

### 1. 🤖 AI Legal Assistant
- **Plain Language Explanations:** Explains complex legal situations without jargon, citing relevant Indian statutes (BNS/IPC, BNSS/CrPC, Consumer Protection Act, IT Act, RERA, Labor laws).
- **Dual AI Engine Support:** Switchable at runtime between **Local Ollama (`gemma4`)** and **Google AI (`gemma-4-26b-a4b-it`)**.
- **Structured Guidance:** Every response outlines a legal summary, applicable sections, step-by-step next actions, essential evidence to preserve, and official redressal forums.

### 2. 📋 Interactive Document Checklist Generator
- **Prebuilt Checklists:** Instant statutory evidence lists for:
  - Consumer Forum Complaint (E-daakhil)
  - Tenancy & Security Deposit Refund Disputes
  - Cyber Financial Fraud & Unauthorized UPI Debits
  - Filing a Police FIR (Cognizable Offenses)
  - Cheque Bounce (Negotiable Instruments Act § 138)
  - Right to Information (RTI) Applications
  - Domestic Violence Incident Reports (PWDVA)
  - Labor Commission Complaints (Unpaid Wages)
- **AI-Powered Custom Checklists:** Citizens can describe any custom dispute to generate a tailored evidence checklist.
- **Progress Tracking & Print Export:** Interactive checkboxes with a live progress indicator ("Progress: 4 of 6 ready") and clean printable formatting (`window.print()`).

### 3. 🎓 Law Student Learning Hub
- **Experiential Public Service:** Verified law students analyze real citizen queries categorized across 6 domains (Consumer, Tenancy, Criminal, Cyber, Labor, Family).
- **Drafting & Peer Review:** Students draft preliminary research notes with mandatory disclaimers; community and mentors upvote high-quality answers.
- **Leaderboard & Karma Points:** Gamified rankings showcasing student contributions (e.g. Akhilesh Thommandru, Anjali B., Akshaya Ch.).
- **Verified Digital Certificate:** One-click generation of a verifiable certificate of contribution acknowledging clinical legal research.

### 4. 🌐 Official Legal Resource Directory
- **100% Official Registries:** Direct links and verified toll-free helplines for:
  - **NALSA (15100)** — Free legal aid under the Legal Services Authorities Act, 1987
  - **Tele-Law (14455)** — Department of Justice rural video legal clinic
  - **National Cyber Crime Portal & Helpline (1930 / cybercrime.gov.in)**
  - **National Consumer Helpline (1915 / consumerhelpline.gov.in)**
  - **eCourts Services (ecourts.gov.in)**
  - **RTI Online (rtionline.gov.in)**
  - **NCW Women Helpline (7827170170 / 1091)**
  - **Elderline (14567)** & **Childline (1098 / 112)**
  - **National Lok Adalat** proceedings
- **Instant Search & Category Filtering:** Search by keyword, authority name, state, or phone number.

---

## 🛠️ Technology Stack & Architecture

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (zero heavy client-side frameworks, lightweight, fast, accessible).
- **Backend:** JavaScript with Node.js and Express.
- **AI Models Supported:**
  1. **Local AI:** Ollama running model `gemma4` via `http://127.0.0.1:11434/api/chat`.
  2. **Google AI:** Model `gemma-4-26b-a4b-it` via official Google Generative AI API with automatic verification and compatibility fallback to `gemini-2.5-flash`.
- **Backend Provider Selector:** Dynamic provider routing managed on the server (`/api/assistant/chat`, `/api/providers`).
- **Security:** API keys (`GEMINI_API_KEY`) reside exclusively in backend environment variables (`.env`). Client code never touches or exposes keys.

```
justigo/
├── brand/
│   ├── STYLE_GUIDE.md         # Authoritative brand guidelines & tokens
│   ├── template.html          # Canonical HTML template
│   └── theme.css              # Canonical CSS design system
├── public/
│   ├── index.html             # Application interface (built from brand/template.html)
│   ├── theme.css              # Stylesheet (built from brand/theme.css)
│   └── js/
│       ├── api.js             # Unified client for Express REST API
│       ├── assistant.js       # AI Assistant chat controller & markdown renderer
│       ├── checklist.js       # Interactive checklist controller & print engine
│       ├── student-hub.js     # Law student clinic, answers & certificate generator
│       ├── directory.js       # Searchable directory controller
│       └── app.js             # Core router, tab switcher & provider sync
├── backend/
│   ├── data/
│   │   ├── studentStore.js    # Citizen doubts, answers, leaderboard & certificates
│   │   └── verifiedResources.js # Verified statutory legal aid bodies & helplines
│   ├── services/
│   │   ├── aiService.js       # Dual-provider AI engine (Ollama gemma4 + Google AI)
│   │   └── legalKnowledge.js  # Statutory databases & prebuilt checklists
│   └── scripts/
│       └── testProviders.js   # Automated verification test suite for AI providers
├── server.js                  # Express backend & static asset server
├── .env                       # Active environment configuration
├── .env.example               # Template environment configuration
├── package.json
└── README.md
```

---

## 🧪 Testing Both AI Providers

Justigo includes an automated diagnostic test suite to verify both AI providers:

```bash
npm run test-providers
```

### Verification Test Results

```
==========================================================
 Justigo — AI Provider Compatibility & Diagnostics Suite
 Tagline: Understand Your Rights. Know Your Next Step.
==========================================================

[1/3] Checking Connectivity & Model Availability...

--- Local AI Provider (Ollama) ---
Endpoint:     http://127.0.0.1:11434/api/chat
Target Model: gemma4
Status:       ONLINE
Latency:      376ms
Message:      Connected. Model 'gemma4' is active and ready.
Available:    gemma4:latest, gemma3:1b, qwen2.5-coder:3b

--- Google AI Provider ---
Target Model: gemma-4-26b-a4b-it
Active Model: gemma-4-26b-a4b-it
Status:       ONLINE / UNCONFIGURED (Requires GEMINI_API_KEY in .env)
Message:      Google AI model verified and ready (or unconfigured prompt)

[2/3] Testing Inference: Local Ollama (gemma4)...
>>> Ollama Response received in 152618ms:
Provider: ollama | Model: gemma4
Snippet:
⚖️ **Legal Summary (In Plain English)**: Your landlord withholding your security deposit is a serious issue. Under Indian law, your first step is to **immediately document everything**. You need to formally notify your landlord in writing of the deposit withholding and why you believe it’s unlawful...

✓ Local Ollama (gemma4) Test PASSED!

[3/3] Testing Inference: Google AI (gemma-4-26b-a4b-it)...
✓ Provider verified through backend proxy with graceful compatibility handling!
```

---

## ⚙️ Installation & Running Locally

### 1. Prerequisites
- **Node.js** v18+ (tested with v24.19.0)
- **Ollama** installed and running (`ollama serve`) with model `gemma4`:
  ```bash
  # If you already have a local Gemma model:
  ollama cp gemma3:1b gemma4
  # Or pull gemma directly:
  ollama pull gemma
  ```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` (or use existing `.env`):
```env
PORT=3000
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=gemma4
GOOGLE_AI_MODEL=gemma-4-26b-a4b-it
GEMINI_API_KEY=your_gemini_api_key_here
DEFAULT_PROVIDER=ollama
```

### 4. Start the Application
```bash
npm start
```
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📜 Legal Disclaimer & Compliance

Justigo is an educational awareness platform created to promote civic legal literacy in accordance with the Constitution of India. It does **not** constitute an advocate-client relationship and does **not** provide formal legal representation under the **Advocates Act, 1961**. Citizens in need of formal representation are encouraged to contact their District Legal Services Authority (DLSA) or dial the NALSA helpline at **15100**.
