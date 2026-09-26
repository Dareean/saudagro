# Product Requirements Document: Saudagro Platform Integrator (Phase 1 MVP)

## 1. Document Control

| Field | Value |
|---|---|
| **Product Name** | Saudagro — Social Agri-Food Intelligence & Trade Platform |
| **Document Version** | v0.1 (Draft) |
| **Date** | *[Insert date]* |
| **Author** | *[Insert author — Product/PIC name]* |
| **Status** | Draft — Pending stakeholder review |
| **Related Materials** | RANCANGAN INOVASI BISNIS SOSIAL: SAUDAGRO (Tab 1 & Tab 2) |

---

## 2. Executive Summary

Saudagro is a social-enterprise agri-food intelligence and trade platform designed to fix a broken supply chain in Central Sulawesi's egg farming value chain. Today, egg farmers (**peternak ayam petelur**) in and around Palu pay inflated prices for corn feed because it passes through multiple middlemen (**tengkulak**), while local corn farmers (**petani jagung**) lack a guaranteed, fairly-priced buyer for their harvest. At the same time, egg farmers struggle to secure stable, fairly-priced buyers for their daily egg production beyond volatile traditional markets.

The long-term vision for Saudagro is an ambitious, multi-sector circular economy platform spanning poultry, horticulture, fisheries, and spice commodities, with future upcycling of egg-shell waste, cracked eggs, and vegetable culls into calcium flour, liquid egg, and BSF maggot protein feed.

**This PRD scopes strictly to Phase 1 of the website MVP.** Phase 1 has one job: stand up a digital marketplace that runs two transactional flows reliably —

1. **Corn → Egg Farmer:** connecting corn farmers directly with egg farmers for feed procurement at a fair, transparent price.
2. **Egg Farmer → UMKM/Market:** connecting egg farmers with bakery/catering UMKM buyers for scheduled, fixed-price bulk egg purchases.

Everything related to upcycling (liquid egg, eggshell calcium flour, organic fertilizer, Maggot BSF, fisheries, cocoa/clove trade) is explicitly **out of scope** for this MVP and is documented as Phase 2/3 in Section 10.

---

## 3. Problem Statement & Target Audience

### 3.1 Problem Statement

**Feed cost inefficiency.** Egg farmers buy corn feed through a long middleman chain, inflating cost and creating inconsistent quality/supply. Meanwhile, corn farmers lack a guaranteed off-taker and are exposed to unfair pricing at harvest time.

**Sales instability for egg farmers.** Egg farmers face inconsistent demand and price volatility when selling to traditional markets or informal buyers, with no fixed-price contract mechanism to smooth out cash flow.

**Lack of buyer certainty for UMKM.** Bakery, catering, and culinary UMKMs need a stable, standardized supply of whole eggs but currently source through fragmented, unreliable channels with fluctuating prices.

**Trust deficit.** Farmers and buyers in the region are highly dependent on WhatsApp and personal relationships for trade; a digital platform must actively build trust (verified identity, transparent pricing, reliable transaction history) rather than assume it.

**Digital literacy variance.** Corn and egg farmers have a wide range of digital literacy. The platform interface must be simple, low-friction, and ideally complement (not fully replace) WhatsApp-based communication habits.

### 3.2 User Personas

#### Persona 1: Petani Jagung (Corn Farmer) — "Pak Jufri"
- **Profile:** 45 years old, smallholder corn farmer in a district outside Palu (e.g. Sigi, Donggala). Sells harvest seasonally.
- **Digital literacy:** Low–moderate. Owns a basic Android smartphone, primarily uses WhatsApp and voice calls. Uncomfortable with complex forms.
- **Motivations:** Wants a guaranteed buyer (off-taker) at harvest time and a fair price without going through a tengkulak who takes a large cut.
- **Pain points:** Price uncertainty, delayed or partial payment from middlemen, no visibility into buyer demand before planting/harvesting.
- **Needs from Saudagro:** Simple listing flow (ideally guided/assisted), clear and trustworthy pricing, fast and reliable payment confirmation.

