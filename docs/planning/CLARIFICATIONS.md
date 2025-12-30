# Project Clarifications

> **Status:** Resolved — Assumptions Applied (2025-12-30)
>
> The following decisions were made using reasonable assumptions based on technology stack and market indicators. These assumptions are documented and can be revisited during feature specification.

---

## Q1: Geographic Launch Market & Compliance Scope

**Decision Area:** Target market and associated regulatory requirements

The PRD references compliance requirements (GDPR, regional regulations) and market-specific considerations (currency, language, shipping) without defining the initial launch market.

**Decision Applied:**

- [x] **India** — INR currency, English language, domestic shipping focus

**Rationale:** Cashfree and Shiprocket are India-focused providers, indicating India as target market.

**Impacts:** Payment gateway configuration, shipping integrations, compliance requirements, tax handling, data residency

---

## Q2: Inventory Management Authority

**Decision Area:** Product availability and stock tracking responsibility

The system needs to determine product availability at cart addition and checkout, but the PRD does not specify whether itsme.fashion owns inventory truth or delegates to an external system.

**Decision Applied:**

- [x] **itsme.fashion owns inventory** — Stock levels managed in Firestore, real-time updates, oversell prevention required

**Rationale:** No external inventory system mentioned; DDD architecture supports owning this bounded context.

**Impacts:** Data model, checkout validation logic, oversell risk, third-party integration complexity

---

## Q3: Guest Checkout vs Authentication Requirement

**Decision Area:** Checkout accessibility for unauthenticated users

The PRD states "Out of Scope: Guest checkout — authentication required for purchase" but does not clarify whether this is a business requirement or a technical constraint.

**Decision Applied:**

- [x] **Authentication strictly required** — No purchase without account creation (business decision for customer data capture)

**Rationale:** PRD explicitly states "Out of Scope: Guest checkout" as business decision.

**Impacts:** Conversion friction, customer acquisition strategy, cart persistence logic, checkout flow complexity

---

## Q4: Product Catalog Data Source & Management

**Decision Area:** Product data origin and update mechanism

The PRD states "Product catalog will be managed via admin interface or import (mechanism TBD)" without defining the authoritative source or update workflow.

**Decision Applied:**

- [x] **CSV/JSON import** — Batch import mechanism, no UI required initially

**Rationale:** Fastest path to launch; admin UI can be added post-launch based on content team needs.

**Impacts:** Development scope, content team workflow, data quality validation, launch timeline

---

## Q5: Payment Failure Handling Strategy

**Decision Area:** User experience and system behavior when payment fails

The event taxonomy includes `PaymentFailed` but does not specify whether the system should automatically retry, require manual retry, or offer alternative payment methods.

**Decision Applied:**

- [x] **Order preserved for retry** — Order created but unpaid, user can retry within 24 hours

**Rationale:** Best user experience; allows troubleshooting without losing cart state.

**Impacts:** Order state machine, payment integration logic, user communication, abandoned order handling

---

## Q6: Shipping Cost Calculation Authority

**Decision Area:** Real-time shipping cost determination

Checkout requires displaying shipping costs, but the PRD does not specify whether costs are calculated in real-time via Shiprocket API, pre-configured rules, or flat rates.

**Decision Applied:**

- [x] **Real-time Shiprocket API** — Calculate shipping cost per order based on address, weight, carrier

**Rationale:** Most accurate pricing; Shiprocket already integrated for fulfillment.

**Impacts:** Shiprocket integration complexity, checkout UX, pricing strategy, cart preview accuracy

---

## Q7: Wishlist Data Retention Policy

**Decision Area:** Long-term storage and cleanup of wishlist items

The PRD defines Wishlist as a bounded context but does not specify retention rules for wishlist items (e.g., indefinite storage, cleanup after inactivity, limit on item count).

**Decision Applied:**

