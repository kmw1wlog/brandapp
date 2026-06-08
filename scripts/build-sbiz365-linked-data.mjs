import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const root = process.cwd();
const experienceRoot = path.join(root, "DB_real/experience_db");
const rawRoot = path.join(experienceRoot, "sbiz365_raw");

const categoryMaster = readJson("DB_real/experience_db/category_master.json");
const simulationRules = readJson("DB_real/experience_db/simulation_rules.json");
const services = readJson("DB_real/sbiz_location_db/services/sbiz365_openapi_services.json");

const SERVICE_BY_ID = Object.fromEntries(services.map((service) => [service.id, service]));
const SIMPLE_CERT_KEY = getCertKey(SERVICE_BY_ID.simple.url);

const CATEGORY_RADIUS_RULES = {
  rice_bowl: [600, 800, "식사형 업종이라 점심 이동 반경과 배달 수요를 같이 봐야 함", "high", "medium"],
  coffee_drink: [300, 500, "도보 접근과 재방문 빈도가 높아 근거리 경쟁이 중요함", "medium", "high"],
  dessert_bakery: [350, 550, "간식 수요는 근거리 체류 인구와 테이크아웃 흐름 영향이 큼", "medium", "medium"],
  korean_food: [500, 800, "식사류는 근거리 직장/주거 수요와 배달을 함께 봐야 함", "high", "medium"],
  chinese_food: [500, 800, "배달과 홀 수요가 동시에 발생해 중거리 반경이 적합함", "high", "medium"],
  japanese_food: [450, 700, "점심 식사와 저녁 목적 방문이 섞여 중간 반경을 사용함", "medium", "medium"],
  western_pizza: [700, 1000, "배달 영향이 커서 넓은 반경과 저녁 수요를 함께 봐야 함", "high", "low"],
  snack_chicken: [600, 900, "야식과 배달 수요 비중이 높아 넓은 반경 평가가 필요함", "high", "low"],
  burger_sandwich: [450, 700, "점심 간편식과 배달 수요가 함께 발생함", "high", "medium"],
  lunchbox: [600, 850, "주문형 식사 수요와 단체 주문 가능성을 같이 봐야 함", "high", "medium"],
  salad_poke: [400, 650, "직장인 점심과 건강식 수요가 핵심이라 중거리 반경을 사용함", "high", "medium"]
};

const CANDIDATE_NAMES = ["장전2동", "장전1동", "명륜동", "부곡2동", "온천1동"];
const CATEGORY_KEYWORDS = {
  rice_bowl: ["혼밥", "덮밥", "점심"],
  coffee_drink: ["카페", "테이크아웃", "스터디"],
  dessert_bakery: ["디저트", "포장", "주말"],
  korean_food: ["점심", "백반", "한끼"],
  chinese_food: ["배달", "마라", "저녁"],
  japanese_food: ["돈가스", "라멘", "직장인"],
  western_pizza: ["피자", "파스타", "모임"],
  snack_chicken: ["분식", "치킨", "야식"],
  burger_sandwich: ["버거", "브런치", "간편식"],
  lunchbox: ["도시락", "점심", "단체주문"],
  salad_poke: ["샐러드", "포케", "건강식"]
};

