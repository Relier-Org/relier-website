# Limo Anywhere layout correction

> Esta es la revisión inicial. La [QA posterior del proceso de reservas](../limoanywhere-qa/README.md)
> amplía la cobertura y documenta la cotización de prueba creada posteriormente.
> Para instalar, usar el archivo completo actualizado indicado allí.

Verified September 19, 2026 against the live `horizontalv2` form, configuration
`13`, Custom CSS `7`. The complete replacement has **not been saved in Limo Anywhere**.

## Installation

**For a complete replacement**, use
[`../limoanywhere-custom-css-complete.css`](../limoanywhere-custom-css-complete.css).
Back up Custom CSS `7`, replace its entire contents with this file, and save.
Do not include `<style>` tags. This includes the original theme for all booking
steps plus the layout correction. The live form was observed with only the
layout patch on September 19, which explains the missing theme. The complete
replacement was tested in-browser at the same nine widths listed below.

The following instructions apply only when the original theme is still present:

1. Open Custom CSS `7` in the Limo Anywhere/AddOns panel and back up its contents.
2. Append all of [`../limoanywhere-layout-fix.css`](../limoanywhere-layout-fix.css)
   after the existing CSS. Do not replace the existing stylesheet or include
   `<style>` tags. The patch needs the existing theme styles.
3. Save and reload the home and online reservation pages.
4. To revert, remove the appended block.

This file is an external provider stylesheet. It is deliberately not imported
by Next.js: parent-page CSS cannot style this cross-origin iframe.

## Cause and scope

The provider now groups fields inside `.lqc-route-fields`, `.lqc-when-fields`
and `.lqc-who-fields`. The previous five-column rule placed those three groups
in the first three columns, leaving unused space and compressing their contents.
The generic `!important` label rule also exposed the hourly-only return checkbox
in Transfer mode.

The patch lays out the actual groups, restores conditional checkbox visibility,
keeps Hourly's destination and duration, and aligns the Login link. Desktop
Transfer has five fields in one row; Hourly and tablet widths use two rows;
mobile uses one column. Existing provider visibility logic stays in control of
the duration, return trip, map and hidden form inputs.

## Verification

- Injected the patch after the current custom CSS in a temporary browser session
  using the live provider page, then inside the actual `relier.com` iframe.
- Checked Transfer and Hourly at 320, 390, 600, 601, 768, 1000, 1001, 1140 and
  1440 px: no horizontal document overflow or overlapping visible input boxes.
- Checked return date/time expansion and Hourly's return-to-pickup behavior:
  the destination is disabled when checked; the separate return-trip block hides.
- Submitted the empty form and verified the provider's validation error.
- Visually inspected desktop, mobile, return-trip and hourly previews.
- TypeScript, lint and production build passed. Build reports existing warnings
  about metadataBase and next-intl/Webpack dependency parsing.

No quote, customer record, payment or booking was created. Successful booking,
quote-loading and server-failure flows were not exercised for this CSS patch.
Post-save verification remains necessary once panel access is available.

Before images show the provider form directly; after images show the corrected
form embedded on the live Relier site in the temporary browser session.

| View | Before | Preview after patch |
| --- | --- | --- |
| Desktop | [Before](before-desktop.png) | [After](after-desktop.png) |
| Mobile | [Before](before-mobile.png) | [After](after-mobile.png) |

## Login panel correction

The complete stylesheet also includes the login panel correction. The provider's
fixed drawer inherited a white background and had no scrollable form. In the
desktop embed, its 249 px viewport clipped the submit and recovery controls.

The replacement uses Relier's dark theme, two input columns above 600 px and
one column below. The header remains visible while the form can scroll when
errors or limited space require it. The provider still controls opening,
closing, authentication and hidden loading/error states.

Verified inside the actual cross-origin iframe on `relier.com` at browser widths
1440, 1024, 768, 390 and 320 px: all default controls visible, no horizontal
overflow, close button and Escape working. Empty-field validation was checked.
Loading, invalid credentials, network failure and success were checked using
temporary in-browser mock responses; no credentials were sent to Limo and no
real account was authenticated. TypeScript, lint and production build passed.

- [Login before, desktop](login-before-desktop.png)
- [Login preview, desktop](login-after-desktop.png)
- [Login preview, mobile](login-after-mobile.png)

These remain browser previews. Replace the entire Custom CSS `7` value with
`limoanywhere-custom-css-complete.css` to publish the correction.
