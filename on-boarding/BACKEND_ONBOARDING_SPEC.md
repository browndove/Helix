# Helix Facility Pre-Onboarding — Backend Integration Spec

**Audience:** Backend developers  
**Source of truth (frontend):** `on-boarding/assets/data.js`, `on-boarding/assets/app.js`  
**Portal URL (static):** `/on-boarding/index.html`

This document describes what the pre-onboarding portal collects today, how submission is shaped, and what the backend must accept when you wire up persistence, file intake, and notifications.

---

## 1. Overview

The portal has **two layers**:

| Layer | What it is | Blocks submit? |
|-------|------------|----------------|
| **Step 1 — Facility checklist** | Six form sections (facility, contacts, staffing, services, staff systems) | **Yes** — all required visible fields must be complete |
| **Steps 2–6 — Data file uploads** | CSV/Excel attachments for Helix ingestion templates | **No** — optional at submit time; facility can attach later |

There is also a **Templates** view (read-only reference) showing exact column names for Departments, Units, Staff, Roles, and Patients — mirrored from `Helix App Required Templates.xlsx`.

**Prototype today:** No server. Answers and upload *metadata* persist in `localStorage` (`helix.preonboarding.v1`). Submit downloads a JSON file. **File bytes are not uploaded** — only filename, size, validation result, and timestamps are stored in the browser.

---

## 2. Portal flow (steps)

### Step 1 — Facility checklist (`portal_phase: "checklist"`)

Six sections, in order:

1. Facility Information  
2. Primary Contact Person  
3. Secondary Contact *(entire section optional)*  
4. Staffing  
5. Services & Infrastructure  
6. Staff Systems & Directory  

After the last section, the user can open **Review** and **Submit** (100% of required Step 1 fields).

### Steps 2–6 — Template file uploads

Accessed via the top step bar, sidebar upload buttons, landing-page links, or **Next** from Step 1 (or from Review). No email gate — upload steps are reachable anytime.

| Step | `uploadKey` | Template | Label |
|------|-------------|----------|--------|
| 2 | `departments` | Departments | Departments file |
| 3 | `units` | Units | Units file |
| 4 | `staff` | Staff | **Staff file** |
| 5 | `roles` | Roles | Roles file |
| 6 | `patients` | Patients | **Patients file** |

Navigation between upload steps uses **Previous stage** / **Next stage** (not tabs in the top rail — only Step 1 appears in the step rail).

**Upload rules (UI):**

- Accepts `.csv`, `.xlsx`, `.xls` (and generic spreadsheet MIME types).  
- **CSV:** first row is validated against template column names (exact spelling, order, count).  
- **Excel:** accepted but header check is deferred (`validation.ok: null`); message says Helix validates on intake.  
- Replacing a file overwrites prior metadata for that `uploadKey`.  
- Uploads do **not** block Step 1 submit.

---

## 3. Step 1 — Field reference

### Field types

| `type` | Storage in `answers` | Notes |
|--------|----------------------|--------|
| `text` | string | Trimmed non-empty for “answered” |
| `email` | string | Must match basic email regex on submit path |
| `number` | string or number in UI | Stored as user input; empty string = unanswered |
| `textarea` | string | |
| `select` | string | One of `options` |
| `yesno` | `"Yes"` or `"No"` | Segmented control |
| `phone-intl` | digits only in `answers[key]`; ISO in `answers[key + "_iso"]` | See §5 |

### Conditional fields

Only shown (and required when visible) when the condition matches:

| Field | Shown when |
|-------|------------|
| `total_it_staff` | `has_it_team` === `"Yes"` |
| `total_inpatient_beds` | `has_inpatient_wards` === `"Yes"` |

### Section: Facility Information (`id: facility`)

| Key | Label | Required | Type |
|-----|-------|----------|------|
| `facility_name` | Facility Name | yes | text |
| `facility_type` | Facility Type | yes | select — see §7 |
| `facility_region` | Region | yes | select — Ghana regions (§7) |
| `facility_city` | City / Town | yes | text |
| `facility_address` | Facility Address | yes | textarea |
| `facility_email` | Facility Email Address | yes | email |
| `facility_phone` | Facility Phone Number | yes | phone-intl |

