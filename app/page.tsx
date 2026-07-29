"use client";

import { useEffect, useRef, useState } from "react";

type Tab = "plogging" | "records" | "map" | "rewards";
type Mode = "solo" | "group";
type RankMetric = "distance" | "time";
type ActivityRecord = {
  id: number;
  distance: number;
  elapsedSeconds: number;
  steps: number;
  createdAt: string;
};
type PurchaseRecord = {
  id: number;
  name: string;
  price: number;
  purchasedAt: string;
};
type ProfileData = {
  nickname: string;
  phone: string;
  email: string;
  region: string;
};
type GpsStatus = "idle" | "connecting" | "active" | "denied" | "unavailable";
type GroupData = {
  id: number;
  name: string;
  place: string;
  time: string;
  max: number;
  count: number;
  joined: boolean;
  owned: boolean;
};

const navItems: { id: Tab; icon: string; label: string }[] = [
  { id: "plogging", icon: "⌁", label: "플로깅" },
  { id: "records", icon: "↗", label: "기록" },
  { id: "map", icon: "⌖", label: "쓰레기통" },
  { id: "rewards", icon: "◆", label: "리워드" },
];

const soloRank = [
  { rank: 1, name: "바다지킴이", distance: "84.6 km", time: "12시간 48분", avatar: "민", color: "#fd8d68" },
  { rank: 2, name: "푸른파도", distance: "76.2 km", time: "11시간 32분", avatar: "윤", color: "#6e9df5" },
  { rank: 3, name: "조개소년", distance: "68.9 km", time: "10시간 15분", avatar: "준", color: "#f1bd55" },
];

const groupRank = [
  { rank: 1, name: "해운대 어벤져스", distance: "326.8 km", time: "48시간 20분", avatar: "해", color: "#fd8d68" },
  { rank: 2, name: "파도 타는 사람들", distance: "289.2 km", time: "43시간 10분", avatar: "파", color: "#6e9df5" },
  { rank: 3, name: "블루 클린업", distance: "244.5 km", time: "39시간 42분", avatar: "블", color: "#69bf91" },
];

const initialGroups: GroupData[] = [
  { id: 1, name: "광안리 아침 바로깅", place: "광안리 만남의 광장", time: "7월 30일 오전 8:00", max: 10, count: 7, joined: false, owned: false },
  { id: 2, name: "해운대 노을 러너스", place: "해운대 중앙광장", time: "7월 30일 오후 6:30", max: 12, count: 9, joined: false, owned: false },
  { id: 3, name: "송정 주말 클린런", place: "송정해수욕장 입구", time: "8월 1일 오전 9:00", max: 15, count: 11, joined: false, owned: false },
  { id: 4, name: "동백섬 한 바퀴", place: "동백섬 관광안내소", time: "8월 2일 오후 5:00", max: 8, count: 5, joined: false, owned: false },
];

const communityRoutes = [
  { id: 1, title: "동백섬 바다 한 바퀴", area: "해운대 · 동백섬", distance: "3.2km", time: "48분", bins: 3, author: "민지", avatar: "민", likes: 248, tone: "mint", mapUrl: "https://www.openstreetmap.org/export/embed.html?bbox=129.142%2C35.151%2C129.159%2C35.162&layer=mapnik&marker=35.1568%2C129.1522" },
  { id: 2, title: "광안대교 노을 코스", area: "수영구 · 광안리", distance: "4.6km", time: "1시간 5분", bins: 4, author: "부산러너", avatar: "부", likes: 193, tone: "coral", mapUrl: "https://www.openstreetmap.org/export/embed.html?bbox=129.105%2C35.148%2C129.126%2C35.162&layer=mapnik&marker=35.1532%2C129.1186" },
  { id: 3, title: "송정 파도 따라 걷기", area: "해운대 · 송정", distance: "5.1km", time: "1시간 12분", bins: 5, author: "파도맘", avatar: "파", likes: 156, tone: "blue", mapUrl: "https://www.openstreetmap.org/export/embed.html?bbox=129.191%2C35.171%2C129.211%2C35.184&layer=mapnik&marker=35.1787%2C129.1998" },
  { id: 4, title: "이기대 해안 산책길", area: "남구 · 이기대", distance: "6.8km", time: "1시간 38분", bins: 3, author: "초록발걸음", avatar: "초", likes: 132, tone: "sand", mapUrl: "https://www.openstreetmap.org/export/embed.html?bbox=129.115%2C35.117%2C129.135%2C35.135&layer=mapnik&marker=35.1268%2C129.1237" },
];