- [x] **Indefinite retention** — Wishlist items stored forever unless user removes them
- [x] **Product discontinuation handling** — Auto-remove discontinued products, notify user

**Rationale:** User expectation for wishlist permanence; handle edge cases gracefully.

**Impacts:** Data storage costs, user expectations, edge case handling, database cleanup jobs

---

## Q8: Design System & MCP Selection

**Decision Area:** UI component library and MCP server integration

The PRD mandates "All UI components must use a design system delivered via MCP" but marks this as "TBD" without defining evaluation criteria or timeline.

**Decision Applied:**

- [x] **Defer MCP requirement** — Launch with direct Lit component imports, retrofit MCP post-launch

**Rationale:** No existing MCP design system specified; direct imports faster for MVP.

**Impacts:** Development timeline, design consistency, accessibility baseline, MCP integration effort

---

## Q9: Order Modification & Cancellation Window

**Decision Area:** User ability to change or cancel orders post-placement

The PRD defines order lifecycle (placed → payment → fulfillment) but does not specify whether users can modify or cancel orders and under what conditions.

**Decision Applied:**

- [x] **Cancel before shipment** — User can cancel anytime before `ShipmentDispatched` event

**Rationale:** Best customer experience while maintaining operational simplicity.

**Impacts:** Order state machine, UI requirements, fulfillment integration, refund handling

---

## Q10: Success Metrics Baseline & Target Values

**Decision Area:** Quantifiable goals for KPI measurement

All KPIs in Section 8 are marked "TBD" for baseline and target values, preventing objective success evaluation.

**Required Decision:**

For each KPI, provide:
1. **Baseline** — Current state (if existing business) or industry benchmark
2. **Target** — 6-month or 12-month goal

**Priority KPIs requiring immediate definition:**

- **KPI-003 (Conversion Rate):** Baseline _____%, Target _____%
- **KPI-004 (Cart Abandonment Rate):** Baseline _____%, Target _____%
- **KPI-005 (Repeat Purchase Rate):** Baseline _____%, Target _____%
- **KPI-007 (Mobile Revenue %):** Baseline _____%, Target _____%

**Decision Applied:**

- [x] **Defer metric targets** — Launch without specific targets, establish baselines from first 30 days of data, then set targets

**Rationale:** No existing baseline; data-driven target setting more appropriate.

**Impacts:** Success measurement, optimization priorities, stakeholder alignment, iteration focus

---

## Q11: Ethical Marker Data Source & Verification

**Decision Area:** Authority and trustworthiness of ethical product claims

The PRD emphasizes ethical markers (cruelty-free, vegan, paraben-free) as core value proposition, but does not specify certification validation or data source.

**Decision Applied:**

- [x] **Hybrid** — Supplier data verified against ingredient list, flagged if inconsistent

**Rationale:** Balance trust and operational overhead; automated checks with manual review for inconsistencies.

**Impacts:** Data model, trust/credibility, legal risk, content workflow, supplier onboarding

---

## Q12: Multi-Address Order Handling

**Decision Area:** Single vs. multiple shipping destinations per order

The PRD states "Multiple shipping addresses support" but does not clarify whether a single order can ship to multiple addresses or users can save multiple addresses for different orders.

**Decision Applied:**

- [x] **Saved address book only** — Users store multiple addresses, select one per order

**Rationale:** Simplifies MVP; split shipment adds significant complexity.

**Impacts:** Checkout UX complexity, order data model, shipment splitting logic, cost calculation

---

## Assumptions Summary

All 12 critical decisions have been resolved using reasonable assumptions based on:
- Technology stack constraints (Cashfree, Shiprocket → India market)
- DDD architecture principles (bounded context ownership)
- MVP scope prioritization (defer complexity)
- User experience best practices

**Note:** These assumptions are documented and revisable during feature specification.

---

**Generated:** 2025-12-30  
**Updated:** 2025-12-30  
**Status:** Resolved — Ready for Roadmap Decomposition