### Section: Primary Contact (`id: primary_contact`)

| Key | Label | Required | Type |
|-----|-------|----------|------|
| `primary_name` | Name of Primary Contact Person | yes | text |
| `primary_phone` | Primary Contact's Phone Number | yes | phone-intl |
| `primary_email` | Primary Contact's Email Address | yes | email |

### Section: Secondary Contact (`id: secondary_contact`) — **optional section**

| Key | Label | Required | Type |
|-----|-------|----------|------|
| `secondary_name` | Name of Secondary Contact | no | text |
| `secondary_phone` | Secondary Contact Phone Number | no | phone-intl |
| `secondary_email` | Secondary Contact Email Address | no | email |

### Section: Staffing (`id: staffing`)

| Key | Label | Required | Type |
|-----|-------|----------|------|
| `total_employees` | Total Number of Employees | yes | number |
| `total_clinical_staff` | Total Number of Clinical Staff | yes | number |
| `total_nonclinical_staff` | Total Number of Non-Clinical / Admin Staff | yes | number |
| `has_it_team` | Does the Facility Have an IT Team? | yes | yesno |
| `total_it_staff` | Total Number of IT Staff | yes* | number — *only if `has_it_team` is Yes |

### Section: Services & Infrastructure (`id: services`)

| Key | Label | Required | Type |
|-----|-------|----------|------|
| `has_emergency` | Does the Facility Have an Emergency Department? | yes | yesno |
| `has_inpatient_wards` | Does the Facility Have Inpatient Wards? | yes | yesno |
| `total_inpatient_beds` | Total Number of Inpatient Beds | yes* | number — *only if `has_inpatient_wards` is Yes |
| `has_ambulance` | Does the Facility Have Ambulance / Transfer Coordination? | yes | yesno |
| `has_medical_director` | Does the Facility Have a Medical Director? | yes | yesno |

### Section: Staff Systems & Directory (`id: staff_systems`)

| Key | Label | Required | Type |
|-----|-------|----------|------|
| `staff_has_id` | Do Staff Have Official Staff IDs? | yes | yesno |
| `staff_has_work_email` | Do All Staff Have a Designated Work Email Address? | yes | yesno |
| `staff_uses_personal_email` | Do All Staff Mainly Use Personal Email Addresses? | yes | yesno |
| `has_employee_directory` | Does the Facility Have an Employee Directory? | yes | yesno |
| `staff_list_by_department` | Is There a List of Staff by Departments? | yes | yesno |
| `staff_list_by_role` | Is There a List of Staff by Roles? | yes | yesno |

---

## 4. Steps 2–6 — Template schemas (ingestion)

**Global rules for all templates:**

- One row per record.  
- Column headers must match **exactly** (Helix reads headers verbatim).  
- Multiple values in one cell: semicolon-separated (`;`).  
- Dates: `YYYY-MM-DD` (e.g. patient `dob`).  
- `department` (and related location fields) must match names used on the **Departments** sheet.  
- `building_block` / `floor` should be consistent between **Departments** and **Units**.

### Step 2 — Departments (`uploadKey: departments`)

| Column | Required |
|--------|----------|
| `building_block` | yes |
| `department` | yes |
| `department_description` | no |
| `subspecialty` | no |
| `subspecialty_description` | no |
| `floor` | yes |
| `ward_list` | yes — semicolon-separated ward names |

### Step 3 — Units (`uploadKey: units`)

| Column | Required |
|--------|----------|
| `building_block` | yes — must match Departments |
| `unit` | yes |
| `floor` | no |

### Step 4 — Staff (`uploadKey: staff`) ⭐

**One row per staff member.** Department must exist on Departments sheet.

