# Plan — Move Both LEXA Lab Website Forms to Embedded Microsoft Forms

**Status:** Planning document only. No code has been changed.
**Prepared for:** David Eisenhauer · Drafted 2026-08-27
**Repo:** `de9871/lexalabwebsite` @ `e22a11f` (main)
**Decision:** Both site forms become **Microsoft Forms, embedded in the existing pages**, with responses stored in GSU's Microsoft 365 tenant and Microsoft's **built-in per-response email notification** going to `ychen146@gsu.edu`.

**No API. No API key. No serverless function. No environment variables. No build step.**

> **For the practical build order, who does what, and effort estimates, see Appendix C.**

> Supersedes `RESEND-FORMS-PLAN.md`. That approach was evaluated and set aside — the reasoning is preserved in **Appendix B** as a decision record.

---

## 1. Summary

| | Before | After |
|---|---|---|
| `contact.html` — Participant Registry | Hand-built HTML form, `action="#"`, submits nowhere | Embedded Microsoft Form |
| `team.html` — Student Volunteer Interest | Hand-built HTML form, `action="#"`, submits nowhere | Embedded Microsoft Form |
| Where responses live | — | GSU M365 tenant (Excel workbook in OneDrive/SharePoint) |
| Notification | — | Built-in Forms email to the form owner |
| Code written | — | **None.** Two `<iframe>` blocks replacing two `<form>` blocks |
| Secrets to manage | — | **None** |
| Third-party processors | — | **None new.** Microsoft is already GSU's provider |

## 2. Why this approach

1. **The lab already does this.** The Project READ screener runs on Microsoft Forms at `forms.cloud.microsoft/r/W8QFnat8qS`. Same tool, same tenant, no new vendor to clear.
2. **Notification is built in.** Microsoft sends an email per response natively. That is exactly the "you had a submission" behavior wanted — with no API and nothing to maintain.
3. **Participant data never leaves GSU.** Responses about identifiable minors stay inside the institution's own Microsoft 365 tenant rather than passing through and resting in an outside email vendor's logs. This defuses nearly all of the privacy review that a third-party email path would require.
4. **Responses are actually stored.** Every submission lands in a structured Excel workbook. The current forms store nothing, and an email-only design would leave the lab with no record beyond an inbox.
5. **It survives the Squarespace migration** — with one caveat. The site is a prototype destined for a Squarespace rebuild. A Microsoft Forms `<iframe>` pastes into a Squarespace **Code block** unchanged, whereas a serverless function could not come along at all — Squarespace cannot host one, so that work would have been discarded and rebuilt.
   > **⚠️ Caveat — verify the Squarespace plan.** Iframes in Code blocks are a **premium feature**: available on Core, Plus, Advanced, Business, and Commerce plans, but **not on Personal/Basic**, where Code blocks accept only plain text, HTML, Markdown, and CSS. If the lab lands on a lower plan, the embed cannot carry over.
   > **The link-out fallback (Appendix A) works on every plan**, because it is only a hyperlink. That makes the fallback genuinely plan-independent and worth keeping in reach.
   > - [ ] Confirm which Squarespace plan the rebuild will use, before relying on the embed transferring.
6. **Nothing to break.** No key to rotate, no function to time out, no dependency to patch, no billing to lapse.

---

## 3. Verified current state

- Pure static site. No `package.json`, no build step, no framework, no `/api` directory.
- **No environment variables and no secrets** anywhere in the code or git history.
- `vercel.json` is 3 lines: `{"$schema": "…", "cleanUrls": true}` — **no `headers` block, so no Content-Security-Policy is set.** This matters: a restrictive CSP would block the Microsoft iframe. Nothing currently does. ✅
- Site is served over **HTTPS** by Vercel — required for the embed. ✅
- One script tag site-wide: `<script src="assets/js/nav.js">`.
- Root-level `nav.js`, `styles.css`, `lexa-lab-logo.png` are **unused duplicates**; every page references the `assets/` copies. Do not edit the root copies.

### Still-outstanding blocker (unrelated to forms, but blocks launch)

The deployment sits behind **Vercel Authentication** — every URL redirects to `vercel.com/login`, and `lexalabwebsite.vercel.app` returns `404 DEPLOYMENT_NOT_FOUND`. Families cannot reach the site at all today.