#### Persona 2: Peternak Ayam Petelur (Egg Farmer) — "Bu Rahma"
- **Profile:** 38 years old, runs a mid-sized layer-hen farm near Palu. Buys feed regularly (weekly/bi-weekly) and sells eggs daily.
- **Digital literacy:** Moderate. Uses WhatsApp Business, basic e-commerce apps, and manages simple bookkeeping.
- **Motivations:** Lower and more predictable feed costs; a reliable, recurring buyer for daily egg output so unsold stock doesn't spoil or get dumped at low prices.
- **Pain points:** Feed price volatility, inconsistent feed quality, unsold egg stock at end of day, cash flow gaps between buying feed and getting paid for eggs.
- **Needs from Saudagro:** Dual-sided role — as a **buyer** of corn feed and a **seller** of whole eggs. Needs to browse/order feed and list/fulfill egg supply against B2B contracts.

#### Persona 3: UMKM Buyer (Bakery/Catering) — "Kak Dilla"
- **Profile:** 29 years old, owns a small bakery/catering business in Palu supplying local cafes and events.
- **Digital literacy:** Moderate–high. Comfortable with apps, online ordering, and digital payment.
- **Motivations:** Predictable, standardized-quality egg supply at a fixed price so she can plan production costs without daily price shocks.
- **Pain points:** Egg price spikes during high-demand seasons, inconsistent quality/freshness from ad-hoc suppliers, time lost sourcing eggs manually.
- **Needs from Saudagro:** A subscription/contract mechanism to lock in supply volume and price with a specific egg farmer or pool of farmers.

---

## 4. Goals, Non-Goals, and OKRs

### 4.1 Business Goals (MVP Success Criteria)

1. **Prove the matchmaking loop works end-to-end:** at least one repeatable, trackable transaction cycle completes between a corn farmer and an egg farmer, and between an egg farmer and a UMKM buyer, without needing offline/manual reconciliation.
2. **Demonstrate fair-price transparency:** every completed transaction on the platform shows a price that both sides can see was set transparently (not silently set by Saudagro or a hidden middleman).
3. **Build a foundational base of trusted, verified users** (farmers and buyers) large enough to generate real transaction volume and data for Phase 2 planning.

### 4.2 OKRs (Illustrative — to be finalized with stakeholders)

**Objective: Validate the feed-to-egg trade loop in Palu and surrounding districts.**
- KR1: Onboard *[X]* verified corn farmers and *[Y]* verified egg farmers within *[Z]* months of launch.
- KR2: Facilitate *[X]* tons of corn feed traded through the platform in the first quarter.
- KR3: Secure *[X]* signed B2B egg-supply contracts with UMKM buyers.
- KR4: Achieve *[X]*% of transactions completed without a support/manual intervention.

### 4.3 Non-Goals (Explicitly Out of Scope for Phase 1)

- No processing, upcycling, or sale of liquid egg, eggshell calcium flour, or organic fertilizer.
- No Maggot BSF, fisheries, or cocoa/clove commodity features.
- No in-app payment gateway/escrow beyond what's clarified in Section 11 (payment flow is a known gap — see Unresolved Issues).
- No built-in logistics/fleet management — Phase 1 assumes farmers/buyers arrange pickup or delivery unless clarified otherwise (see Section 11).
- No B2G government data-intelligence dashboard (this is a later revenue pillar, not part of MVP).
- No predictive demand forecasting or Smart Crop Planning algorithms — Phase 1 is a matchmaking and transaction platform, not an AI forecasting tool.
- No mobile native app — Phase 1 is a responsive website only, unless otherwise directed.

---

## 5. User Flow Descriptions

### 5.1 Flow A — Corn Farmer Lists & Sells Feed Corn to Egg Farmer

1. Corn farmer registers/logs in (assisted registration flow recommended given digital literacy variance).
2. Corn farmer creates a **corn listing**: quantity available, harvest/availability date, location, quality indicators (e.g., moisture level), and asking price.
3. Listing appears in the marketplace, visible to verified egg farmers within relevant proximity.
4. Egg farmer browses/searches corn listings, filters by location, quantity, and price.
5. Egg farmer sends a purchase request / initiates an order against the listing.
6. Corn farmer confirms availability and price (price negotiation, if allowed, happens here — **needs clarification**, see Section 11).
7. Order is confirmed; both parties see order details (agreed price, quantity, pickup/delivery arrangement).
8. Payment is made (**mechanism TBD** — see Section 11) and confirmed on the platform.
9. Corn farmer marks the order fulfilled/delivered; egg farmer confirms receipt.
10. Transaction is closed and recorded in both users' transaction history, contributing to their trust/reputation profile.

