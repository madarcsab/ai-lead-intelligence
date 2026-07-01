# Technical Architecture & Cost Breakdown (S2W Media)

This document outlines the detailed system architecture, API integration parameters, email verification mechanics, voice dialing pipeline, client template mapping, and monthly operating cost projections for **LeadFlow AI** tailored to **S2W Media**.

---

## 1. System Architecture & Request Flow

The system orchestrates tasks across API directories, web crawlers, verification handshakes, and external calling APIs:

```
                          [ User Creates Campaign ]
                       (Inputs brief, LLM suggests tags)
                                     │
                                     ▼
                        [ Dual-Phase API Sourcing ]
                     (Phase 1: Company -> Phase 2: Contact)
                                     │
                                     ▼
                         [ S2W Data Deduplication ]
                     (Checks against historical database)
                                     │
                                     ▼
                       [ Enrichment & Discovery Loop ]
                    (Website Firecrawl & LinkedIn Playwright)
                                     │
                  ┌──────────────────┴──────────────────┐
                  ▼                                     ▼
       [ Email verification ]                 [ Phone Verification ]
      (MX DNS & SMTP socket tests)           (Outbound Vapi / Bland.ai call)
                  │                                     │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                          [ AI QA Heuristics & LLM ]
                         (GPT-4o mini fit-scoring)
                                     │
                   ┌─────────────────┴─────────────────┐
                   ▼                                   ▼
          [ Match: >= 85 Score ]              [ 70 - 84 Score / Catch-All ]
            (Ready Status)                      (Flagged for Review)
                   │                                   │
                   │                                   ▼
                   │                        [ S2W QA Review Desk ]
                   │                        (Manual correction/approve)
                   │                                   │
                   └─────────────────┬─────────────────┘
                                     │
                                     ▼
                        [ Client Template Engine ]
                      (Column-mapping & CSV format)
                                     │
                                     ▼
                         [ Customer Success Delivery ]
```

---

## 2. API Sourcing Strategy (Querying Companies vs. Individuals)

To ensure S2W Media doesn't waste API credits on unqualified targets, the platform implements a **Dual-Phase Sourcing Process**:

### Phase 1: Company Search (Querying Companies)
The system first queries the **Apollo Company Search API** (`POST /v1/organizations/search`) and **ZoomInfo Company Search API** to filter companies matching the Campaign Brief.
* **Data Fields Retrieved & Checked**:
  * `company_name` & `website_domain` (for website scraping).
  * `estimated_headcount` & `industry_tags` (to verify ICP bounds).
  * `funding_total` & `hq_country` / `hq_state` (for geographic verification).
  * `technologies_used` (e.g. HubSpot, Shopify, WordPress).

### Phase 2: Contact Search (Querying Individuals)
For all companies that pass Phase 1, the system queries the **Apollo People Search API** (`POST /v1/people/search`) and **ZoomInfo Contact API** targeting matching decision-maker roles.
* **Data Fields Retrieved & Checked**:
  * `first_name` & `last_name` (clean capitalization).
  * `exact_title` (e.g. "Vice President of Sales Operations").
  * `corporate_email` & `email_status` (api-verified/catch-all).
  * `direct_dial` & `corporate_phone` (forwarded to the voice dialer).
  * `contact_linkedin_url` (for active profiling).
  * `seniority_level` & `department` (for heuristic checks).

---

## 3. Double-Pass Verification (Email & Voice)

To automate **S2W Media's Contact Verification & Qualification (Stage 2)**, LeadFlow AI combines technical email tests with AI-driven voice calls:

### A. Double-Pass Email Validation
1. **DNS & MX Record Check**: The backend extracts the domain and performs an asynchronous DNS query to verify that valid MX (Mail Exchange) records exist.
2. **SMTP Socket Handshake ($0.00)**: The engine connects directly to the recipient's mail server on Port 25. It runs the SMTP sequence (`HELO` -> `MAIL FROM` -> `RCPT TO`) and parses the response. 
   * **250 OK**: Active mailbox (Approved).
   * **550/551**: Invalid mailbox (Discarded).
   * **Catch-All**: If the server accepts any dummy email, the domain is flagged as "Catch-All" and sent to the S2W QA Review Desk.

### B. AI Voice Verification Call (Vapi / Bland.ai Integration)
For campaigns requiring strict phone-verified employment status:
1. The backend triggers a webhook to **Vapi** or **Bland.ai** with the contact direct line/corporate phone and details:
   ```json
   {
     "phone_number": "+1234567890",
     "contact_name": "Sarah Jenkins",
     "company_name": "Acme Corp",
     "target_title": "VP of Customer Success"
   }
   ```
2. The AI voice agent calls the number, speaks in a natural voice, navigates gatekeepers, and asks to verify if the contact works there in the specified role:
   * *AI*: *"Hi, I was looking to connect with Sarah Jenkins in Customer Success, is she still active with the team?"*
   * *Office*: *"Yes, she is, let me transfer you."* OR *"No, she left last month."*
