# Build log (for Part-C: problems faced and how they were solved)

## Problem 1: Links to pages that didn't exist yet
The starter homepage linked to about, projects, research, experience and
design-portfolio pages that weren't built. Clicking them showed a 404.
**Fix:** Built pages one at a time. The design portfolio isn't ready, so its
homepage link became a non-clickable "Soon" label and its footer link was removed.

## Problem 2: Shared script running on pages that don't need it
script.js loads projects.json on every page, but only the homepage and projects
page have a project grid, so other pages made a pointless request that could fail.
**Fix:** Wrapped the AJAX call in a check: `if ($("#project-grid").length)`.

## Problem 3: Broken paths after reorganising into folders
Moving files into css/, js/, images/ and data/ broke the old relative paths
(style.css, script.js, projects.json).
**Fix:** Updated every href/src in the HTML and the AJAX URL (now data/projects.json).

## Still to test
- Chrome vs Edge observations (do this when all pages are done)
