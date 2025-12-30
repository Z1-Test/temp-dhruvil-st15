# 📄 Feature Specification — Order History & Tracking

## 0. Metadata

```yaml
feature_name: "Order History & Tracking"
bounded_context: "checkout"
status: "approved"
owner: "Checkout Team"
```

## 1. Overview

Provides customers visibility into past orders and real-time tracking of current shipments, building trust and reducing support inquiries.

## 2. User Problem

Customers need to track orders and reference past purchases.

## 3. Goals

**User Experience:** Easy order lookup, real-time tracking  
**Business:** Reduce "where is my order" support tickets

## 4. Non-Goals

Download invoices, reorder from history, order modification post-payment, returns/refunds UI

## 5. Functional Scope

- Order history page (all user orders, sorted by date)
- Order detail view (line items, pricing, status)
- Real-time order status (Pending → Paid → Shipped → Delivered)
- Tracking number display
- Carrier tracking link (Shiprocket integration)
- Order cancellation (before dispatch only)

## 6. Dependencies

F10 (Payment creates orders), F12 (Fulfillment provides tracking), Shiprocket tracking API

## 7. User Stories

**Scenario:** View Order History

**Given** I have placed 3 orders  
**When** I navigate to "My Orders"  
**Then** I see all 3 orders sorted by date (recent first)  
**And** each shows order number, date, total, status

**Scenario:** Track Shipment

**Given** my order was shipped  
**When** I view order details  
**Then** I see tracking number  
**And** I see "Track Package" link  
**When** I click it  
**Then** I'm taken to carrier tracking page

**Scenario:** Cancel Order

**Given** order status is PAID (not yet shipped)  
**When** I click "Cancel Order"  
**Then** I see confirmation dialog  
**When** I confirm  
**Then** order status updates to CANCELLED  
**And** refund is initiated via Cashfree

## 8. Edge Cases

- No orders yet: Show empty state "No orders yet - Start shopping!"
- Order cancellation only before SHIPPED status

## 9. Implementation Tasks

- [ ] T01 — Build order history list page
- [ ] T02 — Create order detail view with line items, pricing, status
- [ ] T03 — Integrate real-time status updates from Fulfillment events
- [ ] T04 — Display tracking number and carrier link
- [ ] T05 — Implement order cancellation with refund initiation
- [ ] T06 [Rollout] — Feature flag

## 10. Acceptance Criteria

- [ ] AC1 — Order history displays all user orders with correct status
- [ ] AC2 — Order details show complete information
- [ ] AC3 — Tracking numbers display with working carrier links
- [ ] AC4 — Order cancellation works for PAID status only
- [ ] AC5 — Real-time status updates within 5s of fulfillment events

## 11. Rollout & Risk

**Flag:** `feature_fe_checkout_fl_011_order_history_tracking_enabled`  
**Rollout:** 0% → 50% → 100% over 5 days  
**Risk:** Low  
**Exit:** 14 days at 100%, tracking link accuracy >98%

## 12. History & Status

- **Status:** Approved  
- **Epic:** Epic 5 — Fulfillment & Communication  
- **Dependencies:** F10, F12
