"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  FileText,
  Gift,
  LineChart,
  MapPin,
  Menu,
  MessageSquareText,
  PackageCheck,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBasket,
  Store,
  Truck,
  Utensils
} from "lucide-react";
import { InlineWaitlistCta } from "@/components/branch/InlineWaitlistCta";

const categories = [
  {
    id: "rice_bowl",
    label: "고기덮밥",
    brand: "육반장",
    subtitle: "숯불향 가득한 한 끼, 든든한 고기덮밥",
    concept: "프리미엄 고기덮밥 전문점",
    location: "부산 대학가",
    capital: "5,000만원",
    image: "/branch/image_template/categories/rice_bowl/rice_bowl_01.jpg",
    storefront: "/branch/image_template/categories/rice_bowl/rice_bowl_02.jpg",
    interior: "/branch/image_template/categories/rice_bowl/rice_bowl_03.jpg",
    menu: "/branch/image_template/categories/rice_bowl/rice_bowl_04.jpg",
    tags: ["한식", "덮밥", "1인식당"],
    metrics: ["창업비 4,850만원", "월매출 1,050만원", "순수익률 22%", "회수 18개월"]
  },
  {
    id: "coffee_drink",
    label: "커피·음료",
    brand: "컵스테이션",
    subtitle: "테이크아웃 회전율을 높인 커피 앤 드링크",
    concept: "커피와 음료 테이크아웃 전문점",
    location: "역세권 상권",
    capital: "3,800만원",
    image: "/branch/image_template/categories/coffee_drink/coffee_drink_01.png",
    storefront: "/branch/image_template/categories/coffee_drink/coffee_drink_02.png",
    interior: "/branch/image_template/categories/coffee_drink/coffee_drink_03.png",
    menu: "/branch/image_template/categories/coffee_drink/coffee_drink_04.png",
    tags: ["카페", "음료", "테이크아웃"],
    metrics: ["창업비 3,900만원", "월매출 880만원", "순수익률 19%", "회수 16개월"]
  },
  {
    id: "salad_poke",
    label: "샐러드·포케",
    brand: "그린볼랩",
    subtitle: "건강식 수요를 겨냥한 샐러드 앤 포케",
    concept: "샐러드와 포케 전문점",
    location: "오피스 상권",
    capital: "4,200만원",
    image: "/branch/image_template/categories/salad_poke/salad_poke_01.png",
    storefront: "/branch/image_template/categories/salad_poke/salad_poke_02.png",
    interior: "/branch/image_template/categories/salad_poke/salad_poke_03.png",
    menu: "/branch/image_template/categories/salad_poke/salad_poke_04.png",
    tags: ["샐러드", "포케", "건강식"],
    metrics: ["창업비 4,300만원", "월매출 960만원", "순수익률 21%", "회수 17개월"]
  },
  {
    id: "dessert_bakery",
    label: "디저트",
    brand: "오븐스텝",
    subtitle: "선물 수요와 SNS 공유를 노리는 디저트 브랜드",
    concept: "디저트와 베이커리 전문점",
    location: "주거 밀집 상권",
    capital: "4,600만원",
    image: "/branch/image_template/categories/dessert_bakery/dessert_bakery_01.png",
    storefront: "/branch/image_template/categories/dessert_bakery/dessert_bakery_02.png",
    interior: "/branch/image_template/categories/dessert_bakery/dessert_bakery_03.png",
    menu: "/branch/image_template/categories/dessert_bakery/dessert_bakery_04.png",
    tags: ["디저트", "베이커리", "선물"],
    metrics: ["창업비 4,700만원", "월매출 980만원", "순수익률 20%", "회수 19개월"]
  },
  {
    id: "burger_sandwich",
    label: "버거·샌드위치",
    brand: "그릴패스",
    subtitle: "세트 객단가와 배달 적합도를 함께 잡는 브랜드",
    concept: "버거와 샌드위치 전문점",
    location: "대학가 골목",
    capital: "5,200만원",
    image: "/branch/image_template/categories/burger_sandwich/burger_sandwich_01.png",
    storefront: "/branch/image_template/categories/burger_sandwich/burger_sandwich_02.png",
    interior: "/branch/image_template/categories/burger_sandwich/burger_sandwich_03.png",
    menu: "/branch/image_template/categories/burger_sandwich/burger_sandwich_04.png",
    tags: ["버거", "샌드위치", "배달"],
    metrics: ["창업비 5,100만원", "월매출 1,120만원", "순수익률 20%", "회수 20개월"]
  }
];

const journey = [
  ["01", "업종 선택", "관심 업종과 자본 조건을 입력"],
  ["02", "브랜드 시안", "업종별 가상 브랜드와 이미지 확인"],
  ["03", "입지 분석", "상권, 경쟁, 유동 수요를 점검"],
  ["04", "개점 타임테이블", "개점일까지 할 일을 날짜별로 정리"],
  ["05", "상담 질문지", "시공, 입지, 홍보 질문지를 생성"],
  ["06", "메뉴 개발", "판매가와 원가율을 함께 계산"],
  ["07", "공급망 방어", "싼 공급처와 공동구매 후보 확인"],
  ["08", "회계 시뮬레이터", "1~4개월 매출과 순이익 비교"],
  ["09", "점주 대시보드", "개점 후 운영 도구 3개월 무료"]
];

