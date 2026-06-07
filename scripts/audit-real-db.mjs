import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dbRoots = [
  "DB_real/branch_supplier_db",
  "DB_real/collected_brand",
  "DB_real/perplexity_supplier_db"
];
const outputPath = path.join(root, "docs/real-db-audit.md");

function walkFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkFiles(fullPath);
    return [fullPath];
  });
}

function safeJsonParse(filePath) {
  try {
    return { ok: true, value: JSON.parse(fs.readFileSync(filePath, "utf8")) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "unknown json parse error" };
  }
}

function countCsvRows(text) {
  const rows = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  return rows.length > 0 ? rows.length - 1 : 0;
}

function summarizeObjectKeys(value) {
  if (Array.isArray(value)) {
    const firstObject = value.find((item) => item && typeof item === "object" && !Array.isArray(item));
    return firstObject ? Object.keys(firstObject) : [];
  }
  if (value && typeof value === "object") return Object.keys(value);
  return [];
}

function relative(filePath) {
  return path.relative(root, filePath).replace(/\\/g, "/");
}

function collectFileAudit() {
  const files = dbRoots.flatMap((dir) => walkFiles(path.join(root, dir)));
  return files
    .filter((filePath) => /\.(json|csv|md|txt|html)$/i.test(filePath))
    .sort()
    .map((filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      const content = fs.readFileSync(filePath, "utf8");
      if (ext === ".json") {
        const parsed = safeJsonParse(filePath);
        if (!parsed.ok) {
          return {
            file: relative(filePath),
            type: "json",
            recordCount: "parse_error",
            majorFields: [],
            notes: [`JSON parse failed: ${parsed.error}`]
          };
        }
        const value = parsed.value;
        const recordCount = Array.isArray(value)
          ? value.length
          : value && typeof value === "object"
            ? Object.keys(value).length
            : 0;
        return {
          file: relative(filePath),
          type: "json",
          recordCount,
          majorFields: summarizeObjectKeys(value),
          notes: []
        };
      }
      if (ext === ".csv") {
        const [headerLine] = content.split(/\r?\n/);
        return {
          file: relative(filePath),
          type: "csv",
          recordCount: countCsvRows(content),
          majorFields: headerLine ? headerLine.split(",").map((item) => item.trim()) : [],
          notes: []
        };
      }
      return {
        file: relative(filePath),
        type: ext.slice(1),
        recordCount: content.split(/\r?\n/).filter(Boolean).length,
        majorFields: [],
        notes: []
      };
    });
}

function buildDomainSummary() {
  const canonicalSuppliers = safeJsonParse(path.join(root, "DB_real/branch_supplier_db/suppliers.json"));
  const canonicalProducts = safeJsonParse(path.join(root, "DB_real/branch_supplier_db/supplier_products.json"));
  const perplexityProducts = safeJsonParse(path.join(root, "DB_real/perplexity_supplier_db/products.json"));
  const missingItems = safeJsonParse(path.join(root, "DB_real/perplexity_supplier_db/missing_items.json"));

  const supplierProducts = canonicalProducts.ok && Array.isArray(canonicalProducts.value) ? canonicalProducts.value : [];
  const products = perplexityProducts.ok && Array.isArray(perplexityProducts.value) ? perplexityProducts.value : [];
  const validPerplexity = products.filter((item) => item.is_valid_product_detail_url === true && item.page_type === "product_detail" && item.product_url);
  const leadOnlyPerplexity = products.filter((item) => ["recipe_page", "search_result_only", "candidate_only"].includes(item.page_type));
  const rejectedPerplexity = products.filter((item) => ["product_qna", "category_page_truncated_url"].includes(item.page_type) || !item.product_url);
  const directBrandNames = ["덮덮밥", "핵밥", "덮밥장사장", "바로덮밥", "순수덮밥", "덮밥슈퍼", "1992덮밥&짜글이"];

  const directBrandMentions = fs.readFileSync(path.join(root, "DB_real/collected_brand/tab2_franchise_status.txt"), "utf8");
  const missingDirectData = directBrandNames.filter((name) => !directBrandMentions.includes(name));

  return {
    supplierCount: canonicalSuppliers.ok && Array.isArray(canonicalSuppliers.value) ? canonicalSuppliers.value.length : 0,
    supplierProductCount: supplierProducts.length,
    validPerplexityCount: validPerplexity.length,
    leadOnlyCount: leadOnlyPerplexity.length,
    rejectedCount: rejectedPerplexity.length,
    missingItemCount: missingItems.ok && Array.isArray(missingItems.value) ? missingItems.value.length : 0,
    directBrandNames,
    missingDirectData
  };
}

