# Vibecoding Project Tracker — Design

**Status:** Hackathon starter design doc · fill in the **`<TODO>`** sections before you tag `design-done`.

**Why this file exists.** This tracker is your tool. It should look like *your* tool — not a generic Kanban with default Tailwind blue. Twenty minutes of design decisions here will be visible on every screen for the next six weeks of Module 5.

**Who owns this.** Person B, during the same window the rest of the team is reviewing the PRD. By the time the team converges to start M4 (`data-model`), this file should be filled in and the colors should already be in `tailwind.config.js`.

---

## 1. Mood / vibe

One sentence that captures the feeling the tracker should leave you with.

A clean dark-mode board where urgent and overdue tasks stand out right away.

Two or three references that capture the vibe (links to dribbble shots, screenshots of apps you admire, Pinterest boards — anything visual):

- Linear (`https://linear.app`) — dark backgrounds with clean borders.
- Raycast (`https://www.raycast.com`) — dark UI with bright accent colors.
- GitHub Dark Mode (`https://github.com`) — simple dark layout with clear status labels.

Anti-references — what we are explicitly **not** trying to look like:

- Cluttered Jira boards or bright default Tailwind templates.

## 2. Color palette

These are the colors the build milestones will reference. Once chosen, paste the hex values into `tailwind.config.js` so the rest of the team can use Tailwind utility classes (e.g. `bg-brand-primary`, `border-due-warning`).

### Brand

| Token | Hex | Where it shows up |
|---|---|---|
| `brand-primary` | `#4F46E5` | Header, "+" button, focus rings |
| `brand-accent` | `#22D3EE` | Highlights, hover states, links |
| `surface-page` | `#09090B` | Page background |
| `surface-card` | `#18181B` | Card background |
| `text-primary` | `#F4F4F5` | Body text |
| `text-muted` | `#A1A1AA` | Captions, dates, counts |

### Task type (M6 `tag-style`)

| Token | Hex | When used |
|---|---|---|
| `type-feature` | `#38BDF8` | Cards tagged `feature` (accent stripe + icon) |
| `type-bug` | `#F472B6` | Cards tagged `bug` (accent stripe + icon) |

### Due-date states (M8 `due-tint`)

| Token | Hex | When used |
|---|---|---|
| `due-safe` | `#10B981` | More than 2 days out |
| `due-warning` | `#FACC15` | Less than 24 hours |
| `due-overdue` | `#FF2A54` | Past due |
| `due-neutral` | `#71717A` | Done (overrides date) |

## 3. Typography

| Role | Font | Why |
|---|---|---|
| Heading | `Space Grotesk` | It looks modern and stands out for headers. |
| Body | `Inter` | It is clean and easy to read on dark backgrounds. |
| Monospace (tags, badges, code) | `JetBrains Mono` | It keeps tags, dates, and code snippets clear. |

Suggested sizes (override only if the design demands it):

- Page title: 24 px / semibold
- Section header: 16 px / semibold uppercase
- Card title: 14 px / medium
- Body: 14 px / regular
- Caption: 12 px / regular muted

## 4. Component principles

One short sentence per element. These set the tone for the build phase — Person A's modal and Person B's anchor board should both feel like they came from this doc.

- **Cards:** Dark cards with a thin border and a bright red stripe when overdue.
- **Buttons:** Solid fill, no gradients, rounded corners, and clear hover states.
- **Modal:** Centered dark box with a dark dimmed background.
- **Empty states:** Dashed border with grey text and no icons.
- **Drag affordance (if used):** Grab cursor on hover with a status dropdown as a backup.

## 5. Voice / microcopy

Three lines of microcopy that capture the tone of the product. Keep it short — these are the words a stressed user reads at 11pm.

| Where | Text |
|---|---|
| "+" button label | `+ New Task` |
| Empty column placeholder | `No tasks here yet.` |
| Toast after "Copy as Prompt Context" | `Copied. Paste it into your AI.` |
| Confirm-delete message | `Delete this task? You can't undo this.` |
| Handoff toast (M7 `task-owner`) | `Assigned to {name}.` |

## 6. Logo / wordmark

The tracker probably doesn't need a logo, but it does need a name and a wordmark style.

- **Product name:** `Vibecoding Project Tracker`
- **Wordmark style:** Bold heading font in the primary brand color with no icon.

## 7. Out of scope (this hackathon)

To keep design tight, the following are explicitly not part of `design-done`:

- A dark mode toggle. Pick one mode and ship it.
- Multiple themes. One brand, applied consistently.
- Animations beyond a 200 ms fade on toast notifications.
- A custom icon set. Use [Lucide icons](https://lucide.dev) via Tailwind classes if you need any.

---

*DESIGN.md version: hackathon-starter v1*