import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { spawn, spawnSync } from "node:child_process";

const root = process.cwd();
const outRoot = path.join(root, "DB_real/sbiz_location_db");
const storeZipPath = "/home/openq/Downloads/소상공인시장진흥공단_상가(상권)정보_20260331.zip";
const industryCodePath = "/home/openq/Downloads/소상공인시장진흥공단_상가(상권)정보 업종코드_20230228.csv";
const openApiGuidePath = "/home/openq/Downloads/(251128)소상공인시장진흥공단_상가(상권)정보_OpenApi 활용가이드.zip";
const capturedAt = new Date().toISOString();

const seedRequests = [
  {
    id: "busan_pnu_ilsik_bowl_800m",
    label: "부산대 상권 일식 카레/돈가스/덮밥 800m",
    latitude: 35.23125,
    longitude: 129.08412,
    radiusMeters: 800,
    category: {
      largeCode: "I2",
      largeName: "음식점업",
      middleCode: "I203",
      middleName: "일식 음식점업",
      smallCode: "I20302",
      smallName: "일식 카레/돈가스/덮밥"
    }
  },
  {
    id: "busan_pnu_cafe_500m",
    label: "부산대 상권 카페 500m",
    latitude: 35.23125,
    longitude: 129.08412,
    radiusMeters: 500,
    category: {
      largeCode: "I2",
      largeName: "음식점업",
      middleCode: "I212",
      middleName: "비알코올 음료점업",
      smallCode: "I21201",
      smallName: "카페"
    }
  }
];

const sbiz365Services = [
  ["sns", "SNS 분석", "snsAnaly", "c9b8baf919fd5471ef16e3c067a74fdf643b7c7b5546624a48859affd9b0e587", "검색 언급량과 키워드 분위기를 체험용 수요 신호로 표시"],
  ["theme", "테마상권 분석", "hpReport", "55b7f6e3e8d780ec44875d88f2da415aa5eb21c0a3c5e6a67ba52a1add4fe55e", "생활인구와 테마 상권 특성을 요약"],
  ["weather", "창업기상도", "weather", "95001e176aea1bea143d29813ffcf80ae495f767b75762be9c2bcfb27e4691cf", "업종 진입 위험과 성장 신호를 날씨형 지표로 표시"],
  ["sales_trend", "점포당 매출액 추이", "slsIdex", "abf25476f31af7e82f38ce61bd3e57f2e286343bf5c897bfc6a9e4f698e0df84", "매출 추세와 계절성 보정값을 표시"],
  ["store_status", "업소현황", "storSttus", "cd749a16e4bd3d322957ca130d030005afca30d73f0cfdc006b18a72516a392b", "동종 업소 수와 업종 밀도를 표시"],
  ["business_age", "업력현황", "stcarSttus", "8e7c634e896fda5625f4915a3da916d8c5d40f37059c2446a0b96d1a49cdaaad", "신규/장기 영업 비중을 안정성 신호로 표시"],
  ["map", "상권지도", "startupPublic", "3a0b450af5f1377cbcfae88fa63a3c9a5c2cc3791f71f77336d924552b2636fb", "지도형 상권 경계를 체험 패널로 연결"],
  ["detail", "상세분석", "detail", "0eec239dccd128e723cd803950dedb096cf8ecc29dcd5d56bd8ed5cfff0fa88a", "종합 상세 리포트 CTA와 위험 요인을 표시"],
  ["delivery", "배달분석", "delivery", "fe7bf0b9eb0102d71e54dcf9cd07c363a4510d56eed9a82f075a1528afcade2f", "배달 수요와 경쟁 강도를 시뮬레이터 보정값으로 표시"],
  ["tour", "관광 축제 정보", "tour", "9dd56e575a2e7db7ea0e93ebfc262f0a6985145a75616aba02f3eff00762eff6", "축제/관광 이벤트를 단기 매출 보너스 후보로 표시"],
  ["simple", "간단분석", "simple", "778d83fdeeec1660be6f3eca1835a4dad7be67f0aee9e88c30237f42ef062668", "첫 화면 적합도와 핵심 KPI 카드에 연결"]
].map(([id, name, route, certKey, appUsage]) => ({
  id,
  name,
  route,
  url: `https://bigdata.sbiz.or.kr/#/openApi/${route}?certKey=${certKey}`,
  requestedAt: "2026-06-08",
  validUntil: "2026-09-30",
  appUsage
}));

