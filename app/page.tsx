"use client";

import { useEffect, useRef, useState } from "react";

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
        <span>바로깅</span>
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

function MapScreen({ onCamera }: { onCamera: () => void }) {
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
        <button className="primary-button" onClick={onCamera}><span>◉</span> 카메라로 배출 인증하기</button>
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
            <h2>{step === 0 ? "카메라로 배출을 인증해요" : step === 1 ? "배출 사진을 확인하고 있어요" : "센서와 무게를 확인 중이에요"}</h2>
            <p>{step === 0 ? "쓰레기를 수거함에 넣는 모습이 잘 보이게 촬영해 주세요." : step === 1 ? "올바른 배출 모습이 선명하게 촬영됐어요." : "센서가 1.8kg의 쓰레기를 감지했어요."}</p>
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

function ActivityModal({
  mode,
  onClose,
  joined,
  participantCount,
  onToggleJoin,
}: {
  mode: Mode;
  onClose: () => void;
  joined: boolean;
  participantCount: number;
  onToggleJoin: () => void;
}) {
  if (mode === "group") {
    return (
      <div className="modal-backdrop">
        <div className="activity-modal group-modal">
          <button className="modal-close" onClick={onClose}>×</button>
          <span className="activity-badge">같이 만드는 변화</span>
          <h2>함께 플로깅</h2>

          <article className="open-group">
            <div className="open-group-head">
              <div><span>모집 중</span><h3>광안리 아침 바로깅</h3></div>
              <strong>{participantCount}<small> / 10명</small></strong>
            </div>
            <p>⌖ 광안리 만남의 광장 · 7월 30일 오전 8:00</p>
            <button className={joined ? "cancel-join" : "join-button"} onClick={onToggleJoin}>
              {joined ? "참여 취소" : "참여하기"}
            </button>
          </article>

          <div className="form-divider"><span>새 그룹 만들기</span></div>
          <div className="group-form">
            <label>그룹 이름<input placeholder="예: 주말 바다 지킴이" aria-label="그룹 이름" /></label>
            <label>시작 지점<input placeholder="예: 해운대 중앙광장" aria-label="시작 지점" /></label>
            <div>
              <label>만나는 시간<input type="datetime-local" aria-label="만나는 시간" /></label>
              <label>인원 수<input type="number" min="2" max="50" defaultValue="10" aria-label="인원 수" /></label>
            </div>
          </div>
          <button className="primary-button" onClick={() => { alert("새 플로깅 그룹이 만들어졌어요!"); onClose(); }}>그룹 만들기</button>
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
        <button className="primary-button" onClick={() => { alert("플로깅 기록을 시작했어요!"); onClose(); }}>기록 시작하기</button>
      </div>
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("plogging");
  const [points, setPoints] = useState(6840);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [activityMode, setActivityMode] = useState<Mode | null>(null);
  const [joined, setJoined] = useState(false);
  const [participantCount, setParticipantCount] = useState(7);

  const completeScan = () => {
    setPoints((p) => p + 180);
    setCameraOpen(false);
    setTab("rewards");
  };

  const toggleJoin = () => {
    setJoined((current) => {
      setParticipantCount((count) => current ? Math.max(0, count - 1) : count + 1);
      return !current;
    });
  };

  return (
    <div className="site-shell">
      <div className="phone">
        <div className="statusbar"><span>9:41</span><div><i></i><i></i><b>▰</b></div></div>
        <Header points={points} />
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
        {activityMode && (
          <ActivityModal
            mode={activityMode}
            onClose={() => setActivityMode(null)}
            joined={joined}
            participantCount={participantCount}
            onToggleJoin={toggleJoin}
          />
        )}
      </div>
    </div>
  );
}
