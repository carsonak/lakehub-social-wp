# Task 01: Git Tracking of Design Exports & Content Source Documents

## Objective and Agreed Scope

1. **Track 16-09-2026 Figma Exports**:
   - The user provided 10 approved design export files in `docs/design-exports/16-09-2026/`:
     - `About.png` (@2x raster) and `About.svg` (@1x vector)
     - `Home.png` (@2x raster) and `Home.svg` (@1x vector)
     - `Impact.png` (@2x raster) and `Impact.svg` (@1x vector)
     - `Our Programs.png` (@2x raster) and `Our Programs.svg` (@1x vector)
     - `blog-template.png` (@2x raster) and `blog-template.svg` (@1x vector)
   - Preserve historical exports in `docs/design-exports/14-09-2026/`.
   - Update any documentation or path references that pointed to root `docs/design-exports/*.png`.

2. **Track Google Drive Source Documents**:
   - The user provided a Google Drive folder (`https://drive.google.com/drive/folders/1zIEg_it4RXoLnIy-J4hl3YS77uC9V4np?usp=sharing`) containing canonical site copy.
   - Version both the binary `.docx` files and plain text extractions in `docs/content-source/`:
     - `about_page.docx` and `about_page.txt`
     - `home_page.docx` and `home_page.txt`
     - `impact_page.docx` and `impact_page.txt`
     - `programs_page.docx` and `programs_page.txt`
   - Record file provenance, IDs, and export timestamps in `docs/content-source/provenance.json`.

---

## Detailed Implementation Steps

1. Verify all 10 export files in `docs/design-exports/16-09-2026/` have valid checksums and dimensions.
2. Ingest Google Docs files into `docs/content-source/`.
3. Create `docs/content-source/provenance.json` recording:
   - Google Drive Folder ID: `1zIEg_it4RXoLnIy-J4hl3YS77uC9V4np`
   - Document IDs and hashes:
     - `about_page.docx`: `1ATjjyBnILzCZ5QujJjUnJSLVwUundH5h`
     - `home_page.docx`: `1yAOYJXQkKG_ymrjVuSN0t0JhzccCThwM`
     - `impact_page.docx`: `1GHbxTWaFn5BwRJBmWJNCZpvZlxbjS6c3`
     - `programs_page.docx`: `1DP37dygiUurND-UEhajlT7wuLxyg_MTp`
4. Stage tracked source documents and exports cleanly in Git without touching runtime files.

---

## Progress & Tracking

- [x] Verify design exports integrity
- [x] Save and verify Google Docs source documents and extracted text
- [x] Create `docs/content-source/provenance.json`
- [x] Review git status and staging

## Unplanned Changes & Scope Deviations

*(Record any changes made during execution that were not in the original plan)*
