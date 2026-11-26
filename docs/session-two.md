# Session two: authoring and release

## Custom block

`blocks/eds-enablement-block/` implements **EDS Enablement Block**. The block
accepts rows of cells containing images or rich text, following the Block
Collection's Columns content model. Cells stack on mobile and share the row at
900px and above. Image-only cells receive responsive, optimized pictures;
authored alt text, image dimensions, and fetch priority are retained. Existing
pictures with a default WebP source are preserved instead of replaced, retaining
their responsive authoring and any in-flight image request. Empty blocks, text-only
cells, multiple rows, and omitted images do not require special placeholder content.

Use the block table heading **EDS Enablement Block (session-two, session-practice)**.
EDS normalizes this to `eds-enablement-block session-two session-practice`.
The `session-two` variant adds a padded background; `session-practice` adds a border.
Both are authored variants, not classes forced onto every instance.

## Author in DA

1. Sign in at https://da.live/#/psaketh2002/eds-enablement.
2. Create a page named `session-two` at the content root.
3. Add the H1 **Build, preview, publish** and the introduction from
   [the HTML fixture](../drafts/session-two.html).
4. Insert a two-column table with a merged heading row:

   | EDS Enablement Block (session-two, session-practice) | |
   | --- | --- |
   | Insert the Green Double Helix image from the Block Collection Columns example. Set alt text to "Green double helix sculpture". | H2: EDS Enablement Block. Add the paragraph, list, and Block Collection link from the fixture. |

   Open the [Block Collection](https://www.aem.live/developer/block-collection)
   and copy an image from the Columns example into the image cell. This uses
   DA's image ingestion rather than relying on an external image hotlink.
   The fixture uses the same publicly served collection image for local testing.
5. Add the second section and its
   [Live Preview limitations link](https://docs.da.live/authors/reference/live-preview#limitations)
   from the fixture. Use a section break between sections.
6. Add a page-level metadata table at the bottom:

   | Metadata | |
   | --- | --- |
   | Title | session-2 setup first page |
   | Description | A hands-on introduction to authoring and publishing with Edge Delivery Services. |

   Use **Title**, not a custom field called "meta title": EDS generates the HTML
   title from this field.

## Global/bulk metadata

Create a **sheet** named `metadata` at the DA content root with one worksheet:

| URL | title |
| --- | --- |
| ** | session-2 setup |

Preview and publish this sheet as well as the page. The `**` row supplies the
site-wide default; the page's `Title` overrides it. On `/session-two`, inspect
`document.title` and expect exactly `session-2 setup first page`. On an existing
page without a page-level title, expect `session-2 setup`. Do not remove another
page's explicit title just to test inheritance.

The fixture's `<title>` is a local example only. A Git file cannot create the DA
metadata sheet or prove server-side metadata precedence.

## Local verification

Use Node.js 24 and run:

```sh
npm ci
npm run lint
npx -y @adobe/aem-cli up --no-open --html-folder drafts
```

Open http://localhost:3000/drafts/session-two.html. The committed HTML fixture contains
the initial EDS markup and both required classes. It is not a DA-authored page.
It is marked `noindex, nofollow` because it is a development sample.
Verify mobile and desktop layouts, image loading, keyboard access to the CTA,
the exact title, and the limitations link. Also verify the existing home page.
Once DA content is available, restart without `--html-folder drafts` and check
http://localhost:3000/session-two against the real preview content.

Validated locally with `aem up` and the repository's full `npm run lint`:

- Desktop (1440px) columns and mobile (390px) stacking, without horizontal overflow.
- Exact page title, both variant classes, one H1, an H2 inside the block, and
  the limitations link.
- Loaded collection image, three responsive sources, preserved alt text and
  dimensions, and a keyboard-focusable CTA.
- Empty blocks, text-only content, empty cells, multiple rows, and mixed
  image/text cells without losing authored text.
- No DA preview module requested on normal visits; a mocked CDN module confirmed
  that `?dapreview=1` imports once and receives the `loadPage` function. This is
  an integration wiring test, not a claim that the authenticated DA editor was tested.
- Existing home page still loads its seven cards and Columns block without
  introducing a custom block or loading the DA preview module.

The fixture preconnects to the collection image origin, includes responsive WebP
sources in its initial HTML, and marks its above-the-fold image `fetchpriority="high"`.
Its sources match block decoration
so the browser does not download a large PNG before discovering a second,
optimized image through JavaScript. Images elsewhere remain lazy unless authored
otherwise; the block does not promote every image to high priority.
The fixture also loads its font stylesheet and preloads its two first-screen
fonts in the head to avoid reflowing the heading and introduction after the
optimized image has already painted. This is scoped to the fixture, not a change
to the site's default font-loading policy.

The original PR PageSpeed check reported mobile performance 84 and LCP 4.4s.
A mobile Lighthouse reproduction scored 81 and showed an initial 493KB PNG
download followed by a second, optimized image. After these changes, local
Lighthouse measured mobile performance 99, LCP 2.3s, and CLS 0; desktop measured
100. The mobile image transfer was approximately 35KB with high priority and no
PNG download. Hosted CI remains the release gate because network timings vary.

## DA Live Preview

The end of `scripts/scripts.js` loads DA's official preview integration only when
`dapreview` is present, and supplies the existing `loadPage` callback. Normal
visits do not fetch the preview script. Initialization failures are logged.
In DA, open the page and select the **Preview** tab, then test the mobile and
desktop viewport controls. If the project makes cross-origin API calls, allow
`https://main--eds-enablement--psaketh2002.preview.da.live` on those services.
See [requirements and limitations](https://docs.da.live/authors/reference/live-preview#limitations);
always compare the real preview/published page before release.

## Sidekick and release

1. In a supported Chrome browser, install
   [AEM Sidekick](https://chromewebstore.google.com/detail/aem-sidekick/igkmdomcgoebiipaifhmpfjhbjccggml)
   and pin it. An integrated VS Code browser is not a substitute for installing
   the extension in your Chrome profile.
2. Follow the [Sidekick setup guide](https://www.aem.live/docs/sidekick) to add
   `psaketh2002/eds-enablement` and sign in with publishing permissions.
3. Preview the page and metadata sheet. Verify
   https://main--eds-enablement--psaketh2002.aem.page/session-two.
4. Push branch `session-two` and inspect
   https://session-two--eds-enablement--psaketh2002.aem.page/session-two.
   If DA authoring is still blocked, the code-only fixture is available at
   https://session-two--eds-enablement--psaketh2002.aem.page/drafts/session-two.html;
   this does **not** substitute for checking authored content.
5. Open a PR to `main` and include the working preview URL, test results, and
   authoring/publication status. Confirm CI and Code Sync checks. Run PageSpeed
   Insights on the authored branch preview and target 100 before merging.
6. Merge the reviewed PR. In Sidekick, publish the metadata sheet and page.
   Publishing Git code does not publish DA content.
7. Check https://main--eds-enablement--psaketh2002.aem.live/session-two.
   Verify the exact title, both classes, images, mobile layout, and limitations
   link. Capture a screenshot showing that URL and the new block. Do not label
   a localhost or branch screenshot as production evidence.

## Delivery status

The `session-two` branch is pushed and [PR #1](https://github.com/psaketh2002/eds-enablement/pull/1)
is open. The branch fixture is verified. The initial SSH push failed because it
authenticated as `saketh_adobe`; switching to HTTPS with personal-account
authentication resolved access without deleting the corporate SSH key.
The initial hosted PageSpeed failure is addressed by the image and font-loading
changes described above; verify the latest PR check before merging.

DA page/bulk metadata authoring, Sidekick installation/publication, and a
production release have not been verified by this implementation. The integrated
browser initially required Adobe sign-in and disabled the Chrome Web Store's
**Add to Chrome** control. Complete the authenticated steps above in a supported
Chrome profile. The captured screenshot is of the local fixture, not production.

## Submission writeup

I built a reusable EDS Enablement Block with responsive image-and-text rows for
the session-two sandbox page.
The block supports the authored `session-two` and `session-practice` classes and
preserves image alt text while generating optimized picture sources.
I prepared a local page fixture with a valid Block Collection image, the required
page title, and a link to the DA Live Preview limitations.
I also added the DA Live Preview integration and documented the bulk title
`session-2 setup`, which must be overridden by the page title
`session-2 setup first page`.
One problem was that the default shell exposed Node.js 12 while the project's
tooling targets Node.js 24.
I resolved that by selecting the installed Node.js 24 runtime, restoring the
dependencies, and validating the block with repository lint and desktop/mobile
browser checks through the AEM development server.
The branch is pushed and a PR is open, while DA authoring, Sidekick publication,
and the production screenshot remain to be verified.