- [ ] Vercel → Project → Settings → **Deployment Protection** → Vercel Authentication → **Disabled**
- [ ] Re-add the `lexalabwebsite.vercel.app` alias (Settings → Domains) or correct the repo's homepage URL

---

## 4. Prerequisite — the tenant setting that blocks everything

Microsoft Forms defaults many organizational accounts to **"Only people in my organization can respond."** Families and prospective students are external and have no GSU login. Both forms **must** be set to **"Anyone can respond."**

If that option is greyed out, external sharing is disabled tenant-wide and **only a GSU Microsoft 365 admin can enable it** (Admin Center → Settings → Org settings → Microsoft Forms → external sharing).

- [ ] **Verify this before building anything.** Every other step is wasted if external responses are blocked.
- The Project READ screener already accepts public responses, so this is very likely already enabled — confirm rather than assume.

Two consequences of anonymous mode:

- **Respondent email is not captured automatically.** Both field maps below ask for it explicitly. ✅
- **File-upload questions force the form back to organization-only.** Do not add one to either form, or external submissions will silently stop working.

---

## 5. Phase 1 — Build the forms

Create both under **Dr. Chen's account (`ychen146@gsu.edu`)**, or in a lab-owned Microsoft 365 Group.

This is load-bearing: **the built-in notification goes to the form owner.** Group ownership is the more durable choice — a form created by a student becomes orphaned when they graduate, a common and avoidable failure for lab-run forms.

- [ ] Decide: Dr. Chen personally, or a lab-owned M365 Group (better for continuity)

### 5.1 Form A — Participant Registry (`contact.html`)

Recreate all 7 fields so nothing is lost:

| # | Question | Type | Required | Configuration |
|---|---|---|---|---|
| 1 | Parent / Guardian Name | Text (short) | ✅ | |
| 2 | Email Address | Text (short) | ✅ | Restrictions → **Email** |
| 3 | Phone Number | Text (short) | ❌ | Keep optional — matches the current form |
| 4 | Reason for Reaching Out | Choice | ✅ | 5 options, verbatim below |
| 5 | Child Age | Text (short) | ✅ | Restrictions → **Number → Greater than or equal to → 0** |
| 6 | Message | Text (**long**) | ✅ | Reuse the current placeholder as the question subtitle |
| 7 | Consent acknowledgement | Choice (single, one option) | ✅ | See note below |

**Reason options — copy exactly:**
`I am interested in participating in a study` · `I want to learn more about the lab's research` · `I would like to explore a research collaboration` · `Media or press inquiry` · `General question or comment`

**Consent question.** Microsoft Forms has no true checkbox control. The standard equivalent is a **required single-choice question with exactly one option**, whose text is the existing consent language:
> *"I understand this form is for research contact only and does not guarantee participation in any study."*

**Form description.** Carry over the page's existing intro and closing reassurance so the tone survives the move:
> *"Families interested in future studies can use this form to share contact information with the lab. A team member may follow up if a study may be a fit. Families who participate in a study may receive an Amazon gift card."*
> *"Your information is kept private and used only for lab communication. Participation in research is always voluntary."*

### 5.2 Form B — Student Volunteer Interest (`team.html`)

| # | Question | Type | Required | Configuration |
|---|---|---|---|---|
| 1 | Full Name | Text (short) | ✅ | |
| 2 | Email Address | Text (short) | ✅ | Restrictions → **Email** |
| 3 | Current Institution | Text (short) | ✅ | |
| 4 | Program/Major and Year | Text (short) | ✅ | |
| 5 | Interest Type | Choice | ✅ | `Graduate Research Assistant` · `Volunteer` |
| 6 | Research Interests and Relevant Experience | Text (**long**) | ✅ | |

**Form description:**
> *"Students interested in joining the lab as a graduate research assistant or volunteer can complete this form. Applications are reviewed on a rolling basis."*

### 5.3 Theme both forms to the site's palette

Microsoft Forms accepts a **custom hex value**: in the form's theme picker, click the **paint-bucket icon** and enter the hex directly (there is no eyedropper — the code must be typed).

