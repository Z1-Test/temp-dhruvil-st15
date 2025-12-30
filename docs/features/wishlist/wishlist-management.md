# 📄 Feature Specification — Wishlist Management

---

## 0. Metadata

```yaml
feature_name: "Wishlist Management"
bounded_context: "wishlist"
status: "approved"
owner: "Wishlist Team"
```

---

## 1. Overview

This feature enables authenticated shoppers to save products for later purchase, providing a persistent collection separate from the shopping cart. It supports product discovery, comparison, and purchase planning.

**What this feature enables:**
- Save products to wishlist for future consideration
- View all saved products on dedicated wishlist page
- Move wishlist items to cart when ready to purchase
- Remove products from wishlist
- Indefinite wishlist persistence

**Why it exists:**
- Users want to save interesting products without committing to purchase
- Enables shopping over multiple sessions
- Supports gift planning and product comparison workflows

**What meaningful change it introduces:**
- Extends shopping beyond single session
- Reduces cart abandonment by offering alternative to immediate purchase
- Enables long-term product consideration

---

## 2. User Problem

Shoppers who find interesting products but aren't ready to purchase immediately, or want to save items for comparison or future reference.

---

## 3. Goals

### User Experience Goals

- **Easy Saving**: One-click add to wishlist from any product
- **Persistent Storage**: Wishlist never expires
- **Quick Purchase**: Move to cart when ready to buy
- **Cross-Device Access**: Wishlist syncs across all devices

### Business / System Goals

- **Engagement**: Keep users returning to the platform
- **Conversion**: Convert wishlist items to purchases over time
- **Analytics**: Understand product interest patterns

---

## 4. Non-Goals

- Guest wishlists (requires authentication)
- Wishlist sharing or social features
- Price drop notifications
- Multiple wishlists per user
- Wishlist size limits

---

## 5. Functional Scope

**Core capabilities:**

- Add product to wishlist from product detail or listing pages
- View all wishlist items on dedicated page
- Remove items from wishlist
- Move items from wishlist to cart
- Handle discontinued products (auto-remove with notification)
- Wishlist icon toggle on product pages

**Expected behaviors:**

- Wishlist requires user authentication
- Items persist indefinitely in Firestore
- Discontinued products auto-removed on next wishlist view
- Move-to-cart validates stock availability

---

## 6. Dependencies & Assumptions

**Dependencies:**
- Feature 1 (Authentication) - wishlists require logged-in users
- Feature 3 (Product Detail) - provides wishlist add entry points
- Firestore Wishlist collection

**Assumptions:**
- Users understand wishlist vs cart distinction
- Unlimited wishlist size acceptable
- Single wishlist per user sufficient

---

## 7. User Stories & Experience Scenarios

### User Story 1 — Saving Products

**As an** authenticated shopper  
**I want** to save products to my wishlist  
**So that** I can consider them for future purchase

**Scenario 1.1** — Add to Wishlist

**Given** I'm logged in and viewing a product  
**When** I click the wishlist heart icon  
**Then** the product is added to my wishlist  
**And** the heart icon fills/highlights to show saved state  
**And** I see confirmation "Added to wishlist!"  
**And** I remain on the current page

**Scenario 1.2** — Wishlist Icon Toggle

**Given** a product is already in my wishlist  
**When** I view that product page  
**Then** the wishlist icon is highlighted/filled  
**When** I click it again  
**Then** the product is removed from wishlist  
**And** the icon returns to unhighlighted state

---

### User Story 2 — Managing Wishlist

**As a** user with saved products  
**I want** to review my wishlist  
**So that** I can decide what to purchase

**Scenario 2.1** — Viewing Wishlist

**Given** I have 5 products in my wishlist  
**When** I navigate to my wishlist page  
**Then** I see all 5 products displayed  
**And** each shows: image, name, price, availability status  
**And** I see "Move to Cart" and "Remove" buttons for each

**Scenario 2.2** — Move to Cart

**Given** I'm viewing my wishlist  
**When** I click "Move to Cart" on an in-stock item  
**Then** the item is added to my cart  
**And** stock availability is validated first  
**And** the item is removed from wishlist  
**And** I see confirmation "Moved to cart!"

**Scenario 2.3** — Discontinued Product Handling

**Given** one of my wishlist items was discontinued  
**When** I view my wishlist  
**Then** I see a notification "Some items are no longer available"  
**And** the discontinued item is highlighted  
**And** I can dismiss/remove it  
**And** it's auto-removed from Firestore

---

## 8. Edge Cases & Constraints

**Constraints:**
- Wishlist requires authentication (no guest wishlists)
- Items persist indefinitely unless manually removed or discontinued
- Move-to-cart blocked if item out of stock

---

## 9. Implementation Tasks (Execution Agent Checklist)

- [ ] **T01** — Create wishlist icon component with toggle state (add/remove)
- [ ] **T02** — Implement add-to-wishlist functionality from product pages
- [ ] **T03** — Build wishlist page displaying all saved items
- [ ] **T04** — Implement move-to-cart with stock validation
- [ ] **T05** — Handle discontinued product detection and removal
- [ ] **T06** — Integrate with Firestore Wishlist collection for persistence
- [ ] **T07** [Rollout] — Implement feature flag

---

## 10. Acceptance Criteria (Verifiable Outcomes)

- [ ] **AC1** — Authenticated users can add/remove products from wishlist with one click
- [ ] **AC2** — Wishlist page displays all saved items with current availability
- [ ] **AC3** — Move-to-cart validates stock and successfully adds to cart
- [ ] **AC4** — Wishlist persists across sessions and devices via Firestore
- [ ] **AC5** — Discontinued products are handled gracefully with user notification

---

## 11. Rollout & Risk

**Feature Flag:** `feature_fe_wishlist_fl_007_wishlist_management_enabled`

**Progressive Rollout:** 0% → 40% → 100% over 5 days

**Risks:**
- Low: User confusion between cart and wishlist (mitigation: clear labeling and behavior)

**Exit Criteria:** 14 days at 100%, wishlist usage >20% of users

**Temporary Flag:** Yes, will be removed after exit criteria met.

---

## 12. History & Status

- **Status:** Approved
- **Version:** 1.0.0
- **Last Updated:** 2025-12-30
- **Related Epics:** Epic 3 — Shopping Experience
- **Dependencies:** F1 (Authentication), F3 (Product Detail)
- **Dependent Features:** None

---

## Final Note

> This document defines **intent and experience** for wishlist management.
> Execution details are derived from it — never the other way around.