function calculateGpsDistance(
  previous: { latitude: number; longitude: number },
  current: { latitude: number; longitude: number },
) {
  const earthRadiusKm = 6371;
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  const latitudeDelta = toRadians(current.latitude - previous.latitude);
  const longitudeDelta = toRadians(current.longitude - previous.longitude);
  const previousLatitude = toRadians(previous.latitude);
  const currentLatitude = toRadians(current.latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(previousLatitude) * Math.cos(currentLatitude) * Math.sin(longitudeDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function Header({ points, onAccount }: { points: number; onAccount: () => void }) {
  return (
    <header className="topbar">
      <div className="brand"><span>바로깅</span></div>
      <button className="point-pill" aria-label="내 포인트">
        {points.toLocaleString()} P
      </button>
      <button className="account-button" onClick={onAccount}>프로필</button>
    </header>
  );
}

function PloggingScreen({ onStart, attendanceCount }: { onStart: (mode: Mode) => void; attendanceCount: number }) {
  return (
    <main className="screen plogging-screen">
      <section className="welcome">
        <p className="eyebrow">오늘도 바다를 가볍게</p>
        <h1>어떻게 주울까요?</h1>
        <p>플로깅 거리 1km마다 10포인트가 쌓여요.</p>
      </section>

      <section className="mode-stack">
        <button className="mode-card solo" onClick={() => onStart("solo")}>
          <span className="mode-number">01</span>
          <span className="mode-copy">
            <strong>혼자 플로깅</strong>
            <small>내 속도로 가볍게 시작하기</small>
          </span>
          <span className="mode-arrow">→</span>
          <span className="solo-figure" aria-hidden="true">●<i></i></span>
        </button>

        <button className="mode-card group" onClick={() => onStart("group")}>
          <span className="mode-number">02</span>
          <span className="mode-copy">
            <strong>함께 플로깅</strong>
            <small>그룹을 만들고 기록을 모아요</small>
          </span>
          <span className="mode-arrow">→</span>
          <span className="group-figures" aria-hidden="true">● ● ●</span>
        </button>
      </section>

      <section className="streak-card">
        <div>
          <span className="streak-icon">♨</span>
          <div><strong>{attendanceCount}일 연속 플로깅 중!</strong><small>이번 달 {attendanceCount}일 참여했어요</small></div>
        </div>
        <div className="week-row">
          {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </section>

      <section className="mini-tip">
        <span>오늘의 파도 팁</span>
        <p>해가 낮은 오후 5시, 동백섬 산책로가 걷기 좋아요.</p>
      </section>
    </main>
  );
}

function RecordsScreen({ nickname, activityRecords }: { nickname: string; activityRecords: ActivityRecord[] }) {
  const [ranking, setRanking] = useState<Mode>("group");
  const [metric, setMetric] = useState<RankMetric>("distance");
  const [routes, setRoutes] = useState(communityRoutes);
  const [courseOpen, setCourseOpen] = useState(false);
  const [detailRoute, setDetailRoute] = useState<(typeof communityRoutes)[number] | null>(null);
  const ranks = ranking === "group" ? groupRank : soloRank;
  const addedDistance = activityRecords.reduce((sum, record) => sum + record.distance, 0);
  const addedSeconds = activityRecords.reduce((sum, record) => sum + record.elapsedSeconds, 0);
  const addedSteps = activityRecords.reduce((sum, record) => sum + record.steps, 0);
  const totalSeconds = 8 * 3600 + 42 * 60 + addedSeconds;
  const totalTime = `${String(Math.floor(totalSeconds / 3600)).padStart(2, "0")}:${String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0")}`;
  return (
    <main className="screen">
      <section className="page-title">
        <p className="eyebrow">우리의 작은 움직임</p>
        <h1>활동 기록</h1>
      </section>

      <div className="stat-grid">
        <div><span>이번 달</span><strong>{(28.4 + addedDistance).toFixed(2)} <small>km</small></strong><em>↑ 12%</em></div>
        <div><span>누적 시간</span><strong>{totalTime}</strong><small>시간 : 분</small></div>
        <div><span>걸음 수</span><strong>{(42680 + addedSteps).toLocaleString()}</strong><small>걸음</small></div>
      </div>

      {activityRecords.length > 0 && (
        <section className="latest-session-card">
          <span>방금 저장된 기록</span>
          <strong>{activityRecords[0].distance.toFixed(2)}km · {Math.floor(activityRecords[0].elapsedSeconds / 60)}분 {activityRecords[0].elapsedSeconds % 60}초</strong>
          <small>{activityRecords[0].steps.toLocaleString()}걸음 · {activityRecords[0].createdAt}</small>
        </section>
      )}

      <section className="section-block">
        <div className="section-head">
          <h2>플로깅 랭킹</h2>
          <div className="segmented">
            <button className={ranking === "group" ? "active" : ""} onClick={() => setRanking("group")}>그룹</button>
            <button className={ranking === "solo" ? "active" : ""} onClick={() => setRanking("solo")}>개인</button>
          </div>
        </div>
        <div className="metric-toggle">
          <button className={metric === "distance" ? "active" : ""} onClick={() => setMetric("distance")}>누적 거리</button>
          <button className={metric === "time" ? "active" : ""} onClick={() => setMetric("time")}>누적 시간</button>
        </div>
        <div className="rank-list">
          {ranks.map((item) => (
            <div className="rank-item" key={item.rank}>
              <b>{item.rank}</b>
              <span className="rank-avatar" style={{ background: item.color }}>{item.avatar}</span>
              <div><strong>{item.name}</strong><small>{item.rank === 1 ? "이번 달 최고 기록" : "꾸준히 달리는 중"}</small></div>
              <em>{metric === "distance" ? item.distance : item.time}</em>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block route-section">
        <div className="section-head"><h2>부산 사용자 추천 코스</h2><button className="text-button course-upload-button" onClick={() => setCourseOpen(true)}>+ 코스 등록</button></div>
        <p className="route-subtitle">부산에서 바로깅 중인 사람들이 직접 공유했어요.</p>
        <div className="route-feed">
          {routes.map((route, index) => (
            <article className="community-route" key={route.id}>
              <div className={`route-map ${route.tone}`}>
                <iframe title={`${route.title} 지도`} src={route.mapUrl} loading="lazy" tabIndex={-1}></iframe>
                <small className="mini-map-label">{route.area.split(" · ")[1]} · 실제 지도</small>
                {index === 0 && <b>인기</b>}
              </div>
              <div className="route-info">
                <div className="route-author"><span>{route.avatar}</span><strong>{route.author}</strong><small>{route.area}</small></div>
                <h3>{route.title}</h3>
                <p>{route.distance} · 약 {route.time} · 수거함 {route.bins}개</p>
                <div className="route-actions">
                  <span>♡ {route.likes}</span>
                  <button onClick={() => setDetailRoute(route)}>자세히</button>
                  <button onClick={() => alert(`${route.title} 코스 링크를 복사했어요!`)}>공유 ↗</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      {courseOpen && (
        <CourseUploadModal
          onClose={() => setCourseOpen(false)}
          onCreate={(route) => {
            setRoutes((current) => [{ ...route, id: Date.now(), author: nickname, avatar: nickname.slice(0, 1), likes: 0, tone: "mint", mapUrl: "https://www.openstreetmap.org/export/embed.html?bbox=129.02%2C35.07%2C129.18%2C35.22&layer=mapnik&marker=35.1379%2C129.0751" }, ...current]);
            setCourseOpen(false);
          }}
        />
      )}
      {detailRoute && <CourseDetailModal route={detailRoute} onClose={() => setDetailRoute(null)} />}
    </main>
  );
}

function MapScreen({ onCamera }: { onCamera: () => void }) {
  const [selected, setSelected] = useState(1);
  const [query, setQuery] = useState("");
  const bins = [
    { id: 1, name: "해운대 중앙광장", distance: "120m", fill: "32%", status: "여유", area: "해운대해수욕장", mapUrl: "https://www.openstreetmap.org/export/embed.html?bbox=129.151%2C35.154%2C129.169%2C35.166&layer=mapnik&marker=35.1590%2C129.1603" },
    { id: 2, name: "동백섬 입구", distance: "380m", fill: "71%", status: "보통", area: "동백섬 · 마린시티", mapUrl: "https://www.openstreetmap.org/export/embed.html?bbox=129.139%2C35.148%2C129.158%2C35.162&layer=mapnik&marker=35.1548%2C129.1500" },
    { id: 3, name: "미포 산책로", distance: "620m", fill: "18%", status: "여유", area: "미포 · 달맞이길", mapUrl: "https://www.openstreetmap.org/export/embed.html?bbox=129.168%2C35.158%2C129.185%2C35.170&layer=mapnik&marker=35.1629%2C129.1764" },
    { id: 4, name: "광안리 만남의 광장", distance: "1.2km", fill: "45%", status: "여유", area: "광안리해수욕장", mapUrl: "https://www.openstreetmap.org/export/embed.html?bbox=129.106%2C35.148%2C129.126%2C35.162&layer=mapnik&marker=35.1532%2C129.1186" },
    { id: 5, name: "송정해수욕장 입구", distance: "2.8km", fill: "63%", status: "보통", area: "송정해수욕장", mapUrl: "https://www.openstreetmap.org/export/embed.html?bbox=129.192%2C35.172%2C129.209%2C35.184&layer=mapnik&marker=35.1787%2C129.1998" },
  ];
  const bin = bins.find((b) => b.id === selected)!;
  const searchResults = query.trim()
    ? bins.filter((b) => b.name.toLowerCase().includes(query.trim().toLowerCase()))
    : [];
  return (
    <main className="screen map-screen">
      <section className="map-head">
        <div><p className="eyebrow">내 주변 스마트 수거함</p><h1>가까운 쓰레기통</h1></div>
        <button className="locate-button" aria-label="현재 위치">◎</button>
      </section>
      <div className="search-wrap">
        <div className="map-search">
          <span>⌕</span>
          <input
            aria-label="쓰레기통 위치 검색"
            placeholder="해변이나 장소를 검색해보세요"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && <button aria-label="검색어 지우기" onClick={() => setQuery("")}>×</button>}
        </div>
        {query && (
          <div className="search-results">
            {searchResults.length > 0 ? searchResults.map((result) => (
              <button key={result.id} onClick={() => { setSelected(result.id); setQuery(""); }}>
                <span>♲</span>
                <div><strong>{result.name}</strong><small>현재 위치에서 {result.distance} · {result.status}</small></div>
                <b>→</b>
              </button>
            )) : <p>검색 결과가 없어요. 다른 해변 이름을 입력해 보세요.</p>}
          </div>
        )}
      </div>
      <section className={`map-canvas map-view-${selected}`}>
        <iframe key={bin.id} title={`${bin.name} 주변 지도`} src={bin.mapUrl}></iframe>
        <span className="map-source">OpenStreetMap</span>
      </section>
      <section className="bin-panel">
        <div className="drag"></div>
        <div className="bin-top">
          <span className="bin-illustration">♲</span>
          <div><span className="status"><i></i>{bin.status}</span><h2>{bin.name}</h2><p>현재 위치에서 도보 {bin.distance}</p></div>
        </div>
        <div className="bin-meter"><span style={{ width: bin.fill }}></span></div>
        <div className="bin-meta"><span>수거함 용량 {bin.fill}</span><span>최근 확인 2분 전</span></div>
        <button className="primary-button" onClick={onCamera}><span>◉</span> 카메라로 배출 인증하기</button>
      </section>
    </main>
  );
}

function RewardsScreen({
  points,
  claimedDays,
  purchaseHistory,
  onRedeem,
  onAttendance,
}: {
  points: number;
  claimedDays: number[];
  purchaseHistory: PurchaseRecord[];
  onRedeem: (name: string, price: number) => boolean;
  onAttendance: (day: number) => void;
}) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const today = 29;
  const rewards = [
    { icon: "♨", className: "coffee", name: "카페 음료 쿠폰", price: 2000, items: [{ name: "카페 음료 5천원권", detail: "제휴 카페 5,000원 이용권", price: 2000 }, { name: "카페 음료 1만원권", detail: "제휴 카페 10,000원 이용권", price: 4000 }, { name: "카페 음료 3만원권", detail: "제휴 카페 30,000원 이용권", price: 6000 }] },
    { icon: "▱", className: "bag", name: "친환경 마켓 쿠폰", price: 2000, items: [{ name: "친환경 마켓 5천원권", detail: "친환경 상품 5,000원 이용권", price: 2000 }, { name: "친환경 마켓 1만원권", detail: "친환경 상품 10,000원 이용권", price: 4000 }, { name: "친환경 마켓 3만원권", detail: "친환경 상품 30,000원 이용권", price: 6000 }] },
    { icon: "▰", className: "transit", name: "대중교통 충전권", price: 2000, items: [{ name: "교통카드 5천원권", detail: "모바일 교통카드 5,000원 충전", price: 2000 }, { name: "교통카드 1만원권", detail: "모바일 교통카드 10,000원 충전", price: 4000 }, { name: "교통카드 3만원권", detail: "모바일 교통카드 30,000원 충전", price: 6000 }] },
    { icon: "◇", className: "store", name: "편의점 상품권", price: 2000, items: [{ name: "편의점 5천원권", detail: "제휴 편의점 5,000원 이용권", price: 2000 }, { name: "편의점 1만원권", detail: "제휴 편의점 10,000원 이용권", price: 4000 }, { name: "편의점 3만원권", detail: "제휴 편의점 30,000원 이용권", price: 6000 }] },
    { icon: "♥", className: "donate", name: "해양 보호 기부", price: 1000, items: [{ name: "산호 복원 응원", detail: "산호 서식지 보호", price: 1000 }, { name: "바다거북 구조 지원", detail: "치료와 방류 지원", price: 3000 }, { name: "부산 해변 정화 후원", detail: "정화 장비 구입 지원", price: 5000 }] },
    { icon: "⌂", className: "local", name: "지역사랑 상품권", price: 2500, items: [{ name: "부산어묵 교환권", detail: "지역 제휴 매장", price: 2500 }, { name: "씨앗호떡 세트", detail: "부산 전통시장 교환", price: 3200 }, { name: "로컬 카페 이용권", detail: "부산 동네 카페", price: 4500 }] },
  ];
  const [selectedReward, setSelectedReward] = useState<(typeof rewards)[number] | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  return (
    <main className="screen rewards-screen">
      <section className="reward-hero">
        <p>나의 바다 포인트</p>
        <h1>{points.toLocaleString()} <small>P</small></h1>
        <span>이번 달 124km · +1,240 P</span>
        <b className="reward-rate">1km 달릴 때마다 10P</b>
        <div className="wave-balance"></div>
      </section>
      <section className="attendance">
        <div className="section-head">
          <div><span className="streak-icon">♨</span><h2>{claimedDays.length}일 연속 출석</h2></div>
          <strong>7월 <button aria-label="월 변경">⌄</button></strong>
        </div>
        <p>날짜를 눌러 출석하면 <b>매일 1P</b>를 바로 받아요.</p>
        <div className="calendar-labels">{["월", "화", "수", "목", "금", "토", "일"].map(d => <span key={d}>{d}</span>)}</div>
        <div className="calendar">
          <span className="calendar-empty"></span><span className="calendar-empty"></span>
          {days.map((day) => (
            <button
              key={day}
              className={`${claimedDays.includes(day) ? "checked" : ""} ${day === today ? "today" : ""}`}
              disabled={day > today || claimedDays.includes(day)}
              onClick={() => onAttendance(day)}
            >
              {claimedDays.includes(day) ? "✓" : day}
            </button>
          ))}
        </div>
        <div className="attendance-progress"><span style={{ width: `${(claimedDays.length / 31) * 100}%` }}></span></div>
        <small>{claimedDays.length} / 31일 출석 · 하루 1P</small>
      </section>
      <section className="reward-shop">
        <div className="section-head"><h2>포인트로 바꿔요</h2><button className="text-button" onClick={() => setHistoryOpen(true)}>이용내역</button></div>
        <div className="coupon-row">
          {rewards.map((reward) => (
            <article key={reward.name}>
              <span className={`coupon-icon ${reward.className}`}>{reward.icon}</span>
              <p>{reward.name}</p><strong>{reward.price.toLocaleString()} P</strong>
              <button onClick={() => setSelectedReward(reward)}>교환하기</button>
            </article>
          ))}
        </div>
      </section>
      <section className="point-history">
        <div><span className="history-icon">⌁</span><p><strong>플로깅 5.4km 완료</strong><small>오늘 · 해운대 해변 코스</small></p><b>+54 P</b></div>
        <div><span className="history-icon">⌁</span><p><strong>플로깅 3.2km 완료</strong><small>어제 · 동백섬 코스</small></p><b>+32 P</b></div>
        <div><span className="history-icon">♨</span><p><strong>7월 12일 출석 완료</strong><small>7월 12일 · 매일 출석</small></p><b>+1 P</b></div>
      </section>
      {selectedReward && (
        <div className="modal-backdrop">
          <div className="exchange-modal">
            <button className="modal-close" onClick={() => setSelectedReward(null)}>×</button>
            <span className={`coupon-icon ${selectedReward.className}`}>{selectedReward.icon}</span>
            <p className="eyebrow">SELECT REWARD</p>
            <h2>{selectedReward.name}</h2>
            <p>원하는 상품을 골라 포인트로 교환해 보세요.</p>
            <div className="exchange-item-list">
              {selectedReward.items.map((item) => (
                <article key={item.name}>
                  <div><strong>{item.name}</strong><small>{item.detail}</small></div>
                  <b>{item.price.toLocaleString()}P</b>
                  <button onClick={() => { if (onRedeem(item.name, item.price)) setSelectedReward(null); }}>선택</button>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
      {historyOpen && (
        <div className="modal-backdrop">
          <div className="exchange-modal history-modal">
            <button className="modal-close" onClick={() => setHistoryOpen(false)}>×</button>
            <p className="eyebrow">REWARD HISTORY</p>
            <h2>교환 이용내역</h2>
            <p>지금까지 포인트로 교환한 상품이에요.</p>
            {purchaseHistory.length > 0 ? (
              <div className="purchase-history-list">
                {purchaseHistory.map((purchase) => (
                  <article key={purchase.id}>
                    <span>✓</span>
                    <div><strong>{purchase.name}</strong><small>{purchase.purchasedAt} · 교환 완료</small></div>
                    <b>-{purchase.price.toLocaleString()}P</b>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-history"><b>◇</b><strong>아직 교환한 상품이 없어요</strong><small>상품을 교환하면 이곳에 기록됩니다.</small></div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function CameraModal({ onClose, onComplete }: { onClose: () => void; onComplete: (earnedPoints: number) => void }) {
  const [step, setStep] = useState(0);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const awardedRef = useRef(false);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const closeCamera = () => {
    stopCamera();
    onClose();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
      setCameraError("");
    } catch {
      setCameraError("카메라 권한을 허용하면 배출 모습을 인증할 수 있어요.");
    }
  };

  const captureWaste = () => {
    stopCamera();
    setCameraOn(false);
    setStep(1);
  };

  useEffect(() => {
    if (step !== 1) return;
    const timer = window.setTimeout(() => setStep(2), 700);
    return () => window.clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (step !== 2 || awardedRef.current) return;
    awardedRef.current = true;
    onComplete(34);
  }, [step, onComplete]);

  useEffect(() => () => stopCamera(), []);

  return (
    <div className="modal-backdrop">
      <div className="scan-modal">
        {step < 2 ? (
          <>
            <button className="modal-close" onClick={closeCamera}>×</button>
            <div className={`camera-view ${cameraOn ? "live" : ""} ${step > 0 ? "captured" : ""}`}>
              <video ref={videoRef} playsInline muted aria-label="배출 인증 카메라 화면" />
              {!cameraOn && step === 0 && <span className="camera-placeholder"><b>◉</b>배출 모습을 촬영해 주세요</span>}
              {step > 0 && <span className="capture-check">✓</span>}
              {cameraOn && <i className="focus-frame"></i>}
            </div>
            <p className="eyebrow">SMART BIN #H12</p>
            <h2>{step === 0 ? "카메라로 배출을 인증해요" : "배출 사진을 확인하고 있어요"}</h2>
            <p>{step === 0 ? "쓰레기를 수거함에 넣는 모습이 잘 보이게 촬영해 주세요." : "촬영한 사진이 확인되면 포인트가 바로 지급돼요."}</p>
            {cameraError && <p className="camera-error">{cameraError}</p>}
            {step === 0 && (
              <button className="camera-button" onClick={cameraOn ? captureWaste : startCamera}>
                {cameraOn ? "● 촬영하고 인증하기" : "◉ 카메라 켜기"}
              </button>
            )}
            <div className="scan-steps">
              {["사진 촬영", "사진 확인", "포인트 지급"].map((label, i) => <span key={label} className={step >= i ? "active" : ""}><i>{step > i ? "✓" : i + 1}</i>{label}</span>)}
            </div>
          </>
        ) : (
          <div className="success-state">
            <span className="success-ring">✓</span>
            <p className="eyebrow">인증 완료</p>
            <h2>사진 인증 완료!</h2>
            <p>배출 사진 인증이 끝나 <b>34P가 바로 지급됐어요.</b></p>
            <div className="scan-steps complete-steps">
              {["사진 촬영", "사진 확인", "포인트 지급"].map((label) => <span key={label} className="active"><i>✓</i>{label}</span>)}
            </div>
            <div className="verification-summary">
              <div><span>오늘 걸은 거리</span><strong>3.4 km</strong></div>
              <div><span>오늘 활동 시간</span><strong>42분 18초</strong></div>
              <div><span>획득 포인트</span><strong>+34 P</strong></div>
            </div>
            <small className="point-rule-note">1km당 10P 기준으로 계산됐어요.</small>
            <button className="primary-button" onClick={closeCamera}>포인트 지급 확인</button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileModal({
  points,
  profile,
  activityRecords,
  onSaveProfile,
  onClose,
  onLogout,
}: {
  points: number;
  profile: ProfileData;
  activityRecords: ActivityRecord[];
  onSaveProfile: (profile: ProfileData) => void;
  onClose: () => void;
  onLogout: () => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const nickname = profile.nickname;
  const recordedActivities = activityRecords.map((record) => ({
    distance: `${record.distance.toFixed(2)}km`,
    title: "새로 저장한 바로깅",
    detail: `${record.createdAt} · ${Math.floor(record.elapsedSeconds / 60)}분 ${record.elapsedSeconds % 60}초 · ${record.steps.toLocaleString()}걸음`,
  }));
  const activities = [
    ...recordedActivities,
    { distance: "5.4km", title: "해운대 해변 바로깅", detail: "7월 28일 · 48분 · +54P" },
    { distance: "3.2km", title: "동백섬 한 바퀴", detail: "7월 27일 · 36분 · +32P" },
    { distance: "4.8km", title: "광안리 야간 바로깅", detail: "7월 25일 · 52분 · +48P" },
    { distance: "6.1km", title: "송정 파도 따라 걷기", detail: "7월 22일 · 1시간 8분 · +61P" },
    { distance: "2.9km", title: "미포 산책로 클린런", detail: "7월 20일 · 31분 · +29P" },
    { distance: "7.3km", title: "이기대 해안길", detail: "7월 17일 · 1시간 42분 · +73P" },
    { distance: "4.1km", title: "다대포 노을 코스", detail: "7월 14일 · 49분 · +41P" },
  ];
  const visibleActivities = showAll ? activities : activities.slice(0, 3);

  return (
    <div className="modal-backdrop">
      <div className="account-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <p className="profile-title">내 프로필</p>
        <div className="account-profile">
          <span>{nickname.slice(0, 1)}</span>
          <div><p>바다를 달리는 중</p><h2>{nickname} 님</h2><small>부산 바로거 · 2026년 3월부터</small></div>
        </div>
        <div className="account-stats">
          <div><span>누적 거리</span><strong>128.6 km</strong></div>
          <div><span>활동 시간</span><strong>26시간 42분</strong></div>
          <div><span>보유 포인트</span><strong>{points.toLocaleString()} P</strong></div>
        </div>

        <section className="account-section">
          <div className="account-section-title"><h3>{showAll ? "전체 활동 기록" : "최근 활동 기록"}</h3><button onClick={() => setShowAll((current) => !current)}>{showAll ? "접기" : "전체보기"}</button></div>
          <div className="account-activities">
            {visibleActivities.map((activity) => (
              <article key={`${activity.title}-${activity.detail}`}>
                <b>{activity.distance}</b>
                <div><strong>{activity.title}</strong><small>{activity.detail}</small></div>
              </article>
            ))}
          </div>
        </section>

        <section className="account-section privacy-section">
          <div className="account-section-title">
            <h3>개인정보</h3>
            {!editing && <button onClick={() => { setDraft(profile); setEditing(true); }}>수정</button>}
          </div>
          {editing ? (
            <form
              className="privacy-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (!draft.nickname.trim() || !draft.email.trim()) return;
                onSaveProfile({
                  nickname: draft.nickname.trim(),
                  phone: draft.phone.trim(),
                  email: draft.email.trim(),
                  region: draft.region.trim(),
                });
                setEditing(false);
              }}
            >
              <label>닉네임<input value={draft.nickname} onChange={(event) => setDraft({ ...draft, nickname: event.target.value })} maxLength={12} required /></label>
              <label>휴대폰<input value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} inputMode="tel" placeholder="010-0000-0000" /></label>
              <label>이메일<input value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} type="email" required /></label>
              <label>활동 지역<input value={draft.region} onChange={(event) => setDraft({ ...draft, region: event.target.value })} placeholder="부산광역시" /></label>
              <div className="privacy-form-actions">
                <button type="button" onClick={() => { setDraft(profile); setEditing(false); }}>취소</button>
                <button type="submit">저장하기</button>
              </div>
            </form>
          ) : (
            <dl>
              <div><dt>닉네임</dt><dd>{profile.nickname}</dd></div>
              <div><dt>휴대폰</dt><dd>{profile.phone || "미입력"}</dd></div>
              <div><dt>이메일</dt><dd>{profile.email}</dd></div>
              <div><dt>활동 지역</dt><dd>{profile.region || "미입력"}</dd></div>
            </dl>
          )}
        </section>
        <button className="logout-button" onClick={() => { if (window.confirm("바로깅에서 로그아웃할까요?")) onLogout(); }}>로그아웃</button>
      </div>
    </div>
  );
}

function CourseUploadModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (route: { title: string; area: string; distance: string; time: string; bins: number }) => void;
}) {
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("");
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [bins, setBins] = useState(2);

  const submitCourse = () => {
    if (!title.trim() || !area.trim() || !distance.trim() || !time.trim()) {
      alert("코스 이름, 부산 지역, 거리와 예상 시간을 모두 입력해 주세요.");
      return;
    }
    onCreate({
      title: title.trim(),
      area: `부산 · ${area.trim()}`,
      distance: distance.includes("km") ? distance : `${distance}km`,
      time: time.trim().replace(/^약\s*/, ""),
      bins,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="course-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <p className="eyebrow">BUSAN COMMUNITY COURSE</p>
        <h2>추천 코스 등록</h2>
        <p>직접 걸어본 부산 플로깅 코스를 이웃에게 알려주세요.</p>
        <div className="course-map-preview">
          <span className="preview-road pr1"></span><span className="preview-road pr2"></span><span className="preview-road pr3"></span>
          <span className="preview-route">● · · · ◆ · · ●</span>
          <small>BUSAN</small>
        </div>
        <div className="course-form">
          <label>코스 이름<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 영도 바다 마을 코스" /></label>
          <label>부산 지역<input value={area} onChange={(e) => setArea(e.target.value)} placeholder="예: 영도구 · 흰여울문화마을" /></label>
          <div>
            <label>거리(km)<input value={distance} onChange={(e) => setDistance(e.target.value)} inputMode="decimal" placeholder="4.2" /></label>
            <label>예상 시간<input value={time} onChange={(e) => setTime(e.target.value)} placeholder="약 55분" /></label>
            <label>수거함 수<input value={bins} onChange={(e) => setBins(Number(e.target.value))} type="number" min="0" max="20" /></label>
          </div>
        </div>
        <button className="primary-button" onClick={submitCourse}>부산 추천 코스로 등록하기</button>
      </div>
    </div>
  );
}

function CourseDetailModal({ route, onClose }: { route: (typeof communityRoutes)[number]; onClose: () => void }) {
  return (
    <div className="modal-backdrop">
      <div className="course-detail-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="detail-map"><iframe title={`${route.title} 상세 지도`} src={route.mapUrl}></iframe></div>
        <div className="detail-author"><span>{route.avatar}</span><div><strong>{route.author}님의 추천 코스</strong><small>{route.area}</small></div></div>
        <h2>{route.title}</h2>
        <div className="detail-stats">
          <div><span>거리</span><strong>{route.distance}</strong></div>
          <div><span>예상 시간</span><strong>{route.time}</strong></div>
          <div><span>스마트 수거함</span><strong>{route.bins}개</strong></div>
        </div>
        <section className="course-guide">
          <h3>코스 안내</h3>
          <ol>
            <li><i>1</i><div><strong>{route.area.split(" · ")[1]} 시작 지점</strong><small>해변 입구에서 플로깅을 시작해요.</small></div></li>
            <li><i>2</i><div><strong>해안 산책로 구간</strong><small>안전한 보행로를 따라 쓰레기를 수거해요.</small></div></li>
            <li><i>3</i><div><strong>스마트 수거함 도착</strong><small>카메라로 배출 사진을 인증해요.</small></div></li>
          </ol>
        </section>
        <button className="primary-button" onClick={() => { alert(`${route.title} 코스를 내 플로깅에 저장했어요!`); onClose(); }}>이 코스로 시작하기</button>
      </div>
    </div>
  );
}

function ActivityModal({
  mode,
  onClose,
  groups,
  onToggleJoin,
  onCreateGroup,
  onDeleteGroup,
  onCompleteActivity,
}: {
  mode: Mode;
  onClose: () => void;
  groups: GroupData[];
  onToggleJoin: (id: number) => void;
  onCreateGroup: (group: Omit<GroupData, "id" | "joined" | "owned">) => void;
  onDeleteGroup: (id: number) => void;
  onCompleteActivity: (record: ActivityRecord) => void;
}) {
  const [groupName, setGroupName] = useState("");
  const [groupPlace, setGroupPlace] = useState("");
  const [groupTime, setGroupTime] = useState("");
  const [groupMax, setGroupMax] = useState(10);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>("idle");
  const [gpsPosition, setGpsPosition] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null);
  const [gpsDistance, setGpsDistance] = useState(0);
  const gpsWatchIdRef = useRef<number | null>(null);
  const previousGpsPositionRef = useRef<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [recording]);

  useEffect(() => () => {
    if (gpsWatchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(gpsWatchIdRef.current);
    }
  }, []);

  const estimatedDistance = elapsed * 0.0032;
  const measuredSteps = elapsed * 2;
  const measuredDistance = gpsStatus === "active" ? gpsDistance : estimatedDistance;
  const measuredTime = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
  const gpsStatusLabel: Record<GpsStatus, string> = {
    idle: "GPS 준비",
    connecting: "GPS 연결 중",
    active: "GPS 연결됨",
    denied: "위치 권한 필요",
    unavailable: "GPS 사용 불가",
  };

  const startGpsTracking = () => {
    setGpsPosition(null);
    setGpsDistance(0);
    previousGpsPositionRef.current = null;

    if (!navigator.geolocation) {
      setGpsStatus("unavailable");
      return;
    }

    setGpsStatus("connecting");
    gpsWatchIdRef.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const current = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
        };
        setGpsPosition(current);
        setGpsStatus("active");

        const previous = previousGpsPositionRef.current;
        if (previous) {
          const segmentDistance = calculateGpsDistance(previous, current);
          const minimumMovement = Math.max(0.003, coords.accuracy / 2000);
          if (coords.accuracy <= 100 && segmentDistance >= minimumMovement && segmentDistance <= 0.2) {
            setGpsDistance((distance) => distance + segmentDistance);
          }
        }
        previousGpsPositionRef.current = current;
      },
      (error) => {
        setGpsStatus(error.code === error.PERMISSION_DENIED ? "denied" : "unavailable");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000,
      },
    );
  };

  const stopGpsTracking = () => {
    if (gpsWatchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(gpsWatchIdRef.current);
      gpsWatchIdRef.current = null;
    }
  };

  const createGroup = () => {
    if (!groupName.trim() || !groupPlace.trim() || !groupTime) {
      alert("그룹 이름, 시작 지점, 만나는 시간을 모두 입력해 주세요.");
      return;
    }
    onCreateGroup({
      name: groupName.trim(),
      place: groupPlace.trim(),
      time: groupTime.replace("T", " "),
      max: groupMax,
      count: 1,
    });
    setGroupName("");
    setGroupPlace("");
    setGroupTime("");
    setGroupMax(10);
  };

  if (mode === "group") {
    return (
      <div className="modal-backdrop">
        <div className="activity-modal group-modal">
          <button className="modal-close" onClick={onClose}>×</button>
          <span className="activity-badge">같이 만드는 변화</span>
          <h2>함께 플로깅</h2>

          <div className="recruiting-head"><strong>모집 중인 그룹</strong><span>{groups.length}개</span></div>
          <div className="open-group-list">
            {groups.map((group) => (
              <article className="open-group" key={group.id}>
                <div className="open-group-head">
                  <div><span>모집 중</span><h3>{group.name}</h3></div>
                  <div className="group-actions">
                    <strong>{group.count}<small> / {group.max}명</small></strong>
                    {group.owned && <button onClick={() => onDeleteGroup(group.id)}>삭제</button>}
                  </div>
                </div>
                <p>⌖ {group.place} · {group.time}</p>
                <button
                  className={group.joined ? "cancel-join" : "join-button"}
                  onClick={() => onToggleJoin(group.id)}
                  disabled={!group.joined && group.count >= group.max}
                >
                  {group.joined ? "참여 취소" : group.count >= group.max ? "모집 완료" : "참여하기"}
                </button>
              </article>
            ))}
          </div>

          <div className="form-divider"><span>새 그룹 만들기</span></div>
          <div className="group-form">
            <label>그룹 이름<input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="예: 주말 바다 지킴이" aria-label="그룹 이름" /></label>
            <label>시작 지점<input value={groupPlace} onChange={(e) => setGroupPlace(e.target.value)} placeholder="예: 해운대 중앙광장" aria-label="시작 지점" /></label>
            <div>
              <label>만나는 시간<input value={groupTime} onChange={(e) => setGroupTime(e.target.value)} type="datetime-local" aria-label="만나는 시간" /></label>
              <label>인원 수<input value={groupMax} onChange={(e) => setGroupMax(Number(e.target.value))} type="number" min="2" max="50" aria-label="인원 수" /></label>
            </div>
          </div>
          <button className="primary-button" onClick={createGroup}>그룹 만들기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop">
      <div className="activity-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <span className="activity-badge">나만의 페이스</span>
        <h2>혼자 플로깅</h2>
        <p>현재 위치에서 바로 기록을 시작할까요?</p>
        {recording && <span className="recording-live"><i></i>측정 중</span>}
        <div className={`gps-card gps-${gpsStatus}`}>
          <div>
            <span><i></i>{gpsStatusLabel[gpsStatus]}</span>
            <small>
              {gpsPosition
                ? `현재 위치 ${gpsPosition.latitude.toFixed(5)}, ${gpsPosition.longitude.toFixed(5)}`
                : gpsStatus === "idle"
                  ? "측정을 시작하면 현재 위치를 확인해요."
                  : gpsStatus === "denied"
                    ? "휴대폰 설정에서 위치 권한을 허용해 주세요."
                    : "휴대폰의 현재 위치를 찾고 있어요."}
            </small>
          </div>
          {gpsPosition && <b>오차 약 {Math.round(gpsPosition.accuracy)}m</b>}
        </div>
        <div className={`live-preview ${recording ? "is-recording" : ""}`}>
          <span><i>이동 거리</i><b>{measuredDistance.toFixed(2)} km</b></span>
          <span><i>시간</i><b>{measuredTime}</b></span>
          <span><i>걸음 수</i><b>{measuredSteps.toLocaleString()}</b></span>
        </div>
        <p className="distance-rule">{recording ? "거리·시간·걸음 수가 실시간으로 기록되고 있어요." : "GPS로 이동 거리 측정 · 1km당 10P"}</p>
        <button
          className={`primary-button ${recording ? "stop-recording" : ""}`}
          onClick={() => {
            if (!recording) {
              setElapsed(0);
              startGpsTracking();
              setRecording(true);
            } else {
              stopGpsTracking();
              setRecording(false);
              onCompleteActivity({
                id: Date.now(),
                distance: measuredDistance,
                elapsedSeconds: elapsed,
                steps: measuredSteps,
                createdAt: "오늘",
              });
              onClose();
            }
          }}
        >
          {recording ? "측정 종료" : "측정 시작하기"}
        </button>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: (nickname: string, email: string) => void }) {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = (event: React.FormEvent) => {
    event.preventDefault();
    if (!nickname.trim() || !email.trim() || !password.trim()) {
      setError("닉네임, 이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }
    setError("");
    onLogin(nickname.trim(), email.trim());
  };

  return (
    <div className="login-screen">
      <div className="login-brand">
        <span>BAROGGING · BUSAN</span>
        <h1>바로깅</h1>
        <p>걷고, 줍고, 부산의 바다를 바꾸다.</p>
      </div>
      <div className="login-wave"><i></i><b></b></div>
      <form className="login-card" onSubmit={login}>
        <div><p className="eyebrow">WELCOME BACK</p><h2>다시 바다를 달려볼까요?</h2></div>
        <label>닉네임<input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="앱에서 사용할 닉네임" maxLength={12} /></label>
        <label>이메일<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="barogging@email.com" autoComplete="email" /></label>
        <label>비밀번호<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="비밀번호 입력" autoComplete="current-password" /></label>
        <div className="login-options"><label><input type="checkbox" /> 로그인 유지</label><button type="button">비밀번호 찾기</button></div>
        {error && <p className="login-error">{error}</p>}
        <button className="login-button" type="submit">로그인</button>
        <button className="demo-login" type="button" onClick={() => onLogin(nickname.trim() || "바다러너", email.trim() || "barogging@email.com")}>체험 계정으로 시작하기</button>
        <p className="signup-copy">바로깅이 처음인가요? <button type="button">회원가입</button></p>
      </form>
    </div>
  );
}

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("바다러너");
  const [profile, setProfile] = useState<ProfileData>({
    nickname: "바다러너",
    phone: "010-1234-2847",
    email: "barogging@email.com",
    region: "부산광역시",
  });
  const [tab, setTab] = useState<Tab>("plogging");
  const [points, setPoints] = useState(2000);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [activityMode, setActivityMode] = useState<Mode | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [groups, setGroups] = useState<GroupData[]>(initialGroups);
  const [activityRecords, setActivityRecords] = useState<ActivityRecord[]>([]);
  const [claimedDays, setClaimedDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const [attendanceReady, setAttendanceReady] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseRecord[]>([]);
  const [purchaseHistoryReady, setPurchaseHistoryReady] = useState(false);
  const [notice, setNotice] = useState("");
  const noticeTimerRef = useRef<number | null>(null);

  const showNotice = (message: string) => {
    setNotice(message);
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => setNotice(""), 2600);
  };

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("barogging-attendance-2026-07");
      if (saved) setClaimedDays(JSON.parse(saved));
    } catch {
      // 기기 저장소를 사용할 수 없어도 현재 화면에서는 한 번만 지급합니다.
    }
    setAttendanceReady(true);
  }, []);

  useEffect(() => {
    if (!attendanceReady) return;
    try {
      window.localStorage.setItem("barogging-attendance-2026-07", JSON.stringify(claimedDays));
    } catch {
      // 저장소가 차단된 환경에서는 현재 접속 중인 출석 상태를 유지합니다.
    }
  }, [attendanceReady, claimedDays]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("barogging-purchase-history");
      if (saved) setPurchaseHistory(JSON.parse(saved));
    } catch {
      // 저장소가 차단된 환경에서는 현재 접속 중인 교환 내역을 유지합니다.
    }
    setPurchaseHistoryReady(true);
  }, []);

  useEffect(() => {
    if (!purchaseHistoryReady) return;
    try {
      window.localStorage.setItem("barogging-purchase-history", JSON.stringify(purchaseHistory));
    } catch {
      // 저장소가 차단된 환경에서는 현재 접속 중인 교환 내역을 유지합니다.
    }
  }, [purchaseHistoryReady, purchaseHistory]);

  const completeScan = (earnedPoints: number) => {
    setPoints((current) => current + earnedPoints);
    showNotice(`사진 인증 완료 · ${earnedPoints}P 지급 완료`);
  };

  const toggleJoin = (id: number) => {
    setGroups((current) => current.map((group) => {
      if (group.id !== id) return group;
      const joined = !group.joined;
      return {
        ...group,
        joined,
        count: joined ? Math.min(group.max, group.count + 1) : Math.max(0, group.count - 1),
      };
    }));
  };

  const createGroup = (group: Omit<GroupData, "id" | "joined" | "owned">) => {
    setGroups((current) => [{ ...group, id: Date.now(), joined: true, owned: true }, ...current]);
    alert("새 그룹이 모집 목록 맨 위에 추가됐어요!");
  };

  const deleteGroup = (id: number) => {
    if (window.confirm("내가 만든 이 그룹을 삭제할까요?")) {
      setGroups((current) => current.filter((group) => group.id !== id));
    }
  };

  if (!loggedIn) {
    return (
      <div className="site-shell">
        <div className="phone"><LoginScreen onLogin={(name, email) => {
          setNickname(name);
          setProfile({
            nickname: name,
            phone: "",
            email,
            region: "부산광역시",
          });
          setPoints(2000);
          setClaimedDays([]);
          setPurchaseHistory([]);
          try {
            window.localStorage.setItem("barogging-attendance-2026-07", "[]");
            window.localStorage.setItem("barogging-purchase-history", "[]");
          } catch {
            // 저장소가 차단되어도 현재 로그인에서는 출석과 이용내역을 초기화합니다.
          }
          setLoggedIn(true);
        }} /></div>
      </div>
    );
  }

  return (
    <div className="site-shell">
      <div className="phone">
        <Header points={points} onAccount={() => setProfileOpen(true)} />
        <div className="content">
          {tab === "plogging" && <PloggingScreen onStart={setActivityMode} attendanceCount={claimedDays.length} />}
          {tab === "records" && <RecordsScreen nickname={nickname} activityRecords={activityRecords} />}
          {tab === "map" && <MapScreen onCamera={() => setCameraOpen(true)} />}
          {tab === "rewards" && (
            <RewardsScreen
              points={points}
              claimedDays={claimedDays}
              purchaseHistory={purchaseHistory}
              onRedeem={(name, price) => {
                if (points < price) {
                  showNotice("포인트가 부족해요.");
                  return false;
                }
                setPoints((current) => current - price);
                setPurchaseHistory((current) => [{
                  id: Date.now(),
                  name,
                  price,
                  purchasedAt: new Date().toLocaleDateString("ko-KR"),
                }, ...current]);
                showNotice(`교환 완료 · ${name}에 ${price.toLocaleString()}P를 사용했어요.`);
                return true;
              }}
              onAttendance={(day) => {
                if (claimedDays.includes(day)) {
                  showNotice("이 날짜의 출석 보상은 이미 받았어요.");
                  return;
                }
                setClaimedDays((current) => [...current, day]);
                setPoints((current) => current + 1);
                showNotice(`7월 ${day}일 출석 완료 · 오늘의 1P가 지급됐어요.`);
              }}
            />
          )}
        </div>
        <nav className="bottom-nav" aria-label="주요 메뉴">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setTab(item.id)} className={tab === item.id ? "active" : ""} aria-current={tab === item.id ? "page" : undefined}>
              <span>{item.icon}</span><small>{item.label}</small>
            </button>
          ))}
        </nav>
        {cameraOpen && <CameraModal onClose={() => setCameraOpen(false)} onComplete={completeScan} />}
        {profileOpen && (
          <ProfileModal
            points={points}
            profile={profile}
            activityRecords={activityRecords}
            onSaveProfile={(updatedProfile) => {
              setProfile(updatedProfile);
              setNickname(updatedProfile.nickname);
              showNotice("개인정보가 저장됐어요.");
            }}
            onClose={() => setProfileOpen(false)}
            onLogout={() => {
              setProfileOpen(false);
              setLoggedIn(false);
            }}
          />
        )}
        {activityMode && (
          <ActivityModal
            mode={activityMode}
            onClose={() => setActivityMode(null)}
            groups={groups}
            onToggleJoin={toggleJoin}
            onCreateGroup={createGroup}
            onDeleteGroup={deleteGroup}
            onCompleteActivity={(record) => {
              setActivityRecords((current) => [record, ...current]);
              showNotice(`측정 완료 · ${record.distance.toFixed(2)}km · ${record.steps.toLocaleString()}걸음 · ${Math.floor(record.elapsedSeconds / 60)}분 ${record.elapsedSeconds % 60}초`);
            }}
          />
        )}
        {notice && <div className="app-notice" role="status">{notice}</div>}
      </div>
    </div>
  );
}
