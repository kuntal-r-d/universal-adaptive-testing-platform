Here is the updated **Product Requirement Specification (PRS)**.

This version is significantly refactored to prioritize **extensibility**. Instead of hard-coding "NCLEX logic," we are defining a **"Universal Test Engine"** where the exam rules (stopping criteria, scoring algorithms, item types) are treated as **configurable metadata**.

---

# Product Requirement Specification: Universal Adaptive Testing Platform

## 1. Functional Requirements (FR)

### **FR-01: The "Polymorphic" Exam Engine**

The system must support a "Pluggable Strategy" architecture to handle different exam methodologies dynamically.

* **FR-01.1: Engine Configuration Profile:** The system shall allow administrators to define an "Exam Profile" with specific parameters:
* **Algorithm:** `Item_Adaptive` (NCLEX/GMAT), `Section_Adaptive` (GRE), `Linear_Fixed` (Standard), `LOFT` (Randomized).
* **Scoring Model:** Configurable IRT models (Rasch, 1PL, 2PL, 3PL) or Classical Test Theory (Summation).
* **Stopping Rules:**
* *Standard Error Rule:* Stop when SEM < X (e.g., 0.3).
* *Length Rule:* Min/Max question counts (e.g., Min 75, Max 145).
* *Time Rule:* Max duration (e.g., 180 mins).




* **FR-01.2: Session State Management:** The system must preserve the state of every active exam. If a user disconnects, they must be able to resume at the exact question index with the exact same timer value.
* **FR-01.3: Navigation Control:** The system must support configurable navigation constraints:
* *Unidirectional:* No going back (CAT standard).
* *Bidirectional:* Flag and review (Linear standard).



### **FR-02: Universal Question Bank (CMS)**

The content management system must be schema-agnostic to support any domain (Nursing, Business, Engineering).

* **FR-02.1: Dynamic Item Schema:** The database must use `JSONB` structures to store question content, allowing for:
* **Variable Option Counts:** 2 to N options.
* **Interaction Types:** Single Select, Multi-Select (SATA), Ordering, Hotspot (Image coordinates), Drag-and-Drop.


* **FR-02.2: Hierarchical Tagging:** Questions must support a flexible tagging tree (Domain  Subject  Topic  Competency) to map to any external syllabus (e.g., "NCLEX Client Needs" or "GMAT Quant").
* **FR-02.3: Psychometric Metadata:** Every question record must store:
* Difficulty Parameter ().
* Discrimination Parameter ().
* Guessing Parameter ().
* *Exposure Count:* To track how often a question is shown (preventing over-exposure).



### **FR-03: AI-Augmented Authoring**

* **FR-03.1: Generation Pipeline:** The system shall provide an interface to prompt an LLM (via API) to generate draft items based on a specific "Exam Profile" and "Topic."
* **FR-03.2: Human-in-the-Loop Validation:** Generated items must enter a `DRAFT` state. They can only be promoted to `ACTIVE` (live) after manual review and approval by an Admin.

### **FR-04: "Smart Coach" Analytics**

* **FR-04.1: Gap Analysis:** The system must compare a user's `Current Theta` against the `Target Theta` (Passing Standard) defined in the Exam Profile.
* **FR-04.2: Velocity Prediction:** The system shall calculate a "Ready Date" based on the user's historical rate of improvement ( / Time).
* **FR-04.3: Adaptive Remediation:** The system must generate dynamic study tasks (e.g., "Take a 20-question quiz on Topic X") specifically targeting the user's lowest-performing metadata tags.

---

## 2. Non-Functional Requirements (NFR)

### **NFR-01: Extensibility & Modularity**

* **Strategy Pattern:** The backend code (Python/Node) must use the Strategy Design Pattern for the scoring engine. Adding a new exam type (e.g., "LSAT") should require creating a new Strategy Class, not modifying the core engine code.
* **Service Decoupling:** The "Scoring Service" (Python) must be completely strictly decoupled from the "Content Service" (Strapi/Express). They shall communicate only via defined REST/gRPC APIs.

### **NFR-02: Performance & Latency**

* **Next-Item Latency:** The time between submitting an answer and rendering the next adaptive question must be **< 200 milliseconds** (P95).
* **Concurrent Users:** The system must support horizontal scaling (via Docker/Kubernetes) to handle spikes in concurrent test-takers without degradation.

### **NFR-03: Security & Integrity**

* **Item Exposure Control:** The item selection algorithm must include a "randomness factor" or exposure control method (like the Sympson-Hetter method) to ensure no single question is overused, preserving bank security.
* **Anti-Harvesting:** The API must implement rate limiting and anomaly detection to prevent a single user from "scraping" the question bank by rapidly cycling through exams.

### **NFR-04: Data Integrity**

* **Audit Logging:** Every keystroke, answer change (if allowed), and time-per-item must be logged for forensic analysis.
* **ACID Compliance:** Exam results and transactions must be stored in a relational database (PostgreSQL) with strict transaction guarantees to prevent data loss during network failures.

---