const sdsc2Endpoints = [
  ["storeZoneOne", "지정 상권조회", "/storeZoneOne"],
  ["storeListInDong", "행정동 단위 상가업소 조회", "/storeListInDong"],
  ["baroApi", "행정경계조회", "/baroApi"],
  ["storeZoneInRadius", "반경내 상권조회", "/storeZoneInRadius"],
  ["storeZoneInRectangle", "사각형내 상권조회", "/storeZoneInRectangle"],
  ["storeZoneInAdmi", "행정구역 단위 상권조회", "/storeZoneInAdmi"],
  ["storeOne", "단일 상가업소 조회", "/storeOne"],
  ["storeListInBuilding", "건물 단위 상가업소 조회", "/storeListInBuilding"],
  ["storeListInPnu", "지번 단위 상가업소 조회", "/storeListInPnu"],
  ["storeListInArea", "상권내 상가업소 조회", "/storeListInArea"],
  ["storeListInRadius", "반경내 상가업소 조회", "/storeListInRadius"],
  ["storeListInRectangle", "사각형내 상가업소 조회", "/storeListInRectangle"],
  ["storeListInPolygon", "다각형내 상가업소 조회", "/storeListInPolygon"],
  ["storeListInUpjong", "업종별 상가업소 조회", "/storeListInUpjong"],
  ["storeListByDate", "수정일자기준 상가업소 조회", "/storeListByDate"],
  ["reqStoreModify", "상가업소정보 변경요청", "/reqStoreModify"],
  ["largeUpjongList", "상권정보 업종 대분류 조회", "/largeUpjongList"],
  ["middleUpjongList", "상권정보 업종 중분류 조회", "/middleUpjongList"],
  ["smallUpjongList", "상권정보 업종 소분류 조회", "/smallUpjongList"]
].map(([id, name, pathValue]) => ({
  id,
  name,
  path: pathValue,
  url: `https://apis.data.go.kr/B553077/api/open/sdsc2${pathValue}`,
  appUsage: id.includes("Radius") ? "입력 좌표 기반 on-demand 캐시 생성" : "입지 프로파일 보강 데이터"
}));

function writeJson(relativePath, value) {
  const filePath = path.join(outRoot, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeCsv(relativePath, rows) {
  const filePath = path.join(outRoot, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  if (rows.length === 0) {
    fs.writeFileSync(filePath, "", "utf8");
    return;
  }
  const columns = Object.keys(rows[0]);
  const body = [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => escapeCsv(row[column])).join(","))
  ].join("\n");
  fs.writeFileSync(filePath, `${body}\n`, "utf8");
}

function escapeCsv(value) {
  if (value == null) return "";
  const text = String(value);
  if (/["\n,]/.test(text)) return `"${text.replace(/"/g, "\"\"")}"`;
  return text;
}

function parseCsvLine(line) {
  const cells = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === "\"") {
      if (quoted && line[index + 1] === "\"") {
        value += "\"";
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }
    if (char === "," && !quoted) {
      cells.push(value);
      value = "";
      continue;
    }
    value += char;
  }
  cells.push(value);
  return cells;
}

function readIndustryCodes() {
  const converted = spawnSync("iconv", ["-f", "cp949", "-t", "utf-8", industryCodePath], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 4
  });
  if (converted.status !== 0) throw new Error(converted.stderr);
  const lines = converted.stdout.trim().split(/\r?\n/);
  return lines.slice(1).map((line) => {
    const [largeCode, largeName, middleCode, middleName, smallCode, smallName] = parseCsvLine(line);
    return { largeCode, largeName, middleCode, middleName, smallCode, smallName };
  });
}

function listStoreCsvEntries() {
  const output = spawnSync("unzip", ["-l", storeZipPath], { encoding: "utf8" });
  if (output.status !== 0) throw new Error(output.stderr);
  return output.stdout
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*\d+\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}\s+(.+\.csv)$/)?.[1])
    .filter(Boolean);
}

