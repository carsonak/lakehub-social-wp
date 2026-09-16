# Task 04: Blog Template Implementation & Post Creation

## Objective and Agreed Behavior

1. **Blog Template (`single.html`)**:
   - The user specified:
     > "The 'blog-template' page is a template for how the pages that the ReadMore buttons and links lead to might look like. For sections that have enough information in the Google drive we can implement them, for links that have missing content we can implement a 'Coming Soon' page or link to their relevant websites where applicable."
   - The approved design export `docs/design-exports/16-09-2026/blog-template.svg` and `blog-template.png` dictates the layout:
     - **Header**: Site header with active navigation indicator.
     - **Hero Header Section**:
       - Post Title (Roboto 48px bold, line-height 58px).
       - Meta row: Author ("By [Full Name]"), Date ("13 Sept 2026 • 5 min read").
       - Featured Image: On desktop, sits side-by-side with or below the title ($652 \times 450$ px, rounded corners `rx=12`).
     - **Article Body**:
       - Centered reading column (max-width 768px).
       - Rich typography: H2 headings (Roboto 40px bold), body text (Hanken Grotesk 16px, line-height 24px), H3 subheadings (Roboto 20px bold).
       - Figure image with caption: Black vertical bar indicator (`width: 2px, height: 21px, fill: black`) beside caption text.
       - Blockquote: Styled pull quote in Inter 20px italic with quote marks.
       - **Share this post** section: Heading ("Share this post", Roboto 18px 600) with social share icons (X/Twitter, LinkedIn, Facebook, Copy link button).
     - **Footer**: Standard site footer with columns, newsletter subscription form, copyright.

2. **Publishing Google Drive Insight Articles**:
   - Google Drive `home_page.docx` provides content for multiple stories.
   - We will publish:
     1. **Flagship Post**:
        - Title: `From Learning to Shipping: Kisumu's Tech Talent Steps Into the Global Market`
        - Content: The complete article provided in `home_page.docx` (96 developers from first Zone01 Kisumu cohort, "A Different Way to Learn", "From Kisumu to the World", "The People Behind the Numbers", "Beyond Graduation", "A Signal for Kisumu's Technology Ecosystem").
        - Featured Image: `wp-content/uploads/2026/09/insight-zone01-1.png` or `wp-content/uploads/2026/09/home-hero.png`.
     2. **GreenTech Article**:
        - Title: `GreenTech: Young Developers Are Building for the Future of the Lake Region`
        - Content: Full copy from `home_page.docx` regarding solar installation monitoring, smart waste management, climate risk, fish traceability.
        - Featured Image: `wp-content/uploads/2026/09/insight-gender.png`.
     3. **AI Learning Journey Article**:
        - Title: `AI Is Becoming Part of the Zone01 Learning Journey`
        - Content: Full copy from `home_page.docx` regarding the Agentic AI Hackathon and UN Sustainable Development Goals.
        - Featured Image: `wp-content/uploads/2026/09/insight-italanta.png`.
     4. **Global Opportunities Article**:
        - Title: `From Kisumu to Global Opportunities`
        - Content: Malika Asman's transition from Zone01 to Outreachy.
     5. **Building From Here Article**:
        - Title: `Building From Here: Why Kisumu's Tech Ecosystem Matters`
        - Content: Build From Here Conference 2026 theme.
     6. **Building Bridges Beyond Kisumu**:
        - Title: `LakeHub Is Building Bridges Beyond Kisumu`
        - Content: Caleb Nyoiro at Mandela Washington Fellowship Alumni Forum.

3. **Query Loop & ReadMore Linking**:
   - The Home page "Latest Insights" section displays these posts dynamically with featured images, titles, excerpts, and working `→` Read-More links leading to the single post page.

---

## Detailed Implementation Steps

### 1. Update `templates/single.html`
Replace basic post-content wrapper with structured block layout:
```html
<!-- wp:template-part {"slug":"header","tagName":"header"} /-->

<main class="wp-block-group lakehub-blog-post-shell" id="main-content">
  <!-- Post Hero Container -->
  <div class="lakehub-blog-header">
    <div class="lakehub-blog-header-content">
      <!-- wp:post-title {"level":1,"className":"lakehub-blog-title"} /-->
      <div class="lakehub-blog-meta">
        <span class="lakehub-blog-author">By <!-- wp:post-author-name /--></span>
        <span class="lakehub-blog-date"><!-- wp:post-date {"format":"j M Y"} /--></span>
        <span class="lakehub-blog-bullet">•</span>
        <span class="lakehub-blog-readtime">5 min read</span>
      </div>
    </div>
    <div class="lakehub-blog-featured-media">
      <!-- wp:post-featured-image {"aspectRatio":"1.45","style":{"border":{"radius":"12px"}}} /-->
    </div>
  </div>

  <!-- Post Body Container -->
  <div class="lakehub-blog-body">
    <!-- wp:post-content {"layout":{"type":"constrained","contentSize":"768px"}} /-->

    <!-- Social Share Block -->
    <div class="lakehub-blog-share">
      <h3>Share this post</h3>
      <div class="lakehub-social-share-links">
        <a href="#" class="lakehub-share-btn share-x" aria-label="Share on X">...</a>
        <a href="#" class="lakehub-share-btn share-linkedin" aria-label="Share on LinkedIn">...</a>
        <a href="#" class="lakehub-share-btn share-facebook" aria-label="Share on Facebook">...</a>
        <button class="lakehub-share-btn share-copy" aria-label="Copy link to clipboard">...</button>
      </div>
    </div>
  </div>
</main>

<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->
```

### 2. Styling in `style.css`
- Blog header layout (grid/flex with title & meta on left, featured image on right on desktop, stacking on mobile).
- Figure caption bar:
  ```css
  .lakehub-blog-body figcaption {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-size: 0.875rem;
    color: #1e1e1e;
    border-left: 2px solid #000;
    padding-left: 0.625rem;
    margin-top: 0.5rem;
  }
  ```
- Pullquote:
  ```css
  .lakehub-blog-body blockquote {
    font-family: var(--wp--preset--font-family--inter);
    font-style: italic;
    font-size: 1.25rem;
    line-height: 1.75rem;
    padding: 1.5rem 2rem;
    border-left: 3px solid var(--wp--preset--color--teal);
    margin: 2rem 0;
  }
  ```
- Social share strip:
  ```css
  .lakehub-blog-share {
    border-top: 1px solid #e5e7eb;
    padding-top: 2rem;
    margin-top: 3rem;
  }
  ```

### 3. Share Script in `assets/js/main.js`
Wire up Twitter/X, LinkedIn, Facebook share URLs and clipboard copy for the current post URL.

### 4. Create Posts via WP-CLI
Insert the 6 articles into the database with proper slugs, excerpts, categories, and featured images.

---

## Progress & Tracking

- [x] Structure `templates/single.html` matching design export (`blog-template.svg`)
- [x] Add blog post styles to `style.css` (header grid, typography, caption border, pullquote, social share)
- [x] Implement social share interactions in `assets/js/main.js` (X, LinkedIn, Facebook, clipboard copy)
- [x] Create flagship article: "From Learning to Shipping" (ID 214)
- [x] Create supplementary articles from `home_page.docx` (IDs 215, 216, 217, 218, 219)
- [x] Verify Home page Query Loop displays cards and links correctly
- [x] Test desktop and mobile layout of blog template (automated Playwright test passed)

## Unplanned Changes & Scope Deviations

Updated author display name for user 1 to "LakeHub Team" for consistent editorial presentation on single blog posts.