### 5.2 Flow B — Egg Farmer Sells Whole Eggs to UMKM Buyer (Fixed-Price / Recurring)

1. Egg farmer registers/logs in and completes profile (farm capacity, daily production estimate, location).
2. Egg farmer creates an **egg supply listing**: daily/weekly volume available, grade (Grade A / standard), price, and delivery terms.
3. UMKM buyer browses egg farmer listings or searches by volume/location needed.
4. UMKM buyer initiates a **supply request**, which can be either:
 - a) A one-off bulk order, or
 - b) A **recurring B2B contract request** (fixed-price, scheduled recurring supply — the priority "Subscription" flow from the source material).
5. Egg farmer reviews and accepts/negotiates the contract terms (price, volume, frequency, duration).
6. Contract is confirmed and becomes active; both parties can see contract status and delivery schedule.
7. On each scheduled delivery cycle, egg farmer marks the batch as fulfilled; UMKM buyer confirms receipt.
8. Payment for each cycle is made and recorded (**mechanism TBD**, see Section 11).
9. Contract history and fulfillment reliability contribute to both parties' trust/reputation profile.

### 5.3 Cross-Cutting Flow — Trust & Verification

1. Upon registration, all users (corn farmer, egg farmer, UMKM buyer) go through a lightweight verification step (e.g., phone number verification via WhatsApp/SMS OTP, and optionally ID/farm-location confirmation).
2. Verified badge is shown on profiles to increase trust for first-time matches.
3. After each completed transaction, both parties can leave a simple rating/confirmation (fulfilled as agreed / not fulfilled) to build a visible track record.

---

## 6. Functional Requirements (MoSCoW)

