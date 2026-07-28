"use client";

import { useEffect, useRef, useState } from "react";

type Tab = "plogging" | "records" | "map" | "rewards";
type Mode = "solo" | "group";
type RankMetric = "distance" | "time";
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
  { id: 1, title: "동백섬 바다 한 바퀴", area: "해운대 · 동백섬", distance: "3.2km", time: "48분", bins: 3, author: "민지", avatar: "민", likes: 248, tone: "mint" },
  { id: 2, title: "광안대교 노을 코스", area: "수영구 · 광안리", distance: "4.6km", time: "1시간 5분", bins: 4, author: "부산러너", avatar: "부", likes: 193, tone: "coral" },
  { id: 3, title: "송정 파도 따라 걷기", area: "해운대 · 송정", distance: "5.1km", time: "1시간 12분", bins: 5, author: "파도맘", avatar: "파", likes: 156, tone: "blue" },
  { id: 4, title: "이기대 해안 산책길", area: "남구 · 이기대", distance: "6.8km", time: "1시간 38분", bins: 3, author: "초록발걸음", avatar: "초", likes: 132, tone: "sand" },
];

function Header({ points, onAccount }: { points: number; onAccount: () => void }) {
  return (
    <header className="topbar">
      <div className="brand"><span>바로깅</span></div>
      <button className="point-pill" aria-label="내 포인트">
        {points.toLocaleString()} P
      </button>
      <button className="account-button" onClick={onAccount}>내 계정</button>
    </header>
  );
}