const timeline = [
  ["D-30", "창업안 확정", "아이템, 상권, 콘셉트 방향을 확정합니다.", "완료"],
  ["D-26", "점포 후보 확인", "상권 분석 및 점포 후보를 선정합니다.", "완료"],
  ["D-22", "시공사 상담", "평면도 기반 상담 및 예상 견적을 받습니다.", "진행 중"],
  ["D-18", "공급처 견적", "주방기기, 집기, 비품 공급처 견적을 비교합니다.", "대기"],
  ["D-15", "영업신고 준비", "영업신고에 필요한 서류와 요건을 준비합니다.", "대기"],
  ["D-9", "간판·메뉴판", "간판 디자인과 메뉴판 제작을 진행합니다.", "대기"],
  ["D-7", "배달앱 등록", "배달의민족, 쿠팡이츠, 네이버 플레이스를 등록합니다.", "대기"],
  ["D-day", "오픈", "점검을 마치고 운영을 시작합니다.", "예정"]
];

const menuCards = [
  { name: "우삼겹 덮밥", price: "9,900원", cost: "29.4%", score: "92점", image: "/branch/image_template/categories/rice_bowl/rice_bowl_01.jpg" },
  { name: "직화 제육 덮밥", price: "9,900원", cost: "29.7%", score: "94점", image: "/branch/image_template/categories/rice_bowl/rice_bowl_02.jpg" },
  { name: "간장목살 덮밥", price: "10,500원", cost: "29.1%", score: "91점", image: "/branch/image_template/categories/rice_bowl/rice_bowl_03.jpg" },
  { name: "반장 세트", price: "12,900원", cost: "28.8%", score: "90점", image: "/branch/image_template/categories/rice_bowl/rice_bowl_04.jpg" }
];

const suppliers = [
  ["식자재왕 도매마트", "우삼겹 3mm", "12,800원", "배송비 포함"],
  ["푸드라인 유통", "우삼겹 3mm", "13,900원", "최소주문 50,000원"],
  ["신세계푸드마켓", "우삼겹 3mm", "14,200원", "냉동 배송"],
  ["오늘식자재", "우삼겹 3mm", "15,100원", "당일 출고"]
];

const groupBuys = [
  ["수입산 우삼겹 공동구매", "58명", "7~12%", "82%"],
  ["덮밥용기 공동구매", "34명", "10~15%", "68%"],
  ["배달봉투 공동구매", "27명", "8~12%", "54%"]
];

const simulationRows = [
  ["1개월차", "1,600", "1,300", "350", "120"],
  ["2개월차", "2,250", "1,950", "650", "280"],
  ["3개월차", "2,800", "2,600", "950", "500"],
  ["4개월차", "3,250", "3,050", "1,250", "720"]
];