| Req ID | Requirement Name | MoSCoW | Description | User Story |
|---|---|---|---|---|
| **Epic: Registration & Profile** | | | | |
| REQ-01 | User Registration & Role Selection | Must | User registers as Corn Farmer, Egg Farmer, or UMKM Buyer; phone-based verification (WhatsApp/SMS OTP). | As a new user, I want to register quickly with my phone number so I can start using the platform without complex steps. |
| REQ-02 | Farmer/Buyer Profile Fields | Must | Capture role-specific profile data (location, farm capacity, production volume, business type). | As a farmer, I want my profile to reflect my farm's real capacity so buyers trust my listings. |
| REQ-03 | Trust/Verification Badge | Should | Display a "Verified" badge once identity and location are confirmed. | As a buyer, I want to see verified sellers so I feel safe transacting. |
| REQ-04 | Assisted/Guided Registration Mode | Should | Simplified step-by-step registration UI with large text/icons for lower digital-literacy users. | As a corn farmer with limited smartphone experience, I want a simple guided sign-up so I'm not intimidated by the process. |
| **Epic: Feed (Corn) Trading** | | | | |
| REQ-05 | Create Corn Listing | Must | Corn farmer creates a listing with quantity, price, location, availability date, and quality indicators. | As a corn farmer, I want to list my harvest so egg farmers can find and buy it directly. |
| REQ-06 | Browse/Search Corn Listings | Must | Egg farmer can browse and filter corn listings by location, price, and quantity. | As an egg farmer, I want to find nearby corn listings so I can reduce transport cost and get fresh feed. |
| REQ-07 | Initiate Corn Purchase Request | Must | Egg farmer sends a purchase request against a listing. | As an egg farmer, I want to request a specific quantity of corn so I can lock in a deal. |
| REQ-08 | Corn Order Confirmation | Must | Corn farmer accepts/declines the purchase request; order status updates for both parties. | As a corn farmer, I want to confirm orders so I know exactly what I've committed to sell. |
| REQ-09 | Corn Quality/Moisture Data Field | Should | Listing includes a structured field for moisture level or quality grade. | As an egg farmer, I want to see corn quality data before buying so I avoid low-quality feed. |
| REQ-10 | Price Negotiation on Corn Listing | Could | Allow limited back-and-forth price negotiation before order confirmation. | As a corn farmer, I want some room to negotiate price so I'm not locked into a lowball offer. |
| **Epic: Egg Trading & B2B Contracts** | | | | |
| REQ-11 | Create Egg Supply Listing | Must | Egg farmer lists available daily/weekly egg volume, grade, and price. | As an egg farmer, I want to list my daily egg output so buyers can find and commit to purchasing it. |
| REQ-12 | Browse/Search Egg Listings | Must | UMKM buyer browses and filters egg listings by location, volume, and price. | As a UMKM buyer, I want to find egg farmers near me who can meet my volume needs. |
| REQ-13 | One-Off Bulk Order Request | Must | UMKM buyer places a single bulk purchase request against a listing. | As a UMKM buyer, I want to place a one-time bulk order when I have a special need. |
| REQ-14 | Recurring B2B Contract Creation | Must | UMKM buyer and egg farmer can set up a fixed-price, recurring supply contract (volume, frequency, duration). | As a UMKM buyer, I want to lock in a fixed price and schedule so my costs are predictable. |
| REQ-15 | Contract Status Dashboard | Must | Both parties can view active contracts, upcoming deliveries, and fulfillment history. | As an egg farmer, I want to see my upcoming delivery commitments so I don't miss a scheduled order. |
| REQ-16 | Mark Delivery Fulfilled / Confirm Receipt | Must | Egg farmer marks a scheduled delivery as fulfilled; buyer confirms receipt. | As a UMKM buyer, I want to confirm I received my order so the transaction record is accurate. |
| REQ-17 | Contract Renewal / Renegotiation | Should | Notify both parties before contract expiry and allow renewal or renegotiation. | As an egg farmer, I want to be notified before a contract ends so I can renegotiate terms in time. |
| **Epic: Matching, Payment & Trust** | | | | |
| REQ-18 | Transaction History Log | Must | System records all completed transactions per user for both trade flows. | As a user, I want to see my past transactions so I can track my trade activity. |
| REQ-19 | Post-Transaction Rating/Confirmation | Should | Both parties confirm "fulfilled as agreed" or flag an issue after each transaction. | As a buyer, I want to rate a seller's reliability so future buyers can trust the platform. |
| REQ-20 | Payment Confirmation Recording | Must | Platform records payment status per order/contract cycle (method TBD — see Section 11). | As a farmer, I want to see confirmed payment status so I know when I've been paid. |
| REQ-21 | In-App Notifications (Order/Contract Updates) | Should | Push/WhatsApp-linked notifications for new requests, confirmations, and reminders. | As a farmer with limited app usage, I want WhatsApp-style notifications so I don't miss important updates. |
| REQ-22 | Admin/Ops Dashboard for Dispute Flagging | Should | Internal dashboard for Saudagro team to view flagged/disputed transactions. | As a Saudagro operator, I want visibility into disputes so I can intervene and preserve trust. |
| REQ-23 | Commission Fee Calculation Display | Must | Platform transparently shows the commission (3% corn, 5% egg per source doc) applied to each transaction. | As a farmer, I want to see exactly what fee is deducted so I trust the platform's pricing is fair. |
| REQ-24 | Multi-language / Bahasa Indonesia UI | Must | Full UI in Bahasa Indonesia (with regional simplicity in phrasing). | As a local farmer, I want the platform in Bahasa Indonesia so I can understand it fully. |
| REQ-25 | Advanced Analytics / Demand Forecasting | Won't | Predictive Smart Crop Planning / demand forecasting tools. | *(Explicitly excluded from MVP — Phase 2/3 feature.)* |
| REQ-26 | Upcycling Product Listings (Liquid Egg, Calcium Flour, etc.) | Won't | Listing/sale of any upcycled or processed by-products. | *(Explicitly excluded from MVP — Phase 2/3 feature.)* |

---

## 7. Data Fields & Platform Content Requirements

### 7.1 User/Profile Data

