# Image Asset System

Static template images are copied from the repository `image_templat` folder into `public/branch/image_template` for Next.js static serving.

The manifest lives at `src/data/branch/assets/brand_asset_manifest.json`. It defines `BrandAsset` entries with `templateUrl`, `selectedUrl`, kind, title, and status.

Components:

- `BrandHeroImage`: large selected brand image.
- `BrandAssetGallery`: brand asset grid.
- `BrandAssetCard`: individual image card using `next/image`.
- `BrandAssetModal`: enlarged view.
- `BrandAssetGenerationButton`: mocked regeneration flow only.
- `BrandBoardView`: hero plus gallery composition.

The UI always labels images as sample templates and states that external image generation API integration is not active. It does not claim a new image was generated.
