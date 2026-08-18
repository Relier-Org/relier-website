# Contact form email — Resend

Status (18-ago-2026): **wired end to end, waiting on Resend's domain
verification.** Account, domain, DNS records, API key and env vars are all in
place. The last real send returned `The relier.com domain is not verified` —
Resend hasn't flipped `relier.com` from `pending` to `verified` yet. Nothing left
to configure on our side; see "Where it stands" below.

Before this, the `/contact` form was theatre: it validated, waited 700 ms with a
`setTimeout` and showed "Thank you". Nothing was ever sent. Real leads only
arrived through the `mailto:` links or the Limo Anywhere iframe.

## What's wired

| File | Role |
| --- | --- |
| `lib/contact/schema.ts` | Types, length limits and validation shared by the client and the API route. Errors are codes (`required`, `email`, `tooLong`) so the UI renders them in the active locale. |
| `lib/contact/api.ts` | Browser-side `fetch` helper + `ContactApiError` (mirrors `lib/booking/api.ts`). |
| `app/api/contact/route.ts` | `POST /api/contact/`. Validates, checks the honeypot, rate-limits, sends. |
| `lib/email/resend.ts` | Resend REST client, env config, dry mode. |
| `lib/email/contactTemplate.ts` | Subject + HTML + plain-text bodies for the internal notification. |
| `components/sections/ContactSplit.tsx` | Real submit, error states, honeypot field. |
| `messages/{en,es,pt}/pages.json` | `contact.form.errors.tooLong`, `contact.form.error.generic`, `contact.form.error.rateLimited`. |

### Mail shape

- **From:** `Relier Website <info@relier.com>` (`CONTACT_FROM_EMAIL`)
- **To:** `info@relier.com` (`CONTACT_TO_EMAIL`, comma-separated for more)
- **Reply-To:** the visitor's email, so hitting Reply in Gmail answers them directly
- **Subject:** `New website enquiry — Jane Doe`, with a `(ES)` / `(PT)` suffix when
  the visitor wasn't browsing in English

Same To/From pair the WordPress Elementor form uses today, so nothing changes for
whoever reads the inbox.

### Why no `resend` npm package

The whole integration is one `POST https://api.resend.com/emails`. A REST call
keeps `package.json` lean and removes a dependency to keep upgraded. If we ever
need batch sending, attachments or webhooks, swapping in the SDK touches only
`lib/email/resend.ts`.

### Abuse protection

- **Honeypot** — a visually-hidden `referral` field. Filled means bot: the route
  answers `200 { ok: true }` and drops the message, so the bot doesn't retry.
  The name matters: a honeypot called `company` or `organization` maps to a
  Chrome autofill category, and an autofilled honeypot would silently discard a
  real lead. `referral` maps to nothing.
- **Rate limit** — 5 submissions per IP per 10 minutes, in module memory. Per
  serverless instance, not global: enough for one abusive client, not for a
  distributed flood. Move to Vercel KV / Upstash only if that ever happens.
- **No reCAPTCHA.** The old WordPress form stacked CleanTalk *and* reCAPTCHA, and
  both were prime suspects when leads went missing. Not repeating that unless
  spam actually shows up.

## Where it stands

| Step | State |
| --- | --- |
| Resend account | ✅ `gastonrelier@gmail.com`, org `gastonrelier` (client-owned, not Terra) |
| Domain added | ✅ `relier.com`, region `us-east-1`, id `457d8864-c56c-475c-9d6b-92af5645af5b` |
| Custom Return-Path | ✅ `send` — keeps the records on the subdomain |
| Click / open tracking | ✅ both off. Click tracking rewrites every link through a tracking domain: no value for an internal notification, and it hurts the spam score |
| DNS records | ✅ all three published on Cloudflare and matching Resend byte for byte (verified with `dig`) |
| Root MX (Google Workspace) | ✅ untouched — `info@relier.com` unaffected |
| API key | ✅ in `.env.local` (git-ignored, `chmod 600`) |
| Vercel env vars | ✅ the three vars on Production + Preview + Development. **No redeploy triggered** — the next deploy picks them up |
| Domain verified | ⏳ still `pending` on Resend's side |
| First real send | ⏳ blocked by the above |

Poll it without opening the dashboard:

```bash
curl -s https://api.resend.com/domains \
  -H "Authorization: Bearer $RESEND_API_KEY" | python3 -m json.tool
```