| Field | Applies To | Notes |
|---|---|---|
| Full name | All users | |
| Phone number (WhatsApp-linked) | All users | Primary contact & OTP verification channel |
| Role | All users | Corn Farmer / Egg Farmer / UMKM Buyer |
| Farm/business location (village/kecamatan, GPS pin if possible) | Corn Farmer, Egg Farmer | Needed for proximity matching and logistics |
| Farm capacity / production volume estimate | Corn Farmer, Egg Farmer | e.g., hectares planted, number of laying hens |
| Business type & typical order volume | UMKM Buyer | e.g., bakery, catering, daily egg need |
| Verification status | All users | Verified / Pending / Unverified |

### 7.2 Corn Listing Data

| Field | Notes |
|---|---|
| Quantity available (kg/ton) | |
| Price per unit | |
| Harvest/availability date | |
| Moisture level / quality grade | Critical for feed quality trust — flagged in Section 11 |
| Location | |
| Listing status | Available / Reserved / Sold |

### 7.3 Egg Listing / Contract Data

| Field | Notes |
|---|---|
| Daily/weekly volume available | |
| Egg grade (e.g., Grade A whole egg) | |
| Price per unit (per egg / per kg / per tray — **unit TBD**, see Section 11) | |
| Delivery frequency (one-off / daily / weekly) | |
| Contract duration (for recurring contracts) | |
| Delivery/pickup terms | |
| Listing/contract status | Active / Pending / Fulfilled / Expired |

### 7.4 Transaction Data

| Field | Notes |
|---|---|
| Transaction/contract ID | |
| Buyer & seller identity | |
| Agreed price & quantity | |
| Commission fee applied | |
| Payment status | |
| Fulfillment status | |
| Timestamp(s) | Created, confirmed, fulfilled |
| Post-transaction rating/flag | |

---

## 8. Non-Functional Requirements

- **Performance on 4G/limited connectivity:** Pages must load acceptably on average 4G speeds common in Palu and surrounding districts; prioritize lightweight assets, lazy-loading images, and minimal JS payload. Target: core pages (listing browse, order confirmation) usable under 3–4 second load on 4G.
- **Mobile-first, responsive design:** Majority of users will access via smartphone browsers, not desktop.
- **Accessibility for lower digital literacy:** Large tap targets, minimal text-per-screen, iconography paired with text, guided flows for listing creation, and Bahasa Indonesia throughout (avoid English jargon in UI copy).
- **WhatsApp-complementary design:** Where feasible, critical notifications (new order, contract update, payment confirmation) should be deliverable via WhatsApp, since it's the dominant communication channel for this user base.
- **Security:** Phone-based OTP authentication, secure session handling, and protection of user location/contact data from being scraped or exposed publicly beyond what's needed for matchmaking.
- **Data integrity & auditability:** All transaction and contract state changes should be logged immutably for dispute resolution and future trust-scoring.
- **Availability:** Platform should target high uptime during business hours (early morning listing activity is expected, given agricultural work patterns).
- **Localization:** All currency in IDR (Rupiah); dates/times in WITA (Waktu Indonesia Tengah).
- **Scalability posture:** MVP architecture should not block future addition of upcycling product categories (Phase 2/3), even though those features are out of scope now.

---

## 9. Risks & Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| **Trust deficit between petani–peternak** (farmers unfamiliar with digital trade may distrust a platform-mediated deal over a known tengkulak) | Low adoption, reversion to old middleman channels | Verified badges, visible transaction history, in-person onboarding/field agents in early rollout, transparent pricing display |
| **Logistics not integrated in Sulteng** (no built-in delivery/fleet system in MVP) | Buyers/sellers may abandon deals due to unclear pickup/delivery responsibility | Clearly define delivery responsibility per listing (self-arranged vs. platform-facilitated) — flagged as an open item in Section 11; consider a simple "delivery arranged by: buyer/seller" field for MVP |
| **Low digital literacy leading to abandoned registrations or listings** | Reduced supply-side liquidity on the platform | Assisted/guided registration mode (REQ-04), field agent support in launch regions, WhatsApp-linked flows |
| **Price volatility / no negotiation mechanism** | Farmers or buyers feel prices are unfair or rigid | Transparent commission display (REQ-23), optional negotiation flow (REQ-10) |
| **Payment mechanism ambiguity** (unclear how money actually moves) | Transactions stall or revert to informal cash payment outside the platform, undermining trust and data | Resolve payment flow before development (see Section 11); consider phased approach — record-only tracking first, integrated payment gateway later |
| **Thin liquidity at launch** (few farmers/buyers = few matches) | Platform feels empty, early users churn | Concentrated regional launch (single kecamatan/cluster first), manual matchmaking support by Saudagro team during ramp-up |
| **Data quality on listings (inaccurate quantity/quality claims)** | Buyer dissatisfaction, disputes, reputational damage | Post-transaction rating system (REQ-19), admin dispute dashboard (REQ-22), field verification for high-volume sellers |

