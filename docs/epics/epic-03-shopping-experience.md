# 🎯 Epic 3: Shopping Experience

## Overview

Enable shoppers to collect items for purchase, save favorites, and manage shipping addresses.

## Business Value

Reduces cart abandonment, enables multi-item purchases, and provides conveniences that drive repeat purchases.

## Features Included

- **Feature 6:** Shopping Cart Management
- **Feature 7:** Wishlist Management
- **Feature 8:** Address Management

## Scope

This epic delivers:
- Persistent shopping cart with real-time updates
- Wishlist for saving products across sessions
- Multiple shipping address management

## Dependencies

**Requires Epic 1 and Epic 2:**
- F1 (Authentication) for user cart/wishlist/address persistence
- F3 (Product Detail) for add-to-cart/wishlist entry points
- F5 (Inventory) for stock validation

## Execution Order

**All features in this epic can be developed in parallel** (Phase 3):

8. Feature 6 (Cart) - depends on F1, F3, F5
9. Feature 7 (Wishlist) - depends on F1, F3
10. Feature 8 (Address) - depends on F1

## Success Criteria

- [ ] Cart persists across sessions for authenticated users
- [ ] Guest cart merges correctly on login
- [ ] Wishlist items move to cart with stock validation
- [ ] Address validation prevents invalid Indian addresses
- [ ] Cart operations complete in <500ms
- [ ] Wishlist usage >20% of users

## Risks

- **Medium:** Cart sync issues across devices
- **Low:** Guest-to-user cart merge edge cases
- **Low:** Address validation false rejections

## Timeline Estimate

**Duration:** 2-3 weeks (parallel development after Epic 2)

## Rollout Strategy

Progressive rollout for all features. Cart is highest priority (required for checkout).

---

**Epic Status:** Approved  
**Last Updated:** 2025-12-30
