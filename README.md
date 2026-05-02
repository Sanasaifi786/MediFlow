
#Link to the Demo Video
https://drive.google.com/file/d/1807DGk9H54ejxynY-RtfrwIf4mCYbgFz/view?usp=drivesdk

# 🏥 MediFlow AI — Multi-Agent Healthcare Operating System

> *Empowering hospitals with autonomous AI agents for a smarter, faster, and more accurate clinical workflow.*

MediFlow AI is a full-stack, production-ready clinical platform that automates critical hospital operations using **Autonomous AI Agents**. Built for multi-tenant healthcare environments, it provides role-specific portals for every member of the medical team — from Administrators and Doctors to Nurses and Insurance Managers — all powered by a centralized **Clinical Brain Agent** that intelligently plans, routes, and executes complex medical tasks.


## 🌐 Explore Live

Experience the live instance of the MediFlow application:
- **Frontend URL**: [https://mediflow-deploy.vercel.app/](https://mediflow-deploy.vercel.app/)
- **Backend API URL**: [https://mediflow-8qei.onrender.com](https://mediflow-8qei.onrender.com)

---

## 📋 Table of Contents

1. [Explore Live](#-explore-live)
2. [Project Details](#-project-details)
3. [Key Features](#-key-features)
4. [Tech Stack](#-tech-stack)
5. [Project Structure](#-project-structure)
6. [Prompt Description](#-prompt-description)
7. [Setup & Installation](#-setup--installation)
8. [API Endpoints](#-api-endpoints)
9. Architecture Diagram

---

## 🔍 Project Details

### The Problem
Modern hospitals are overwhelmed with repetitive, high-risk administrative and clinical paperwork:
- Doctors spend **3–4 hours per day** writing discharge summaries manually.
- Insurance claims are delayed due to slow, error-prone manual eligibility checks.
- Medicine inventory is tracked in outdated spreadsheets, causing critical shortages.

### The MediFlow Solution
MediFlow introduces an **Agentic AI Architecture** where specialized AI agents autonomously handle each of these workflows:

| Workflow | Agent | Outcome |
| :--- | :--- | :--- |
| Discharge Process | Discharge Agent | Dual-format clinical + patient-friendly summaries |
| Insurance Claims | Insurance Agent | Automated eligibility verification & claim scoring |
| Inventory Management | Inventory Agent | Real-time stock tracking & intelligent reorder alerts |
| Clinical Routing | Brain Agent | Unified query router for all clinical AI agents |

### Who Uses MediFlow?
| Role | Portal | Primary Actions |
| :--- | :--- | :--- |
| **Administrator** | Admin Portal | Staff onboarding, AI prompt tuning, system logs |
| **Doctor** | Doctor Portal | AI queries, discharge report generation |
| **Nurse** | Nurse Portal | Real-time patient event & vitals logging |
| **Insurance Manager** | Insurance Portal | Claim verification & policy management |
| **Inventory Manager** | Inventory Portal | Stock tracking & supply chain management |

---

## ✨ Key Features

### 🧠 Multi-Agent Clinical Brain
A centralized AI routing system (`brain.js`) that uses **Google Gemini** to analyze incoming queries and intelligently delegate them to the correct specialist agent. The brain detects intent (`insurance`, `inventory`, `discharge`) and routes with zero manual configuration.

### 📑 Autonomous Discharge Engine
A 4-step agentic pipeline:
1. **Timeline Extraction** — Fetches all patient events (admissions, tests, surgeries).
2. **Data Validation** — Checks for missing critical fields before proceeding.
3. **Clinical Summary** — Generates a professional doctor-level report.
4. **Patient Summary** — Translates the clinical report into simple, friendly language for the patient.

### 🛡️ Role-Based Access Control (RBAC)
JWT-protected routes ensure every user sees only their designated portal. Login credentials determine the entire dashboard experience automatically.

### 🩺 Doctor's AI Assistant (Discharge Automation)
Doctors can generate complete, dual-format discharge summaries with a single click — giving back hours of manual documentation time. The AI automatically reads the patient's full event timeline and produces a professional clinical report (for the doctor) and a simplified, friendly explanation (for the patient).

### 🔍 Intelligent Insurance Claim Detector
The Insurance Agent acts as an autonomous claim analysis engine — it reads patient data, fetches the linked policy, checks eligibility criteria, and produces an intelligent **claim approval score**. This eliminates slow, error-prone manual verification and helps insurance managers make faster, data-backed decisions.

### 👩‍⚕️ Nurse Event Logger with Smart Search
Nurses can log real-time clinical events (consultations, tests, surgeries) using a **professional searchable patient selector** that filters by name or diagnosis across thousands of records instantly.

### 🕵️ Live Reasoning Hub
A complete audit trail of every AI agent's decision-making process. Administrators can monitor which agent was activated, what data it processed, and what conclusion it reached — in real-time.

### ⚙️ Dynamic Prompt Kernel Editor
A syntax-highlighted, dark-mode code editor inside the Admin Portal that allows live editing of AI agent behavior without restarting the server. Features a **Discard** button for safe experimentation.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | 19 | Component-based UI architecture |
| **Tailwind CSS** | v4 | Custom "Medical Emerald" design system |
| **Axios** | Latest | API communication with global JWT interceptors |
| **React Router DOM** | v6 | Protected, role-based routing |
| **Lucide React** | Latest | Professional clinical iconography |

### Backend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | v18+ | Server runtime |
| **Express** | v4 | REST API framework |
| **MongoDB** | Atlas | Patient, inventory, and employee data |
| **Mongoose** | v8 | Schema validation and ORM |
| **Google Gemini** | 1.5 Flash | AI agent reasoning and clinical analysis |
| **JSON Web Token** | Latest | Secure authentication |
| **Bcrypt** | Latest | Password hashing |

---

## 📂 Project Structure

```
MediFlow/
├── 📁 backend/
│   ├── 📁 agents/
│   │   ├── 📁 insurance/       # Insurance claim processing logic
│   │   ├── 📁 inventory/       # Stock management AI logic
│   │   └── dischargeAgent.js   # 4-step discharge pipeline
│   ├── 📁 config/
│   │   └── connectDB.js        # MongoDB connection
│   ├── 📁 middleware/
│   │   └── auth.js             # JWT verification middleware
│   ├── 📁 models/
│   │   ├── employeeModel.js    # Staff schema (all roles)
│   │   ├── patientModel.js     # Patient records schema
│   │   ├── patientEventModel.js# Clinical timeline events
│   │   ├── insuranceModel.js   # Policy & claim records
│   │   └── inventoryModel.js   # Medicine stock schema
│   ├── 📁 prompts/
│   │   ├── brain.js            # AI routing prompt
│   │   ├── discharge.js        # Clinical summary prompts
│   │   ├── insurance.js        # Claim analysis prompts
│   │   └── inventory.js        # Stock intelligence prompts
│   ├── 📁 routes/
│   │   ├── auth.route.js       # Login, dashboard, employee management
│   │   ├── brain.route.js      # AI query routing
│   │   ├── discharge.route.js  # Discharge report generation
│   │   ├── insurance.route.js  # Insurance claim APIs
│   │   ├── inventory.route.js  # Inventory management APIs
│   │   ├── nurse.route.js      # Patient event logging
│   │   └── prompts.route.js    # Dynamic prompt editing
│   ├── 📁 services/
│   │   └── gemini.service.js   # Google Gemini API wrapper
│   ├── 📁 utils/
│   │   └── logger.js           # Reasoning hub logger
│   ├── brain.js                # Master AI agent router
│   ├── .env                    # Environment variables
│   └── server.js               # Express server entry point
│
└── 📁 frontend/
    └── 📁 src/
        ├── 📁 components/
        │   ├── Layout.jsx          # Main dashboard shell
        │   └── Sidebar.jsx         # Role-aware navigation
        ├── 📁 pages/
        │   ├── Login.jsx           # Authentication portal
        │   ├── Dashboard.jsx       # Role-specific home page
        │   ├── Assistant.jsx       # Doctor's AI chat interface
        │   ├── NursePortal.jsx     # Clinical event logger
        │   ├── AddEmployee.jsx     # Admin staff onboarding
        │   ├── PromptManager.jsx   # AI kernel editor
        │   ├── Inventory.jsx       # Stock management UI
        │   ├── Claims.jsx          # Insurance claims UI
        │   ├── Report.jsx          # Discharge report UI
        │   └── Logs.jsx            # Reasoning hub viewer
        ├── api.js                  # Axios config (baseURL + interceptors)
        ├── App.jsx                 # Route definitions
        └── index.css               # Tailwind + Custom Design System
```

---

## 🧩 Prompt Description

MediFlow uses dynamic **AI Prompts** located in the `backend/prompts` directory to control agent behavior, analyze information, and output structured JSON data:

### 🧠 Master Brain Router Prompt
- **File**: `backend/prompts/brain.js`
- **Description**: Governs the main intent classification system of the application.
- **Purpose**: Analyzes raw clinical or operational queries and intelligently directs them to specialized agents (`insurance`, `inventory`, `discharge`, or `unknown`) while identifying any patient reference IDs in the text.

### 🛡️ Insurance Agent Prompts
- **File**: `backend/prompts/insurance.js`
- **Descriptions**:
  - **Entity Extraction**: Pulls the patient's name, age, and disease from unstructured text.
  - **Cost Prediction**: Estimates the treatment cost (in INR) based on the disease and age.
  - **Agent Loop Prompt**: Orchestrates the autonomous agent logic to call appropriate extraction, policy verification, eligibility checking, and risk scoring tools before outputting the final result.
- **Purpose**: Automates claim verification, eligibility checks, and overall risk analysis in a unified medical-insurance loop.

### 📑 Discharge Agent Prompts
- **File**: `backend/prompts/discharge.js`
- **Descriptions**:
  - **Data Validation**: Inspects patient history and timelines for critical data points.
  - **Clinical Summary**: Generates a professional, medically precise discharge report for the medical team.
  - **Patient Summary**: Converts the clinical report into clear, easy-to-understand, and supportive instructions for the patient.
- **Purpose**: Reduces the manual paperwork burden for doctors while ensuring patients receive clear and accurate health summaries upon discharge.

### 💊 Inventory Agent Prompts
- **File**: `backend/prompts/inventory.js`
- **Description**: Configures the Hospital Inventory Management Agent.
- **Purpose**: Powers queries regarding medicine/supply stock levels, updates inventory counts, and identifies low-stock items.

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** (Local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Google Gemini API Key** ([Get it here](https://aistudio.google.com/))

### Step 1: Clone the Repository
```bash
git clone https://github.com/Sanasaifi786/MediFlow.git
cd MediFlow
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_DB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
JWT_SECRET=your_strong_jwt_secret_key
```

Start the backend server:
```bash
npm run dev
```
> ✅ Backend will be running at `http://localhost:5000`

### Step 3: Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
> ✅ Frontend will be running at `http://localhost:5173`

### Step 4: First Login
Use your Admin credentials to log in. If no admin exists, register one directly via the `/auth/employees` API endpoint.

---

## 🔌 API Endpoints

### 🔐 Authentication
| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/auth/login` | `POST` | ✅ | Login with email & password |
| `/auth/dashboard` | `GET` | ✅ | Fetch role-specific dashboard data |
| `/auth/employees` | `POST` | ✅ Admin | Create and authorize new staff |
| `/auth/me` | `GET` | ✅ | Get current user profile details |

### 🧠 AI Brain Agent
| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/brain/query` | `POST` | ✅ | Route clinical queries to AI agents |
| `/brain/logs` | `GET` | ✅ | Fetch real-time AI reasoning logs |

### 📑 Discharge Agent
| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/discharge/generate` | `POST` | ✅ | Generate full discharge report for a patient |

### 🏥 Nurse Portal
| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/nurse/patients` | `GET` | ✅ | Fetch list of all patients for selection |
| `/nurse/log-event` | `POST` | ✅ | Record a new clinical patient event |

### 💊 Inventory Agent
| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/inventory/process` | `POST` | ✅ | Process stock queries via AI agent |

### 📋 Insurance Agent
| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/insurance/process` | `POST` | ✅ | Process insurance claim verification |

### ⚙️ Prompt Management (Admin Only)
| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/prompts` | `GET` | ✅ Admin | List all AI system prompt files |
| `/prompts/update` | `POST` | ✅ Admin | Update an AI agent's behavior in real-time |

---

## 🔐 Environment Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` |
| `MONGO_DB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `JWT_SECRET` | JWT signing secret | `mediflow_secret_key` |

---
## Architechture diagram
<img width="1024" height="1024" alt="4157fb5e-013c-402b-abe1-401a3cf5c5b6" src="https://github.com/user-attachments/assets/a62b48a3-4c6c-4b13-81d9-27df329a42ad" />
> Built with ❤️ for the next generation of intelligent healthcare.
