# LakeHub Social — Website Link Inventory

> **Document Version**: 1.0  
> **Last Updated**: September 2026  
> **Repository Baseline**: LakeHub Social WordPress Block Theme (`lakehub-social` 3.2.3)  
> **Maintenance Notice**: This document inventories all static, dynamic, and pending links across the LakeHub Social website. For features and pages currently routing to `/coming-soon/`, this document details both their current fallback behavior and their intended destinations, and should be updated as those dedicated pages/features are deployed.

---

## Table of Contents

1. [Architectural Overview & Global Behaviors](#1-architectural-overview--global-behaviors)
2. [Global Repeated Components](#2-global-repeated-components)
   - [2.1 Site Header & Primary Navigation](#21-site-header--primary-navigation)
   - [2.2 Site Footer](#22-site-footer)
3. [Page-by-Page Inventories](#3-page-by-page-inventories)
   - [3.1 Home Page (`/`)](#31-home-page-)
   - [3.2 About Page (`/about/`)](#32-about-page-about)
   - [3.3 Programs Page (`/programs/`)](#33-programs-page-programs)
   - [3.4 Impact Page (`/impact/`)](#34-impact-page-impact)
   - [3.5 Team Page (`/team/`)](#35-team-page-team)
   - [3.6 Coming Soon Page (`/coming-soon/`)](#36-coming-soon-page-coming-soon)
   - [3.7 Single Blog Post Template (`/{post-slug}/`)](#37-single-blog-post-template-post-slug)
   - [3.8 404 Page Not Found (`/404`)](#38-404-page-not-found-404)
   - [3.9 Blog Archive Template (`index.html`)](#39-blog-archive-template-indexhtml)
4. [Dynamic Content Patterns Reference](#4-dynamic-content-patterns-reference)
5. [Pending Implementations & Coming Soon Register](#5-pending-implementations--coming-soon-register)
6. [Summary Verification Matrix](#6-summary-verification-matrix)

---

## 1. Architectural Overview & Global Behaviors

All link behaviors across LakeHub Social conform to consistent accessibility, security, and navigation standards governed by `theme.json` and `assets/js/main.js`:

1. **Internal Links**:
   - All internal routes are root-relative (e.g., `/`, `/about/`, `/programs/`).
   - Default navigation executes in the same tab (`_self`).
   - Active page states in the header navigation are dynamically detected via `WP_HTML_Tag_Processor` in `functions.php`, adding `.current-menu-item` to the `<li>` and `aria-current="page"` to the `<a>` tag for screen readers.
2. **External Links**:
   - All external URLs (beginning with `http://` or `https://` targeting a different origin) automatically receive `target="_blank"` and `rel="noopener noreferrer"` via client-side runtime enhancement in `main.js`.
3. **In-Page Anchor Scrolling**:
   - Hash anchors (`#about`, `#mission`, `#history`, `#team`, etc.) trigger smooth scrolling to section landmarks when activated on the same page. When activated from another page, the browser navigates to the target page and lands at the designated anchor.
4. **Interactive Action Affordances**:
   - Several elements styled as buttons perform client-side JavaScript actions (e.g., clipboard copy on blog posts, text accordion drawers on the About page, Mailchimp AJAX form feedback in the footer) without changing the browser URL.

---

## 2. Global Repeated Components

These components are registered as template parts (`parts/header.html` and `parts/footer.html`) and appear on every page of the site. Differences on individual pages are documented below.

### 2.1 Site Header & Primary Navigation

Defined in `patterns/site-header.php` and embedded via `parts/header.html`.

| Label / Element | Exact Location | Destination URL | Where It Leads | Click & Browser Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **LakeHub Header Logo** | Top-left of header bar | `/` | LakeHub homepage | Same tab (`_self`). Resets scroll to top of Home. |
| **Home** | Primary navigation menu | `/` | LakeHub homepage | Same tab (`_self`). Has `aria-current="page"` when on Home. |
| **About** | Primary navigation menu | `/about/` | About LakeHub, Mission, Story & Team | Same tab (`_self`). Has `aria-current="page"` when on About. |
| **Programs** | Primary navigation menu | `/programs/` | Flagship Zone01 and other programs | Same tab (`_self`). Has `aria-current="page"` when on Programs. |
| **Impact** | Primary navigation menu | `/impact/` | Community projects & portfolio stories | Same tab (`_self`). Has `aria-current="page"` when on Impact. |
| **Mobile Menu Toggle** | Header right (mobile viewports $\le 600\text{px}$) | `button[aria-haspopup="true"]` | Navigation drawer toggle | In-page button. Toggles overlay navigation drawer with `aria-expanded`. |

#### Page Differences in Header
- **Active Navigation Indicator**: The PHP block filter in `functions.php` checks the current URL against the menu item. On `/`, "Home" is marked active; on `/about/`, "About" is marked active; on `/programs/`, "Programs" is marked active; on `/impact/`, "Impact" is marked active. On secondary templates (`/team/`, `/coming-soon/`, blog posts, 404), all navigation items remain neutral.

---

### 2.2 Site Footer

Defined in `patterns/site-footer.php` and embedded via `parts/footer.html`.

| Label / Element | Exact Location | Destination URL | Where It Leads | Click & Browser Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **LakeHub Footer Logo** | Footer brand column (left) | `/` | LakeHub homepage | Same tab (`_self`). |
| **LinkedIn Icon** | Footer brand column, social icons | `https://www.linkedin.com/company/lakehub/` | Official LakeHub LinkedIn page | Opens in new tab (`target="_blank" rel="noopener noreferrer"`). |
| **Facebook Icon** | Footer brand column, social icons | `https://www.facebook.com/LakeHubKisumu/` | Official LakeHub Facebook page | Opens in new tab (`target="_blank" rel="noopener noreferrer"`). |
| **X (Twitter) Icon** | Footer brand column, social icons | `https://x.com/lakehub` | Official LakeHub X profile | Opens in new tab (`target="_blank" rel="noopener noreferrer"`). |
| **About Us** | "Quick Links" column | `/about/` | About page | Same tab (`_self`). |
| **Our Mission** | "Quick Links" column | `/about/#mission` | Mission & Vision section on About page | Anchor scroll on `/about/`; cross-page navigation from other pages. |
| **Impact Stories** | "Quick Links" column | `/impact/` | Impact page | Same tab (`_self`). |
| **History** | "Quick Links" column | `/about/#history` | Our Story section on About page | Anchor scroll on `/about/`; cross-page navigation from other pages. |
| **FAQ** | "Help" column | `/coming-soon/` *(Intended: `/faq/`)* | Dedicated FAQ page (pending) | Same tab (`_self`). Currently routes to Coming Soon fallback. |
| **Support** | "Help" column | `/coming-soon/` *(Intended: `/support/`)* | Support & Helpdesk portal (pending) | Same tab (`_self`). Currently routes to Coming Soon fallback. |
| **Newsletter Subscribe** | "Get in touch!" column | Form submit action | Mailchimp newsletter sign-up | In-page AJAX form submission handled by `main.js`. No URL redirection. |
| **Privacy Policy** | Footer bottom row (center-right) | `/coming-soon/` *(Intended: `/privacy-policy/`)* | Privacy Policy legal terms (pending) | Same tab (`_self`). Currently routes to Coming Soon fallback. |
| **Contact Us** | Footer bottom row (center-right) | `mailto:info@lakehub.co.ke` | LakeHub general email inbox | Launches system default email client to compose message. |

#### Page Differences in Footer
- **Anchor Jumping vs In-Page Smooth Scrolling**:
  - When clicked on the **About page** (`/about/`), the links `Our Mission` (`/about/#mission`) and `History` (`/about/#history`) trigger smooth in-page scrolling directly to their target sections without page reloading.
  - When clicked on **any other page**, the browser performs standard navigation to `/about/` and immediately scrolls to the target anchor.

---

## 3. Page-by-Page Inventories

### 3.1 Home Page (`/`)

- **Template**: `templates/front-page.html` (Post ID: 11)
- **Header State**: "Home" link active (`aria-current="page"`).
- **Footer State**: Standard footer.

#### Page Content Links

| Label / Element | Exact Location | Destination URL | Where It Leads | Click & Browser Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **JOIN THE COMMUNITY** | Hero Section (`#community`), primary button | `/coming-soon/` *(Intended: Community signup/portal)* | Community registration portal (pending) | Same tab (`_self`). Currently routes to Coming Soon fallback. |
| **OUR PROGRAMS** | Hero Section (`#community`), outline button | `/programs/` | LakeHub Programs page | Same tab (`_self`). |
| **GIZ Logo** | Partners Section (`.is-style-lakehub-partners`), carousel slide 1 | `https://www.giz.de/en/` | Deutsche Gesellschaft für Internationale Zusammenarbeit (GIZ) homepage | Opens in new tab (`target="_blank" rel="noopener noreferrer"`). Keyboard and drag scrollable track. |
| **Livelihood Impact Fund Logo** | Partners Section, carousel slide 2 | `https://www.livelihoodimpactfund.org/` | Livelihood Impact Fund homepage | Opens in new tab (`target="_blank" rel="noopener noreferrer"`). |
| **Partners for Equity Logo** | Partners Section, carousel slide 3 | `https://partnersforequity.org/` | Partners for Equity Australia homepage | Opens in new tab (`target="_blank" rel="noopener noreferrer"`). |
| **German Cooperation Logo** | Partners Section, carousel slide 4 | `https://www.giz.de/en/` | German Federal Ministry / GIZ cooperation | Opens in new tab (`target="_blank" rel="noopener noreferrer"`). |
| **African Visionary Fellowship Logo** | Partners Section, carousel slide 5 | `https://www.segalfamilyfoundation.org/our-partners/african-visionary-fellowship/` | Segal Family Foundation AVF page | Opens in new tab (`target="_blank" rel="noopener noreferrer"`). |
| **Latest Insights (Cards)** | Latest Insights Section (`#stories`), dynamic post grid | Dynamic permalink: `/{post-slug}/` | Full single article story view | Each card provides 3 links (Featured Image, Title, and Read More "→" arrow). Same tab (`_self`). See Section 4 for details. |
| **EXPLORE PROGRAMS** | Call To Action Section (bottom), primary button | `/programs/` | LakeHub Programs page | Same tab (`_self`). |

---

### 3.2 About Page (`/about/`)

- **Template**: `templates/about.html` (Post ID: 146)
- **Header State**: "About" link active (`aria-current="page"`).
- **Footer State**: "Our Mission" and "History" links perform smooth in-page scrolling.

#### Page Content Links

| Label / Element | Exact Location | Destination URL | Where It Leads | Click & Browser Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **Read More / Hide Toggle** | Our Story Section (`#history`), collapsible drawer | In-page JavaScript action button | Expands/collapses extended history paragraphs | In-page button (`main.js`). Does not alter browser URL. Sets `aria-expanded`. |
| **Meet The Full Team** | Meet Our Team Section (`#team`), bottom centered button | `/team/` | Comprehensive LakeHub Team page | Same tab (`_self`). |

> *Note: The 6 featured team member cards rendered by `lakehub/team` in this section display photos, roles, and bios, but contain no outbound links.*

---

### 3.3 Programs Page (`/programs/`)

- **Template**: `templates/programs.html` (Post ID: 21)
- **Header State**: "Programs" link active (`aria-current="page"`).
- **Footer State**: Standard footer.

#### Page Content Links

| Label / Element | Exact Location | Destination URL | Where It Leads | Click & Browser Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **View Program** | Flagship Program Hero (`#flagship`), centered primary button | `https://www.zone01kisumu.ke/` | Zone01 Kisumu official website | Opens in new tab (`target="_blank" rel="noopener noreferrer"`). |
| **FemiDevs — Learn More ➜** | Other Programs Grid, Card 1 | `/coming-soon/` *(Intended: `/programs/femidevs/`)* | FemiDevs women-in-tech program landing page (pending) | Same tab (`_self`). Falls back to Coming Soon when `_lakehub_program_url` is unset. |
| **Opportunities for Youth in Africa — Learn More ➜** | Other Programs Grid, Card 2 | `/coming-soon/` *(Intended: `/programs/oya/`)* | OYA program portal (pending) | Same tab (`_self`). Falls back to Coming Soon when `_lakehub_program_url` is unset. |
| **Alumni Network — Learn More ➜** | Other Programs Grid, Card 3 | `/coming-soon/` *(Intended: `/programs/alumni/`)* | LakeHub Alumni portal (pending) | Same tab (`_self`). Falls back to Coming Soon when `_lakehub_program_url` is unset. |
| **Issue-Based Collaborative Network — Learn More ➜** | Other Programs Grid, Card 4 | `/coming-soon/` *(Intended: `/programs/icon/`)* | ICON collaborative governance hub (pending) | Same tab (`_self`). Falls back to Coming Soon when `_lakehub_program_url` is unset. |

---

### 3.4 Impact Page (`/impact/`)

- **Template**: `templates/impact.html` (Post ID: 150)
- **Header State**: "Impact" link active (`aria-current="page"`).
- **Footer State**: Standard footer.

#### Page Content Links

| Label / Element | Exact Location | Destination URL | Where It Leads | Click & Browser Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **Read more (with arrow)** | Community Projects (`#community-engagements`), Chichwa platform card | `/coming-soon/` *(Intended: `/impact/chichwa/`)* | Detailed Chichwa e-commerce case study (pending) | Same tab (`_self`). Currently routes to Coming Soon fallback. |
| **Read more** | Inspiring Portfolios (`#portfolios`), inline paragraph text | `/from-kisumu-to-global-opportunities/` | Malika Asman full feature story article | Same tab (`_self`). In-text link leading to single post page. |
| **View More People** | Inspiring Portfolios (`#portfolios`), action button | `/coming-soon/` *(Intended: `/impact/portfolios/`)* | Alumni portfolio directory (pending) | Same tab (`_self`). Currently routes to Coming Soon fallback. |

> *Note: The 4 "Dimensions of Transformation" cards (`#transformation`) feature interactive CSS scaling and proximity lighting on cursor move, but contain no hyperlinks.*

---

### 3.5 Team Page (`/team/`)

- **Template**: `templates/team.html` (Post ID: 151)
- **Header State**: Neutral active state (no primary navigation link active).
- **Footer State**: Standard footer.

#### Page Content Links
- **Dynamic Team Grid**: Renders all 12 published LakeHub team members via `lakehub/team {"limit":0}`:
  1. James Odede (Founder & CEO)
  2. David Sultan (Co-founder)
  3. Alpha Omondi (Lead Systems Engineer)
  4. Bellah Oyucho (Programs Manager)
  5. Daisy Achieng' (Community Lead)
  6. Rodgers Kaunda (Technical Mentor)
  7. Paul Oguda (Advisory Board Member)
  8. Caleb Nyoiro (Operations Associate)
  9. Deril Okoth (Frontend Developer)
  10. Torsten Kremser (Partner & Advisor)
  11. Lydiah Ojowi (Finance Manager)
  12. Dorcas Owinoh (Communications Specialist)
- *Link Count*: **0 page content links**. Each member card displays a portrait photo, member name, position role, and biographical copy; no external profiles or social links are configured on these cards.

---

### 3.6 Coming Soon Page (`/coming-soon/`)

- **Template**: `templates/page.html` with pattern `lakehub-social/coming-soon` (Post ID: 220)
- **Header State**: Neutral active state.
- **Footer State**: Standard footer.

#### Page Content Links

| Label / Element | Exact Location | Destination URL | Where It Leads | Click & Browser Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **BACK TO HOME** | Central Coming Soon Card, primary button | `/` | LakeHub homepage | Same tab (`_self`). |

---

### 3.7 Single Blog Post Template (`/{post-slug}/`)

- **Template**: `templates/single.html`
- **Header State**: Neutral active state.
- **Footer State**: Standard footer.

#### Page Content & Social Share Links

| Label / Element | Exact Location | Destination URL | Where It Leads | Click & Browser Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **Copy link to clipboard** | Social Share Dock (`.lakehub-social-share-links`), first icon button (`.share-copy`) | None (JavaScript Clipboard API) | Copies post URL to system clipboard | In-page button. Displays temporary "Copied!" tooltip for 2 seconds. |
| **Share on LinkedIn** | Social Share Dock, second icon (`.share-linkedin`) | `https://www.linkedin.com/sharing/share-offsite/?url={postUrl}` | LinkedIn post share dialogue | Opens in new tab (`target="_blank" rel="noopener noreferrer"`). URL dynamically populated by `main.js`. |
| **Share on X** | Social Share Dock, third icon (`.share-x`) | `https://twitter.com/intent/tweet?url={postUrl}&text={postTitle}` | X / Twitter tweet composer | Opens in new tab (`target="_blank" rel="noopener noreferrer"`). URL and title dynamically populated by `main.js`. |
| **Share on Facebook** | Social Share Dock, fourth icon (`.share-facebook`) | `https://www.facebook.com/sharer/sharer.php?u={postUrl}` | Facebook share dialogue | Opens in new tab (`target="_blank" rel="noopener noreferrer"`). URL dynamically populated by `main.js`. |

---

### 3.8 404 Page Not Found (`/404`)

- **Template**: `templates/404.html`
- **Header State**: Neutral active state.
- **Footer State**: Standard footer.

#### Page Content Links

| Label / Element | Exact Location | Destination URL | Where It Leads | Click & Browser Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **Back to Home** | Main error message container, primary button | `/` | LakeHub homepage | Same tab (`_self`). Safe exit for users encountering broken or expired routes. |

---

### 3.9 Blog Archive Template (`index.html`)

- **Template**: `templates/index.html` (Used for post archive/blog listing fallbacks)
- **Header State**: Neutral active state.
- **Footer State**: Standard footer.

#### Page Content Links

| Label / Element | Exact Location | Destination URL | Where It Leads | Click & Browser Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **Post Title Links** | Inside Query Loop post items | `/{post-slug}/` | Individual single post view | Same tab (`_self`). |
| **Previous Page** | Query pagination controls (`wp:query-pagination-previous`) | `?paged={n-1}` | Preceding page of blog posts | Same tab (`_self`). Only rendered when earlier pages exist. |
| **Page Number Links** | Query pagination controls (`wp:query-pagination-numbers`) | `?paged={n}` | Specific page of blog posts | Same tab (`_self`). |
| **Next Page** | Query pagination controls (`wp:query-pagination-next`) | `?paged={n+1}` | Next page of blog posts | Same tab (`_self`). Only rendered when additional pages exist. |

---

## 4. Dynamic Content Patterns Reference

To accommodate future content creation without invalidating this document, dynamic collections are structured according to standardized patterns:

### Pattern A: Latest Insights Query Loop (Home Page)
- **Markup Location**: `templates/front-page.html` / `patterns/home-insights.php`
- **Fixed Pattern Structure**:
  ```html
  <div class="wp-block-group is-style-lakehub-insight-card">
    <a href="{post-permalink}"><img class="wp-block-post-featured-image" ... /></a>
    <div class="wp-block-group is-style-lakehub-insight-copy">
      <h3 class="wp-block-post-title"><a href="{post-permalink}">{post-title}</a></h3>
      <p class="wp-block-post-excerpt">{post-excerpt}</p>
      <a class="wp-block-read-more" href="{post-permalink}">→</a>
    </div>
  </div>
  ```
- **Dynamic Variables**:
  - `{post-permalink}`: Root-relative path `/{post-slug}/`.
  - `{post-title}`: Title string of the published post.
  - `{post-featured-image}`: Media attachment image URL.
- **Routing Target**: All 3 link targets route to `templates/single.html` for that post.
- **Current Live Post Examples (9 posts)**:
  1. `/from-learning-to-shipping/` — "From Learning to Shipping: Kisumu's Tech Talent Steps Into the Global Market"
  2. `/greentech-lake-region/` — "GreenTech: Young Developers Are Building for the Future of the Lake Region"
  3. `/ai-zone01-learning-journey/` — "AI Is Becoming Part of the Zone01 Learning Journey"
  4. `/from-kisumu-to-global-opportunities/` — "From Kisumu to Global Opportunities"
  5. `/building-from-here-tech-ecosystem/` — "Building From Here: Why Kisumu's Tech Ecosystem Matters"
  6. `/lakehub-building-bridges-beyond-kisumu/` — "LakeHub Is Building Bridges Beyond Kisumu"
  7. `/zone01-kisumu-and-nationdev-sign-mou/` — "Zone01 Kisumu and Nation.dev Sign MoU"
  8. `/closing-the-gender-parity-in-technology/` — "Closing the Gender Parity in Technology"
  9. `/italanta-hackathon-2024/` — "iTALANTA HACKATHON 2024"

---

### Pattern B: Other Programs Dynamic Collection (Programs Page)
- **Markup Location**: Plugin block `lakehub/programs` (`render.php`)
- **Fixed Pattern Structure**:
  ```html
  <article class="lakehub-program">
    <div class="lakehub-program-image">{post-thumbnail}</div>
    <div class="lakehub-program-copy">
      <h3>{program-title}</h3>
      <div class="lakehub-program-description">{program-content}</div>
      <a class="lakehub-program-link" href="{target-url}" aria-label="Learn more about {program-title}">Learn More ➜</a>
    </div>
  </article>
  ```
- **Dynamic Variables**:
  - `{program-title}`: Name of program post.
  - `{target-url}`: Stored in post meta `_lakehub_program_url`. If empty or null, defaults to `/coming-soon/`.
- **Intended Route Behavior**: Once URLs are entered in WordPress admin for each Program post, the button directly routes to that URL.

---

## 5. Pending Implementations & Coming Soon Register

The following links currently route to `/coming-soon/`. When the respective features or landing pages are implemented, their URLs must be updated in theme templates, patterns, or post meta, and this table should be refreshed:

| Source Page / Location | Link Element | Current Target | Intended Target | Action Required Upon Activation |
| :--- | :--- | :--- | :--- | :--- |
| **Site Footer (Help)** | "FAQ" link | `/coming-soon/` | `/faq/` | Update `patterns/site-footer.php` navigation block |
| **Site Footer (Help)** | "Support" link | `/coming-soon/` | `/support/` | Update `patterns/site-footer.php` navigation block |
| **Site Footer (Bottom)** | "Privacy Policy" link | `/coming-soon/` | `/privacy-policy/` | Update `patterns/site-footer.php` paragraph text |
| **Home Page (Hero)** | "JOIN THE COMMUNITY" button | `/coming-soon/` | Community signup / portal | Update Home page post content (Post ID 11) |
| **Programs Page (Collection)** | "FemiDevs" link | `/coming-soon/` | `/programs/femidevs/` | Set `_lakehub_program_url` post meta on Post ID 22 |
| **Programs Page (Collection)** | "Opportunities for Youth in Africa" link | `/coming-soon/` | `/programs/oya/` | Set `_lakehub_program_url` post meta on Post ID 23 |
| **Programs Page (Collection)** | "Alumni Network" link | `/coming-soon/` | `/programs/alumni/` | Set `_lakehub_program_url` post meta on Post ID 24 |
| **Programs Page (Collection)** | "ICON" link | `/coming-soon/` | `/programs/icon/` | Set `_lakehub_program_url` post meta on Post ID 25 |
| **Impact Page (Projects)** | "Read more" (Chichwa) | `/coming-soon/` | `/impact/chichwa/` | Update Impact page post content (Post ID 150) |
| **Impact Page (Portfolios)** | "View More People" button | `/coming-soon/` | `/impact/portfolios/` | Update Impact page post content (Post ID 150) |

---

## 6. Summary Verification Matrix

| Category | Count | Primary Behaviors & Protocols |
| :--- | :--- | :--- |
| **Global Header Links** | 5 | Same-tab (`_self`); dynamic `aria-current="page"` per page; mobile hamburger drawer. |
| **Global Footer Links** | 10 | Internal same-tab (`_self`), External new-tab (`_blank`), Email dispatch (`mailto:`). |
| **Home Page Links** | 35 | 2 Hero buttons + 5 Partner external links + 27 Insight links (9 posts $\times$ 3 links) + 1 CTA button. |
| **About Page Links** | 1 | 1 "Meet The Full Team" button (`/team/`) + 1 in-page accordion toggle button. |
| **Programs Page Links** | 5 | 1 Flagship external link (`_blank`) + 4 Program collection links (`/coming-soon/` fallback). |
| **Impact Page Links** | 3 | 1 Community Project link + 1 In-text story link (`/from-kisumu...`) + 1 "View More People" link. |
| **Team Page Links** | 0 | 0 outbound links (12 biographical profile cards). |
| **Coming Soon Page Links** | 1 | 1 "BACK TO HOME" button (`/`). |
| **Single Blog Post Template** | 4 | 1 In-page clipboard copy button + 3 Social sharing intent links (LinkedIn, X, Facebook). |
| **404 Page Template** | 1 | 1 "Back to Home" button (`/`). |
| **Total Tracked Link Affordances** | **65** | All cataloged with destination, location, and click behavior. |