function increment(map, key, amount = 1) {
  map.set(key, (map.get(key) ?? 0) + amount);
}

function haversineMeters(lat1, lon1, lat2, lon2) {
  const radius = 6371000;
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * radius * Math.asin(Math.sqrt(a));
}

function emptyProfileAccumulator(seed) {
  return {
    seed,
    totalStoresInRadius: 0,
    sameLargeStoresInRadius: 0,
    sameMiddleStoresInRadius: 0,
    sameSmallStoresInRadius: 0,
    administrativeDistrictCounts: new Map(),
    middleCategoryCounts: new Map(),
    smallCategoryCounts: new Map(),
    nearbyStores: []
  };
}

function pushNearby(profile, store, distanceMeters) {
  profile.nearbyStores.push({
    storeId: store.storeId,
    name: store.storeName,
    distanceMeters: Math.round(distanceMeters),
    sidoName: store.sidoName,
    sigunguName: store.sigunguName,
    administrativeDongName: store.administrativeDongName,
    middleCategoryName: store.middleCategoryName,
    smallCategoryName: store.smallCategoryName,
    longitude: store.longitude,
    latitude: store.latitude
  });
  profile.nearbyStores.sort((a, b) => a.distanceMeters - b.distanceMeters);
  if (profile.nearbyStores.length > 80) profile.nearbyStores.length = 80;
}

