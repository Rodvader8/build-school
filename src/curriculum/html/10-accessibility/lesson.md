About one in five Australians lives with a disability. Plenty of them browse with a screen reader, a keyboard only, or zoomed right in. A page built for them is also a page Google understands better. Good HTML does most of the work.

## The checklist pros run

| Check | Why |
|---|---|
| `<html lang="...">` | The screen reader picks the right voice. |
| Every `img` has `alt` | Describes the picture. A purely decorative image gets `alt=""` (empty, but present) so it's skipped. |
| Headings don't skip levels | `h1` then `h2` then `h3`. Jumping from `h1` to `h4` breaks the outline people navigate by. |
| Every input has a `label` | Otherwise a screen reader just says "edit text". |
| Link text makes sense on its own | Screen reader users often list all the links. Ten "click here" links are useless. |
| A `nav` has a name | `aria-label="Main"` tells people which menu this is when there are several. |

`aria-label` is an **ARIA** attribute: extra information for assistive technology. The first rule of ARIA is to use plain HTML first and only reach for it when HTML has no tag for the job.

## Your turn

This page has **six** problems from the checklist. Find and fix them all. The checks tell you which ones are still broken.

> Pro move: in Chrome, open DevTools (F12), go to the **Lighthouse** tab and run an Accessibility report. It catches most of these automatically.