Use the site's exact button/link blue, read from `assets/css/styles.css:23`:

```
#0039A6      /* --clr-primary-action — "GSU Blue" */
```

For reference, the site's other brand tokens (`styles.css:22-26`):

| Token | Hex | Role |
|---|---|---|
| `--clr-primary` | `#002855` | GSU Deep Navy — headings |
| **`--clr-primary-action`** | **`#0039A6`** | **GSU Blue — buttons, links ← use this** |
| `--clr-secondary` | `#1E4E9A` | Cool mid-blue — section labels |

This is the single highest-value step for making the embed feel native rather than pasted in.

---

## 6. Phase 2 — Sharing settings

For **each** form: **Collect responses** → set the dropdown to **"Anyone can respond."**

- [ ] Form A set to "Anyone can respond"
- [ ] Form B set to "Anyone can respond"
- [ ] Copy each form's response URL (`https://forms.cloud.microsoft/r/XXXXXXXX`) — needed in Phase 4
- [ ] Confirm **no file-upload question exists** on either form (see §4)

**Do not** disable name recording expecting anonymity — in external mode Microsoft does not capture respondent identity anyway, and both forms ask for name and email as explicit questions because the lab needs to reply.

---

## 7. Phase 3 — Notifications

For **each** form: **More settings (⋯) → Response receipts → ✅ "Get email notification of each response."**

The owner then receives an email per submission containing **a link to the response**, rather than the response body — the data stays in the tenant and is read there. This is precisely the notify-then-read pattern wanted, and it requires no code.

- [ ] Enabled on Form A
- [ ] Enabled on Form B
- [ ] Test submission confirmed arriving at `ychen146@gsu.edu` — **check the junk folder**

**If more is needed later** — copying `asdlab@gsu.edu`, custom subject lines, routing by "Reason" — use **Power Automate**: *When a new response is submitted* → *Get response details* → *Send an email*. Only worth doing if the built-in notification proves insufficient. Do not start here.

---

## 8. Phase 4 — Embed in the site

### 8.1 Getting the embed code

In each form: **Collect responses → Embed icon (`</>`) → copy the `<iframe>` code.**

> **⚠️ Use the `src` Microsoft generates — do not hand-build the URL.** Microsoft emits an embed `src` in one of several shapes, e.g.
> `https://forms.office.com/Pages/ResponsePage.aspx?id=…&embed=true` or `https://forms.office.com/e/XXXXXXXX?embed=true`,
> and may use either the `forms.office.com` or the newer `forms.cloud.microsoft` host. The short **`/r/…` link is the sharing URL, not the embed URL.**
>
> The `src` values in §8.2 and §8.3 below are **placeholders showing the surrounding markup only.** Paste the real generated `src` verbatim, then apply the modifications in §8.4 to the attributes around it.

### 8.2 `contact.html` — replace the form block

**Delete lines 204–342** — verified extent, comprising:

| Line(s) | Content |
|---|---|
| 204 | `<!-- SQUARESPACE: Use a Form block for this section -->` (superseded — the replacement below carries a corrected one) |
| 205 | `<!-- TODO: Connect this form to Squarespace, Formspree, or an approved final form handler before launch. -->` (stale) |
| 206–342 | The `<form class="form-stack" …>` element through its closing `</form>` (137 lines) |

Keep everything around it — the section heading, the intro paragraph, and the "A Note for Families" callout carry the page's warmth.

> **⚠️ Copy fix — do not miss this.** The intro paragraph at **line 201** ends:
> *"…Fields marked with an asterisk (\*) are required."*
> That sentence describes the HTML form being deleted. The embedded Microsoft Form marks its own required fields, and no asterisks will appear on the page. **Delete that final sentence** and keep the rest of the paragraph. Leaving it in points readers at something that no longer exists.

Replace lines 204–342 with:

```html
<!-- SQUARESPACE: Use a Code block and paste this iframe unchanged -->
<div class="form-embed">
  <iframe
    src="https://forms.cloud.microsoft/r/XXXXXXXX?embed=true"
    title="LEXA Lab participant registry form"
    width="100%"
    height="1100"
    frameborder="0"
    marginwidth="0"
    marginheight="0"
    style="border:none; max-width:100%;"
    allowfullscreen>
  </iframe>
</div>
```