---

## 10. Timeline & Phases

### Phase 1 (This MVP — Current Scope)
Platform Integrator focused exclusively on:
- Corn Farmer → Egg Farmer feed trading
- Egg Farmer → UMKM/Market whole-egg trading (including recurring B2B contracts)
- Matchmaking commission revenue (3% corn, 5% egg) and B2B subscription fee

### Phase 2 (Post-MVP — Upcycling Stage 1)
- **Liquid Egg:** Cracked/reject egg collection and processing into pasteurized liquid egg for bakery UMKM.
- Revenue: margin on liquid egg sales.

### Phase 3 (Upcycling Stage 2)
- **Eggshell Calcium Flour & Organic Fertilizer:** Eggshell collection, drying, and milling into calcium supplement (sold back to egg farmers) and organic fertilizer (sold to Lembah Napu vegetable farmers).
- Revenue: margin on calcium flour and fertilizer sales.

### Phase 3+ (Ecosystem Expansion)
- Vegetable culls → Maggot BSF biokonversi for alternative protein feed.
- Fisheries diversification (standard/non-standard catch, surimi processing).
- Cocoa & clove direct-trade aggregation for export.
- B2G data intelligence dashboard licensing (supply forecasting, regional inflation monitoring) for local government.

---

## 11. Unresolved Issues / Needed Clarifications

The following gaps must be resolved before design and development can proceed with full confidence:

1. **Payment method(s):** What payment methods are preferred/available in Palu — bank transfer, e-wallet (e.g., DANA/OVO/GoPay), cash-on-delivery, or platform-held escrow? Does Saudagro handle payment collection, or only record confirmation of an offline payment?
2. **Logistics/delivery ownership:** Does Saudagro provide or arrange delivery in Phase 1, or is delivery entirely the responsibility of the buyer/seller (self-pickup or private arrangement)? This affects both the user flow (Section 5) and a required data field (Section 7).
3. **Egg pricing unit:** Should egg listings/contracts price per individual egg, per kg, or per tray (isi 30)? This is standard in Indonesian egg trade but needs to be locked for the data model.
4. **Corn quality standard:** What specific moisture level or quality grading standard should the platform enforce/display for corn listings (e.g., % moisture threshold, visual grading)?
5. **Price negotiation policy:** Should the platform allow open negotiation on listed prices (REQ-10, currently "Could"), or should Saudagro define fixed reference pricing to protect the Fair Trade positioning?
6. **Contract default/dispute handling:** What happens if an egg farmer fails to fulfill a scheduled B2B contract delivery, or a UMKM buyer fails to pay on time? Is there a penalty, grace period, or escalation process?
7. **Identity verification method:** What level of identity verification is feasible at launch — phone OTP only, or also KTP/farm-ownership document upload? Who performs verification (automated vs. manual field agent)?
8. **Geographic launch scope:** Should Phase 1 launch across all of Kota Palu and surrounding kabupaten simultaneously, or start with a single concentrated cluster to build initial liquidity (recommended per Section 9 risk mitigation)?
9. **Minimum order volumes:** Are there minimum quantity thresholds for corn or egg listings/orders to keep transactions viable (given transport cost)?
10. **Commission collection mechanics:** How is the 3%/5% commission actually deducted — withheld from payment before payout, or invoiced separately to one/both parties?

---

*End of Document — Saudagro Phase 1 MVP PRD*