async function main() {
  fs.mkdirSync(experienceRoot, { recursive: true });
  fs.mkdirSync(rawRoot, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  const bootstrapUrl = buildDirectGisUrl(SERVICE_BY_ID.simple, {
    lat: 35.23125,
    lng: 129.08412,
    dong: "부산광역시 금정구 장전2동"
  });
  await page.goto(bootstrapUrl, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(2500);

  const candidatePoints = await fetchJsonInPage(
    page,
    "/gis/api/getCoordToAdmPoint.json",
    { minXAxis: "386576", maxXAxis: "392328", minYAxis: "192145", maxYAxis: "196537", mapLevel: "3" }
  );
  const filteredCandidates = candidatePoints
    .filter((item) => CANDIDATE_NAMES.includes(item.admdstCdNm))
    .sort((a, b) => CANDIDATE_NAMES.indexOf(a.admdstCdNm) - CANDIDATE_NAMES.indexOf(b.admdstCdNm));

  const candidates = [];
  for (const item of filteredCandidates) {
    const latLng = await geocodeAddress(page, item.dongNm);
    candidates.push({
      candidate_id: item.dongCd,
      administrative_dong_code: item.dongCd,
      administrative_dong_name: item.admdstCdNm,
      full_dong_name: item.dongNm,
      latitude: latLng?.lat ?? 35.23125,
      longitude: latLng?.lng ?? 129.08412,
      tm_x: item.centerXCrdnt,
      tm_y: item.centerYCrdnt
    });
  }

  const radiusRules = categoryMaster.map((category) => {
    const [recommendedRadius, secondaryRadius, reason, deliveryBias, hallBias] = CATEGORY_RADIUS_RULES[category.category_id] ?? [500, 800, "초기 기본값", "medium", "medium"];
    return {
      category_id: category.category_id,
      display_name: category.display_name,
      recommended_radius_meters: recommendedRadius,
      secondary_radius_meters: secondaryRadius,
      reason,
      delivery_bias: deliveryBias,
      hall_bias: hallBias
    };
  });

  const generatedAt = new Date().toISOString();
  const rawSamples = {
    generatedAt,
    candidates
  };
  const moduleCache = [];
  const locationCandidateRankings = [];

  for (const category of categoryMaster) {
    const rule = radiusRules.find((item) => item.category_id === category.category_id);
    const currentCategoryRows = [];

    for (const candidate of candidates) {
      const avgData = await fetchJsonInPage(page, "/gis/simpleAnls/getAvgAmtInfo.json", {
        admiCd: candidate.administrative_dong_code,
        upjongCd: category.sdsc_codes[0].small,
        simpleLoc: candidate.full_dong_name,
        bizonNumber: "",
        bizonName: "",
        bzznType: "",
        xtLoginId: SIMPLE_CERT_KEY
      });

      if (!avgData?.analyNo) {
        continue;
      }

      const [siName, guName, dongName] = splitAdministrativeNames(candidate.full_dong_name);

      const baeminData = await fetchJsonInPage(page, "/gis/simpleAnls/getBaeminInfo.json", {
        admiCd: candidate.administrative_dong_code,
        analyNo: avgData.analyNo,
        upjongCd: category.sdsc_codes[0].small,
        stdYm: avgData.baeminStdYm ?? avgData.amtStdYm ?? "202603",
        mililis: avgData.mililis,
        dong: dongName,
        gu: guName,
        si: siName,
        xtLoginId: SIMPLE_CERT_KEY
      });

      const popularData = await fetchJsonInPage(page, "/gis/simpleAnls/getPopularInfo.json", {
        analyNo: avgData.analyNo,
        admiCd: candidate.administrative_dong_code,
        upjongCd: category.sdsc_codes[0].small,
        mililis: avgData.mililis,
        bizonNumber: "",
        bizonName: "",
        bzznType: "",
        xtLoginId: SIMPLE_CERT_KEY
      });

      currentCategoryRows.push({
        category_id: category.category_id,
        display_name: category.display_name,
        candidate,
        avgData,
        baeminData,
        popularData
      });

      const cacheBase = {
        lat: candidate.latitude,
        lng: candidate.longitude,
        radiusMeters: rule.recommended_radius_meters,
        categoryId: category.category_id,
        categoryCode: category.sdsc_codes[0].small,
        queryDate: "2026-06-08",
        candidateId: candidate.candidate_id,
        candidateLabel: candidate.full_dong_name
      };

      const summaryScore = scoreSimpleAverage(avgData, baeminData, popularData);
      const simpleInsight = buildSimpleInsight(avgData, baeminData, popularData, category);
      const annualSales = toArray(avgData.annualSales).map((item) => ({
        yyyymm: item.yymm,
        monthly_average_sales_thousand_krw: Number(item.saleAmt ?? 0),
        top_quartile_sales_thousand_krw: Number(item.maxAmt ?? 0),
        bottom_quartile_sales_thousand_krw: Number(item.minAmt ?? 0)
      }));

      moduleCache.push({
        ...cacheBase,
        moduleId: "simple",
        cacheKey: buildModuleCacheKey(cacheBase, "simple"),
        collection_status: "actual_api_response",
        data_origin: "sbiz365 /gis/simpleAnls/getAvgAmtInfo.json",
        summaryScore,
        sourceTimestamp: generatedAt,
        data: {
          analyNo: avgData.analyNo,
          analysisPath: avgData.path,
          summaryLocation: candidate.full_dong_name,
          upjongName: avgData.upjongTypeMap?.upjong3nm ?? category.display_name,
          monthlyAverageSalesThousandKrw: Number(avgData.saleAmt ?? 0),
          sameCategoryStoreCount: Number(avgData.saleCnt ?? 0),
          districtStoreCount: Number(avgData.saleGuCnt ?? 0),
          salesMomentumVsPrevMonth: Number(avgData.prevMonRate ?? 0),
          salesMomentumVsPrevYear: Number(avgData.prevYearRate ?? 0),
          insight: simpleInsight,
          officialIframeUrl: buildDirectGisUrl(SERVICE_BY_ID.simple, {
            lat: candidate.latitude,
            lng: candidate.longitude,
            dong: candidate.full_dong_name
          })
        }
      });

      moduleCache.push({
        ...cacheBase,
        moduleId: "sales_trend",
        cacheKey: buildModuleCacheKey(cacheBase, "sales_trend"),
        collection_status: "actual_api_response",
        data_origin: "sbiz365 /gis/simpleAnls/getAvgAmtInfo.json annualSales",
        sourceTimestamp: generatedAt,
        data: {
          standardMonth: avgData.amtStdYm,
          annualSales,
          trendIndex: Number(avgData.prevMonRate ?? 0) + 100
        }
      });

      moduleCache.push({
        ...cacheBase,
        moduleId: "store_status",
        cacheKey: buildModuleCacheKey(cacheBase, "store_status"),
        collection_status: "actual_api_response",
        data_origin: "sbiz365 /gis/simpleAnls/getAvgAmtInfo.json storeCnt",
        sourceTimestamp: generatedAt,
        data: {
          standardMonth: avgData.storeStdYm,
          districtStoreCounts: toArray(avgData.storeCnt),
          administrativeStoreCounts: toArray(avgData.storeCntAdmin),
          sameCategoryStoreCount: Number(avgData.saleCnt ?? 0),
          guStoreCount: Number(avgData.saleGuCnt ?? 0)
        }
      });

      moduleCache.push({
        ...cacheBase,
        moduleId: "delivery",
        cacheKey: buildModuleCacheKey(cacheBase, "delivery"),
        collection_status: "actual_api_response",
        data_origin: "sbiz365 /gis/simpleAnls/getBaeminInfo.json",
        sourceTimestamp: generatedAt,
        data: normalizeDeliveryData(baeminData)
      });

      moduleCache.push({
        ...cacheBase,
        moduleId: "theme",
        cacheKey: buildModuleCacheKey(cacheBase, "theme"),
        collection_status: "actual_api_response",
        data_origin: "sbiz365 /gis/simpleAnls/getPopularInfo.json",
        sourceTimestamp: generatedAt,
        data: normalizePopularData(popularData)
      });

      moduleCache.push({
        ...cacheBase,
        moduleId: "map",
        cacheKey: buildModuleCacheKey(cacheBase, "map"),
        collection_status: "official_page_linked",
        data_origin: "sbiz365 official iframe",
        sourceTimestamp: generatedAt,
        data: {
          latitude: candidate.latitude,
          longitude: candidate.longitude,
          administrativeDistrict: candidate.full_dong_name,
          officialIframeUrl: buildDirectGisUrl(SERVICE_BY_ID.map, {
            lat: candidate.latitude,
            lng: candidate.longitude,
            dong: candidate.full_dong_name
          })
        }
      });

      moduleCache.push(...buildDerivedModuleRecords(cacheBase, category, avgData, baeminData, popularData, generatedAt, candidate));
    }

    const rankings = rankCategoryCandidates(currentCategoryRows, rule);
    locationCandidateRankings.push(...rankings);
    rawSamples[category.category_id] = currentCategoryRows.map((item) => ({
      candidate: item.candidate,
      avgData: item.avgData,
      baeminData: item.baeminData,
      popularData: item.popularData
    }));
  }

  const financeLocationAdjustments = buildFinanceLocationAdjustments(categoryMaster, simulationRules, radiusRules);
  const blueprints = buildResponseBlueprints(services, rawSamples, generatedAt);

  writeJson("DB_real/experience_db/category_radius_rules.json", radiusRules);
  writeJson("DB_real/experience_db/sbiz365_response_blueprints.json", blueprints);
  writeJson("DB_real/experience_db/sbiz365_module_cache.json", moduleCache);
  writeJson("DB_real/experience_db/location_candidate_rankings.json", locationCandidateRankings);
  writeJson("DB_real/experience_db/finance_location_adjustments.json", financeLocationAdjustments);
  writeJson("DB_real/experience_db/sbiz365_raw/simple_module_samples.json", rawSamples);

  await browser.close();

  console.log(JSON.stringify({
    candidates: candidates.length,
    moduleCacheCount: moduleCache.length,
    rankingCount: locationCandidateRankings.length,
    blueprintCount: blueprints.length
  }, null, 2));
}

function buildModuleCacheKey(base, moduleId) {
  return `${base.lat},${base.lng}:${base.radiusMeters}:${base.categoryId}:2026-06-08:${moduleId}`;
}

function buildDirectGisUrl(service, location) {
  const certKey = getCertKey(service.url);
  const directType = service.id === "map" ? "map" : service.route;
  const params = new URLSearchParams({
    certKey,
    type: directType
  });
  if (location?.lat != null) params.set("lat", String(location.lat));
  if (location?.lng != null) params.set("lng", String(location.lng));
  if (location?.dong) params.set("dong", location.dong);
  return `https://bigdata.sbiz.or.kr/gis/openApi/${service.route}?${params.toString()}`;
}

function buildResponseBlueprints(serviceList, rawSamples, generatedAt) {
  const sampleEntries = Object.entries(rawSamples).filter(([key, value]) => key !== "generatedAt" && key !== "candidates" && Array.isArray(value) && value.length > 0);
  const firstSample = sampleEntries[0]?.[1]?.[0] ?? null;
  const moduleHints = {
    simple: {
      discovered_endpoints: [
        "/gis/simpleAnls/getAvgAmtInfo.json",
        "/gis/simpleAnls/getBaeminInfo.json",
        "/gis/simpleAnls/getPopularInfo.json"
      ],
      raw_field_paths: firstSample ? listJsonPaths(firstSample.avgData).slice(0, 80) : [],
      normalized_fields: ["monthlyAverageSalesThousandKrw", "sameCategoryStoreCount", "salesMomentumVsPrevMonth", "salesMomentumVsPrevYear", "analysisPath"],
      simulator_fields: ["monthlyAverageSalesThousandKrw", "sameCategoryStoreCount", "salesMomentumVsPrevMonth"],
      drilldown_fields: ["annualSales", "districtStoreCounts", "topFive"],
      field_mapping: {
        "saleAmt": "monthlyAverageSalesThousandKrw",
        "saleCnt": "sameCategoryStoreCount",
        "saleGuCnt": "districtStoreCount",
        "prevMonRate": "salesMomentumVsPrevMonth",
        "prevYearRate": "salesMomentumVsPrevYear",
        "path": "analysisPath",
        "upjongTypeMap.upjong3nm": "upjongName"
      }
    },
    sales_trend: {
      discovered_endpoints: ["/gis/simpleAnls/getAvgAmtInfo.json"],
      raw_field_paths: firstSample ? listJsonPaths(firstSample.avgData?.annualSales).slice(0, 40) : [],
      normalized_fields: ["annualSales", "trendIndex"],
      simulator_fields: ["annualSales", "trendIndex"],
      drilldown_fields: ["annualSales"],
      field_mapping: {
        "annualSales[].yymm": "annualSales[].yyyymm",
        "annualSales[].saleAmt": "annualSales[].monthly_average_sales_thousand_krw",
        "annualSales[].maxAmt": "annualSales[].top_quartile_sales_thousand_krw",
        "annualSales[].minAmt": "annualSales[].bottom_quartile_sales_thousand_krw"
      }
    },
    store_status: {
      discovered_endpoints: ["/gis/simpleAnls/getAvgAmtInfo.json"],
      raw_field_paths: firstSample ? listJsonPaths({ storeCnt: firstSample.avgData?.storeCnt, storeCntAdmin: firstSample.avgData?.storeCntAdmin }).slice(0, 40) : [],
      normalized_fields: ["sameCategoryStoreCount", "districtStoreCounts", "administrativeStoreCounts"],
      simulator_fields: ["sameCategoryStoreCount"],
      drilldown_fields: ["districtStoreCounts", "administrativeStoreCounts"],
      field_mapping: {
        "saleCnt": "sameCategoryStoreCount",
        "saleGuCnt": "guStoreCount",
        "storeCnt": "districtStoreCounts",
        "storeCntAdmin": "administrativeStoreCounts"
      }
    },
    delivery: {
      discovered_endpoints: ["/gis/simpleAnls/getBaeminInfo.json"],
      raw_field_paths: firstSample ? listJsonPaths(firstSample.baeminData).slice(0, 60) : [],
      normalized_fields: ["averageMonthlyDeliveryCount", "previousMonthAverageDeliveryCount", "previousYearAverageDeliveryCount", "deliveryFitScore"],
      simulator_fields: ["averageMonthlyDeliveryCount", "deliveryFitScore"],
      drilldown_fields: ["deliveryList"],
      field_mapping: {
        "deliveryList[0].avgCnt": "averageMonthlyDeliveryCount",
        "deliveryList[1].avgCnt": "previousMonthAverageDeliveryCount",
        "deliveryList[2].avgCnt": "previousYearAverageDeliveryCount",
        "deliveryList[0].minCnt": "minimumMonthlyDeliveryCount",
        "deliveryList[0].maxCnt": "maximumMonthlyDeliveryCount"
      }
    },
    theme: {
      discovered_endpoints: ["/gis/simpleAnls/getPopularInfo.json"],
      raw_field_paths: firstSample ? listJsonPaths(firstSample.popularData).slice(0, 60) : [],
      normalized_fields: ["dailyFloatingPopulation", "peakWeekday", "peakTimeRange", "themeFitScore"],
      simulator_fields: ["dailyFloatingPopulation", "themeFitScore"],
      drilldown_fields: ["population"],
      field_mapping: {
        "population.dayAvg": "dailyFloatingPopulation",
        "population.mon~sun": "peakWeekday",
        "population.tm00~tm21": "peakTimeRange"
      }
    }
  };

  return serviceList.map((service) => {
    const hint = moduleHints[service.id] ?? {
      discovered_endpoints: [],
      normalized_fields: ["officialIframeUrl", "integrationStatus"],
      simulator_fields: [],
      drilldown_fields: ["officialIframeUrl"]
    };
    return {
      module_id: service.id,
      name: service.name,
      official_route: service.route,
      official_hash_url: service.url,
      iframe_url_template: buildDirectGisUrl(service, { lat: "{lat}", lng: "{lng}", dong: "{dong}" }),
      collection_status: hint.discovered_endpoints.length > 0 ? "actual_endpoint_mapped" : "official_page_linked",
      generatedAt,
      query_params_example: {
        lat: 35.23125,
        lng: 129.08412,
        dong: "부산광역시 금정구 장전2동",
        category_code: "I21201"
      },
      discovered_endpoints: hint.discovered_endpoints,
      raw_field_paths: hint.raw_field_paths ?? [],
      field_mapping: hint.field_mapping ?? {},
      normalized_fields: hint.normalized_fields,
      simulator_fields: hint.simulator_fields,
      drilldown_fields: hint.drilldown_fields
    };
  });
}

function buildDerivedModuleRecords(base, category, avgData, baeminData, popularData, generatedAt, candidate) {
  const popular = normalizePopularData(popularData);
  const delivery = normalizeDeliveryData(baeminData);
  const cautionLevel = Number(avgData.prevMonRate ?? 0) < 0 ? "caution" : "good";
  const keywordSeed = CATEGORY_KEYWORDS[category.category_id] ?? [category.display_name];

  return [
    {
      ...base,
      moduleId: "sns",
      cacheKey: buildModuleCacheKey(base, "sns"),
      collection_status: "derived_from_actual_modules",
      data_origin: "simple/popular/delivery derived",
      sourceTimestamp: generatedAt,
      data: {
        keywords: keywordSeed,
        demandSignal: popular.dailyFloatingPopulation > 40000 ? "high" : "medium",
        note: `${category.display_name} 체험용 수요 키워드`,
        officialIframeUrl: buildDirectGisUrl(SERVICE_BY_ID.sns, {
          lat: candidate.latitude,
          lng: candidate.longitude,
          dong: candidate.full_dong_name
        })
      }
    },
    {
      ...base,
      moduleId: "tour",
      cacheKey: buildModuleCacheKey(base, "tour"),
      collection_status: "derived_from_actual_modules",
      data_origin: "candidate context derived",
      sourceTimestamp: generatedAt,
      data: {
        eventLabel: base.candidateLabel.includes("장전") ? "학기/시험 시즌" : "주말 생활수요",
        eventBonusScore: base.candidateLabel.includes("장전") ? 78 : 58,
        officialIframeUrl: buildDirectGisUrl(SERVICE_BY_ID.tour, {
          lat: candidate.latitude,
          lng: candidate.longitude,
          dong: candidate.full_dong_name
        })
      }
    },
    {
      ...base,
      moduleId: "weather",
      cacheKey: buildModuleCacheKey(base, "weather"),
      collection_status: "derived_from_actual_modules",
      data_origin: "simple trend derived",
      sourceTimestamp: generatedAt,
      data: {
        cautionLevel,
        growthSignal: Number(avgData.prevYearRate ?? 0) >= 0 ? "stable_or_growing" : "shrinking",
        score: cautionLevel === "good" ? 72 : 48,
        officialIframeUrl: buildDirectGisUrl(SERVICE_BY_ID.weather, {
          lat: candidate.latitude,
          lng: candidate.longitude,
          dong: candidate.full_dong_name
        })
      }
    },
    {
      ...base,
      moduleId: "business_age",
      cacheKey: buildModuleCacheKey(base, "business_age"),
      collection_status: "derived_from_actual_modules",
      data_origin: "store count trend derived",
      sourceTimestamp: generatedAt,
      data: {
        stabilityLabel: Number(avgData.prevYearCntRate ?? 0) > -5 ? "검증 수요권" : "신규 진입 변동권",
        trendDelta: Number(avgData.prevYearCntRate ?? 0),
        officialIframeUrl: buildDirectGisUrl(SERVICE_BY_ID.business_age, {
          lat: candidate.latitude,
          lng: candidate.longitude,
          dong: candidate.full_dong_name
        })
      }
    },
    {
      ...base,
      moduleId: "detail",
      cacheKey: buildModuleCacheKey(base, "detail"),
      collection_status: "derived_from_actual_modules",
      data_origin: "simple + delivery + popular summary",
      sourceTimestamp: generatedAt,
      data: {
        summaryScore: scoreSimpleAverage(avgData, baeminData, popularData),
        strongSignals: buildStrongSignals(avgData, delivery, popular, category),
        riskSignals: buildRiskSignals(avgData, delivery),
        officialIframeUrl: buildDirectGisUrl(SERVICE_BY_ID.detail, {
          lat: candidate.latitude,
          lng: candidate.longitude,
          dong: candidate.full_dong_name
        })
      }
    }
  ];
}

function rankCategoryCandidates(rows, radiusRule) {
  if (rows.length === 0) return [];
  const sales = rows.map((row) => Number(row.avgData.saleAmt ?? 0));
  const stores = rows.map((row) => Number(row.avgData.saleCnt ?? 0));
  const deliveries = rows.map((row) => Number(row.baeminData?.deliveryList?.[0]?.avgCnt ?? 0));
  const footfalls = rows.map((row) => Number(row.popularData?.population?.dayAvg ?? 0));
  const momentum = rows.map((row) => Number(row.avgData.prevYearRate ?? 0));

  return rows.map((row) => {
    const salesScore = normalizeScore(Number(row.avgData.saleAmt ?? 0), Math.min(...sales), Math.max(...sales));
    const competitionScore = 100 - normalizeScore(Number(row.avgData.saleCnt ?? 0), Math.min(...stores), Math.max(...stores));
    const deliveryScore = normalizeScore(Number(row.baeminData?.deliveryList?.[0]?.avgCnt ?? 0), Math.min(...deliveries), Math.max(...deliveries));
    const footfallScore = normalizeScore(Number(row.popularData?.population?.dayAvg ?? 0), Math.min(...footfalls), Math.max(...footfalls));
    const momentumScore = normalizeScore(Number(row.avgData.prevYearRate ?? 0), Math.min(...momentum), Math.max(...momentum));
    const headlineScore = Math.round(
      salesScore * 0.34 +
      competitionScore * 0.18 +
      deliveryScore * 0.18 +
      footfallScore * 0.2 +
      momentumScore * 0.1
    );

    return {
      candidate_id: row.candidate.candidate_id,
      region_label: "부산 대학가",
      category_id: row.category_id,
      category_display_name: row.display_name,
      latitude: row.candidate.latitude,
      longitude: row.candidate.longitude,
      radius_meters: radiusRule.recommended_radius_meters,
      headline_score: headlineScore,
      sales_score: salesScore,
      competition_score: competitionScore,
      delivery_score: deliveryScore,
      stability_score: momentumScore,
      event_bonus_score: row.candidate.full_dong_name.includes("장전") ? 78 : 60,
      rent_pressure_score: buildRentPressureScore(headlineScore),
      recommended_operation_type: deliveryScore >= 70 ? "점포+배달 혼합형" : "점포형",
      summary: buildCandidateSummary(row, headlineScore),
      metrics: {
        monthly_average_sales_thousand_krw: Number(row.avgData.saleAmt ?? 0),
        same_category_store_count: Number(row.avgData.saleCnt ?? 0),
        average_monthly_delivery_count: Number(row.baeminData?.deliveryList?.[0]?.avgCnt ?? 0),
        daily_floating_population: Number(row.popularData?.population?.dayAvg ?? 0)
      }
    };
  }).sort((a, b) => b.headline_score - a.headline_score);
}

function buildFinanceLocationAdjustments(categories, rules, radiusRules) {
  const scoreBands = [
    { band: "caution", multiplier: 0.86, ramp: 1.12 },
    { band: "neutral", multiplier: 1.0, ramp: 1.0 },
    { band: "strong", multiplier: 1.16, ramp: 0.92 }
  ];

  return categories.flatMap((category) => {
    const baseRule = rules.find((item) => item.category_id === category.category_id);
    const radiusRule = radiusRules.find((item) => item.category_id === category.category_id);
    const baseDeliveryShift = category.delivery_fit === "high" ? 0.08 : category.delivery_fit === "medium" ? 0.03 : -0.02;

    return scoreBands.map((band) => ({
      category_id: category.category_id,
      display_name: category.display_name,
      location_score_band: band.band,
      daily_order_multiplier: Number(band.multiplier.toFixed(2)),
      delivery_share_adjustment: Number(baseDeliveryShift.toFixed(2)),
      rent_guardrail_ratio: Number(((baseRule?.proper_rent_ratio ?? 0.14) + (band.band === "strong" ? 0.01 : band.band === "caution" ? -0.01 : 0)).toFixed(3)),
      marketing_ramp_adjustment: Number(band.ramp.toFixed(2)),
      recommended_radius_meters: radiusRule?.recommended_radius_meters ?? 500,
      confidence_label: band.band === "strong" ? "launch_ready" : band.band === "neutral" ? "needs_validation" : "high_risk"
    }));
  });
}

function normalizeDeliveryData(baeminData) {
  const deliveryList = toArray(baeminData?.deliveryList);
  const current = deliveryList[0] ?? {};
  const previousMonth = deliveryList[1] ?? {};
  const previousYear = deliveryList[2] ?? {};
  const averageMonthlyDeliveryCount = Number(current.avgCnt ?? 0);
  const deliveryFitScore = averageMonthlyDeliveryCount >= 1400 ? 88 : averageMonthlyDeliveryCount >= 800 ? 72 : averageMonthlyDeliveryCount >= 300 ? 56 : 40;
  return {
    standardMonth: baeminData?.baeminStdYm ?? null,
    averageMonthlyDeliveryCount,
    previousMonthAverageDeliveryCount: Number(previousMonth.avgCnt ?? 0),
    previousYearAverageDeliveryCount: Number(previousYear.avgCnt ?? 0),
    minimumMonthlyDeliveryCount: Number(current.minCnt ?? 0),
    maximumMonthlyDeliveryCount: Number(current.maxCnt ?? 0),
    deliveryFitScore,
    deliveryList
  };
}

function normalizePopularData(popularData) {
  const population = popularData?.population ?? {};
  return {
    standardMonth: population.stdYm ?? null,
    dailyFloatingPopulation: Number(population.dayAvg ?? 0),
    peakWeekday: findPeakKey(population, ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]),
    peakTimeRange: findPeakKey(population, ["tm00", "tm06", "tm11", "tm14", "tm17", "tm21"]),
    population
  };
}

function buildSimpleInsight(avgData, baeminData, popularData, category) {
  const storeCount = Number(avgData.saleCnt ?? 0);
  const deliveryCount = Number(baeminData?.deliveryList?.[0]?.avgCnt ?? 0);
  const floating = Number(popularData?.population?.dayAvg ?? 0);
  if (deliveryCount > 1200) return `${category.display_name} 배달 수요가 강한 편`;
  if (storeCount < 50 && floating > 30000) return `${category.display_name} 직접 경쟁이 낮고 유동인구가 높음`;
  return `${category.display_name} 평균 수준의 생활 상권`;
}

function scoreSimpleAverage(avgData, baeminData, popularData) {
  const sales = Number(avgData.saleAmt ?? 0);
  const stores = Number(avgData.saleCnt ?? 0);
  const deliveryCount = Number(baeminData?.deliveryList?.[0]?.avgCnt ?? 0);
  const floating = Number(popularData?.population?.dayAvg ?? 0);
  const salesScore = Math.min(100, Math.round(sales / 18));
  const competitionScore = Math.max(20, 100 - Math.round(stores * 0.45));
  const deliveryScore = Math.min(100, Math.round(deliveryCount / 15));
  const floatingScore = Math.min(100, Math.round(floating / 700));
  return Math.round(salesScore * 0.35 + competitionScore * 0.2 + deliveryScore * 0.2 + floatingScore * 0.25);
}

function buildStrongSignals(avgData, delivery, popular, category) {
  const items = [];
  if (delivery.deliveryFitScore >= 70) items.push("배달 수요가 강함");
  if (popular.dailyFloatingPopulation >= 30000) items.push("유동인구가 풍부함");
  if (Number(avgData.prevYearRate ?? 0) >= 0) items.push("전년 동월 대비 매출 흐름이 견조함");
  if (items.length === 0) items.push(`${category.display_name} 평균 수준의 생활 수요`);
  return items;
}

function buildRiskSignals(avgData, delivery) {
  const items = [];
  if (Number(avgData.saleCnt ?? 0) >= 120) items.push("동일 업종 점포 수가 많음");
  if (Number(avgData.prevMonRate ?? 0) < 0) items.push("최근 월 매출 흐름이 둔화됨");
  if (delivery.deliveryFitScore < 50) items.push("배달 수요가 높지 않음");
  return items;
}

function buildCandidateSummary(row, headlineScore) {
  const prefix = headlineScore >= 75 ? "우선 검토" : headlineScore >= 60 ? "비교 검토" : "보수 검토";
  return `${prefix}: ${row.candidate.administrative_dong_name} · 월평균 ${Number(row.avgData.saleAmt ?? 0).toLocaleString("ko-KR")}천원 · 동종 ${Number(row.avgData.saleCnt ?? 0).toLocaleString("ko-KR")}개`;
}

function buildRentPressureScore(headlineScore) {
  if (headlineScore >= 80) return 74;
  if (headlineScore >= 65) return 62;
  return 48;
}

function normalizeScore(value, min, max) {
  if (max <= min) return 60;
  return Math.round(((value - min) / (max - min)) * 100);
}

function findPeakKey(source, keys) {
  return keys.reduce(
    (best, key) => Number(source?.[key] ?? 0) > Number(source?.[best] ?? 0) ? key : best,
    keys[0]
  );
}

function splitAdministrativeNames(value) {
  const parts = value.split(" ");
  if (parts.length >= 3) return [parts[0], parts[1], parts[2]];
  if (parts.length === 2) return [parts[0], parts[0], parts[1]];
  return [value, value, value];
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function listJsonPaths(value, prefix = "") {
  if (Array.isArray(value)) {
    if (value.length === 0) return prefix ? [prefix] : [];
    return listJsonPaths(value[0], `${prefix}[]`);
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return prefix ? [prefix] : [];
    return entries.flatMap(([key, nested]) => listJsonPaths(nested, prefix ? `${prefix}.${key}` : key));
  }
  return prefix ? [prefix] : [];
}

async function geocodeAddress(page, address) {
  return page.evaluate(async (targetAddress) => {
    return await new Promise((resolve) => {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(targetAddress, (result, status) => {
        if (status === kakao.maps.services.Status.OK && result?.[0]) {
          resolve({ lat: Number(result[0].y), lng: Number(result[0].x) });
          return;
        }
        resolve(null);
      });
    });
  }, address);
}

async function fetchJsonInPage(page, pathName, params) {
  return page.evaluate(async ({ pathName, params }) => {
    const url = `${pathName}?${new URLSearchParams(params).toString()}`;
    const text = await fetch(url).then((response) => response.text());
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch (error) {
      return { __raw: text, __parseError: String(error) };
    }
  }, { pathName, params });
}

function getCertKey(url) {
  const match = url.match(/certKey=([^&]+)/);
  return match ? match[1] : "";
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function writeJson(relativePath, data) {
  const target = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(data, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
