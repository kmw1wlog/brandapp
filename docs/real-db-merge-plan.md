# Real DB Merge Plan

## 1. Canonical DB 구조

- root source of truth:
  - `DB_real/branch_supplier_db` -> canonical supplier base
  - `DB_real/perplexity_supplier_db` -> supplier delta and missing-items evidence
  - `DB_real/collected_brand` -> franchise detail evidence, currently deopdeopbap-heavy
- build output:
  - `src/data/branch/real/manifest.json`
  - `src/data/branch/real/scenario/busan_meatbowl.json`
  - `src/data/branch/real/franchise/*.json`
  - `src/data/branch/real/suppliers/*.json`
  - `src/data/branch/real/cost/*.json`
  - `src/data/branch/real/readiness/demo_readiness.json`

## 2. 각 원천 데이터의 병합 규칙

- suppliers:
  - start from GPT canonical `suppliers.json`, `supplier_products.json`, `price_snapshots.json`
  - merge perplexity only when `is_valid_product_detail_url=true`, `page_type=product_detail`, `product_url` exists
  - normalize by canonicalized URL and supplier name
- supplier leads:
  - route `recipe_page`, `search_result_only`, `candidate_only` into `supplier_leads.json`
- rejected URLs:
  - route `product_qna`, `category_page_truncated_url`, `product_url=null`, ellipsis-like truncated URLs into `rejected_supplier_urls.json`
- franchise:
  - deopdeopbap gets full detail fields from `tab1_brand_info.txt`, `tab2_franchise_status.txt`
  - other direct-cohort brands are created as named records with nullable numeric fields when local DB evidence is missing
  - cohort stats exclude null, masked, approximate-only values
- costing:
  - keep existing `src/data/branch/cost/menu_costs.json` as baseline
  - overlay real ingredient product matches and real normalized unit prices only when verified

## 3. 충돌 시 우선순위

1. GPT canonical product + price snapshot
2. perplexity valid product detail URL
3. perplexity supplier summary
4. lead_only
5. rejected

For franchise data:

1. local collected text with explicit numeric value
2. existing sample benchmark fallback
3. null with warning note

## 4. `rejected` / `lead_only` / `verified` 상태 규칙

- `verified_product`:
  - canonical GPT product with URL and price snapshot, or perplexity valid detail URL with usable product fields
- `needs_price_check`:
  - product detail URL exists but displayed price is null or unit normalization is incomplete
- `lead_only`:
  - URL candidate exists but detail page is not confirmed
- `rejected`:
  - Q&A page, category page, truncated URL, null URL, or non-product page

## 5. 화면별 사용 데이터

- `/dashboard/startup/new`
  - `franchise_benchmark_summary.json`
  - `franchise_cohorts.json`
  - fallback to existing `franchise_benchmarks.json` only if real build missing
- `/dashboard/startup/franchise`
  - `franchise_brands.json`
  - `franchise_cohorts.json`
  - `franchise_data_quality.json`
- `/dashboard/startup/cost`
  - `menu_costs.json`
  - `ingredient_master.json`
  - `ingredient_product_matches.json`
- `/dashboard/startup/suppliers`
  - `supplier_products.json`
  - `supplier_leads.json`
  - `rejected_supplier_urls.json`
  - `group_buy_candidates.json`
  - `supplier_data_quality.json`
- `/dashboard/startup/brand`
  - template image manifest + KIE route state
- `/dashboard/startup/build`
  - deopdeopbap representative cost references + existing branch build docs
- `/dashboard/startup/owner-preview`
  - supplier readiness and alert summaries

## 6. 테스트 시나리오

1. `node scripts/audit-real-db.mjs` writes `docs/real-db-audit.md`
2. `node scripts/build-real-branch-db.mjs` creates `src/data/branch/real`
3. `node scripts/validate-real-branch-db.mjs` passes thresholds
4. `/dashboard/startup/new` shows direct cohort label and no old average copy
5. `/dashboard/startup/franchise` shows 7 direct brands, deopdeopbap detail, folded adjacent/reference cohorts
6. `/dashboard/startup/suppliers` shows verified products, lead-only candidates, rejected URLs, and no `0원` for missing prices
7. `/dashboard/startup/cost` shows ingredient product links and price-status badges
8. `/dashboard/startup/brand` keeps static template without API key and enters mock generation flow