### 8.3 `team.html` — replace the form block

**Delete lines 253–289** — the `<form class="form-stack" …>` element through its closing `</form>` (37 lines). There is no stale comment or asterisk sentence on this page; the surrounding copy needs no edit. Replace with:

```html
<!-- SQUARESPACE: Use a Code block and paste this iframe unchanged -->
<div class="form-embed">
  <iframe
    src="https://forms.cloud.microsoft/r/YYYYYYYY?embed=true"
    title="LEXA Lab student volunteer interest form"
    width="100%"
    height="900"
    frameborder="0"
    marginwidth="0"
    marginheight="0"
    style="border:none; max-width:100%;"
    allowfullscreen>
  </iframe>
</div>
```

### 8.4 Three deliberate changes to Microsoft's default embed code

Microsoft's generated snippet is serviceable but not good enough as-is:

1. **`title` attribute added.** Microsoft's default omits it. An untitled iframe is an unlabelled document to a screen reader — a genuine WCAG failure on a site whose README commits to WCAG AA.
2. **`width="100%"`** instead of Microsoft's fixed `640px`, so the form is responsive.
3. **Height raised** from Microsoft's default `480px`. These are long forms; at 480px users get a cramped scroll-within-a-scroll. Start at **1100px** (Form A, 7 questions) and **900px** (Form B, 6 questions), then tune against the real rendered form.
4. **Obsolete attributes dropped.** Microsoft's snippet still emits `frameborder`, `marginwidth`, and `marginheight`, all removed from the HTML5 standard. `style="border:none"` already does the job of `frameborder="0"`. Dropping them is optional and purely tidiness — they are harmless, just dead markup in a codebase that is otherwise clean. The snippets above keep them for fidelity with what Microsoft gives you; remove them if you prefer.

### 8.5 Optional CSS

Add to `assets/css/styles.css` if the embed needs breathing room inside the existing card:

```css
/* Embedded Microsoft Forms — participant registry & student interest */
.form-embed {
  width: 100%;
  overflow: hidden;
  border-radius: var(--radius-md);   /* match existing token */
}
.form-embed iframe {
  display: block;
  width: 100%;
}
```

`--radius-md` is verified to exist (`styles.css:91`, `5px`) and is the same token `.form-input` already uses — so it is the consistent choice here.

### 8.6 Honest limitation — iframe height is fixed

Microsoft Forms does **not** auto-resize its parent iframe. The height is set once in the markup, so a form that grows later (added question, long validation message, mobile line-wrapping) will scroll internally rather than expand the page.

Mitigations, in order:
1. Set a generous height and test on a real phone.
2. Re-check the height whenever a question is added.
3. Do not attempt a JavaScript auto-resize — cross-origin iframes cannot be measured from the parent, and Microsoft publishes no height-messaging API.

If internal scrolling proves unacceptable on mobile, fall back to **Appendix A** (link out instead of embed).

### 8.7 Orphaned CSS after removal

The `form-*` classes are used on **only these two pages** (verified — no other HTML file references them). Once both forms are deleted, `assets/css/styles.css:1406-1443` becomes dead code:

`.form-stack` · `.form-group` · `.form-group-2` · `.form-label` · `.form-input` (+ `::placeholder`, `:focus`, `textarea`)

That is ~38 lines. Two reasonable choices:

- **Leave it** *(recommended for now)* — harmless, and it is exactly what you would need if a hand-built form ever returns or the Squarespace rebuild wants the styling as reference.
- **Remove it** — only as a **separate commit, after** the embed is confirmed working in production. Bundling a CSS deletion into the same commit makes a clean `git revert` impossible if the embed has to be rolled back.

### 8.8 What does *not* change

- `vercel.json` — no change. `cleanUrls` does not affect iframes, and **no CSP needs adding** (adding one carelessly would break the embed).
- `assets/js/nav.js` — untouched.
- No new JavaScript of any kind.

---

## 9. Phase 5 — Testing

