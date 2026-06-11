import fs from "node:fs";
import path from "node:path";

const SERVICE_KEY = process.env.PUBLIC_DATA_SERVICE_KEY;
if (!SERVICE_KEY) {
  throw new Error("PUBLIC_DATA_SERVICE_KEY is required to collect FTC franchise data.");
}
const root = process.cwd();
const outRoot = path.join(root, "DB_real/ftc_franchise_db");
const latestSupportedYear = 2025;
const firstSupportedYear = 2017;
const years = Array.from({ length: latestSupportedYear - firstSupportedYear + 1 }, (_, index) => firstSupportedYear + index);
const amountUnitNote = "FTC franchise API raw amount values are assumed to be in KRW thousand units based on franchise disclosure conventions.";

const endpointCatalog = [
  {
    id: "brand_franchise_stats",
    title: "브랜드별 가맹점 현황 조회",
    url: "https://apis.data.go.kr/1130000/FftcBrandFrcsStatsService/getBrandFrcsStats",
    yearParam: "yr",
    pageSize: 1000,
    expectedStatus: "collectable"
  },
  {
    id: "brand_startup_stats",
    title: "브랜드별 창업금액 현황 조회",
    url: "https://apis.data.go.kr/1130000/FftcBrandFntnStatsService/getBrandFntnStats",
    yearParam: "yr",
    pageSize: 1000,
    expectedStatus: "collectable"
  },
  {
    id: "area_industry_average_out",
    title: "지역별 외식별 평균매출액 현황 조회",
    url: "https://apis.data.go.kr/1130000/FftcAreaIndutyAvrStatsService/getAreaIndutyAvrOutStats",
    yearParam: "yr",
    pageSize: 1000,
    expectedStatus: "collectable"
  },
  {
    id: "industry_open_close_out",
    title: "주요 외식별 가맹점 개폐점 현황 조회",
    url: "https://apis.data.go.kr/1130000/FftcIndutyFrcsOpclStatsService/getIndutyFrcsOpclOutStats",
    yearParam: "yr",
    pageSize: 1000,
    expectedStatus: "collectable"
  },
  {
    id: "industry_fluctuation",
    title: "업종별 가맹점 변동현황 조회",
    url: "https://apis.data.go.kr/1130000/FftcindutyfrcsflctnstatService/getindutyfrcsflctnstats",
    yearParam: "jngBizCrtraYr",
    pageSize: 1000,
    expectedStatus: "collectable"
  }
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeJson(relativePath, value) {
  const filePath = path.join(outRoot, relativePath);
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function escapeCsvCell(value) {
  if (value == null) return "";
  const stringValue = String(value);
  if (/["\n,]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, "\"\"")}"`;
  }
  return stringValue;
}

function writeCsv(relativePath, rows) {
  const filePath = path.join(outRoot, relativePath);
  ensureDir(path.dirname(filePath));
  if (rows.length === 0) {
    fs.writeFileSync(filePath, "", "utf8");
    return;
  }
  const columns = Array.from(rows.reduce((set, row) => {
    Object.keys(row).forEach((key) => set.add(key));
    return set;
  }, new Set()));
  const lines = [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => escapeCsvCell(row[column])).join(","))
  ];
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function asArray(items) {
  if (items == null) return [];
  if (Array.isArray(items)) return items;
  if (Array.isArray(items.item)) return items.item;
  if (items.item != null) return [items.item];
  return [];
}