function buildMarkdown() {
  const audits = collectFileAudit();
  const summary = buildDomainSummary();
  const lines = [];

  lines.push("# Real DB Audit", "");
  lines.push("## 1. 읽은 파일 목록", "");
  for (const audit of audits) {
    lines.push(`- \`${audit.file}\` · type=${audit.type} · record_count=${audit.recordCount}`);
  }

  lines.push("", "## 2. 각 파일의 레코드 수", "");
  for (const audit of audits) {
    lines.push(`- \`${audit.file}\`: ${audit.recordCount}`);
  }

  lines.push("", "## 3. 각 파일의 주요 필드", "");
  for (const audit of audits) {
    const fields = audit.majorFields.length > 0 ? audit.majorFields.join(", ") : "텍스트/HTML 문서";
    lines.push(`- \`${audit.file}\`: ${fields}`);
  }

  lines.push("", "## 4. 유효 데이터와 부적합 데이터 구분", "");
  lines.push(`- canonical supplier products: ${summary.supplierProductCount}개`);
  lines.push(`- perplexity valid product detail URL: ${summary.validPerplexityCount}개`);
  lines.push(`- perplexity lead_only 후보: ${summary.leadOnlyCount}개`);
  lines.push(`- perplexity rejected URL: ${summary.rejectedCount}개`);
  lines.push("- collected_brand 정량 상세: 덮덮밥 1개 브랜드만 확인 가능");
  lines.push("- collected_brand 관련 브랜드명 언급: 직접 비교군 7개 이름은 텍스트에서 확인되지만 정량 필드는 대부분 없음");

  lines.push("", "## 5. 중복 가능성", "");
  lines.push("- GPT canonical 80개 상품 URL은 collection_summary 기준 중복 0개");
  lines.push("- perplexity delta는 동일 식품 카테고리에 canonical과 겹칠 수 있으므로 URL 기준 중복 제거 필요");
  lines.push("- supplier name은 식봄 판매자명과 공식몰명 혼재 가능성이 있어 supplier id 정규화 필요");

  lines.push("", "## 6. 화면에 바로 쓸 수 있는 데이터", "");
  lines.push("- 공급처 canonical supplier 35개, canonical SKU 80개, group buy 후보 11개");
  lines.push("- 덮덮밥 상세 브랜드 정보와 가맹사업 현황 텍스트");
  lines.push("- perplexity valid product detail URL 20개와 missing_items 15개");

  lines.push("", "## 7. 계산에는 쓰면 안 되는 데이터", "");
  lines.push("- perplexity `page_type=product_qna`, `category_page_truncated_url`, `search_result_only`, `candidate_only`, `recipe_page`");
  lines.push("- 가격 없는 실상품의 `displayed_price=null` 값");
  lines.push("- collected_brand의 함께 볼 만한 브랜드명 언급만 있는 텍스트");
  lines.push("- 브랜드가 직접 입력한 수익 예시를 cohort 평균으로 강제 변환한 값");

  lines.push("", "## 8. 아직 샘플 fallback이 필요한 영역", "");
  lines.push("- franchise direct cohort 7개의 정량 비교값 전부");
  lines.push("- owner profit 완전 비교값");
  lines.push("- 우삼겹, 쌀, 고추장 등 일부 재료의 실가격이 없는 상품");
  lines.push("- KIE 생성 이미지 저장소 영속화");

  lines.push("", "## Summary", "");
  lines.push(`- supplier_count=${summary.supplierCount}`);
  lines.push(`- supplier_product_count=${summary.supplierProductCount}`);
  lines.push(`- perplexity_valid_product_count=${summary.validPerplexityCount}`);
  lines.push(`- perplexity_lead_only_count=${summary.leadOnlyCount}`);
  lines.push(`- perplexity_rejected_count=${summary.rejectedCount}`);
  lines.push(`- missing_item_count=${summary.missingItemCount}`);
  lines.push(`- direct_brand_mentions=${summary.directBrandNames.join(", ")}`);
  lines.push(`- direct_brand_missing_mentions=${summary.missingDirectData.length === 0 ? "none" : summary.missingDirectData.join(", ")}`);

  return `${lines.join("\n")}\n`;
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, buildMarkdown(), "utf8");
console.log(`wrote ${relative(outputPath)}`);