- [ ] Open each live form URL in a **private/incognito window while signed out** — the real test of external access. If it demands a login, §4 is not satisfied.
- [ ] Submit each form from a **non-GSU email address** (personal Gmail or similar)
- [ ] Confirm both notifications reach `ychen146@gsu.edu` — **check junk**
- [ ] Confirm each response appears in its Excel workbook with **every field populated**
- [ ] Verify required-field validation, the email restriction, and the Child Age number restriction all behave
- [ ] View both embedded pages on **a real phone**, not just a narrow desktop window — confirm no cramped internal scrolling
- [ ] Confirm the iframe is reachable and operable **by keyboard alone**
- [ ] Confirm a screen reader announces the iframe by its `title`
- [ ] Confirm the page itself never scrolls horizontally at 320px width
- [ ] Confirm the theme colour reads as belonging to the site

---

## 10. Privacy and IRB

Dramatically lighter than the third-party email path, because **no new processor is introduced** — responses stay in GSU's Microsoft 365 tenant, the same place the Project READ screener's data already goes.

Still worth confirming:

- [ ] **IRB** — does the approved protocol cover collecting recruitment contact through a lab website? The *storage* question is largely settled by staying in-tenant, but the *recruitment method* may still need to be on record.
- [ ] **Retention and stewardship** — tenant data persists until someone deletes it. Unlike a vendor's automatic expiry, this is now a live dataset containing identifiable information about minors. Decide who owns it and how long it is kept.
- [ ] **Access** — who can open the response workbook? Review as students join and leave.
- [ ] **On-page copy** — `contact.html` promises information is "kept private and used only for lab communication." That remains accurate under this design. Confirm it still reads correctly next to the embedded form.

The student volunteer form raises none of these concerns — adult career inquiries with no health data.

---

## 11. File manifest

| Path | Action | Notes |
|---|---|---|
| `contact.html` | Edit | Remove `<form>` at line 206 + stale TODO comment; insert iframe |
| `team.html` | Edit | Remove `<form>` at line 253; insert iframe |
| `assets/css/styles.css` | Edit *(optional)* | `.form-embed` wrapper only |
| `vercel.json` | **No change** | |
| `assets/js/nav.js` | **No change** | |
| `nav.js`, `styles.css` (root) | **No change** | Unused duplicates — leave alone |

**Two files edited, one optionally.** No new files, no dependencies, no secrets, no build step. The repo stays exactly as static as it is today.

---

## 12. Rollback

1. `git revert <sha> && git push` — Vercel redeploys automatically. Forms return to `action="#"`, inert, as today.
2. Or Vercel → Deployments → last known-good → **Promote to Production** (instant).
3. Microsoft Forms are unaffected by any site rollback — responses already collected remain in the tenant.

No data loss is possible from a site rollback, because the site never holds the data.

---

## 13. Cost

**Free.** Microsoft Forms is included in GSU's Microsoft 365 licensing. No Vercel functions are added, so no function usage is incurred. Vercel's Hobby plan permits university projects; this site takes no payments and runs no ads.

There is no billing relationship to lapse and no key to expire — a meaningful advantage for a site that will outlive the students maintaining it.

---

## 14. Execution checklist

- [ ] **§4 verified** — "Anyone can respond" is available in the GSU tenant
- [ ] Vercel Authentication disabled; public URL working
- [ ] Owner decided (Dr. Chen vs. lab M365 Group)
- [ ] Form A built — 7 fields, restrictions, consent question, description
- [ ] Form B built — 6 fields, restrictions, description
- [ ] Both themed to the site's blue
- [ ] Both set to "Anyone can respond"; no file-upload questions
- [ ] Notifications enabled on both
- [ ] Test submissions received at `ychen146@gsu.edu` (junk checked)
- [ ] Embed codes copied; `title`, `width="100%"`, and heights adjusted per §8.4
- [ ] `contact.html` and `team.html` updated; old `<form>` blocks and TODO comment removed
- [ ] Full §9 test pass, including a real phone and keyboard-only navigation
- [ ] §10 privacy items confirmed
- [ ] Production deploy; one live end-to-end submission per form
- [ ] Dr. Chen confirms she receives and can open both

---

## 15. Open questions for Dr. Chen