function toNumber(value) {
  if (value == null || value === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function average(values) {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function median(values) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function round(value) {
  return value == null ? null : Math.round(value);
}

async function fetchJson(url, params, retries = 3) {
  let lastError = null;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const query = new URLSearchParams(params);
      const response = await fetch(`${url}?${query}`, {
        headers: {
          "User-Agent": "brand-app-demo/1.0"
        },
        signal: AbortSignal.timeout(20000)
      });
      const text = await response.text();
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`);
      }
      return JSON.parse(text);
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 200 * attempt));
      }
    }
  }
  throw lastError;
}

async function probeEndpoint(endpoint) {
  const yearValue = endpoint.yearParam === "jngBizCrtraYr" ? "2024" : String(latestSupportedYear);
  try {
    const payload = await fetchJson(endpoint.url, {
      serviceKey: SERVICE_KEY,
      pageNo: "1",
      numOfRows: "1",
      resultType: "json",
      [endpoint.yearParam]: yearValue
    }, 1);
    return {
      id: endpoint.id,
      title: endpoint.title,
      url: endpoint.url,
      status: payload.resultCode === "00" ? "ok" : "api_error",
      resultCode: payload.resultCode ?? null,
      resultMsg: payload.resultMsg ?? null,
      totalCount: toNumber(payload.totalCount),
      checkedAt: new Date().toISOString()
    };
  } catch (error) {
    return {
      id: endpoint.id,
      title: endpoint.title,
      url: endpoint.url,
      status: "blocked",
      resultCode: null,
      resultMsg: error.message,
      totalCount: null,
      checkedAt: new Date().toISOString()
    };
  }
}

async function fetchYearDataset(endpoint, year) {
  const firstPage = await fetchJson(endpoint.url, {
    serviceKey: SERVICE_KEY,
    pageNo: "1",
    numOfRows: String(endpoint.pageSize),
    resultType: "json",
    [endpoint.yearParam]: String(year)
  });
  if (firstPage.resultCode !== "00") {
    throw new Error(`${endpoint.id} ${year}: ${firstPage.resultCode} ${firstPage.resultMsg}`);
  }
  const totalCount = toNumber(firstPage.totalCount) ?? 0;
  const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / endpoint.pageSize);
  const items = asArray(firstPage.items);
  for (let pageNo = 2; pageNo <= totalPages; pageNo += 1) {
    const page = await fetchJson(endpoint.url, {
      serviceKey: SERVICE_KEY,
      pageNo: String(pageNo),
      numOfRows: String(endpoint.pageSize),
      resultType: "json",
      [endpoint.yearParam]: String(year)
    });
    if (page.resultCode !== "00") {
      throw new Error(`${endpoint.id} ${year} page ${pageNo}: ${page.resultCode} ${page.resultMsg}`);
    }
    items.push(...asArray(page.items));
  }
  return {
    year,
    totalCount,
    totalPages,
    items
  };
}

function normalizeBrandStats(datasetByYear) {
  const rows = [];
  for (const { year, items } of datasetByYear) {
    for (const item of items) {
      const averageSalesAmountRaw = toNumber(item.avrgSlsAmt);
      const areaUnitAverageSalesAmountRaw = toNumber(item.arUnitAvrgSlsAmt);
      rows.push({
        sourceDataset: "brand_franchise_stats",
        year,
        industryLargeClassName: item.indutyLclasNm ?? null,
        industryMediumClassName: item.indutyMlsfcNm ?? null,
        corpName: item.corpNm ?? null,
        brandName: item.brandNm ?? null,
        franchiseStoreCount: toNumber(item.frcsCnt),
        newFranchiseRegistrationCount: toNumber(item.newFrcsRgsCnt),
        contractEndCount: toNumber(item.ctrtEndCnt),
        contractCancellationCount: toNumber(item.ctrtCncltnCnt),
        nameChangeCount: toNumber(item.nmChgCnt),
        averageSalesAmountRaw,
        averageSalesAmountKrwAssumed: averageSalesAmountRaw == null ? null : averageSalesAmountRaw * 1000,
        areaUnitAverageSalesAmountRaw,
        areaUnitAverageSalesAmountKrwAssumed: areaUnitAverageSalesAmountRaw == null ? null : areaUnitAverageSalesAmountRaw * 1000,
        amountUnitAssumption: amountUnitNote
      });
    }
  }
  return rows;
}

function normalizeStartupStats(datasetByYear) {
  const rows = [];
  for (const { year, items } of datasetByYear) {
    for (const item of items) {
      const franchiseFeeAmountRaw = toNumber(item.jngBzmnJngAmt);
      const educationFeeAmountRaw = toNumber(item.jngBzmnEduAmt);
      const depositAmountRaw = toNumber(item.jngBzmnAssrncAmt);
      const otherStartupAmountRaw = toNumber(item.jngBzmnEtcAmt);
      const startupTotalAmountRaw = toNumber(item.smtnAmt);
      rows.push({
        sourceDataset: "brand_startup_stats",
        year,
        industryLargeClassName: item.indutyLclasNm ?? null,
        industryMediumClassName: item.indutyMlsfcNm ?? null,
        corpName: item.corpNm ?? null,
        brandName: item.brandNm ?? null,
        franchiseFeeAmountRaw,
        franchiseFeeAmountKrwAssumed: franchiseFeeAmountRaw == null ? null : franchiseFeeAmountRaw * 1000,
        educationFeeAmountRaw,
        educationFeeAmountKrwAssumed: educationFeeAmountRaw == null ? null : educationFeeAmountRaw * 1000,
        depositAmountRaw,
        depositAmountKrwAssumed: depositAmountRaw == null ? null : depositAmountRaw * 1000,
        otherStartupAmountRaw,
        otherStartupAmountKrwAssumed: otherStartupAmountRaw == null ? null : otherStartupAmountRaw * 1000,
        startupTotalAmountRaw,
        startupTotalAmountKrwAssumed: startupTotalAmountRaw == null ? null : startupTotalAmountRaw * 1000,
        amountUnitAssumption: amountUnitNote
      });
    }
  }
  return rows;
}

function normalizeAreaIndustryAverages(datasetByYear) {
  const rows = [];
  for (const { year, items } of datasetByYear) {
    for (const item of items) {
      const averageSalesAmountRaw = toNumber(item.frcsCnt);
      const areaUnitAverageSalesAmountRaw = toNumber(item.arUnitAvrgSlsAmt);
      rows.push({
        sourceDataset: "area_industry_average_out",
        year,
        areaName: item.areaNm ?? null,
        industryMediumClassName: item.indutyMlsfcNm ?? null,
        currencyUnitName: item.crrncyUnitCdNm ?? null,
        averageSalesAmountRaw,
        averageSalesAmountKrwAssumed: averageSalesAmountRaw == null ? null : averageSalesAmountRaw * 1000,
        areaUnitAverageSalesAmountRaw,
        areaUnitAverageSalesAmountKrwAssumed: areaUnitAverageSalesAmountRaw == null ? null : areaUnitAverageSalesAmountRaw * 1000,
        amountUnitAssumption: amountUnitNote
      });
    }
  }
  return rows;
}

function normalizeIndustryOpenClose(datasetByYear) {
  const rows = [];
  for (const { year, items } of datasetByYear) {
    for (const item of items) {
      rows.push({
        sourceDataset: "industry_open_close_out",
        year,
        industryLargeClassName: item.indutyLclasNm ?? null,
        industryMediumClassName: item.indutyMlsfcNm ?? null,
        totalFranchiseStoreCount: toNumber(item.allFrcsCnt),
        newFranchiseRegistrationCount: toNumber(item.newFrcsRgsCnt),
        newFranchiseRate: toNumber(item.newFrcsRt),
        closureLikeFranchiseCount: toNumber(item.endCncltnFrcsCnt),
        closureLikeRate: toNumber(item.endCncltnRt),
        previousYearNewRate: toNumber(item.bfyrNewFrcsRt),
        previousYearNewDifferenceRate: toNumber(item.bfyrVersusNewDffrncRt),
        previousYearClosureRate: toNumber(item.bfyrVersusEndCncltnRt),
        previousYearNetDifferenceRate: toNumber(item.bfyrVersusDffrncRt)
      });
    }
  }
  return rows;
}

function normalizeIndustryFluctuation(datasetByYear) {
  const rows = [];
  for (const { year, items } of datasetByYear) {
    for (const item of items) {
      rows.push({
        sourceDataset: "industry_fluctuation",
        requestedYear: year,
        franchiseBusinessCriteriaYear: toNumber(item.jngBizCrtraYr),
        accountingYear: toNumber(item.acntgYr),
        industryLargeClassName: item.indutyLclasNm ?? null,
        industryMediumClassName: item.indutyMlsfcNm ?? null,
        franchiseStoreCount: toNumber(item.frcsCnt),
        averageNewOpenBusinessCount: toNumber(item.avrgNewOpbizCnt),
        averageContractEndCount: toNumber(item.avrgCtrtEndCnt),
        averageContractCancellationCount: toNumber(item.avrgCtrtCncltnCnt)
      });
    }
  }
  return rows;
}

function buildJoinKey(row) {
  return [
    row.year,
    row.industryLargeClassName ?? "",
    row.industryMediumClassName ?? "",
    row.corpName ?? "",
    row.brandName ?? ""
  ].join("||");
}

function joinBrandAndStartup(brandRows, startupRows) {
  const startupMap = new Map(startupRows.map((row) => [buildJoinKey(row), row]));
  const joined = [];
  for (const brandRow of brandRows) {
    const startupRow = startupMap.get(buildJoinKey(brandRow));
    joined.push({
      id: buildJoinKey(brandRow),
      ...brandRow,
      hasStartupStats: Boolean(startupRow),
      franchiseFeeAmountRaw: startupRow?.franchiseFeeAmountRaw ?? null,
      franchiseFeeAmountKrwAssumed: startupRow?.franchiseFeeAmountKrwAssumed ?? null,
      educationFeeAmountRaw: startupRow?.educationFeeAmountRaw ?? null,
      educationFeeAmountKrwAssumed: startupRow?.educationFeeAmountKrwAssumed ?? null,
      depositAmountRaw: startupRow?.depositAmountRaw ?? null,
      depositAmountKrwAssumed: startupRow?.depositAmountKrwAssumed ?? null,
      otherStartupAmountRaw: startupRow?.otherStartupAmountRaw ?? null,
      otherStartupAmountKrwAssumed: startupRow?.otherStartupAmountKrwAssumed ?? null,
      startupTotalAmountRaw: startupRow?.startupTotalAmountRaw ?? null,
      startupTotalAmountKrwAssumed: startupRow?.startupTotalAmountKrwAssumed ?? null
    });
  }
  return joined;
}

function aggregateIndustryRows(joinedRows) {
  const grouped = new Map();
  for (const row of joinedRows) {
    const key = [row.year, row.industryLargeClassName, row.industryMediumClassName].join("||");
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(row);
  }
  return [...grouped.entries()].map(([key, rows]) => {
    const [year, industryLargeClassName, industryMediumClassName] = key.split("||");
    const salesValues = rows.map((row) => row.averageSalesAmountKrwAssumed).filter((value) => value != null);
    const startupValues = rows.map((row) => row.startupTotalAmountKrwAssumed).filter((value) => value != null);
    const storeCounts = rows.map((row) => row.franchiseStoreCount).filter((value) => value != null);
    const newCounts = rows.map((row) => row.newFranchiseRegistrationCount).filter((value) => value != null);
    const endCounts = rows.map((row) => row.contractEndCount).filter((value) => value != null);
    const cancellationCounts = rows.map((row) => row.contractCancellationCount).filter((value) => value != null);
    const totalStores = storeCounts.reduce((sum, value) => sum + value, 0);
    const totalNew = newCounts.reduce((sum, value) => sum + value, 0);
    const totalEnd = endCounts.reduce((sum, value) => sum + value, 0);
    const totalCancellation = cancellationCounts.reduce((sum, value) => sum + value, 0);
    const totalClosureLike = totalEnd + totalCancellation;
    return {
      year: Number(year),
      industryLargeClassName,
      industryMediumClassName,
      brandCount: rows.length,
      quantifiedSalesBrandCount: salesValues.length,
      quantifiedStartupBrandCount: startupValues.length,
      totalFranchiseStoreCount: totalStores,
      totalNewFranchiseRegistrationCount: totalNew,
      totalContractEndCount: totalEnd,
      totalContractCancellationCount: totalCancellation,
      totalClosureLikeCount: totalClosureLike,
      averageBrandSalesKrw: round(average(salesValues)),
      medianBrandSalesKrw: round(median(salesValues)),
      averageBrandStartupCostKrw: round(average(startupValues)),
      medianBrandStartupCostKrw: round(median(startupValues)),
      averageStoresPerBrand: round(average(storeCounts)),
      medianStoresPerBrand: round(median(storeCounts)),
      averageNewRegistrationsPerBrand: round(average(newCounts)),
      averageEndCountsPerBrand: round(average(endCounts)),
      averageCancellationCountsPerBrand: round(average(cancellationCounts)),
      newRegistrationRateByStore: totalStores > 0 ? Number((totalNew / totalStores).toFixed(4)) : null,
      closureLikeRateByStore: totalStores > 0 ? Number((totalClosureLike / totalStores).toFixed(4)) : null,
      joinedBrandCoverageRate: Number((rows.filter((row) => row.hasStartupStats).length / rows.length).toFixed(4))
    };
  }).sort((a, b) => a.year - b.year || a.industryLargeClassName.localeCompare(b.industryLargeClassName, "ko") || a.industryMediumClassName.localeCompare(b.industryMediumClassName, "ko"));
}

function buildFoodServiceLatestViews(joinedRows, aggregatedRows) {
  const foodRows = joinedRows
    .filter((row) => row.year === latestSupportedYear && row.industryLargeClassName === "외식")
    .sort((a, b) => (b.averageSalesAmountKrwAssumed ?? -1) - (a.averageSalesAmountKrwAssumed ?? -1));

  const foodIndustryRows = aggregatedRows
    .filter((row) => row.year === latestSupportedYear && row.industryLargeClassName === "외식")
    .sort((a, b) => (b.averageBrandSalesKrw ?? -1) - (a.averageBrandSalesKrw ?? -1));

  const rankingRows = [];
  const grouped = new Map();
  for (const row of foodRows) {
    if (!grouped.has(row.industryMediumClassName)) grouped.set(row.industryMediumClassName, []);
    grouped.get(row.industryMediumClassName).push(row);
  }
  for (const [industryMediumClassName, rows] of grouped.entries()) {
    rows
      .filter((row) => (row.franchiseStoreCount ?? 0) > 0)
      .slice(0, 30)
      .forEach((row, index) => {
        rankingRows.push({
          year: latestSupportedYear,
          industryMediumClassName,
          rankInIndustry: index + 1,
          brandName: row.brandName,
          corpName: row.corpName,
          franchiseStoreCount: row.franchiseStoreCount,
          averageSalesAmountKrwAssumed: row.averageSalesAmountKrwAssumed,
          startupTotalAmountKrwAssumed: row.startupTotalAmountKrwAssumed,
          newFranchiseRegistrationCount: row.newFranchiseRegistrationCount,
          contractEndCount: row.contractEndCount,
          contractCancellationCount: row.contractCancellationCount
        });
      });
  }

  return {
    foodRows,
    foodIndustryRows,
    rankingRows
  };
}

async function main() {
  fs.rmSync(outRoot, { recursive: true, force: true });
  ensureDir(outRoot);

  const endpointStatuses = [];
  for (const endpoint of endpointCatalog) {
    endpointStatuses.push(await probeEndpoint(endpoint));
  }
  writeJson("metadata/endpoint_status.json", endpointStatuses);

  const collectableEndpoints = endpointCatalog.filter((endpoint) => endpoint.expectedStatus === "collectable");
  const byEndpoint = {};

  for (const endpoint of collectableEndpoints) {
    const yearlyDatasets = [];
    for (const year of years) {
      console.log(`fetch ${endpoint.id} ${year}`);
      const dataset = await fetchYearDataset(endpoint, year);
      yearlyDatasets.push(dataset);
      writeJson(`raw/${endpoint.id}_${year}.json`, {
        endpointId: endpoint.id,
        title: endpoint.title,
        year,
        totalCount: dataset.totalCount,
        totalPages: dataset.totalPages,
        items: dataset.items
      });
    }
    byEndpoint[endpoint.id] = yearlyDatasets;
  }

  const brandRows = normalizeBrandStats(byEndpoint.brand_franchise_stats);
  const startupRows = normalizeStartupStats(byEndpoint.brand_startup_stats);
  const areaAverageRows = normalizeAreaIndustryAverages(byEndpoint.area_industry_average_out);
  const openCloseRows = normalizeIndustryOpenClose(byEndpoint.industry_open_close_out);
  const fluctuationRows = normalizeIndustryFluctuation(byEndpoint.industry_fluctuation);
  const joinedRows = joinBrandAndStartup(brandRows, startupRows);
  const aggregatedRows = aggregateIndustryRows(joinedRows);
  const foodServiceViews = buildFoodServiceLatestViews(joinedRows, aggregatedRows);

  writeJson("normalized/brand_franchise_stats_all.json", brandRows);
  writeCsv("normalized/brand_franchise_stats_all.csv", brandRows);
  writeJson("normalized/brand_startup_stats_all.json", startupRows);
  writeCsv("normalized/brand_startup_stats_all.csv", startupRows);
  writeJson("normalized/area_industry_average_out_all.json", areaAverageRows);
  writeCsv("normalized/area_industry_average_out_all.csv", areaAverageRows);
  writeJson("normalized/industry_open_close_out_all.json", openCloseRows);
  writeCsv("normalized/industry_open_close_out_all.csv", openCloseRows);
  writeJson("normalized/industry_fluctuation_all.json", fluctuationRows);
  writeCsv("normalized/industry_fluctuation_all.csv", fluctuationRows);
  writeJson("normalized/brand_joined_all.json", joinedRows);
  writeCsv("normalized/brand_joined_all.csv", joinedRows);
  writeJson("normalized/food_service_brand_joined_latest.json", foodServiceViews.foodRows);
  writeCsv("normalized/food_service_brand_joined_latest.csv", foodServiceViews.foodRows);

  writeJson("aggregates/industry_averages_all_years.json", aggregatedRows);
  writeCsv("aggregates/industry_averages_all_years.csv", aggregatedRows);
  writeJson("aggregates/food_service_industry_averages_latest.json", foodServiceViews.foodIndustryRows);
  writeCsv("aggregates/food_service_industry_averages_latest.csv", foodServiceViews.foodIndustryRows);
  writeJson("aggregates/food_service_brand_rankings_latest.json", foodServiceViews.rankingRows);
  writeCsv("aggregates/food_service_brand_rankings_latest.csv", foodServiceViews.rankingRows);

  writeJson("metadata/collection_report.json", {
    generatedAt: new Date().toISOString(),
    source: "공정거래위원회 가맹정보 OpenAPI",
    latestSupportedYear,
    collectedYears: years,
    amountUnitAssumption: amountUnitNote,
    collectableEndpoints: collectableEndpoints.map((endpoint) => endpoint.id),
    blockedEndpoints: endpointStatuses.filter((item) => item.status !== "ok").map((item) => ({
      id: item.id,
      title: item.title,
      status: item.status,
      message: item.resultMsg
    })),
    rowCounts: {
      brandFranchiseRows: brandRows.length,
      brandStartupRows: startupRows.length,
      areaIndustryAverageRows: areaAverageRows.length,
      industryOpenCloseRows: openCloseRows.length,
      industryFluctuationRows: fluctuationRows.length,
      joinedRows: joinedRows.length,
      foodServiceLatestBrandRows: foodServiceViews.foodRows.length,
      foodServiceLatestIndustryRows: foodServiceViews.foodIndustryRows.length
    },
    yearCounts: Object.fromEntries(collectableEndpoints.map((endpoint) => [
      endpoint.id,
      Object.fromEntries(byEndpoint[endpoint.id].map((dataset) => [dataset.year, dataset.totalCount]))
    ]))
  });

  writeJson("metadata/years_available.json", {
    collectableEndpoints: Object.fromEntries(collectableEndpoints.map((endpoint) => [
      endpoint.id,
      byEndpoint[endpoint.id]
        .filter((dataset) => dataset.totalCount > 0)
        .map((dataset) => dataset.year)
    ]))
  });

  console.log(`collected FTC franchise db -> ${path.relative(root, outRoot)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
