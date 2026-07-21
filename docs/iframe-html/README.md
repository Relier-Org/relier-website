# Limo Anywhere iframe HTML snapshots

Rendered DOM extracted from Relier configuration `13` (`horizontalv2`, Custom CSS `7`) on 2026-07-14.

## Test quote

- Pickup: John F. Kennedy International Airport (JFK)
- Drop-off: Times Square, Manhattan
- Date: 2026-08-15 at 07:00
- Passengers: 2
- Name: Test Example
- Email: `test@example.com`
- Phone: `(202) 555-0123` (reserved example range)
- Vehicle: Sedan
- No payment information was entered.
- No final reservation was confirmed.

## Files

1. `step-01-trip-search.html`: complete rendered document for the initial trip search.
2. `step-02-vehicle-selection.html`: complete rendered vehicle and price selection document.
3. `step-03-personal-information.html`: complete rendered passenger/contact document.
4. `step-04-reservation-summary.html`: complete rendered wizard document. At this point Limo Anywhere preloads steps 4 through 8 and hides inactive pages with `.hidden`.
5. `step-04-fragment-reservation-summary.html`: exact `#trip_summary.page` fragment.
6. `step-05-details-and-notes.html`: exact `#details_notes.page` fragment.
7. `step-06-terms-and-signature.html`: exact `#tos_accept.page` fragment.
8. `step-07-payment-information.html`: exact `#payment_information.page` fragment.
9. `step-08-card-authorization.html`: exact `#bill_card_accept.page` fragment.

## Stable page contract

```text
#trip_summary
  .page_next[data-target="details_notes"]

#details_notes
  .page_prev[data-target="trip_summary"]
  .page_next[data-target="tos_accept"]

#tos_accept
  .page_prev[data-target="details_notes"]
  .page_next[data-target="payment_information"]

#payment_information
  .page_prev[data-target="tos_accept"]
  .page_next[data-target="bill_card_accept"]

#bill_card_accept
  .page_prev[data-target="payment_information"]
  .final_submit
```

## Important limitations

The iframe is cross-origin (`relier.addons.la`). Next.js cannot directly query or rewrite its internal HTML from `relier.com`. Parent-page CSS also cannot cross the iframe boundary.

Safe modification paths are:

1. Custom CSS `7` in the Limo Anywhere dashboard for layout and visual changes.
2. Limo Anywhere configuration/template fields for labels and supported markup.
3. A native booking interface in the Next.js application backed by the provider API, if full HTML ownership is required.

The snapshots are reference material, not drop-in replacements for the live provider document. They include provider scripts and external assets whose behavior depends on the Limo Anywhere origin, session, AJAX endpoints and server-generated state.

Volatile quote identifiers and security tokens were replaced with `TEST_LEAD_ID` and `TEST_SECURITY_TOKEN` before saving.