| Column | Required | Notes |
|--------|----------|--------|
| `email` | yes | Account email |
| `first_name` | yes | |
| `last_name` | yes | |
| `job_title` | no | May differ from app role |
| `rank` | no | e.g. Consultant |
| `middle_name` | no | |
| `phone` | yes | International format, e.g. `233209182633` |
| `gender` | yes | e.g. Male, Female, Other — be consistent |
| `department` | yes | Must match Departments.`department` |
| `subspecialty` | no | |
| `patient_access` | yes | **`Yes` or `No`** |
| `employee_id` | yes | Unique per staff member |
| `highest_qualifications` | yes | e.g. MBChB; use `Other` if none apply |

**Example row (from schema):**

```text
dr.kwame.mensah@gmail.com,Kwame,Mensah,Physician,Consultant,,233209182633,Male,Medicine,Cardiology,Yes,EMP-1001,MBChB
```

### Step 5 — Roles (`uploadKey: roles`)

Operational roles (workflow/communication), not just HR job titles.

| Column | Required | Notes |
|--------|----------|--------|
| `role_name` | yes | |
| `role_description` | no | |
| `department` | yes | Must match Departments |
| `subspecialty` | no | |
| `priority` | yes | `Critical` or `Standard` |
| `restricted_signin` | yes | `Yes` or `No` |
| `permitted_signin_emails` | no* | *Required when `restricted_signin` is Yes; semicolon-separated emails |
| `external_communication` | yes | `Yes` or `No` |
| `escalation` | no | Next role(s), semicolon-separated |

### Step 6 — Patients (`uploadKey: patients`) ⭐

**One row per patient.** Location fields must align with Departments structure.

| Column | Required | Notes |
|--------|----------|--------|
| `first_name` | yes | |
| `last_name` | yes | |
| `middle_name` | no | |
| `dob` | yes | `YYYY-MM-DD` |
| `medical_record_number` | yes | Unique MRN / hospital number |
| `gender` | yes | Consistent values |
| `department` | yes | Must match Departments |
| `subspecialty` | no | |
| `floor` | yes | Same convention as Departments |
| `ward` | yes | Should match ward names from Departments where possible |
| `bed` | no | If facility tracks beds |

**Example row (from schema):**

```text
Ama,Mensah,,1985-03-12,MRN-BULK-FULL-001,Female,Surgery,Neurosurgery,Level 3,Surgical Ward A,
```

---

## 5. Phone numbers

**In browser state (`answers`):**

- `facility_phone`, `primary_phone`, `secondary_phone` → **digits only** (national significant number).  
- `facility_phone_iso`, `primary_phone_iso`, `secondary_phone_iso` → ISO-3166 alpha-2 (e.g. `GH`).

**In submission JSON (`buildSubmissionPayload`):**

- Phone fields become `"<dial_code> <digits>"` e.g. `"+233 209182633"`.  
- Companion field `facility_phone_country`, `primary_phone_country`, etc. (ISO code) — note: internal draft used `_iso` suffix; export uses `_country`.

**Validation:** Per-country max national length from `COUNTRIES` in `data.js`; picker uses flagcdn + dial codes.

---

## 6. Submission JSON payload

Produced on **Submit** (and **Export as JSON**). Filename: `{facility-slug}-preonboarding.json`.

```jsonc
{
  "kind": "helix.facility_preonboarding",
  "schema_version": 3,
  "created_at": "ISO-8601",
  "updated_at": "ISO-8601",
  "submitted": true,
  "submitted_at": "ISO-8601",
  "portal_phase": "checklist | departments | units | staff | roles | patients",
  "answers": {
    "facility_name": "…",
    "facility_phone": "+233 …",
    "facility_phone_country": "GH",
    "has_it_team": "Yes",
    "total_it_staff": "12"
    // …all visible fields from ALL_FIELDS
  },
  "uploads": {
    "departments": null,
    "units": null,
    "staff": {
      "fileName": "staff.csv",
      "size": 12345,
      "lastModified": 1710000000000,
      "savedAt": "ISO-8601",
      "validation": { "ok": true, "message": "First row matches the Helix template headers." }
    },
    "roles": null,
    "patients": { /* same shape */ }
  }
}
```