1. **Should the participant registry and the Project READ screener be one form or two?** They overlap, and two public intake forms may confuse families. Consolidating is worth considering.
2. Should notifications also copy `asdlab@gsu.edu`, the address published site-wide? (Requires Power Automate — §7.)
3. Should families receive an automatic confirmation receipt after submitting? (Microsoft Forms can send one.)
4. Who owns the forms and the response workbooks long-term, and who takes over when students graduate?
5. Is the IRB protocol current with respect to website-based recruitment contact?
6. How long should responses be retained, and who is responsible for purging them?

---

## 16. Claims verified against vendor documentation

Checked 2026-08-27. Re-verify if significant time passes — vendor defaults change.

| Claim | Status | Source |
|---|---|---|
| Microsoft Forms can be embedded via an `<iframe>` (Embed `</>` icon) | ✅ Confirmed | Microsoft Forms sharing/embed docs |
| **Embedded forms accept anonymous external respondents** when set to "Anyone can respond" | ✅ **Confirmed** — the setting required for website embeds | Forms external-sharing docs |
| "Anyone can respond" allows response with **no sign-in** | ✅ Confirmed | Microsoft Q&A |
| That option can be disabled **tenant-wide** by an M365 admin | ✅ Confirmed — the usual cause of a greyed-out option | M365 Admin Center → Org settings → Microsoft Forms |
| Anonymous mode does **not** auto-capture respondent email | ✅ Confirmed — must be an explicit question | Forms external-sharing docs |
| A file-upload question forces organization-only mode | ✅ Confirmed | Forms external-sharing docs |
| Per-response email notification exists (More settings → Response receipts) | ✅ Confirmed | Microsoft Support |
| That notification goes to the **form owner** and links to the response | ✅ Confirmed — basis of §7 | Microsoft Support |
| Embed is responsive when `width` is set to `100%` | ✅ Confirmed | Forms embed guidance |
| Default embed height (`480px`) is often too short and must be raised manually | ✅ Confirmed | Forms embed guidance |
| Host site must be **HTTPS** and must not block the iframe via **CSP** | ✅ Confirmed — this site is HTTPS and sets no CSP | Forms embed guidance + `vercel.json` inspection |
| Power Automate can route responses to custom recipients | ✅ Confirmed | Microsoft Support |
| Vercel Hobby permits university projects | ✅ Confirmed | Vercel Hobby plan / Fair Use docs |

**Second audit — additional findings (2026-08-27):**

| Claim | Status |
|---|---|
| Deleting `contact.html` 204–342 leaves **balanced, valid HTML** | ✅ Confirmed by tag-balance check — block is self-contained |
| Deleting `team.html` 253–289 leaves **balanced, valid HTML** | ✅ Confirmed by tag-balance check — block is self-contained |
| Squarespace Code blocks accept iframes on **any** plan | ❌ **Wrong — corrected.** Premium feature; Core/Plus/Advanced/Business/Commerce only, not Personal/Basic (§2, item 5) |
| The `/r/…` short link is the embed URL | ⚠️ **Corrected.** It is the *sharing* URL; the embed `src` is a different shape and must be copied from the Embed button (§8.1) |
| Microsoft's embed snippet uses HTML5-valid attributes | ⚠️ Partly — it still emits obsolete `frameborder`/`marginwidth`/`marginheight` (§8.4, item 4) |
| `team.html:250` copy works with an embed | ✅ Confirmed — but needs rewording in the **link-out fallback** (Appendix A) |

**Verified directly against this repo (not vendor docs):**

| Claim | Status |
|---|---|
| `contact.html` form spans lines **206–342**; SQUARESPACE + TODO comments at 204–205 | ✅ Confirmed |
| `team.html` form spans lines **253–289** | ✅ Confirmed |
| Intro copy at `contact.html:201` references asterisks and **breaks after embedding** | ⚠️ **Found during review** — §8.2 now fixes it |
| `--clr-primary-action` = `#0039A6` (`styles.css:23`) | ✅ Confirmed — exact hex for §5.3 |
| `--radius-md` exists (`styles.css:91`, `5px`) and is used by `.form-input` | ✅ Confirmed |
| `.btn`, `.btn-primary`, `.btn-lg` all exist | ✅ Confirmed (`577`, `599`, `648`) |
| Material Symbols font loaded on both `contact.html` and `team.html` | ✅ Confirmed — Appendix A's icon works |
| `form-*` CSS used on **no other page**; ~38 lines orphaned by removal | ✅ Confirmed (`styles.css:1406-1443`) |
| No CSP set anywhere (`vercel.json` has no `headers` block) | ✅ Confirmed — embed will not be blocked |