function PloggingScreen({ onStart }: { onStart: (mode: Mode) => void }) {
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
          <div><strong>7일 연속 플로깅 중!</strong><small>이번 달 12일 참여했어요</small></div>
        </div>
        <div className="week-row">
          {["월", "화", "수", "목", "금", "토", "일"].map((day, i) => (
            <span key={day} className={i < 6 ? "done" : ""}><i>{i < 6 ? "✓" : "·"}</i>{day}</span>
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

function RecordsScreen() {
  const [ranking, setRanking] = useState<Mode>("group");
  const [metric, setMetric] = useState<RankMetric>("distance");
  const ranks = ranking === "group" ? groupRank : soloRank;
  return (
    <main className="screen">
      <section className="page-title">
        <p className="eyebrow">우리의 작은 움직임</p>
        <h1>활동 기록</h1>
      </section>

      <div className="stat-grid">
        <div><span>이번 달</span><strong>28.4 <small>km</small></strong><em>↑ 12%</em></div>
        <div><span>누적 시간</span><strong>08:42</strong><small>시간 : 분</small></div>
        <div><span>걸음 수</span><strong>42,680</strong><small>걸음</small></div>
      </div>

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
        <div className="section-head"><h2>부산 사용자 추천 코스</h2><button className="text-button">코스 올리기</button></div>
        <p className="route-subtitle">부산에서 바로깅 중인 사람들이 직접 공유했어요.</p>
        <div className="route-feed">
          {communityRoutes.map((route, index) => (
            <article className="community-route" key={route.id}>
              <div className={`route-map ${route.tone}`}>
                <span className="route-line">⌁⌁⌁⌁</span>
                <i className="pin p1">●</i><i className="pin p2">◆</i><i className="pin p3">●</i>
                {index === 0 && <b>인기</b>}
              </div>
              <div className="route-info">
                <div className="route-author"><span>{route.avatar}</span><strong>{route.author}</strong><small>{route.area}</small></div>
                <h3>{route.title}</h3>
                <p>{route.distance} · 약 {route.time} · 수거함 {route.bins}개</p>
                <div><span>♡ {route.likes}</span><button onClick={() => alert(`${route.title} 코스 링크를 복사했어요!`)}>공유 ↗</button></div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function MapScreen({ onCamera }: { onCamera: () => void }) {
  const [selected, setSelected] = useState(1);
  const [query, setQuery] = useState("");
  const bins = [
    { id: 1, name: "해운대 중앙광장", distance: "120m", fill: "32%", status: "여유" },
    { id: 2, name: "동백섬 입구", distance: "380m", fill: "71%", status: "보통" },
    { id: 3, name: "미포 산책로", distance: "620m", fill: "18%", status: "여유" },
    { id: 4, name: "광안리 만남의 광장", distance: "1.2km", fill: "45%", status: "여유" },
    { id: 5, name: "송정해수욕장 입구", distance: "2.8km", fill: "63%", status: "보통" },
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
      <section className="map-canvas">
        <div className="ocean-label">HAEUNDAE<br /><small>BEACH</small></div>
        <span className="road r1"></span><span className="road r2"></span><span className="road r3"></span>
        <span className="park park1"></span><span className="park park2"></span>
        {bins.slice(0, 3).map((b, i) => (
          <button key={b.id} aria-label={b.name} onClick={() => setSelected(b.id)} className={`map-pin pin-${i + 1} ${selected === b.id ? "selected" : ""}`}>
            <span>♲</span>
          </button>
        ))}
        <span className="you-dot"><i></i>현재 위치</span>
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

function RewardsScreen({ points, onRedeem }: { points: number; onRedeem: () => void }) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const rewards = [
    { icon: "♨", className: "coffee", name: "카페 음료 쿠폰", price: "3,000 P" },
    { icon: "▱", className: "bag", name: "친환경 마켓 쿠폰", price: "5,000 P" },
    { icon: "▰", className: "transit", name: "대중교통 충전권", price: "2,000 P" },
    { icon: "◇", className: "store", name: "편의점 상품권", price: "4,000 P" },
    { icon: "♥", className: "donate", name: "해양 보호 기부", price: "1,000 P" },
    { icon: "⌂", className: "local", name: "지역사랑 상품권", price: "6,000 P" },
  ];
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
          <div><span className="streak-icon">♨</span><h2>7일 연속 출석</h2></div>
          <strong>7월 <button aria-label="월 변경">⌄</button></strong>
        </div>
        <p>이번 달 매일 출석하면 <b>30P 보너스!</b></p>
        <div className="calendar-labels">{["월", "화", "수", "목", "금", "토", "일"].map(d => <span key={d}>{d}</span>)}</div>
        <div className="calendar">
          {days.map((day) => <span key={day} className={day <= 12 ? "checked" : day === 28 ? "today" : ""}>{day <= 12 ? "✓" : day}</span>)}
        </div>
        <div className="attendance-progress"><span style={{ width: "39%" }}></span></div>
        <small>12 / 31일 출석</small>
      </section>
      <section className="reward-shop">
        <div className="section-head"><h2>포인트로 바꿔요</h2><button className="text-button">이용내역</button></div>
        <div className="coupon-row">
          {rewards.map((reward) => (
            <article key={reward.name}>
              <span className={`coupon-icon ${reward.className}`}>{reward.icon}</span>
              <p>{reward.name}</p><strong>{reward.price}</strong>
              <button onClick={onRedeem}>교환하기</button>
            </article>
          ))}
        </div>
      </section>
      <section className="point-history">
        <div><span className="history-icon">⌁</span><p><strong>플로깅 5.4km 완료</strong><small>오늘 · 해운대 해변 코스</small></p><b>+54 P</b></div>
        <div><span className="history-icon">⌁</span><p><strong>플로깅 3.2km 완료</strong><small>어제 · 동백섬 코스</small></p><b>+32 P</b></div>
        <div><span className="history-icon">♨</span><p><strong>6월 한 달 출석 완료</strong><small>6월 30일 · 출석 보너스</small></p><b>+30 P</b></div>
      </section>
    </main>
  );
}

function CameraModal({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
    const timers = [
      setTimeout(() => setStep(2), 900),
      setTimeout(() => setStep(3), 2100),
    ];
    return () => timers.forEach(clearTimeout);
  }, [step]);

  useEffect(() => () => stopCamera(), []);

  return (
    <div className="modal-backdrop">
      <div className="scan-modal">
        {step < 3 ? (
          <>
            <button className="modal-close" onClick={closeCamera}>×</button>
            <div className={`camera-view ${cameraOn ? "live" : ""} ${step > 0 ? "captured" : ""}`}>
              <video ref={videoRef} playsInline muted aria-label="배출 인증 카메라 화면" />
              {!cameraOn && step === 0 && <span className="camera-placeholder"><b>◉</b>배출 모습을 촬영해 주세요</span>}
              {step > 0 && <span className="capture-check">✓</span>}
              {cameraOn && <i className="focus-frame"></i>}
            </div>
            <p className="eyebrow">SMART BIN #H12</p>
            <h2>{step === 0 ? "카메라로 배출을 인증해요" : step === 1 ? "배출 사진을 확인하고 있어요" : "투입 센서를 확인 중이에요"}</h2>
            <p>{step === 0 ? "쓰레기를 수거함에 넣는 모습이 잘 보이게 촬영해 주세요." : step === 1 ? "올바른 배출 모습이 선명하게 촬영됐어요." : "수거함 센서가 쓰레기 투입을 확인했어요."}</p>
            {cameraError && <p className="camera-error">{cameraError}</p>}
            {step === 0 && (
              <button className="camera-button" onClick={cameraOn ? captureWaste : startCamera}>
                {cameraOn ? "● 촬영하고 인증하기" : "◉ 카메라 켜기"}
              </button>
            )}
            <div className="scan-steps">
              {["카메라 촬영", "사진 확인", "센서 인증"].map((label, i) => <span key={label} className={step >= i ? "active" : ""}><i>{step > i ? "✓" : i + 1}</i>{label}</span>)}
            </div>
          </>
        ) : (
          <div className="success-state">
            <span className="success-ring">✓</span>
            <p className="eyebrow">인증 완료</p>
            <h2>올바른 배출이 확인됐어요!</h2>
            <p>카메라와 투입 센서로 인증했어요. 포인트는 플로깅 거리만큼 적립됩니다.</p>
            <strong className="sensor-complete">센서 인증 완료</strong>
            <button className="primary-button" onClick={onComplete}>확인</button>
          </div>
        )}
      </div>
    </div>
  );
}

function AccountModal({ points, onClose }: { points: number; onClose: () => void }) {
  return (
    <div className="modal-backdrop">
      <div className="account-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="account-profile">
          <span>윤</span>
          <div><p>바다를 달리는 중</p><h2>윤바다 님</h2><small>부산 바로거 · 2026년 3월부터</small></div>
        </div>
        <div className="account-stats">
          <div><span>누적 거리</span><strong>128.6 km</strong></div>
          <div><span>활동 시간</span><strong>26시간 42분</strong></div>
          <div><span>보유 포인트</span><strong>{points.toLocaleString()} P</strong></div>
        </div>

        <section className="account-section">
          <div className="account-section-title"><h3>최근 활동 기록</h3><button>전체보기</button></div>
          <div className="account-activities">
            <article><b>5.4km</b><div><strong>해운대 해변 바로깅</strong><small>7월 28일 · 48분 · +54P</small></div></article>
            <article><b>3.2km</b><div><strong>동백섬 한 바퀴</strong><small>7월 27일 · 36분 · +32P</small></div></article>
            <article><b>4.8km</b><div><strong>광안리 야간 바로깅</strong><small>7월 25일 · 52분 · +48P</small></div></article>
          </div>
        </section>

        <section className="account-section privacy-section">
          <div className="account-section-title"><h3>개인정보</h3><button>수정</button></div>
          <dl>
            <div><dt>이름</dt><dd>윤바다</dd></div>
            <div><dt>휴대폰</dt><dd>010-****-2847</dd></div>
            <div><dt>이메일</dt><dd>bada***@email.com</dd></div>
            <div><dt>활동 지역</dt><dd>부산광역시</dd></div>
          </dl>
        </section>
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
}: {
  mode: Mode;
  onClose: () => void;
  groups: GroupData[];
  onToggleJoin: (id: number) => void;
  onCreateGroup: (group: Omit<GroupData, "id" | "joined" | "owned">) => void;
  onDeleteGroup: (id: number) => void;
}) {
  const [groupName, setGroupName] = useState("");
  const [groupPlace, setGroupPlace] = useState("");
  const [groupTime, setGroupTime] = useState("");
  const [groupMax, setGroupMax] = useState(10);

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
        <div className="live-preview"><span><i>거리</i><b>0.00 km</b></span><span><i>시간</i><b>00:00</b></span><span><i>걸음</i><b>0</b></span></div>
        <p className="distance-rule">달린 거리 × 10P · 1km부터 적립</p>
        <button className="primary-button" onClick={() => { alert("플로깅 기록을 시작했어요!"); onClose(); }}>기록 시작하기</button>
      </div>
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("plogging");
  const [points] = useState(6840);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [activityMode, setActivityMode] = useState<Mode | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [groups, setGroups] = useState<GroupData[]>(initialGroups);

  const completeScan = () => {
    setCameraOpen(false);
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

  return (
    <div className="site-shell">
      <div className="phone">
        <div className="statusbar"><span>9:41</span><div><i></i><i></i><b>▰</b></div></div>
        <Header points={points} onAccount={() => setAccountOpen(true)} />
        <div className="content">
          {tab === "plogging" && <PloggingScreen onStart={setActivityMode} />}
          {tab === "records" && <RecordsScreen />}
          {tab === "map" && <MapScreen onCamera={() => setCameraOpen(true)} />}
          {tab === "rewards" && <RewardsScreen points={points} onRedeem={() => alert("교환 신청이 완료됐어요!")} />}
        </div>
        <nav className="bottom-nav" aria-label="주요 메뉴">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setTab(item.id)} className={tab === item.id ? "active" : ""} aria-current={tab === item.id ? "page" : undefined}>
              <span>{item.icon}</span><small>{item.label}</small>
            </button>
          ))}
        </nav>
        {cameraOpen && <CameraModal onClose={() => setCameraOpen(false)} onComplete={completeScan} />}
        {accountOpen && <AccountModal points={points} onClose={() => setAccountOpen(false)} />}
        {activityMode && (
          <ActivityModal
            mode={activityMode}
            onClose={() => setActivityMode(null)}
            groups={groups}
            onToggleJoin={toggleJoin}
            onCreateGroup={createGroup}
            onDeleteGroup={deleteGroup}
          />
        )}
      </div>
    </div>
  );
}
