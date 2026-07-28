"use client";

import { useEffect, useState } from "react";

type Tab = "plogging" | "records" | "map" | "rewards";
type Mode = "solo" | "group";

const navItems: { id: Tab; icon: string; label: string }[] = [
  { id: "plogging", icon: "⌁", label: "플로깅" },
  { id: "records", icon: "↗", label: "기록" },
  { id: "map", icon: "⌖", label: "쓰레기통" },
  { id: "rewards", icon: "◆", label: "리워드" },
];

const soloRank = [
  { rank: 1, name: "바다지킴이", amount: "38.4 kg", avatar: "민", color: "#fd8d68" },
  { rank: 2, name: "푸른파도", amount: "32.1 kg", avatar: "윤", color: "#6e9df5" },
  { rank: 3, name: "조개소년", amount: "28.7 kg", avatar: "준", color: "#f1bd55" },
];

const groupRank = [
  { rank: 1, name: "해운대 어벤져스", amount: "126.8 kg", avatar: "해", color: "#fd8d68" },
  { rank: 2, name: "파도 타는 사람들", amount: "109.2 kg", avatar: "파", color: "#6e9df5" },
  { rank: 3, name: "블루 클린업", amount: "94.5 kg", avatar: "블", color: "#69bf91" },
];

function Header({ points }: { points: number }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">〰</span>
        <span>파도줍</span>
      </div>
      <button className="point-pill" aria-label="내 포인트">
        <span>◆</span> {points.toLocaleString()} P
      </button>
      <button className="avatar" aria-label="내 프로필">윤</button>
    </header>
  );
}

