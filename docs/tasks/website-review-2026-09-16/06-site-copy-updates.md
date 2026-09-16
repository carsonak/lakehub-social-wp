# Task 06: Site Copy Updates & Google Docs Alignment

## Objective and Agreed Scope

Use the content provided in the 4 Google Docs (`home_page.docx`, `about_page.docx`, `impact_page.docx`, `programs_page.docx`) to fill out sections and correct copy across the website. In addition, replace Stacy Dina with **Rodgers Kaunda** (placeholder portrait and bio) on the Team roster.

---

## Detailed Copy Mapping by Page

### 1. Home Page (`home_page.docx`)
- **Impact Through Precision**:
  - `350+` Software Engineers: "Rigorous full-stack and systems architects graduated through peer-driven production pipeline"
  - `45+` Active tech companies & Startup Hiring Partners: "Active tech companies, regional unicorns, and European scaleups employing LakeHub engineers."
  - `88%` Direct Job Placement Rate Within 6 Months: "Sustainable high-income technical roles secured within 6 months post-cohort graduations" (correcting source typo "severed" to "secured").
  - `14` Startups Incubated: "Locally founded fintech, agritech and health solutions created by alumni founders in Western Kenya."
- **Our Journey**:
  - Headline: "From a small meetup to a driving force for innovation."
  - 2013: “The Spark” — First meetups began in Kisumu, gathering local tech enthusiasts.
  - 2014: “Official Hub” — LakeHub officially establishes its physical footprint along Okore Road in the Millimani neighborhood Kisumu, Kenya.
  - 2019: “Expansion” — LakeHub launches their core flagships, the LakeHub Academy and their formalized business incubation program.
  - Present: “Global Impact” — LakeHub grows from a local community into Western Kenya’s major regional center for software, agritech and digital jobs.
- **Latest Insights**:
  - Subheadline: "Ideas, people and innovations shaping the future from Kisumu and beyond."
- **Call to Action**:
  - Headline: "Ideas no longer have to wait their turn."
  - Body: "Join our network of innovators, mentors and investors to turn vision into impact."
  - Button: `[ EXPLORE PROGRAMS ]`

### 2. About Page (`about_page.docx`)
- **About LakeHub Intro**:
  - Verify alignment with: "LakeHub is a tech education and innovation ecosystem that creates pathways for African youth to enter and thrive in the digital economy..."
- **Mission & Vision**:
  - Questions and text:
    - What we dream of doing? "To democratize access to quality technical training, opening sustainable pathways for young Africans to actively participate, build careers, and flourish within the global digital economy."
    - Where we’re heading? "To cultivate a fully integrated regional network where every apprentice, graduate, and industry mentor continuously unlocks economic opportunity, exchanges expertise, and drives meaningful community transformation."
- **Our Story**:
  - Replace older brief paragraph with the full rich text from `about_page.docx`:
    - Headline: "Rooted in Kisumu, Building for the World"
    - 6 paragraphs detailing the evolution from informal meetups in 2013 to structured bootcamps, Zone01 integration, and the LakeHub Social digital network.
- **Team Updates (Stacy Dina Replacement)**:
  - **Stacy Dina is replaced by Rodgers Kaunda**:
    - Name: `Rodgers Kaunda`
    - Role: `Tech Associate`
    - Bio: Placeholder text (`Tech Associate supporting technical operations, workshops, and cohort learning at LakeHub.`) until formal copy is supplied.
    - Portrait: Neutral placeholder avatar/portrait until approved photo is provided by design.
  - Verified Team Roster:
    - Dorcas Owinoh (Co-Executive Director)
    - Caleb Nyoiro (Co-Executive Director)
    - Paul Oguda (Head of Tech)
    - Torsten Kremser (Director of Partnerships)
    - Deril Okoth (Communications Lead)
    - Daisy Achieng' (Communications Associate)
    - Lydiah Ojowi (Finance Manager)
    - Alpha Omondi (Bocal Team - Tech)
    - Bellah Oyucho (Bocal Team - Tech)
    - Rodgers Kaunda (Tech Associate - Placeholder portrait & bio)
    - James Odede (Advisor)
    - David Sultan (Advisor)

