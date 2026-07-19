# CompareList UX audit — 2026-07-20

## Scope

- Surface: localized homepage comparison workflow at `/zh`
- Core task: open the tool, add two lists, adjust matching options, compare, inspect and export results
- Viewports: desktop 1440 × 1000 and mobile 390 × 844
- Mode: combined UX and accessibility review

## Captured flow

1. `01-desktop-entry.png` — desktop landing and empty comparison tool
2. `02-desktop-demo-after-click.png` — desktop demo data and generated results
3. `03-desktop-options.png` — expanded matching options
4. `04-mobile-entry.png` — mobile landing and empty tool
5. `05-mobile-results.png` — mobile action area after generating results
6. `06-mobile-results-detail.png` — mobile result statistics
7. `07-mobile-result-tabs.png` — mobile Venn diagram, result tabs and toolbar
8. `08-mobile-history.png` — mobile history drawer empty state

Post-change verification:

9. `09-mobile-entry-after.png` — corrected mobile header, localized hero and compact input flow
10. `10-mobile-results-after.png` — visible mobile result summary, 3 × 2 categories and two-row toolbar
11. `11-desktop-entry-after.png` — shorter desktop input panels with actions inside the first viewport
12. `12-desktop-results-after.png` — automatic result positioning below the sticky header
13. `13-mobile-history-after.png` — accessible history dialog with visible keyboard focus
14. `14-mobile-csv-page-after.png` — reusable input improvements on the CSV-specific landing page

## Strengths

- The primary two-list mental model is clear and the local-processing promise is visible.
- Demo data creates a useful result without requiring setup.
- Results include overview statistics, a visual summary and category-level data.
- File import, smart matching, filtering, sorting, copying and export cover the main comparison jobs.

## High-impact findings

1. Mobile header navigation does not reflow. Three desktop anchors are squeezed into vertical Chinese text, consume excessive height and push controls off-screen (`04-mobile-entry.png`).
2. Input areas are 460 px tall at every breakpoint. The compare action appears very late on desktop and requires substantial scrolling on mobile (`01-desktop-entry.png`, `04-mobile-entry.png`).
3. The mobile action bar compresses three controls into one row. Chinese button labels wrap character-by-character and the primary action is harder to scan (`05-mobile-results.png`).
4. Swapping lists is unavailable on mobile because the control is desktop-only.
5. Six result categories use a horizontally clipped tab row with no visible overflow affordance (`07-mobile-result-tabs.png`).
6. Search, sort, copy and export compete for one narrow toolbar row; the icon-only overflow button has no accessible name (`07-mobile-result-tabs.png`).
7. Secondary and muted text are too dim for their small size against the dark background across inputs, options and result controls (`01`, `03`, `05`, `07`).
8. Several icon controls have tooltip-only or missing names: history, clear input, export, drawer close and record deletion.
9. The history drawer lacks dialog semantics, initial focus management, Escape handling and background scroll locking (`08-mobile-history.png`).
10. File validation uses blocking browser alerts instead of recoverable inline feedback.
11. Chinese hero copy mixes an untranslated English “Instantly” into the primary heading (`01`, `04`).
12. Motion and smooth scrolling do not currently honor reduced-motion preferences.

## Evidence limits

- Screenshots can show layout, hierarchy and visible contrast risk, but do not prove WCAG conformance.
- Keyboard focus order, screen-reader announcements, file dialog behavior and downloads require functional testing in addition to screenshot review.
- This run focuses on the main homepage workflow. The CSV-specific entry screen was spot-checked because it reuses the changed inputs; other specialized SEO landing pages were not captured as separate end-to-end flows.

## Implemented improvements

- Hidden desktop anchor navigation on small screens and kept language/history controls at 40 px targets.
- Reduced input heights responsively, raised placeholder contrast and added a mobile list-swap control.
- Reflowed primary actions so Chinese and other longer labels never stack character-by-character.
- Added result auto-positioning that respects reduced-motion preferences.
- Replaced the clipped mobile tab strip with a visible 3 × 2 tab grid.
- Split result filtering from copy/export actions and gave export a visible label and accessible menu semantics.
- Increased muted-text and border contrast while retaining the existing dark visual system.
- Added focus-visible treatment and reduced-motion support globally.
- Added dialog semantics, Escape handling, focus return, scroll locking and named icon controls to history.
- Replaced blocking file-type and size alerts with inline recoverable errors; localized row, reset, all and clear labels.
- Added pressed/expanded states, tab/tabpanel relationships and names for previously unlabeled checkboxes and buttons.
- Corrected the mixed-language Chinese hero heading.

## Verification completed

- Desktop and mobile screenshots were recaptured at the original viewport sizes.
- No horizontal document overflow at 390 px or 1440 px.
- Mobile export menu exposes named menu items.
- History opens as a named dialog, focuses Close, closes with Escape and restores focus to History.
- Lint, TypeScript, 16 unit tests and a production build with 103 static pages passed.