**Backend should:**

1. Accept `POST` (or your chosen method) with this structure (or a normalized derivative).  
2. Persist `answers` as the facility pre-onboarding record.  
3. For each non-null `uploads[key]`, accept a **multipart file upload** keyed by `uploadKey` (backend must implement — prototype does not send bytes).  
4. Re-run CSV header validation server-side for `.csv` files.  
5. Queue ingestion pipelines: Departments → Units → Staff → Roles → Patients (order matters for FK-style references by name).  
6. Send notification to Helix onboarding team (email/Slack) with facility name, primary contact, and submission id.

---

## 7. Reference enumerations

### `facility_type` options

Teaching Hospital, Regional Hospital, District Hospital, Municipal Hospital, Polyclinic, Health Centre, CHPS Compound, Specialist Centre / Clinic, Private Hospital, Private Clinic, Diagnostic / Imaging Centre, Maternity Home, Dental Clinic, Eye Clinic, Other

### `facility_region` (Ghana)

Ahafo, Ashanti, Bono, Bono East, Central, Eastern, Greater Accra, North East, Northern, Oti, Savannah, Upper East, Upper West, Volta, Western, Western North

### Yes/No fields

Always the strings **`"Yes"`** or **`"No"`** (not booleans).

---

## 8. Things to note for backend implementation

| Topic | Detail |
|-------|--------|
| **No API yet** | Wire endpoints; frontend will need `fetch` on submit + multipart uploads for Steps 2–6. |
| **Schema version** | `meta.version` / `schema_version` is **3** in current `app.js` (README example still says 2 — use live code). |
| **Submit gate** | Only Step 1 required fields; `submitted: true` can be set even if `uploads` are all null. |
| **Step navigation** | Steps 2–6 are not blocked by `facility_email`; it remains required only for Step 1 submit. |
| **Secondary contact** | Section marked `optional: true`; all fields non-required. |
| **Conditional required** | `total_it_staff`, `total_inpatient_beds` required only when parent yesno is Yes. |
| **Staff vs Roles** | Staff sheet = people roster; Roles sheet = operational roles, escalation, sign-in restrictions. |
| **patient_access** | On Staff rows only — whether that staff member gets patient access in Helix. |
| **Cross-sheet integrity** | Validate `department`, `floor`, `ward` against Departments upload before ingesting Staff/Patients. |
| **MRN uniqueness** | Enforce unique `medical_record_number` per facility on Patients ingest. |
| **employee_id uniqueness** | Enforce unique `employee_id` per facility on Staff ingest. |
| **PHI** | Patient file contains demographics and location — treat as PHI in transit and at rest. |
| **Idempotency** | Support resubmit (`Resubmit` in UI) — use `updated_at` / versioning. |
| **Draft resume** | Today: same browser only. Backend may issue `draft_token` or tie to `facility_email` for cross-device resume. |

---

## 9. Suggested API sketch (not implemented)

```
POST /api/v1/pre-onboarding
  Body: { kind, schema_version, answers, uploads metadata }
  Response: { id, status }

POST /api/v1/pre-onboarding/:id/files/:uploadKey
  multipart: file (csv|xlsx)
  Response: { validation, stored_path }

POST /api/v1/pre-onboarding/:id/submit
  Response: { submitted_at, onboarding_ticket_id }
```

---

## 10. File map

| File | Role |
|------|------|
| `assets/data.js` | `SECTIONS`, `TEMPLATES`, `DATA_UPLOAD_STEPS`, `COUNTRIES` |
| `assets/app.js` | Validation, localStorage, JSON export, CSV header check |
| `index.html` | Portal shell |
| `BACKEND_ONBOARDING_SPEC.md` | This document |

---

*Generated from the Helix pre-onboarding portal codebase. Update this doc when `data.js` or submission shape changes.*