If it's still `pending` after a few hours, re-trigger with
`POST /domains/<id>/verify` — the records are correct, so it's Resend's poller,
not our DNS.

## The original checklist (kept for reference)

### 1. Create the Resend account and add the domain

1. Sign up at <https://resend.com> with a Relier-owned address (ideally
   `info@relier.com` so the client keeps ownership, not a Terra address).
2. **Domains → Add Domain → `relier.com`**, region `us-east-1` (closest to the
   NY operation; the region shows up in the MX value below).

### 2. DNS on Cloudflare

Resend will show three records. They all hang off a `send` subdomain, so **the
root `MX` pointing at Google Workspace is never touched** — `info@relier.com`
keeps working exactly as it does now.

| Type | Name | Value |
| --- | --- | --- |
| `MX` | `send` | `feedback-smtp.us-east-1.amazonses.com` (priority `10`) |
| `TXT` | `send` | `v=spf1 include:amazonses.com ~all` |
| `TXT` | `resend._domainkey` | `p=MIGfMA0GCSq...` (copy verbatim from the dashboard) |

Notes:

- Copy the values from the dashboard, not from this table — the DKIM key is
  unique per domain and the MX host changes with the region.
- Cloudflare: leave everything **DNS only** (MX and TXT are never proxied anyway).
- **Don't touch the root SPF.** DMARC passes on DKIM alignment alone: the DKIM
  signature is `d=relier.com`, which aligns with `From: info@relier.com`, so
  `p=quarantine` is satisfied. The root SPF stays as-is for Google Workspace and
  SendGrid.
- The root SPF still carries `ip4:68.233.227.202`, left over from the old
  HiVelocity host. Unrelated to this work, worth cleaning up separately.
- Verification is usually minutes. Hit **Verify DNS Records** in Resend.

### 3. API key

**API Keys → Create API Key**: permission `Sending access`, domain `relier.com`.
Copy it once — Resend never shows it again.

### 4. Env vars

Local, in `.env.local` (git-ignored; copy the shape from `.env.example`):

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
CONTACT_FROM_EMAIL="Relier Website <info@relier.com>"
CONTACT_TO_EMAIL=info@relier.com
```

On Vercel: the same three on Production, Preview and Development (already loaded
via `vercel env add`). Env vars are read at runtime, but a **redeploy is still
needed** for the new values to reach the running deployment. The Next site is the
`relier-website` project → `https://preview.relier.com`; `relier.com` itself is
still the old WordPress.

Footgun: `vercel link` / `vercel env pull` **rewrite `.env.local`**. They append
rather than clobber, but check the file afterwards — and never let a pull run
before your local secrets are backed up.

### 5. Test

Override the recipient so test noise never reaches the client's inbox:

```bash
CONTACT_TO_EMAIL=nicolas@restoexp.com npm run dev
curl -X POST http://localhost:3000/api/contact/ \
  -H 'Content-Type: application/json' \
  -d '{"firstName":"Test","lastName":"Lead","email":"nicolas@restoexp.com","phone":"+1 555 000 0000","message":"Test from local dev.","locale":"en"}'
```

Careful with the port: if 3000 is taken by another project, `next dev` silently
moves to 3001/3002 and your curl hits somebody else's app.

Expected: `{"ok":true,"delivered":true}` (`"delivered":false` means dry mode —
the key isn't being read). Then submit the real form at
<http://localhost:3000/contact/> and check the three states: validation errors,
sending, success.

Once the mail arrives in `info@relier.com`, open **Show original** in Gmail and
confirm:

```
DKIM: 'PASS' with domain relier.com
DMARC: 'PASS'
```

If DKIM says `d=amazonses.com` instead of `relier.com`, the domain isn't verified
and the send fell back to Resend's shared domain.

### 6. Resend free tier

3,000 emails/month, 100/day, one custom domain. The contact form will not come
close. If it ever does, the paid tier starts at $20/month.

## Pending / decisions not taken

- **No auto-reply to the visitor.** Adding one means copy approved by the client
  in EN/ES/PT. The template file is the place to add it when we do.
- **Booking still goes through Limo Anywhere** (its own SendGrid), untouched here.
  The `/api/booking/*` routes remain mocks.
- **SendGrid's half-finished domain authentication on `relier.com`** (only
  `google._domainkey` is published, no `s1/s2._domainkey`) is a separate
  pre-existing issue affecting Limo Anywhere's booking confirmations, not this
  form. Adding the Resend records doesn't fix or worsen it.