function finalizeProfile(profile) {
  const areaKm2 = Math.PI * (profile.seed.radiusMeters / 1000) ** 2;
  const topMiddleCategories = [...profile.middleCategoryCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  const topSmallCategories = [...profile.smallCategoryCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  const district = [...profile.administrativeDistrictCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "미확인";
  const sameSmallDensity = Number((profile.sameSmallStoresInRadius / areaKm2).toFixed(1));
  const foodDensity = Number((profile.sameLargeStoresInRadius / areaKm2).toFixed(1));
  const cautionSignals = [];
  const advantageSignals = [];
  if (sameSmallDensity >= 20) cautionSignals.push("동일 소분류 경쟁 밀도 높음");
  if (sameSmallDensity < 10) advantageSignals.push("동일 소분류 직접 경쟁이 낮은 편");
  if (foodDensity >= 160) advantageSignals.push("음식점 집적도가 높아 목적 방문 수요 기대");
  if (profile.sameMiddleStoresInRadius >= 30) cautionSignals.push("중분류 내 대체 선택지가 많음");
  if (profile.totalStoresInRadius >= 300) advantageSignals.push("반경 내 생활 상업 밀집도 높음");

  return {
    cacheKey: `${profile.seed.latitude},${profile.seed.longitude}:${profile.seed.radiusMeters}:${profile.seed.category.smallCode}:2026-06-08`,
    sourceTimestamp: capturedAt,
    sourceFiles: [storeZipPath, industryCodePath],
    request: profile.seed,
    administrativeDistrict: district,
    commercialZoneNumber: null,
    metrics: {
      totalStoresInRadius: profile.totalStoresInRadius,
      sameLargeStoresInRadius: profile.sameLargeStoresInRadius,
      sameMiddleStoresInRadius: profile.sameMiddleStoresInRadius,
      sameSmallStoresInRadius: profile.sameSmallStoresInRadius,
      totalStoreDensityPerKm2: Number((profile.totalStoresInRadius / areaKm2).toFixed(1)),
      foodStoreDensityPerKm2: foodDensity,
      sameSmallStoreDensityPerKm2: sameSmallDensity
    },
    topMiddleCategories,
    topSmallCategories,
    salesTrend: {
      source: "소상공인365 점포당 매출액 추이 API 연결 예정",
      simulatorUse: "업종 평균 매출에 입지 보정 계수 적용",
      estimatedTrendIndex: Math.max(82, Math.min(118, 100 + Math.round((profile.sameLargeStoresInRadius - profile.sameMiddleStoresInRadius) / 8)))
    },
    deliveryAnalysis: {
      source: "소상공인365 배달분석 API 연결 예정",
      estimatedDeliveryFit: profile.sameLargeStoresInRadius > 120 ? "high" : "medium",
      deliveryCompetitionLevel: profile.sameMiddleStoresInRadius > 25 ? "high" : "medium"
    },
    businessAgeDistribution: {
      source: "소상공인365 업력현황 API 연결 예정",
      inferredStability: profile.sameMiddleStoresInRadius > 15 ? "검증된 외식 수요권" : "초기 검증 필요"
    },
    snsKeywords: {
      source: "소상공인365 SNS 분석 API 연결 예정",
      keywords: profile.seed.category.smallName.includes("카페") ? ["카공", "디저트", "테이크아웃"] : ["혼밥", "덮밥", "점심"]
    },
    tourismFestivalEvents: {
      source: "소상공인365 관광 축제 정보 API 연결 예정",
      eventFit: profile.seed.label.includes("부산대") ? "대학가 행사와 학기 시즌 반응 확인 필요" : "지역 이벤트 확인 필요"
    },
    advantageSignals,
    cautionSignals,
    nearbyStores: profile.nearbyStores
  };
}

function parseStore(cells) {
  return {
    storeId: cells[0],
    storeName: cells[1],
    largeCategoryCode: cells[3],
    largeCategoryName: cells[4],
    middleCategoryCode: cells[5],
    middleCategoryName: cells[6],
    smallCategoryCode: cells[7],
    smallCategoryName: cells[8],
    sidoCode: cells[11],
    sidoName: cells[12],
    sigunguCode: cells[13],
    sigunguName: cells[14],
    administrativeDongCode: cells[15],
    administrativeDongName: cells[16],
    longitude: Number(cells[37]),
    latitude: Number(cells[38])
  };
}

async function processEntry(entryName, state) {
  const unzip = spawn("unzip", ["-p", storeZipPath, entryName], { stdio: ["ignore", "pipe", "inherit"] });
  const reader = readline.createInterface({ input: unzip.stdout, crlfDelay: Infinity });
  let headerSkipped = false;
  for await (const line of reader) {
    if (!headerSkipped) {
      headerSkipped = true;
      continue;
    }
    if (!line.trim()) continue;
    const store = parseStore(parseCsvLine(line));
    if (!Number.isFinite(store.latitude) || !Number.isFinite(store.longitude)) continue;
    state.totalStores += 1;
    increment(state.sidoCounts, store.sidoName);
    increment(state.largeCategoryCounts, `${store.largeCategoryCode}|${store.largeCategoryName}`);
    increment(state.middleCategoryCounts, `${store.middleCategoryCode}|${store.middleCategoryName}`);
    increment(state.sidoMiddleCounts, `${store.sidoName}|${store.middleCategoryCode}|${store.middleCategoryName}`);
    increment(state.sigunguMiddleCounts, `${store.sidoName}|${store.sigunguName}|${store.middleCategoryCode}|${store.middleCategoryName}`);

    if (store.largeCategoryCode === "I2") {
      state.foodStores += 1;
      increment(state.foodSidoCounts, store.sidoName);
      increment(state.foodSigunguSmallCounts, `${store.sidoName}|${store.sigunguName}|${store.smallCategoryCode}|${store.smallCategoryName}`);
    }

    for (const profile of state.profileAccumulators) {
      const distanceMeters = haversineMeters(profile.seed.latitude, profile.seed.longitude, store.latitude, store.longitude);
      if (distanceMeters > profile.seed.radiusMeters) continue;
      profile.totalStoresInRadius += 1;
      increment(profile.administrativeDistrictCounts, `${store.sidoName} ${store.sigunguName} ${store.administrativeDongName}`);
      increment(profile.middleCategoryCounts, store.middleCategoryName);
      increment(profile.smallCategoryCounts, store.smallCategoryName);
      if (store.largeCategoryCode === profile.seed.category.largeCode) profile.sameLargeStoresInRadius += 1;
      if (store.middleCategoryCode === profile.seed.category.middleCode) profile.sameMiddleStoresInRadius += 1;
      if (store.smallCategoryCode === profile.seed.category.smallCode) profile.sameSmallStoresInRadius += 1;
      if (store.largeCategoryCode === "I2") pushNearby(profile, store, distanceMeters);
    }
  }
  const exitCode = await new Promise((resolve) => unzip.on("close", resolve));
  if (exitCode !== 0) throw new Error(`unzip failed for ${entryName}`);
}

function mapCounts(map, columns) {
  return [...map.entries()].map(([key, count]) => {
    const values = key.split("|");
    return Object.fromEntries(columns.map((column, index) => [column, values[index] ?? null]).concat([["count", count]]));
  });
}

async function main() {
  fs.rmSync(outRoot, { recursive: true, force: true });
  const industryCodes = readIndustryCodes();
  const entries = listStoreCsvEntries();
  const state = {
    totalStores: 0,
    foodStores: 0,
    sidoCounts: new Map(),
    foodSidoCounts: new Map(),
    largeCategoryCounts: new Map(),
    middleCategoryCounts: new Map(),
    sidoMiddleCounts: new Map(),
    sigunguMiddleCounts: new Map(),
    foodSigunguSmallCounts: new Map(),
    profileAccumulators: seedRequests.map(emptyProfileAccumulator)
  };

  for (const entry of entries) {
    console.log(`process ${entry}`);
    await processEntry(entry, state);
  }

  const locationProfiles = state.profileAccumulators.map(finalizeProfile);
  const industryCodeRows = industryCodes.map((item) => ({
    ...item,
    demoFoodService: item.largeCode === "I2"
  }));

  writeJson("metadata/collection_report.json", {
    generatedAt: capturedAt,
    sourceFiles: {
      storeZipPath,
      industryCodePath,
      openApiGuidePath
    },
    storeCsvEntryCount: entries.length,
    totalStores: state.totalStores,
    foodServiceStores: state.foodStores,
    industryCodeCount: industryCodes.length,
    profileCacheCount: locationProfiles.length,
    cacheKeyRule: "lat,lng:radiusMeters:smallCategoryCode:queryDate"
  });
  writeJson("metadata/store_zip_entries.json", entries.map((name) => ({ name })));
  writeJson("services/sbiz365_openapi_services.json", sbiz365Services);
  writeJson("services/sdsc2_openapi_endpoints.json", sdsc2Endpoints);
  writeJson("normalized/industry_codes.json", industryCodeRows);
  writeCsv("normalized/industry_codes.csv", industryCodeRows);
  writeJson("aggregates/store_counts_by_sido.json", mapCounts(state.sidoCounts, ["sidoName"]));
  writeJson("aggregates/food_store_counts_by_sido.json", mapCounts(state.foodSidoCounts, ["sidoName"]));
  writeJson("aggregates/store_counts_by_large_category.json", mapCounts(state.largeCategoryCounts, ["largeCategoryCode", "largeCategoryName"]));
  writeJson("aggregates/store_counts_by_middle_category.json", mapCounts(state.middleCategoryCounts, ["middleCategoryCode", "middleCategoryName"]));
  writeJson("aggregates/store_counts_by_sido_middle_category.json", mapCounts(state.sidoMiddleCounts, ["sidoName", "middleCategoryCode", "middleCategoryName"]));
  writeJson("aggregates/store_counts_by_sigungu_middle_category.json", mapCounts(state.sigunguMiddleCounts, ["sidoName", "sigunguName", "middleCategoryCode", "middleCategoryName"]));
  writeJson("aggregates/food_store_counts_by_sigungu_small_category.json", mapCounts(state.foodSigunguSmallCounts, ["sidoName", "sigunguName", "smallCategoryCode", "smallCategoryName"]));
  writeJson("profiles/location_profile_cache_seed.json", locationProfiles);
  writeJson("profiles/on_demand_cache_schema.json", {
    cacheKey: "lat,lng:radiusMeters:smallCategoryCode:queryDate",
    requiredFields: [
      "administrativeDistrict",
      "commercialZoneNumber",
      "sameSmallStoresInRadius",
      "storeDensity",
      "salesTrend",
      "deliveryAnalysis",
      "businessAgeDistribution",
      "advantageSignals",
      "cautionSignals",
      "snsKeywords",
      "tourismFestivalEvents",
      "sourceTimestamp"
    ],
    refreshPolicy: "same query date returns cached profile; next date may refresh SBDC/Sbiz365 data"
  });

  console.log(`collected SBIZ location db -> ${path.relative(root, outRoot)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