### 3. Impact Page (`impact_page.docx`)
- **Header**:
  - Headline: "Decentralizing tech training in Kenya and positioning youth for leading tech roles."
- **Community Solutions**:
  - Intro: "Technology built by the LakeHub and Zone01 community to solve real problems and create meaningful impact."
  - Chichwa, Chama Trust Wallet, ZoneBridge, Ujuzi360, Rust Kisumu.
- **Inspiring Portfolios**:
  - Feature Malika Asman, junior software engineer at Safaricom, DevOps specialist at Flutterwave.
- **Dimensions of Transformation**:
  - Update descriptions for Technical Mastery, Structured Mentorship, Employment Pipelines, and Personal Growth.
- **The LakeHub Difference**:
  - Highlight 5 core differentiators: practical skills, 45+ hiring partners, support beyond graduation, peer community, data-driven tracking.
- **Call to Action**:
  - Headline: "Be Part of Our Growing Legacy"
  - Buttons: `[ Explore Alumni Stories ]`, `[ Connect With an Alumnus ]`, `[ Partner With Us ]`.

### 4. Programs Page (`programs_page.docx`)
- **Page Introduction**:
  - Headline: "Our Programs Pipeline"
  - Subheadline: "Explore the programs driving tech talent development across Western Kenya and beyond. From flagship accelerators to grassroots initiatives, each program is designed to bridge the gap between training and employment."
- **Program Portfolio**:
  - Zone01 Kisumu (Flagship Talent Accelerator)
  - Grassroots Tech Initiatives (FemiDevs, Agribiz 4 Youth, Digital Literacy Bootcamps)
  - Mentorship Program
- **Program Comparison Table**:
  - Feature comparison (Duration, Cost, Format, Outcome, Ideal For).
- **Call to Action**:
  - Headline: "Find the Right Program for Your Tech Journey"
  - Buttons: `[ Apply to Zone01 ]`, `[ Browse Bootcamps ]`, `[ Talk to Our Team ]`.

---

## Detailed Implementation Steps

1. Update theme pattern files:
   - `patterns/home-hero.php`, `patterns/home-impact.php`, `patterns/home-journey.php`, `patterns/home-insights.php`, `patterns/home-cta.php`
   - `patterns/about-page.php`
   - `patterns/impact-page.php`
   - `patterns/programs-hero.php`, `patterns/programs-list.php`
2. Update `wp-content/plugins/lakehub-site/includes/team-defaults.json` replacing Stacy Dina with Rodgers Kaunda.
3. Update database post ID 134 (`stacy-dina`) via WP-CLI to Rodgers Kaunda (`rodgers-kaunda`) with placeholder avatar and bio.
4. Update database pages via WP-CLI so database content matches theme patterns.

---

## Progress & Tracking

- [x] Update Home page patterns and database content
- [x] Update About page patterns and database content
- [x] Update Rodgers Kaunda in `team-defaults.json` and database post 134
- [x] Update Impact page patterns and database content
- [x] Update Programs page patterns and database content
- [x] Verify team post type and defaults in `lakehub-site`
- [x] Verify frontend rendering against design exports

## Execution Notes & Observations

- Created neutral placeholder portrait `rodgers-placeholder.png` in theme assets and registered media attachment ID 224.
- Replaced Stacy Dina with Rodgers Kaunda in `wp-content/plugins/lakehub-site/includes/team-defaults.json`.
- Updated database post ID 134 to Rodgers Kaunda (`rodgers-kaunda`) with role `TECH ASSOCIATE`, placeholder bio, and attachment 224 with 100% crop.
- Updated `patterns/about-page.php` with 6-paragraph "Rooted in Kisumu, Building for the World" Our Story copy, and synchronized Post 146.
- Updated `patterns/home-journey.php` to year 2014 and `patterns/home-insights.php` to "Ideas, people and innovations shaping the future from Kisumu and beyond", synchronizing Post 11.
- Added typography and block gap spacing for `.is-style-lakehub-story-copy` in `style.css`.
- Verified Stacy Dina is completely removed from `/team/` and Rodgers Kaunda renders cleanly with portrait and bio.