**Not verified — confirm during execution:**
- Whether GSU's tenant currently permits external Forms responses (§4). The Project READ screener suggests yes.
- Whether GSU mail filtering delivers Forms notifications cleanly to `ychen146@gsu.edu` (§7 tests this empirically).
- The correct iframe heights — determinable only against the real rendered forms (§8.4).
- Whether Microsoft Forms is covered by the lab's existing IRB protocol for this specific use (§10).

---

# Appendix A — Embed vs. link out

Embedding is the plan of record. Linking out remains a legitimate fallback, and the site already uses that pattern for the Project READ "Participate" button.

| | Embed (chosen) | Link out (fallback) |
|---|---|---|
| User stays on the site | ✅ | ❌ Opens Microsoft's page |
| Visual continuity | Partial — Microsoft's UI, themed to match | ❌ Leaves the site entirely |
| Mobile behaviour | Fixed-height iframe; needs tuning | ✅ Native, always correct |
| Accessibility risk | Moderate — nested document, needs `title` | ✅ Minimal |
| Effort | Low | Lowest |
| Matches existing site pattern | Partly | ✅ Same as Project READ button |

**Switch to linking out if:** the iframe cannot be made to work well on phones, or accessibility testing surfaces problems that theming cannot fix.

**If falling back**, replace the iframe with a button reusing the existing classes. All three (`.btn`, `.btn-primary`, `.btn-lg` at `styles.css:577,599,648`) and the Material Symbols font are verified present on both pages:

```html
<a class="btn btn-primary btn-lg" href="https://forms.cloud.microsoft/r/XXXXXXXX"
   target="_blank" rel="noopener">
  Join the Participant Registry
  <span class="material-symbols-outlined" aria-hidden="true">open_in_new</span>
</a>
```

Since the link leaves the site, say so in adjacent copy so the jump is not a surprise.

