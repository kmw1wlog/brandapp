"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LocationCandidateRanking } from "@/lib/branch/location-data";

type Props = {
  candidates: LocationCandidateRanking[];
  selectedCandidateId: string | undefined;
  radiusMeters: number;
  onSelectCandidate: (candidateId: string) => void;
};

let kakaoMapLoader: Promise<void> | null = null;

function loadKakaoMapSdk() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.kakao?.maps?.LatLng) return Promise.resolve();
  if (window.kakao?.maps?.load) {
    return new Promise<void>((resolve) => window.kakao.maps.load(resolve));
  }
  if (kakaoMapLoader) return kakaoMapLoader;

  const key = process.env.NEXT_PUBLIC_KAKAO_MAP_JS_KEY;
  if (!key) return Promise.reject(new Error("NEXT_PUBLIC_KAKAO_MAP_JS_KEY is missing"));

  kakaoMapLoader = new Promise((resolve, reject) => {
    const resolveWhenReady = () => {
      if (window.kakao?.maps?.LatLng) resolve();
      else if (window.kakao?.maps?.load) window.kakao.maps.load(resolve);
      else reject(new Error("Kakao map sdk loaded without maps API"));
    };
    const existing = document.querySelector<HTMLScriptElement>("script[data-kakao-map-sdk='true']");
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolveWhenReady();
        return;
      }
      existing.addEventListener("load", resolveWhenReady, { once: true });
      existing.addEventListener("error", () => reject(new Error("Kakao map sdk failed to load")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`;
    script.async = true;
    script.dataset.kakaoMapSdk = "true";
    script.onload = () => {
      script.dataset.loaded = "true";
      resolveWhenReady();
    };
    script.onerror = () => reject(new Error("Kakao map sdk failed to load"));
    document.head.appendChild(script);
  });

  return kakaoMapLoader;
}

export function KakaoLocationMap({ candidates, selectedCandidateId, radiusMeters, onSelectCandidate }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selectedCandidate = useMemo(
    () => candidates.find((item) => item.candidate_id === selectedCandidateId) ?? candidates[0],
    [candidates, selectedCandidateId]
  );

  useEffect(() => {
    let cancelled = false;
    loadKakaoMapSdk()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((sdkError) => {
        if (!cancelled) setError(sdkError instanceof Error ? sdkError.message : "Kakao map sdk failed");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !containerRef.current || candidates.length === 0) return;

    const { kakao } = window;
    const center = new kakao.maps.LatLng(selectedCandidate.latitude, selectedCandidate.longitude);
    const map = new kakao.maps.Map(containerRef.current, {
      center,
      level: 4
    });
    const bounds = new kakao.maps.LatLngBounds();

    candidates.forEach((candidate) => {
      const position = new kakao.maps.LatLng(candidate.latitude, candidate.longitude);
      bounds.extend(position);
      const marker = new kakao.maps.Marker({
        position,
        map
      });
      const infoWindow = new kakao.maps.InfoWindow({
        content: `<div style="padding:8px 10px;font-size:12px;font-weight:700;">${candidate.summary}<br/>점수 ${candidate.headline_score}</div>`
      });
      kakao.maps.event.addListener(marker, "click", () => {
        infoWindow.open(map, marker);
        onSelectCandidate(candidate.candidate_id);
      });
      if (candidate.candidate_id === selectedCandidate.candidate_id) {
        infoWindow.open(map, marker);
      }
    });

    const circle = new kakao.maps.Circle({
      center,
      radius: radiusMeters,
      strokeWeight: 2,
      strokeColor: "#0c5c43",
      strokeOpacity: 0.85,
      strokeStyle: "dashed",
      fillColor: "#0c5c43",
      fillOpacity: 0.12
    });
    circle.setMap(map);
    map.setBounds(bounds);
    map.setCenter(center);
    map.relayout();
  }, [ready, candidates, selectedCandidate, radiusMeters, onSelectCandidate]);

  return (
    <div className="grid gap-3">
      <div className="relative">
        <div
          ref={containerRef}
          className="h-[360px] w-full rounded-[24px] border border-[#ddd2c0] bg-[#f5efe6]"
          data-testid="kakao-location-map"
        />
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-[24px] bg-[#faf6f0]/90 px-6 text-center text-sm font-bold text-[#655d52]">
            Kakao Maps를 불러오지 못했습니다. 앱에서 `OPEN_MAP_AND_LOCAL` 서비스를 켜야 합니다.
          </div>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {candidates.map((candidate) => (
          <button
            key={candidate.candidate_id}
            type="button"
            onClick={() => onSelectCandidate(candidate.candidate_id)}
            className={`rounded-full px-3 py-2 text-xs font-black ${
              candidate.candidate_id === selectedCandidate.candidate_id
                ? "bg-[#164033] text-white"
                : "border border-[#ddd2c0] bg-white text-[#164033]"
            }`}
          >
            {candidate.summary.split("·")[0]?.replace("비교 검토:", "").replace("보수 검토:", "").trim()}
          </button>
        ))}
      </div>
    </div>
  );
}
