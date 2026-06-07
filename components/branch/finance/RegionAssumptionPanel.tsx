import { getMarketServices } from "@/lib/branch/user-input";
import { formatManwon } from "@/lib/branch/finance/finance-format";
import type { RegionProfile } from "@/lib/branch/finance/finance-types";

export function RegionAssumptionPanel({ profile }: { profile: RegionProfile }) {
  const services = getMarketServices().filter((service) => service.useInSimulation).sort((a, b) => a.priority - b.priority);
  return (
    <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-[#164033]">지역 추정값 카드</h3>
          <p className="mt-1 text-sm font-bold text-[#655d52]">{profile.display_name} · {profile.source_status}</p>
        </div>
        <span className="rounded-md bg-[#fff0cf] px-2 py-1 text-xs font-black text-[#805412]">지역 추정값</span>
      </div>
      <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
        <Metric label="월세 범위" value={`${formatManwon(profile.rent_range_monthly[0])}~${formatManwon(profile.rent_range_monthly[1])}`} />
        <Metric label="기준 일 주문" value={`${profile.base_daily_orders}건`} />
        <Metric label="추천 운영" value={profile.recommended_operation_type} />
      </div>
      <div className="mt-5 rounded-lg bg-[#f6f1e8] p-4">
        <h4 className="font-black text-[#164033]">상권 근거 확인</h4>
        <p className="mt-1 text-sm font-bold text-[#655d52]">소상공인365 연동 준비중. 현재는 지역 단위 추정값으로 회계 시뮬레이션을 생성합니다.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {services.slice(0, 7).map((service) => <span key={service.id} className="rounded-md bg-white px-2 py-1 text-xs font-black text-[#574d42]">{service.name}</span>)}
        </div>
        <a href="https://bigdata.sbiz.or.kr" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex rounded-lg bg-[#164033] px-4 py-2 text-sm font-black text-white">소상공인365에서 상권 확인하기</a>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-bold text-[#7a7065]">{label}</p><p className="mt-1 font-black text-[#164033]">{value}</p></div>;
}
