# Task 04: About Page Narrative & Mission/Vision Copy Updates

## Objective and Agreed Behavior

Update the copy on the About page to match the current approved Figma exports (`docs/design-exports/About.svg`):
1. **Intro Section — "About LakeHub"**: Add the descriptive narrative section directly below the About Hero and above the "Mission & Vision" section.
2. **Mission & Vision Question Headings**:
   - Change heading from "Mission" to **"What we dream of doing?"**
   - Text: *"To democratize access to quality technical training, opening sustainable pathways for young Africans to actively participate, build careers, and flourish within the global digital economy."*
   - Change heading from "Vision" to **"Where we’re heading?"**
   - Text: *"To cultivate a fully integrated regional network where every apprentice, graduate, and industry mentor continuously unlocks economic opportunity, exchanges expertise, and drives meaningful community transformation."*

---

## Detailed Instructions for Implementing Agent

### 1. Update Pattern Template
File: `wp-content/themes/lakehub-social/patterns/about-page.php`

#### Insert "About LakeHub" Section before "Mission & Vision":
```html
<!-- wp:group {"className":"is-style-lakehub-about-intro","layout":{"type":"default"},"tagName":"section","metadata":{"name":"About · Intro Narrative"}} -->
<section class="wp-block-group is-style-lakehub-about-intro">
<!-- wp:heading -->
<h2 class="wp-block-heading">About <mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-teal-color">LakeHub</mark></h2>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>LakeHub is a tech education and innovation ecosystem that creates pathways for African youth to enter and thrive in the digital economy. Through programs such as Zone01 and other initiatives, LakeHub connects young people with practical technology training, mentorship, community, and opportunities. Its mission is to democratize access to tech education, based on the belief that talent is equally distributed but opportunities are not. LakeHub Social extends this ecosystem beyond training by connecting apprentices, alumni, and mentors in one network, keeping graduates connected to opportunities and to each other while enabling LakeHub to understand where its talent goes, how they progress, and the impact they create.</p>
<!-- /wp:paragraph -->
</section>
<!-- /wp:group -->
```

#### Update Headings inside Mission Card:
```html
<div class="wp-block-group is-style-lakehub-mission-copy">
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">What we dream of doing?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>To democratize access to quality technical training, opening sustainable pathways for young Africans to actively participate, build careers, and flourish within the global digital economy.</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Where we’re heading?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>To cultivate a fully integrated regional network where every apprentice, graduate, and industry mentor continuously unlocks economic opportunity, exchanges expertise, and drives meaningful community transformation.</p>
<!-- /wp:paragraph -->
</div>
```

### 2. Styling Support in `style.css`
Ensure `.is-style-lakehub-about-intro` has appropriate spacing:
```css
.is-style-lakehub-about-intro {
  max-width: 72rem;
  margin-inline: auto;
  padding: 3rem var(--lakehub-gutter) 1rem;
}
.is-style-lakehub-about-intro h2 {
  font-size: 2.25rem;
  line-height: 2.75rem;
  letter-spacing: -0.06rem;
}
.is-style-lakehub-about-intro p {
  margin-top: 1.25rem;
  font: 400 1rem/1.75rem var(--wp--preset--font-family--inter);
  color: var(--wp--preset--color--body);
}
```

---

## Acceptance Criteria

- The About page displays the "About LakeHub" section with the exact Figma text.
- Mission & Vision card features "What we dream of doing?" and "Where we’re heading?" as third-level headings.
- Paragraph copy under each heading matches the Figma design.
- Block markup validates cleanly without Site Editor recovery errors.

---

## Progress & Tracking

- **Status**: `Pending`
- [ ] Pattern `patterns/about-page.php` updated
- [ ] CSS styling in `style.css` added/verified
- [ ] Editor validation and frontend rendering verified
- **Last Checkpoint**: Plan drafted on 14 September 2026.
- **Next Action**: Apply pattern edits upon plan approval.
- **Commit Receipt**: *Pending*

---

## Unplanned Changes & Scope Deviations

*(Document here any deviations, edge cases, or adjustments made during execution that were not part of the initial plan.)*
- None recorded yet.

---

## Recovery

Revert edits to `wp-content/themes/lakehub-social/patterns/about-page.php` and `style.css`.