function PloggingScreen({ onStart }: { onStart: (mode: Mode) => void }) {
  return (
    <main className="screen plogging-screen">
      <section className="welcome">
        <p className="eyebrow">오늘도 바다를 가볍게</p>
        <h1>어떻게 주울까요?</h1>
        <p>걸을수록 깨끗해지고, 주울수록 포인트가 쌓여요.</p>
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
          <h2>쓰레기 수거 랭킹</h2>
          <div className="segmented">
            <button className={ranking === "group" ? "active" : ""} onClick={() => setRanking("group")}>그룹</button>
            <button className={ranking === "solo" ? "active" : ""} onClick={() => setRanking("solo")}>개인</button>
          </div>
        </div>
        <div className="rank-list">
          {ranks.map((item) => (
            <div className="rank-item" key={item.rank}>
              <b>{item.rank}</b>
              <span className="rank-avatar" style={{ background: item.color }}>{item.avatar}</span>
              <div><strong>{item.name}</strong><small>{item.rank === 1 ? "이번 주 최고 기록" : "꾸준히 줍는 중"}</small></div>
              <em>{item.amount}</em>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block route-section">
        <div className="section-head"><h2>추천 플로깅 코스</h2><button className="text-button">전체보기</button></div>
        <article className="route-card">
          <div className="route-map">
            <span className="route-line">⌁⌁⌁⌁</span>
            <i className="pin p1">●</i><i className="pin p2">◆</i><i className="pin p3">●</i>
          </div>
          <div className="route-info">
            <span className="route-tag">지금 인기</span>
            <h3>동백섬 바다 한 바퀴</h3>
            <p>3.2km · 약 48분 · 스마트 쓰레기통 3개</p>
            <div><span>♡ 248</span><button onClick={() => alert("코스 공유 링크가 복사되었어요!")}>코스 공유 ↗</button></div>
          </div>
        </article>
      </section>
    </main>
  );
}

function MapScreen({ onScan }: { onScan: () => void }) {
  const [selected, setSelected] = useState(1);
  const bins = [
    { id: 1, name: "해운대 중앙광장", distance: "120m", fill: "32%", status: "여유" },
    { id: 2, name: "동백섬 입구", distance: "380m", fill: "71%", status: "보통" },
    { id: 3, name: "미포 산책로", distance: "620m", fill: "18%", status: "여유" },
  ];
  const bin = bins.find((b) => b.id === selected)!;
  return (
    <main className="screen map-screen">
      <section className="map-head">
        <div><p className="eyebrow">내 주변 스마트 수거함</p><h1>가까운 쓰레기통</h1></div>
        <button className="locate-button" aria-label="현재 위치">◎</button>
      </section>
      <div className="map-search"><span>⌕</span><input aria-label="장소 검색" placeholder="해변이나 장소를 검색해보세요" /></div>
      <section className="map-canvas">
        <div className="ocean-label">HAEUNDAE<br /><small>BEACH</small></div>
        <span className="road r1"></span><span className="road r2"></span><span className="road r3"></span>
        <span className="park park1"></span><span className="park park2"></span>
        {bins.map((b, i) => (
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
        <button className="primary-button" onClick={onScan}><span>▣</span> QR 스캔하고 투입구 열기</button>
      </section>
    </main>
  );
}

function RewardsScreen({ points, onRedeem }: { points: number; onRedeem: () => void }) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <main className="screen rewards-screen">
      <section className="reward-hero">
        <p>나의 바다 포인트</p>
        <h1>{points.toLocaleString()} <small>P</small></h1>
        <span>이번 달 +1,240 P</span>
        <div className="wave-balance"></div>
      </section>
      <section className="attendance">
        <div className="section-head">
          <div><span className="streak-icon">♨</span><h2>7일 연속 출석</h2></div>
          <strong>7월 <button aria-label="월 변경">⌄</button></strong>
        </div>
        <p>한 달 20일을 채우면 <b>500P 보너스!</b></p>
        <div className="calendar-labels">{["월", "화", "수", "목", "금", "토", "일"].map(d => <span key={d}>{d}</span>)}</div>
        <div className="calendar">
          {days.map((day) => <span key={day} className={day <= 12 ? "checked" : day === 28 ? "today" : ""}>{day <= 12 ? "✓" : day}</span>)}
        </div>
        <div className="attendance-progress"><span></span></div>
        <small>12 / 20일 달성</small>
      </section>
      <section className="reward-shop">
        <div className="section-head"><h2>포인트로 바꿔요</h2><button className="text-button">이용내역</button></div>
        <div className="coupon-row">
          <article><span className="coupon-icon coffee">♨</span><p>카페 음료 쿠폰</p><strong>3,000 P</strong><button onClick={onRedeem}>교환하기</button></article>
          <article><span className="coupon-icon bag">▱</span><p>친환경 마켓 쿠폰</p><strong>5,000 P</strong><button onClick={onRedeem}>교환하기</button></article>
        </div>
      </section>
      <section className="point-history">
        <div><span className="history-icon">♲</span><p><strong>스마트 수거함 인증</strong><small>오늘 · 해운대 중앙광장</small></p><b>+180 P</b></div>
        <div><span className="history-icon">⌁</span><p><strong>플로깅 활동 완료</strong><small>어제 · 동백섬 코스</small></p><b>+320 P</b></div>
      </section>
    </main>
  );
}

function ScanModal({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timers = [900, 1900, 3000].map((delay, index) => setTimeout(() => setStep(index + 1), delay));
    return () => timers.forEach(clearTimeout);
  }, []);
  return (
    <div className="modal-backdrop">
      <div className="scan-modal">
        {step < 3 ? (
          <>
            <button className="modal-close" onClick={onClose}>×</button>
            <span className={`scanner ${step > 0 ? "opened" : ""}`}><i></i><b>▣</b></span>
            <p className="eyebrow">SMART BIN #H12</p>
            <h2>{step === 0 ? "QR 코드를 확인하고 있어요" : step === 1 ? "투입구가 열렸어요!" : "무게와 투입을 확인 중이에요"}</h2>
            <p>{step === 1 ? "쓰레기를 넣어주세요." : step === 2 ? "센서가 1.8kg의 쓰레기를 감지했어요." : "카메라를 QR 코드에 맞춰주세요."}</p>
            <div className="scan-steps">
              {["QR 확인", "투입구 개방", "센서 인증"].map((label, i) => <span key={label} className={step >= i ? "active" : ""}><i>{step > i ? "✓" : i + 1}</i>{label}</span>)}
            </div>
          </>
        ) : (
          <div className="success-state">
            <span className="success-ring">✓</span>
            <p className="eyebrow">인증 완료</p>
            <h2>바다가 1.8kg 가벼워졌어요!</h2>
            <p>올바른 배출이 확인되어 포인트를 지급했어요.</p>
            <strong>+180 P</strong>
            <button className="primary-button" onClick={onComplete}>포인트 확인하기</button>
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityModal({ mode, onClose }: { mode: Mode; onClose: () => void }) {
  return (
    <div className="modal-backdrop">
      <div className="activity-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <span className="activity-badge">{mode === "solo" ? "나만의 페이스" : "같이 만드는 변화"}</span>
        <h2>{mode === "solo" ? "혼자 플로깅" : "함께 플로깅"}</h2>
        <p>{mode === "solo" ? "현재 위치에서 바로 기록을 시작할까요?" : "새 그룹을 만들거나 초대 코드로 참여해보세요."}</p>
        {mode === "group" && <input className="group-input" placeholder="그룹 이름을 입력하세요" aria-label="그룹 이름" />}
        <div className="live-preview"><span><i>거리</i><b>0.00 km</b></span><span><i>시간</i><b>00:00</b></span><span><i>걸음</i><b>0</b></span></div>
        <button className="primary-button" onClick={() => { alert(mode === "solo" ? "플로깅 기록을 시작했어요!" : "그룹이 만들어졌어요!"); onClose(); }}>{mode === "solo" ? "기록 시작하기" : "그룹 만들기"}</button>
      </div>
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("plogging");
  const [points, setPoints] = useState(6840);
  const [scanOpen, setScanOpen] = useState(false);
  const [activityMode, setActivityMode] = useState<Mode | null>(null);

  const completeScan = () => {
    setPoints((p) => p + 180);
    setScanOpen(false);
    setTab("rewards");
  };

  return (
    <div className="site-shell">
      <div className="phone">
        <div className="statusbar"><span>9:41</span><div><i></i><i></i><b>▰</b></div></div>
        <Header points={points} />
        <div className="content">
          {tab === "plogging" && <PloggingScreen onStart={setActivityMode} />}
          {tab === "records" && <RecordsScreen />}
          {tab === "map" && <MapScreen onScan={() => setScanOpen(true)} />}
          {tab === "rewards" && <RewardsScreen points={points} onRedeem={() => alert("교환 신청이 완료됐어요!")} />}
        </div>
        <nav className="bottom-nav" aria-label="주요 메뉴">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setTab(item.id)} className={tab === item.id ? "active" : ""} aria-current={tab === item.id ? "page" : undefined}>
              <span>{item.icon}</span><small>{item.label}</small>
            </button>
          ))}
        </nav>
        {scanOpen && <ScanModal onClose={() => setScanOpen(false)} onComplete={completeScan} />}
        {activityMode && <ActivityModal mode={activityMode} onClose={() => setActivityMode(null)} />}
      </div>
    </div>
  );
}
