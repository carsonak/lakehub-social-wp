# Editing the LakeHub website

The Home, Programs, About, Impact, and Team pages use WordPress blocks. You do not need HTML, PHP, or CSS.

## Home and Programs

1. Open **Pages**, choose **Home** or **Programs**, and select **Edit**.
2. Click text to change it. Select an image and use **Replace → Media Library** or upload a new image. Give informative images useful alternative text.
3. Select a button and use its link control to change the destination. The Zone01 button starts without a destination; add its program URL when available.
4. Use **List View** (the three horizontal lines in the top toolbar) to select a named section. You can move or remove whole sections. Their internal layout is protected to keep the design consistent.
5. To add a section, open the **+** inserter, choose **Patterns → LakeHub sections**, and insert the section you need. Each copy has independent content.
6. Select **Save**, then preview the page on desktop and mobile.

The page title shown above the editor canvas is an administrative title. The designed hero contains the visible page heading.

## Photo heroes and impact figures

The Home and Programs heroes are **Cover** blocks. Select the hero in List View and use **Replace** to choose its background photograph. Edit the heading and buttons directly. Programs also has a **Zone brand** row with editable text and the supplied 01 image; select the image to replace it if the branding changes.

Home's **Impact** section contains four named rows. Edit a figure (for example, `350+`), heading, or description directly. To change the photograph inside a figure, select its named **Figure image** Group in List View, open the block's **Styles → Background** controls, and replace the background image. The value remains text; do not upload an image of the number itself.

Duplicate, move, or remove an entire impact row through List View to change the collection. Its internal blocks are locked to protect the layout while keeping the text and background image controls available. Keep figures short so they remain readable on narrow screens.

## Journey and partners

Open the section in List View. Under **Timeline**, duplicate a milestone or insert the **Journey milestone** pattern; edit its year, title, and description. Move or remove individual milestones as needed. Under **Partner logos**, add, replace, reorder, or remove Image blocks. Use the image link control to set a partner's website.

Partner logos stay static in the editor. On the website they scroll automatically; visitors can drag either way, focus the carousel and use Left/Right arrow keys. Hovering or keyboard focus pauses scrolling, and reduced-motion preferences disable autoplay. Short collections that fit do not scroll. Upload the original full-colour logo with a transparent background and descriptive alternative text: the theme applies the white appearance and restores the original colours on hover or keyboard focus. The looping copies exist only on the website; do not duplicate logos in the editor to create the loop.

Journey milestones enlarge gently on hover. Program cards receive a cursor-following glare, and buttons and navigation links provide hover/focus feedback automatically; no animation settings or code editing are required.

## Programs

The **Programs · All programs** section contains the editable **Our Other Programs** heading and displays published entries from the **Programs** menu. Its preview includes a **Manage programs** link.

- Choose **Programs → Add New Program**, or edit an existing entry.
- Use the title for the program name, the block editor for its description, and **Featured image** for its photo.
- Under **Program card options**, enter an optional **Learn More URL**. A blank destination displays the label without a link.
- Set **Display order**: lower numbers appear first. Equal numbers are ordered by title. Images alternate sides automatically.
- Save as a draft to prepare content privately, or publish to include it in the collection. Program detail pages are not enabled; destinations may point to another website.

The program description in the block editor is authoritative; the legacy Excerpt field does not override it.

## Latest Insights

Use **Posts → Add New** or edit an existing post. Set a title, featured image, and excerpt. The Home page displays the twelve newest published posts, linking to their full articles. Publishing a new post updates the list automatically.

## Header, footer, and navigation

Open **Appearance → Editor → Design → Patterns → Template parts**, then choose **LakeHub Header** or **LakeHub Footer**. You can also select a template part from a page template in the Site Editor.

Edit Navigation blocks to change links. Select logo or social images to replace them or add destinations. Changes to a shared header or footer affect the whole website. The newsletter area is a visual preview: it does not collect email addresses or submit subscriptions.

Administrators can change structure and global styles. Routine editors should use the prepared sections and content controls. Ask a developer to export intentional shared-layout changes into the theme files so Git retains the canonical design.

## Image tips

Choose a landscape image for heroes and program cards. Keep faces and important subjects near the center because images crop differently on smaller screens. Prefer appropriately sized uploads rather than very large originals. The supplied Figma assets remain bundled with the theme; page images also have editable Media Library copies.

## About, Impact, and Team

Edit About and Impact through **Pages**. Their named sections contain direct text and image controls, with protected internal structure. Hero photos use Cover blocks; the mission collage contains individually replaceable Image blocks. The text in the transformation panels is editable.

Use **Team Members → Add Team Member** for each person. Set the name in the title, the biography in the editor, the portrait in **Featured image**, and the role in **Team card options**. Check **Featured on About** to include a person in About's six-member preview. **Page Attributes → Order** controls ordering, with lower numbers first. The Team page displays all published members. Drafts are hidden; changing a shared record updates both pages. No individual profile page is published.

In the LakeHub Team block settings, use **Featured members only** and **Member limit**; zero means all members. The default About limit is six. Team defaults to all members.

Impact's Chichwa and “View More People” buttons remain visible for editing but hidden on the website until a destination is entered. Select the button and add its URL using the native link control. Removing the URL hides it again.

Latest Insights now defaults to the twelve newest published posts. Change the Query Loop's items-per-page setting to adjust that limit. The three visible desktop cards are a viewport onto that collection; arrow controls move adjacent cards into the center. Cards do not loop, and the unavailable arrow disappears at either end.

The journey remains horizontal on mobile and desktop. Add independent milestone pattern copies inside the timeline; they extend the scrollable track. Partner logos no longer have a pause/play button: pointer hover, keyboard focus, and reduced-motion preferences suspend automatic scrolling.
