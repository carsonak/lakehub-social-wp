# Task 03: Scrolling Logos Track Hover Area & Edge Spacing

## Objective and Agreed Behavior

1. **Restricted Hover Trigger Area**:
   - The hover pause trigger for the logos carousel is restricted strictly to the logos track (`.is-style-lakehub-partner-logos`).
   - Hovering over the section heading `"TRUSTED BY ORGANIZATIONS GLOBALLY"` will **not** pause or interrupt the continuous scrolling animation.
   - Pointer enter/leave events are attached directly to the track element.

2. **Full-Width Edge-to-Edge Logos Appearance**:
   - Remove side padding on `.is-style-lakehub-partners` completely (`padding-inline: 0 !important`).
   - Allow `.is-style-lakehub-partner-logos` to span the full viewport width (`max-width: 100% !important; width: 100% !important; padding-inline: 0 !important`).
   - The scrolling logos now seamlessly appear and disappear from the outer edges of the viewport.

## Progress & Tracking

- [x] Attach pointer enter/leave event listeners directly to `track` in `assets/js/main.js`.
- [x] Remove side padding and enforce full width on `.is-style-lakehub-partners` and `.is-style-lakehub-partner-logos` in `style.css`.
- [x] Verify that hovering the title does not pause scroll, hovering the logos pauses scroll, and logos extend to viewport edges.