3. The call transcription is analyzed by the FastAPI backend. If confirmed active, status is updated to `Phone Verified`. If they left, status is updated to `Disqualified`.

---

## 4. Sourcing & Scraping Waterfall (Fallback for Incomplete Data)

If the API returns complete, pre-verified contact info (including verified business email), the lead bypasses scraping. If the email is missing, the record is stale, or validation indicates a "Catch-All" domain, the **Enrichment Waterfall** begins:

1. **Website Scraper (Firecrawl)**: Crawls target website homepage and `/about` pages to verify B2B vs. B2C.
2. **LinkedIn Company & Contact Verification**: A Playwright script opens the contact's LinkedIn page to check if they are still active and extract bio text.
3. **Pattern Email Generator**: Generates email permutations using the contact's name and domain (e.g. `first.last@domain.com`) and tests them via the SMTP verification engine.
4. **Secondary API Cascades**: Checks secondary APIs (e.g., Hunter.io, Lusha, or Dropcontact) as a fallback layer.

---

## 5. The S2W Campaign QA LLM Prompt

LeadFlow AI combines the API data, website text, and scraped LinkedIn profile details into a single prompt context, instructing the LLM to output structured JSON:

```python
SYSTEM_PROMPT = """
You are the S2W Media QA Agent. Your task is to evaluate if a contact lead complies with target campaign brief parameters.

### Target Campaign Parameters:
- Target Business Type: {campaign_business_type}
- Target Seniority & Title: {campaign_target_titles}
- Target Tech Stack: {campaign_tech_stack}
- Required Geography: {campaign_geography}
- Mandatory ICP Keywords: {campaign_positive_keywords}
- Strict Exclusion Keywords: {campaign_negative_keywords}

### Lead Profile Data:
- Sourced Title: {lead_title}
- Seniority & Department: {lead_seniority} / {lead_department}
- Sourced LinkedIn Bio: {lead_linkedin_bio}
- Company Name: {company_name}
- Sourced Company Size: {company_size}
- Company Tech Stack: {company_tech_stack}
- Scraped Company Website Context:
\"\"\"
{scraped_website_content}
\"\"\"
- Scraped LinkedIn Company Description:
\"\"\"
{scraped_linkedin_company_content}
\"\"\"

### Rules:
1. Evaluate Role Fit: Does the contact's title and bio indicate they own decisions for the target department? (e.g., VP Customer Success matches, VP Customer Support does not).
2. Evaluate Company Fit: Compare the scraped website context against the target business model. Verify they do not match the exclusion keywords.
3. Tech Stack Verification: Does the company use the target tech stack?
4. Geography & Size Verification: Confirm the size and HQ location are within bounds.

### Response JSON Format:
Provide your evaluation in the following JSON format. Do not add any text before or after the JSON.
{
  "fit_score": 95, // Integer 0 to 100
  "fit_status": "APPROVED" | "AMBIGUOUS" | "DISQUALIFIED", // APPROVED if score >= 85, AMBIGUOUS if 70-84, DISQUALIFIED if < 70
  "reasoning": "A concise sentence explaining your evaluation based on the lead title, bio, and company model.",
  "standardized_title": "Cleaned, standardized title format for reporting (e.g., Director of Customer Success)"
}
"""
```

---

## 6. S2W Client Delivery Template Mapper

S2W Media works with multiple clients, each having a unique delivery template:
* **The Mapper**: The CS team uploads the client's blank CSV/Excel sheet.
* **Column Matching**: The UI lists client columns and allows matching them to database properties:
  * `Client Column: Name` -> `LeadFlow Property: first_name + last_name`
  * `Client Column: Email` -> `LeadFlow Property: business_email`
  * `Client Column: Date Verified` -> `LeadFlow Property: current_date`
* **Auto-Export**: The system structures approved leads into the client's exact column layout and format, ready for immediate delivery.

---

## 7. Ongoing Monthly Cost Projections

Assuming an operational volume of **500 leads sourced and enriched per day** (15,000 tasks/month):

| Infrastructure Component | Cost Details | Monthly Cost (USD) |
| :--- | :--- | :--- |
| **FastAPI Backend Hosting** | Hosted on Railway (Starter Plan, 512MB RAM) | $7.00 |
| **Database Storage** | Supabase PostgreSQL (Free/Hobby Tier) | $0.00 |
| **Email Verification** | Local SMTP Socket Handshake validation | $0.00 |
| **Router LLM API** | GPT-4o mini (15,000 runs, ~2k tokens/run) | $4.50 |
| **QA/Copywriter LLM API** | Claude 3.5 Sonnet (for ambiguous exceptions, 1.5k tasks/month) | $18.00 |
| **Sourcing APIs (Apollo/ZoomInfo)**| External APIs (using your company accounts) | $0.00 (External) |
| **AI Phone verification Calls** | Vapi / Bland.ai API calls (approx. 500 calls/month at $0.08/min) | $12.00 |
| **TOTAL RUNNING COSTS** | | **~$41.50 / month** |