**One copy fix in the fallback path:** `team.html:250` reads *"…can fill out **the following interest form** or email Dr. Chen directly."* That phrasing is correct for an embed but wrong for a button that navigates away — reword to something like *"…can complete our interest form or email Dr. Chen directly."* (`contact.html`'s intro needs the asterisk fix from §8.2 in either path.)

---

# Appendix B — Why Resend was set aside (decision record)

Kept because a future maintainer — or the IRB — may reasonably ask why the lab did not simply email form submissions.

**The approach considered:** a Vercel serverless function receiving form POSTs and calling Resend's REST API to email submissions to `ychen146@gsu.edu`.

**It was workable.** Verified during evaluation: Resend's sandbox sender `onboarding@resend.dev` can only deliver to the address that owns the Resend account, so registering the account under `ychen146@gsu.edu` would have allowed sending with no DNS changes — relevant because `gsu.edu` DNS is controlled by GSU IT and would not have been available for domain verification.

**Why it was rejected:**

1. **Participant data would leave the institution.** Guardian name, phone, child's age, and a free-text field inviting families to describe their child would have transited a third-party vendor and rested in its logs for 30 days. That likely required GSU IT vendor review and additional IRB scrutiny — for a capability Microsoft already provides in-tenant.
2. **Nothing would have been stored.** Email-only means no structured record; the lab's only copy of a submission is an inbox message.
3. **It would not have survived the Squarespace migration.** Squarespace cannot host a serverless function, so the work would have been discarded and rebuilt. The Microsoft Forms iframe transfers unchanged.
4. **Ongoing burden.** An API key to hold, rotate, and re-secure at every staff change; a function to maintain; a spam-protection layer to build (honeypot, timing checks, rate limiting) that Microsoft handles upstream.
5. **The notification requirement was already met natively.** The desired behavior — *notify Dr. Chen, keep the data elsewhere* — is Microsoft Forms' built-in response notification, with zero code.

**What was genuinely better about it:** a fully on-brand form matching the site's design system exactly, with no iframe and no visual seam. That is the real cost of this decision, and §5.3's theming step exists to narrow it.

The full superseded plan remains in `RESEND-FORMS-PLAN.md` if the decision is ever revisited.

---

# Appendix C — Sequencing, ownership, and realistic effort

The phases in §5–§9 are ordered logically, not chronologically. This appendix is the practical build order, and names the one dependency that can quietly stall the work.

## C1. The dependency that dictates order

**The embed URLs do not exist until the forms are built.** §8's HTML edits are therefore *blocked* until Phase 1–2 are finished. The site work cannot start first, and cannot be done in parallel by someone waiting on a link.

Plan for the forms to be built first, in one sitting, by whoever owns them.

## C2. The ownership friction — solve this before starting

§5 requires the forms be owned by **`ychen146@gsu.edu`**, because Microsoft's built-in notification goes to the form owner. But the person doing the implementation is not the form owner. That is a real conflict, and it has three resolutions:

| Option | How it works | Verdict |
|---|---|---|
| **A. Lab-owned M365 Group** | Create both forms inside a Group both parties belong to. Notifications reach the Group; both can edit | ✅ **Recommended** — solves ownership *and* the graduation problem in one move |
| **B. Dr. Chen builds them** | She creates both forms from the §5.1/§5.2 field tables and sends back the two URLs | ✅ Workable — the field tables are written to be handed over directly |
| **C. Build then transfer** | Built under one account, then moved to a Group | ⚠️ Extra step, easy to forget, and notification settings should be re-checked after the move |

**Option A is worth the ten minutes it costs.** A form owned by an individual becomes inaccessible when that person leaves — the standard way lab forms are lost.

## C3. Who does what

| Step | Owner | Blocking? |
|---|---|---|
| Confirm "Anyone can respond" is available (§4) | **GSU IT** *(if disabled)* | 🔴 **Blocks everything** |
| Disable Vercel Authentication (§3) | David | 🔴 Blocks public launch |
| Decide form ownership (§C2) | Dr. Chen + David | 🔴 Blocks form creation |
| Build Forms A and B (§5) | Whoever owns them | 🔴 Blocks the embed |
| Sharing + notification settings (§6, §7) | Form owner | 🔴 Blocks testing |
| Embed, HTML edits, height tuning (§8) | David | — |
| Test pass incl. mobile + keyboard (§9) | David | — |
| IRB / retention confirmation (§10) | **Dr. Chen** | 🟡 Parallel — start early, do not let it block build |
| Final sign-off on receipt | Dr. Chen | — |

## C4. Realistic effort

Hands-on time, assuming no surprises:

| Work | Estimate |
|---|---|
| Verify tenant setting | 5 min — **or days**, if a GSU IT ticket is required |
| Build Form A (7 questions, restrictions, consent, description, theme) | 30–45 min |
| Build Form B (6 questions) | 15–20 min |
| Sharing + notifications, both forms | 10 min |
| HTML edits, both pages | 20–30 min |
| **Iframe height tuning + real-device testing** | **30–60 min** — the step most often underestimated |
| Full §9 test pass | 45 min |
| **Total hands-on** | **≈ 3–4 hours**, split across two people |

Not included, because they are waiting rather than working: a GSU IT ticket if the tenant setting is off (days), and IRB confirmation if the protocol needs updating (**weeks** — start this first, in parallel).

**The build is a half-day. The approvals are the schedule.** Open the IRB question and the tenant-setting question on day one, then build while they resolve.

## C5. Suggested order

1. **Day 1, in parallel:** ask GSU IT / check the tenant setting (§4) · raise the IRB question with Dr. Chen (§10) · agree ownership (§C2)
2. Disable Vercel Authentication and fix the public URL (§3) — independent of everything else
3. Build both forms, configure sharing and notifications (§5–§7)
4. Send yourself a test submission from a **signed-out, non-GSU** address before touching any HTML — this validates the whole chain while it is still cheap to change
5. Embed, tune heights, test on a real phone (§8–§9)
6. Deploy to a preview URL, repeat the test pass, then production
7. Dr. Chen confirms she receives and can open both

Step 4 is the one to insist on. It proves external access, notification delivery, and inbox routing — the three things most likely to fail — before any site code is written.