export function OnboardingLandingClient() {
  const [selectedId, setSelectedId] = useState(categories[0].id);
  const selected = categories.find((category) => category.id === selectedId) ?? categories[0];

  return (
    <div className="min-h-screen bg-white text-[#121722]">
      <Header />
      <main>
        <Hero selected={selected} selectedId={selectedId} onSelect={setSelectedId} />
        <Journey />
        <BrandShowcase selected={selected} onSelect={setSelectedId} selectedId={selectedId} />
        <TimelineSection />
        <ConsultingSection />
        <MenuSection />
        <SupplySection />
        <SimulatorSection />
        <OwnerDashboardSection />
        <FinalCta />
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e7ebf0] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 lg:px-10">
        <Link href="/onboarding" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0b9b62] text-lg font-black text-white">b</span>
          <span className="text-2xl font-black text-[#101828]">브랜치</span>
        </Link>
        <nav className="hidden items-center gap-10 text-sm font-black text-[#202735] lg:flex">
          <a href="#brand-ideas">브랜드 시안</a>
          <a href="#timeline">개점 타임테이블</a>
          <a href="#consulting">상담 예약</a>
          <a href="#menu">메뉴 개발</a>
          <a href="#simulator">시뮬레이터</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/startup/new" className="hidden rounded-md border border-[#d7dde5] px-5 py-3 text-sm font-black text-[#1f2937] sm:inline-flex">
            로그인
          </Link>
          <Link href="/dashboard/startup/input" className="rounded-md bg-[#0b9b62] px-5 py-3 text-sm font-black text-white shadow-[0_10px_20px_rgba(11,155,98,0.18)]">
            내 조건으로 창업안 보기
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero({
  selected,
  selectedId,
  onSelect
}: {
  selected: (typeof categories)[number];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="relative overflow-hidden bg-[#fffaf3]">
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-[1440px] min-w-0 gap-10 px-6 py-12 lg:grid-cols-[0.82fr_1.18fr] lg:px-10 lg:py-16">
        <div className="flex min-w-0 flex-col justify-center">
          <p className="text-sm font-black text-[#0b9b62]">프랜차이즈 상담 전, 먼저 비교</p>
          <h1 className="mt-8 text-4xl font-black leading-[1.16] text-[#111827] sm:text-6xl">
            프랜차이즈
            <br className="sm:hidden" />
            상담 전에,
            <br />
            내 자본으로
            <br className="sm:hidden" />
            만들 수 있는
            <br />
            <span className="text-[#50624c]">브랜드 창업안</span>을
            <br />
            먼저 비교하세요.
          </h1>
          <p className="mt-8 max-w-xl text-lg font-bold leading-8 text-[#5b6472]">
            지역, 자본, 업종을 선택하면 내 조건에 맞는 자체 브랜드 창업안과 프랜차이즈 창업안을 한눈에 비교할 수 있어요.
          </p>
          <div className="mt-8 flex max-w-full flex-wrap items-center gap-2 rounded-md border border-[#e5ded2] bg-white p-3 text-sm font-black text-[#344054] shadow-sm">
            <InfoPill icon={MapPin} text={selected.location} />
            <InfoPill icon={CircleDollarSign} text={selected.capital} />
            <InfoPill icon={Utensils} text={selected.label} />
          </div>
          <div className="mt-8 grid min-w-0 gap-3 sm:max-w-xl sm:grid-cols-2">
            <Link href="/dashboard/startup/input" className="flex w-full min-w-0 items-center justify-center gap-3 rounded-md bg-[#ef6f2e] px-5 py-5 text-center text-base font-black leading-6 text-white shadow-[0_16px_30px_rgba(239,111,46,0.24)]">
              <span className="sm:hidden">내 브랜드안 먼저 보기</span>
              <span className="hidden sm:inline">프랜차이즈 상담 전, 내 브랜드안 먼저 보기</span>
              <ArrowRight size={20} />
            </Link>
            <Link href="/dashboard/startup/franchise" className="flex w-full min-w-0 items-center justify-center rounded-md border border-[#e2d8ca] bg-white px-5 py-5 text-center text-base font-black leading-6 text-[#202735]">
              프랜차이즈와 비교해보기
            </Link>
          </div>
          <p className="mt-4 text-sm font-black text-[#0b9b62]">이메일 없이 먼저 체험 가능</p>
          <div className="mt-auto hidden grid-cols-3 gap-8 pt-16 text-center lg:grid">
            <HeroStat value="10,000+" label="조건별 창업안 제공" />
            <HeroStat value="3분" label="맞춤 창업안 완성" />
            <HeroStat value="98%" label="사용자 만족도" />
          </div>
        </div>

        <div className="flex min-w-0 items-center">
          <div className="w-full max-w-full min-w-0 rounded-[20px] border border-[#eadfce] bg-white p-5 shadow-[0_24px_70px_rgba(42,34,24,0.12)]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-[#202735]">업종을 선택하세요</h2>
              <Link href="/dashboard/startup/input" className="flex items-center gap-1 text-sm font-black text-[#50624c]">
                전체 보기
                <ChevronRight size={16} />
              </Link>
            </div>
            <div className="mt-5 flex max-w-full gap-3 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onSelect(category.id)}
                  className={`min-w-[112px] rounded-md border px-4 py-4 text-center text-sm font-black ${
                    selectedId === category.id ? "border-[#222b20] bg-[#f6f0e6] text-[#111827] shadow-inner" : "border-[#eadfce] bg-white text-[#4b5563]"
                  }`}
                >
                  <span className="block text-2xl">{category.id === "rice_bowl" ? "🍲" : category.id === "coffee_drink" ? "🥤" : category.id === "salad_poke" ? "🥗" : category.id === "dessert_bakery" ? "🧁" : "🍔"}</span>
                  <span className="mt-2 block">{category.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-5 overflow-hidden rounded-[18px] border border-[#eadfce] bg-[#fbf6ed]">
              <div className="grid gap-0 xl:grid-cols-[0.88fr_1.12fr]">
                <div className="p-7">
                  <span className="rounded-full border border-[#b9decf] bg-[#eefaf5] px-3 py-1 text-xs font-black text-[#0b9b62]">브랜치 추천 브랜드안</span>
                  <h3 className="mt-8 text-5xl font-black text-[#1d221f]">{selected.brand}</h3>
                  <p className="mt-4 text-lg font-bold text-[#4b5563]">{selected.subtitle}</p>
                  <div className="mt-10 grid grid-cols-3 gap-4 text-center text-xs font-bold text-[#667085]">
                    <MiniMetric value="1인 운영" label="효율화" />
                    <MiniMetric value="높은 회전" label="검증된 메뉴" />
                    <MiniMetric value="트렌디" label="핵심 타깃" />
                  </div>
                </div>
                <div className="relative min-h-[360px]">
                  <Image src={selected.image} alt={`${selected.brand} 대표 이미지`} fill className="object-cover" priority />
                </div>
              </div>
              <div className="grid gap-2 border-t border-[#eadfce] bg-white p-3 lg:grid-cols-3">
                <PreviewImage src={selected.storefront} alt={`${selected.brand} 외관`} />
                <PreviewImage src={selected.interior} alt={`${selected.brand} 내부`} />
                <PreviewImage src={selected.menu} alt={`${selected.brand} 메뉴`} />
              </div>
              <div className="grid gap-4 border-t border-[#eadfce] bg-white p-5 sm:grid-cols-4">
                {selected.metrics.map((metric) => (
                  <p key={metric} className="text-sm font-black text-[#1f2937]">{metric}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-[1360px]">
        <div className="text-center">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0f67d8] text-white">
            <Check size={22} />
          </span>
          <h2 className="mt-5 text-3xl font-black text-[#101828]">브랜치에서 확인할 수 있는 창업 비교 여정</h2>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {journey.map(([number, title, body]) => (
            <article key={number} className="text-center">
              <div className="mx-auto flex aspect-[4/2.7] w-full max-w-[220px] items-center justify-center rounded-md border border-[#dce3ec] bg-[#f8fbff]">
                <span className="text-3xl font-black text-[#0f67d8]">{number}</span>
              </div>
              <p className="mt-4 text-sm font-black text-[#0f67d8]">{number}</p>
              <h3 className="mt-1 text-base font-black text-[#101828]">{title}</h3>
              <p className="mt-2 text-sm font-bold leading-6 text-[#667085]">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandShowcase({
  selected,
  selectedId,
  onSelect
}: {
  selected: (typeof categories)[number];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <section id="brand-ideas" className="border-y border-[#e7ebf0] bg-[#fbfcfd] px-6 py-24">
      <div className="mx-auto max-w-[1360px]">
        <p className="text-sm font-black text-[#0b9b62]">02 업종별 브랜드 시안</p>
        <div className="mt-6 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-5xl font-black leading-tight text-[#101828]">
              업종을 바꾸면,
              <br />
              내 업종에 맞는 가상 브랜드 시안이
              <br />
              바로 나옵니다.
            </h2>
            <p className="mt-6 max-w-xl text-lg font-bold leading-8 text-[#667085]">
              다양한 업종의 브랜드 콘셉트와 디자인을 즉시 확인하고 내 아이템에 가장 맞는 방향을 찾습니다.
            </p>
          </div>
          <div className="relative hidden min-h-[240px] lg:block">
            <div className="absolute right-20 top-0 h-56 w-44 rotate-[-8deg] overflow-hidden rounded-md border border-[#d8dde5] bg-white shadow-xl">
              <Image src={selected.storefront} alt="선택 브랜드 외관" fill className="object-cover" />
            </div>
            <div className="absolute right-0 top-16 h-48 w-44 rotate-[12deg] overflow-hidden rounded-md border border-[#d8dde5] bg-white shadow-xl">
              <Image src={selected.menu} alt="선택 브랜드 메뉴" fill className="object-cover" />
            </div>
            <div className="absolute right-32 top-20 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl">
              <RefreshCw className="text-[#0b9b62]" size={34} />
            </div>
          </div>
        </div>
        <div className="mt-12 flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className={`rounded-full border px-5 py-3 text-sm font-black ${
                selectedId === category.id ? "border-[#0b9b62] bg-[#eaf8f1] text-[#04774b]" : "border-[#dce3ec] bg-white text-[#344054]"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        <article className="mt-8 overflow-hidden rounded-lg border-2 border-[#0b9b62] bg-white">
          <div className="grid gap-0 lg:grid-cols-[0.55fr_1fr_1fr_1fr]">
            <div className="p-8">
              <h3 className="text-3xl font-black text-[#101828]">{selected.brand}</h3>
              <p className="mt-2 font-black text-[#0b9b62]">{selected.concept}</p>
              <p className="mt-6 text-base font-bold leading-8 text-[#667085]">{selected.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {selected.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[#eaf8f1] px-3 py-2 text-xs font-black text-[#04774b]">#{tag}</span>
                ))}
              </div>
              <Link href="/dashboard/startup/brand" className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#0b9b62] px-5 py-3 text-sm font-black text-white">
                이 업종으로 둘러보기
                <ArrowRight size={16} />
              </Link>
            </div>
            <ShowcaseImage src={selected.storefront} alt={`${selected.brand} 외관`} />
            <ShowcaseImage src={selected.interior} alt={`${selected.brand} 인테리어`} />
            <ShowcaseImage src={selected.menu} alt={`${selected.brand} 메뉴판`} />
          </div>
        </article>
      </div>
    </section>
  );
}

function TimelineSection() {
  return (
    <section id="timeline" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-[1360px]">
        <p className="inline-flex rounded-md bg-[#e9f7f1] px-3 py-2 text-sm font-black text-[#0b9b62]">04 개점 타임테이블</p>
        <h2 className="mt-8 text-5xl font-black leading-tight text-[#101828]">
          목표 개점일까지,
          <br />
          <span className="text-[#0b9b62]">해야 할 일을 날짜별로</span> 쪼개줍니다.
        </h2>
        <p className="mt-5 text-lg font-bold text-[#667085]">막막한 오픈 준비를 D-30부터 D-day까지 단계별로 안내합니다.</p>
        <div className="mt-12 grid overflow-hidden rounded-lg border border-[#dce3ec] bg-white lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6">
            <div className="grid gap-4">
              {timeline.map(([day, title, body, status]) => (
                <div key={day} className={`grid grid-cols-[88px_1fr_auto] items-center gap-4 rounded-md border p-5 ${status === "진행 중" ? "border-[#0b9b62] bg-[#f5fcf8]" : "border-[#e5eaf0] bg-white"}`}>
                  <p className="text-2xl font-black text-[#0b9b62]">{day}</p>
                  <div>
                    <h3 className="text-lg font-black text-[#101828]">{title}</h3>
                    <p className="mt-1 text-sm font-bold text-[#667085]">{body}</p>
                  </div>
                  <span className={`rounded-md px-3 py-2 text-xs font-black ${status === "진행 중" ? "bg-[#dff4eb] text-[#04774b]" : "bg-[#f2f4f7] text-[#667085]"}`}>{status}</span>
                </div>
              ))}
            </div>
          </div>
          <aside className="border-t border-[#dce3ec] bg-[#fbfcfd] p-8 lg:border-l lg:border-t-0">
            <p className="text-sm font-black text-[#0b9b62]">D-22</p>
            <h3 className="mt-3 text-2xl font-black text-[#101828]">시공사 상담</h3>
            <p className="mt-3 text-sm font-bold leading-6 text-[#667085]">평면도 기반으로 시공사 상담 및 예상 견적을 받습니다.</p>
            <div className="mt-8 rounded-md border border-[#e5eaf0] bg-white p-6">
              <p className="text-sm font-black text-[#667085]">예상 비용</p>
              <p className="mt-3 text-3xl font-black text-[#101828]">2,500 ~ 3,800만원</p>
              <p className="mt-2 text-sm font-bold text-[#98a2b3]">20평 기준, 평당 125~190만원</p>
            </div>
            <Checklist items={["평면도 PDF", "전기 용량 확인서", "상가 임대차계약서", "시공사 비교 견적 2~3곳"]} />
            <Link href="/dashboard/startup/consultation" className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#0b9b62] px-5 py-4 text-sm font-black text-white">
              상담 예약
              <CalendarDays size={18} />
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}

function ConsultingSection() {
  const templates = [
    ["입지·상권 상담 질문지", "입지 분석", MapPin, ["유동인구와 주요 고객층은 어떻게 되나요?", "경쟁 매장은 몇 개나 있나요?", "향후 상권 리스크는 무엇인가요?"]],
    ["시공사 견적 질문지", "시공", ClipboardList, ["공사 범위는 어디까지인가요?", "추가 비용 발생 항목은 무엇인가요?", "A/S 보증 기간은 어떻게 되나요?"]],
    ["공급처 견적 질문지", "자재·물품", PackageCheck, ["최소 주문 수량과 납기 일정은?", "배송비와 설치비가 있나요?", "품질 보증 조건은?"]],
    ["홍보·릴스 발주 질문지", "마케팅", MessageSquareText, ["제작 기간과 시안 제공 횟수는?", "플랫폼별 견적 차이는?", "수정 범위 기준은?"]]
  ] as const;

  return (
    <section id="consulting" className="border-y border-[#e7ebf0] bg-[#f8fbff] px-6 py-24">
      <div className="mx-auto grid max-w-[1360px] gap-10 lg:grid-cols-[1fr_0.72fr]">
        <div>
          <p className="text-sm font-black text-[#0f67d8]">5 / 6 상담 질문지 앤 예약</p>
          <h2 className="mt-8 text-5xl font-black leading-tight text-[#101828]">
            처음 창업하는 사람이
            <br />
            당하지 않도록,
            <br />
            상담 질문지까지 만들어줍니다.
          </h2>
          <p className="mt-6 text-lg font-bold leading-8 text-[#4b5563]">분야별 맞춤 질문지로 전문가와 상담할 때 꼭 물어봐야 할 것을 빠짐없이 준비하세요.</p>
          <div className="mt-10 grid gap-5">
            {templates.map(([title, badge, Icon, questions]) => (
              <article key={title} className="rounded-lg border border-[#dce6f3] bg-white p-6">
                <div className="grid gap-5 sm:grid-cols-[72px_1fr_auto]">
                  <span className="flex h-16 w-16 items-center justify-center rounded-md bg-[#eaf2ff] text-[#0f67d8]">
                    <Icon size={30} />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-black text-[#101828]">{title}</h3>
                      <span className="rounded-md bg-[#eef8f3] px-2 py-1 text-xs font-black text-[#0b9b62]">{badge}</span>
                    </div>
                    <ol className="mt-4 grid gap-2 text-sm font-bold text-[#4b5563]">
                      {questions.map((question, index) => (
                        <li key={question}>{index + 1}. {question}</li>
                      ))}
                    </ol>
                  </div>
                  <button type="button" className="h-12 rounded-md bg-[#e8f1ff] px-4 text-sm font-black text-[#0f67d8]">원클릭 생성</button>
                </div>
              </article>
            ))}
          </div>
        </div>
        <aside className="rounded-lg border border-[#dce6f3] bg-white p-8 shadow-[0_20px_50px_rgba(15,103,216,0.08)]">
          <h3 className="text-2xl font-black text-[#0f67d8]">1분 만에 상담 질문지 생성</h3>
          <Field label="어떤 전문가와 상담하시나요?" value="입지·상권 전문가" />
          <Field label="상담 목적을 알려주세요" value="카페 창업을 위한 입지 검토를 하고 싶어요. 주거지 근처 소형 상가를 보고 있습니다." large />
          <Field label="추가 요청사항" value="배달 수요, 주차 가능 여부도 포함해주세요." large />
          <button type="button" className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[#0f67d8] px-5 py-4 text-base font-black text-white">
            질문지 생성
            <ArrowRight size={18} />
          </button>
          <div className="mt-8 rounded-lg border border-[#dce6f3] p-5">
            <p className="font-black text-[#101828]">전문가 상담 예약</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map((time) => (
                <button key={time} type="button" className={`rounded-md border px-3 py-3 text-sm font-black ${time === "14:00" ? "border-[#0f67d8] bg-[#0f67d8] text-white" : "border-[#dce6f3] text-[#344054]"}`}>{time}</button>
              ))}
            </div>
          </div>
          <Link href="/dashboard/startup/consultation" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#0f67d8] px-5 py-4 text-base font-black text-white">
            예약 요청 보내기
            <CalendarDays size={18} />
          </Link>
        </aside>
      </div>
    </section>
  );
}

function MenuSection() {
  return (
    <section id="menu" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-[1360px]">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1fr]">
          <div>
            <p className="text-sm font-black text-[#0b9b62]">06 / 07</p>
            <h2 className="mt-8 text-5xl font-black leading-tight text-[#101828]">
              메뉴 개발도 <span className="text-[#0b9b62]">AI</span>가
              <br />
              먼저 시뮬레이션합니다.
            </h2>
            <p className="mt-6 text-lg font-bold leading-8 text-[#667085]">음식점 운영 데이터를 기반으로 메뉴 후보를 생성하고, 원가·판매가·배달 적합도까지 예측합니다.</p>
          </div>
          <div className="rounded-lg border border-[#dce3ec] bg-white p-6 shadow-[0_20px_50px_rgba(16,24,40,0.06)]">
            <div className="flex items-center justify-between">
              <p className="font-black text-[#101828]">AI 메뉴 시뮬레이션</p>
              <span className="rounded-full bg-[#eaf8f1] px-3 py-1 text-xs font-black text-[#0b9b62]">시뮬레이션 완료</span>
            </div>
            <div className="mt-6 h-32 rounded-md bg-[#f8fbff] p-5">
              <div className="h-2 w-3/4 rounded-full bg-[#d8e5f5]" />
              <div className="mt-4 h-2 w-2/3 rounded-full bg-[#d8e5f5]" />
              <div className="mt-8 h-2 w-full rounded-full bg-[#0b9b62]" />
            </div>
          </div>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {menuCards.map((menu) => (
            <article key={menu.name} className="overflow-hidden rounded-lg border border-[#dce3ec] bg-white">
              <div className="relative aspect-[16/7]">
                <Image src={menu.image} alt={menu.name} fill className="object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-[#101828]">{menu.name}</h3>
                    <p className="mt-2 text-sm font-bold text-[#667085]">예상 TOP 메뉴 후보</p>
                  </div>
                  <p className="text-2xl font-black text-[#101828]">{menu.price}</p>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 rounded-md border border-[#e5eaf0] p-4">
                  <MetricLite label="목표 원가율" value={menu.cost} />
                  <MetricLite label="배달 적합도" value={menu.score} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SupplySection() {
  return (
    <section className="border-y border-[#e7ebf0] bg-[#fbfcfd] px-6 py-24">
      <div className="mx-auto max-w-[1360px]">
        <p className="inline-flex rounded-full bg-[#e9f7f1] px-4 py-2 text-sm font-black text-[#0b9b62]">7 / 8 공급처·공동구매·원가방어</p>
        <h2 className="mt-8 text-center text-5xl font-black leading-tight text-[#101828]">
          메뉴에 들어가는 식재료까지 분해해,
          <br />
          더 싸게 살 수 있는 공급처와 공동구매 후보를 모읍니다.
        </h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr_0.9fr]">
          <article className="rounded-lg border border-[#dce3ec] bg-white p-6">
            <h3 className="text-2xl font-black text-[#101828]">1. 메뉴 원재료 분해</h3>
            <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-md">
              <Image src="/branch/image_template/categories/rice_bowl/rice_bowl_01.jpg" alt="우삼겹 덮밥" fill className="object-cover" />
            </div>
            <div className="mt-5 grid gap-3 text-sm font-bold text-[#344054]">
              {["우삼겹 120g", "쌀 200g", "대파 15g", "양파 30g", "덮밥용기 1개", "배달봉투 1개"].map((item) => <p key={item} className="flex justify-between border-b border-[#edf1f5] pb-2">{item}</p>)}
            </div>
            <div className="mt-6 rounded-md bg-[#eef8f3] p-5">
              <p className="text-sm font-black text-[#667085]">1인분 원가 합계</p>
              <p className="mt-2 text-3xl font-black text-[#0b9b62]">2,925원</p>
            </div>
          </article>
          <article className="rounded-lg border border-[#dce3ec] bg-white p-6">
            <h3 className="text-2xl font-black text-[#101828]">2. 더 싸게 살 수 있는 공급처</h3>
            <div className="mt-6 grid gap-4">
              {suppliers.map(([name, item, price, note]) => (
                <div key={name} className="rounded-md border border-[#dce3ec] p-5">
                  <p className="font-black text-[#101828]">{name}</p>
                  <p className="mt-2 text-sm font-bold text-[#667085]">{item}</p>
                  <div className="mt-4 flex items-end justify-between">
                    <p className="text-2xl font-black text-[#0b9b62]">{price}</p>
                    <span className="rounded-md border border-[#b9decf] px-3 py-2 text-xs font-black text-[#04774b]">바로가기</span>
                  </div>
                  <p className="mt-3 text-xs font-bold text-[#98a2b3]">{note}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="rounded-lg border border-[#dce3ec] bg-white p-6">
            <h3 className="text-2xl font-black text-[#101828]">3. 공동구매 후보</h3>
            <div className="mt-6 grid gap-4">
              {groupBuys.map(([name, people, discount, progress]) => (
                <div key={name} className="rounded-md border border-[#dce3ec] p-5">
                  <p className="font-black text-[#101828]">{name}</p>
                  <dl className="mt-4 grid gap-2 text-sm font-bold text-[#4b5563]">
                    <div className="flex justify-between"><dt>현재 관심자</dt><dd>{people}</dd></div>
                    <div className="flex justify-between"><dt>예상 할인율</dt><dd>{discount}</dd></div>
                  </dl>
                  <div className="mt-5 h-3 rounded-full bg-[#dce3ec]">
                    <div className="h-3 rounded-full bg-[#0b9b62]" style={{ width: progress }} />
                  </div>
                  <p className="mt-2 text-right text-sm font-black text-[#0b9b62]">{progress}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function SimulatorSection() {
  return (
    <section id="simulator" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-[1360px]">
        <p className="text-sm font-black text-[#0b9b62]">시뮬레이터</p>
        <h2 className="mt-8 text-5xl font-black leading-tight text-[#101828]">
          내 자본, 입지, 업종 기준으로
          <br />
          개점 후 1~4개월을 시뮬레이션합니다.
        </h2>
        <div className="mt-10 rounded-lg border border-[#dce3ec] bg-white p-6">
          <div className="grid gap-6 md:grid-cols-5">
            <SummaryIcon icon={CircleDollarSign} label="자본" value="5,000만원" />
            <SummaryIcon icon={MapPin} label="입지" value="부산 대학가" />
            <SummaryIcon icon={Utensils} label="업종" value="고기덮밥" />
            <SummaryIcon icon={Store} label="운영형태" value="점포+배달형" />
            <SummaryIcon icon={LineChart} label="목표 월매출" value="3,000만원" />
          </div>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <ChartPanel title="월 매출 추이" rows={simulationRows.map(([month, own, franchise]) => [month, own, franchise])} />
          <ChartPanel title="월 점주 수익 추이" rows={simulationRows.map(([month, , , ownProfit, franchiseProfit]) => [month, ownProfit, franchiseProfit])} />
        </div>
        <div className="mt-8 rounded-lg border border-[#f0d9bd] bg-[#fff8ef] p-6">
          <p className="text-xl font-black text-[#101828]">자가 브랜드가 항상 유리한 것은 아닙니다.</p>
          <p className="mt-2 text-sm font-bold text-[#667085]">업종과 점주의 경험에 따라 프랜차이즈가 더 나을 수 있습니다. 브랜치는 데이터 기준으로 창업 선택지를 비교합니다.</p>
        </div>
      </div>
    </section>
  );
}

function OwnerDashboardSection() {
  const tiles = [
    ["이번 달 매출", "23,450,000원", "-8.3%"],
    ["이번 달 순이익", "4,560,000원", "+12.5%"],
    ["이번 달 원가율", "31.8%", "-1.2%"],
    ["이번 달 구매액", "7,460,000원", "-6.7%"]
  ];
  const tools = [
    ["싼 공급처 찾기", "최근 평균 절감률 7.3%", ShoppingBasket],
    ["원가 변동 대비 AI", "위험 식재료 3개", ShieldCheck],
    ["공동구매 후보", "진행 중 후보 5건", Truck],
    ["메뉴별 원가율", "떡볶이 68.7%", BarChart3],
    ["월 매출 기록", "23,450,000원", LineChart],
    ["점주 의견 남기기", "운영 피드백 접수", MessageSquareText]
  ] as const;

  return (
    <section className="border-y border-[#e7ebf0] bg-[#f8fbff] px-6 py-24">
      <div className="mx-auto max-w-[1360px] text-center">
        <span className="rounded-full bg-[#0b9b62] px-4 py-2 text-sm font-black text-white">혜택 09</span>
        <h2 className="mt-8 text-5xl font-black leading-tight text-[#101828]">
          브랜치로 개점한 점주는
          <br />
          운영 대시보드를 <span className="text-[#0b9b62]">3개월 무료</span>로 사용합니다.
        </h2>
        <p className="mt-5 text-lg font-bold text-[#667085]">매출·원가·구매·홍보까지 한눈에. 데이터로 더 똑똑하게 가게를 운영하세요.</p>
      </div>
      <div className="mx-auto mt-12 max-w-[1360px] overflow-hidden rounded-lg border border-[#dce3ec] bg-white shadow-[0_24px_70px_rgba(16,24,40,0.1)]">
        <div className="grid lg:grid-cols-[260px_1fr]">
          <aside className="border-b border-[#dce3ec] bg-[#fbfcfd] p-6 lg:border-b-0 lg:border-r">
            <p className="text-sm font-black text-[#101828]">브랜치 샘플점</p>
            <p className="mt-1 text-xs font-bold text-[#667085]">가칭점</p>
            <nav className="mt-8 grid gap-2 text-sm font-black text-[#344054]">
              {["대시보드", "싼 공급처 찾기", "원가 변동 대비 AI", "공동구매 후보", "메뉴별 원가율", "월 매출 기록"].map((item, index) => (
                <span key={item} className={`rounded-md px-3 py-3 ${index === 0 ? "bg-[#e9f7f1] text-[#0b9b62]" : ""}`}>{item}</span>
              ))}
            </nav>
          </aside>
          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-4">
              {tiles.map(([label, value, change]) => (
                <div key={label} className="rounded-lg border border-[#dce3ec] p-5 text-left">
                  <p className="text-sm font-black text-[#667085]">{label}</p>
                  <p className="mt-4 text-2xl font-black text-[#101828]">{value}</p>
                  <p className="mt-2 text-sm font-black text-[#0b9b62]">{change}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {tools.map(([title, body, Icon]) => (
                <article key={title} className="rounded-lg border border-[#dce3ec] p-5 text-left">
                  <Icon className="text-[#0b9b62]" size={26} />
                  <h3 className="mt-4 text-lg font-black text-[#101828]">{title}</h3>
                  <p className="mt-2 text-sm font-bold text-[#667085]">{body}</p>
                  <button type="button" className="mt-6 w-full rounded-md border border-[#0b9b62] px-4 py-3 text-sm font-black text-[#04774b]">확인하기</button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <footer className="bg-[#061729] px-6 py-20 text-white">
      <div className="mx-auto max-w-[1360px] text-center">
        <p className="text-5xl font-black leading-tight">
          똑똑한 창업의 시작,
          <br />
          브랜치에서 <span className="text-[#69a7ff]">비교하고 확신</span>을 가지세요.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <DarkBenefit icon={CalendarDays} title="시간과 비용 절약" body="여러 곳 상담 없이 한 번에 비교" />
          <DarkBenefit icon={BarChart3} title="데이터 기반 의사결정" body="객관적인 수치로 확실하게" />
          <DarkBenefit icon={ShieldCheck} title="실패 확률 최소화" body="검증된 정보로 안전하게 시작" />
        </div>
        <div className="mx-auto mt-10 max-w-4xl text-left">
          <InlineWaitlistCta
            title="사전오픈 혜택을 먼저 받아보세요"
            description="체험 리포트 저장, 상담 오픈 알림, 점주 대시보드 3개월 무료 안내 중 가장 필요한 혜택을 먼저 보내드립니다."
            purpose="landing_waitlist"
            submitLabel="사전오픈 혜택 받기"
            benefits={["내 창업안 저장 기능 우선 안내", "상담 오픈 시 우선 연락", "대시보드 3개월 무료 알림"]}
            defaultBenefit="내 창업안 저장 기능 우선 안내"
            theme="dark"
            compact
            testId="landing-waitlist"
          />
        </div>
        <Link href="/dashboard/startup/input" className="mt-12 inline-flex items-center gap-3 rounded-md bg-[#0f67d8] px-8 py-5 text-lg font-black text-white">
          내 브랜드 만들고 창업 준비하기
          <ArrowRight size={22} />
        </Link>
        <div className="mt-16 border-t border-white/10 pt-8 text-sm font-bold text-white/60">© 2026 Branch. 창업 비교와 실행 준비를 위한 체험 데모.</div>
      </div>
    </footer>
  );
}

function InfoPill({ icon: Icon, text }: { icon: typeof MapPin; text: string }) {
  return (
    <span className="flex items-center gap-2 px-3">
      <Icon size={17} className="text-[#50624c]" />
      {text}
    </span>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-black text-[#1f2937]">{value}</p>
      <p className="mt-2 text-sm font-bold text-[#667085]">{label}</p>
    </div>
  );
}

function MiniMetric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-black text-[#1f2937]">{value}</p>
      <p className="mt-1">{label}</p>
    </div>
  );
}

function PreviewImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[4/2.8] overflow-hidden rounded-md">
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}

function ShowcaseImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative min-h-[320px] border-l border-[#e5eaf0]">
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <div className="mt-8">
      <p className="font-black text-[#101828]">필요 서류 / 준비물</p>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <p key={item} className="flex items-center gap-2 text-sm font-bold text-[#4b5563]">
            <Check size={16} className="text-[#0b9b62]" />
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value, large = false }: { label: string; value: string; large?: boolean }) {
  return (
    <label className="mt-6 block">
      <span className="text-sm font-black text-[#344054]">{label}</span>
      <span className={`mt-2 block rounded-md border border-[#dce6f3] bg-[#fbfcff] p-4 text-sm font-bold leading-6 text-[#667085] ${large ? "min-h-[112px]" : ""}`}>{value}</span>
    </label>
  );
}

function MetricLite({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-bold text-[#667085]">{label}</p>
      <p className="mt-2 text-xl font-black text-[#101828]">{value}</p>
    </div>
  );
}

function SummaryIcon({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 border-[#e5eaf0] md:border-r md:last:border-r-0">
      <Icon size={38} className="text-[#0b9b62]" />
      <div>
        <p className="text-sm font-bold text-[#667085]">{label}</p>
        <p className="mt-1 text-xl font-black text-[#101828]">{value}</p>
      </div>
    </div>
  );
}

function ChartPanel({ title, rows }: { title: string; rows: string[][] }) {
  const maxValue = Math.max(...rows.flatMap(([, own, franchise]) => [Number(own.replace(/,/g, "")), Number(franchise.replace(/,/g, ""))]));

  return (
    <article className="rounded-lg border border-[#dce3ec] bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-[#101828]">{title}</h3>
        <div className="flex gap-4 text-sm font-black">
          <span className="text-[#0b9b62]">자가 브랜드</span>
          <span className="text-[#0f67d8]">프랜차이즈</span>
        </div>
      </div>
      <div className="mt-8 grid gap-5">
        {rows.map(([month, own, franchise]) => (
          <div key={month} className="grid grid-cols-[72px_1fr] items-center gap-4">
            <p className="text-sm font-black text-[#667085]">{month}</p>
            <div className="grid gap-2">
              <ChartBar value={own} maxValue={maxValue} className="bg-[#0b9b62]" />
              <ChartBar value={franchise} maxValue={maxValue} className="bg-[#0f67d8]" />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function ChartBar({ value, maxValue, className }: { value: string; maxValue: number; className: string }) {
  const numeric = Number(value.replace(/,/g, ""));
  const width = `${Math.max(12, (numeric / maxValue) * 100)}%`;

  return (
    <div className="flex items-center gap-3">
      <div className="h-3 flex-1 rounded-full bg-[#edf1f5]">
        <div className={`h-3 rounded-full ${className}`} style={{ width }} />
      </div>
      <p className="w-16 text-right text-sm font-black text-[#101828]">{value}</p>
    </div>
  );
}

function DarkBenefit({ icon: Icon, title, body }: { icon: typeof CalendarDays; title: string; body: string }) {
  return (
    <div className="flex items-center justify-center gap-5 text-left">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#69a7ff]/60 text-[#69a7ff]">
        <Icon size={30} />
      </span>
      <div>
        <p className="font-black">{title}</p>
        <p className="mt-1 text-sm font-bold text-white/60">{body}</p>
      </div>
    </div>
  );
}
