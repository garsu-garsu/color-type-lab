import { closeView, graniteEvent } from "@apps-in-toss/web-framework";
import { Loader } from "@toss/tds-mobile";
import { useEffect, useRef, useState } from "react";

import "./App.css";
import { BannerAd, ImageBannerAd } from "./components/BannerAd";
import { HomeScreen } from "./screens/HomeScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { QuizScreen } from "./screens/QuizScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { TodayScreen } from "./screens/TodayScreen";
import { useAdGate } from "./hooks/useAdGate";
import { useColorState } from "./hooks/useColorState";
import { useInterstitialAd } from "./hooks/useInterstitialAd";
import { selectionToTypeId } from "./data/color";
import { getTodayKey } from "./lib/dateKey";
import { EVENT, track, trackScreen } from "./lib/analytics";

type View = "home" | "quiz" | "result" | "today";

const ONBOARDED_KEY = "color:onboarded";

function AppScreens() {
  const { state, diagnose, touchDaily, addExtra, streakAtRisk, keepStreak } =
    useColorState();
  const { watchThen } = useAdGate();
  const { maybeShow } = useInterstitialAd(3);

  const [today, setToday] = useState<string>("");
  // 첫 실행이면 소개 화면부터 — 한 번 보고 나면 다시 뜨지 않아요.
  const [onboarded, setOnboarded] = useState(
    () => localStorage.getItem(ONBOARDED_KEY) != null,
  );
  const [view, setView] = useState<View>("home");
  const [resultTypeId, setResultTypeId] = useState<number | null>(null);
  const [resultStreak, setResultStreak] = useState(0);
  // 현재 결과에서 광고로 해금한 섹션 키들 (결과마다 초기화)
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());

  // KST 오늘 날짜 키 로드
  useEffect(() => {
    let alive = true;
    void getTodayKey().then((k) => {
      if (alive) setToday(k);
    });
    return () => {
      alive = false;
    };
  }, []);

  // 최초 1회 게스트 가입 이벤트
  const signedRef = useRef(false);
  useEffect(() => {
    if (signedRef.current) return;
    signedRef.current = true;
    if (localStorage.getItem("color:signed") == null) {
      localStorage.setItem("color:signed", "1");
      track(EVENT.signup, { method: "guest" });
    }
  }, []);

  useEffect(() => {
    trackScreen(view);
  }, [view]);

  // 토스 네이티브 뒤로가기 → 홈이 아니면 홈으로, 홈이면 앱 닫기
  const viewRef = useRef(view);
  viewRef.current = view;
  useEffect(() => {
    try {
      return graniteEvent.addEventListener("backEvent", {
        onEvent: () => {
          if (viewRef.current !== "home") {
            setView("home");
          } else {
            try {
              closeView();
            } catch {
              /* 브라우저 무시 */
            }
          }
        },
      });
    } catch {
      return undefined;
    }
  }, []);

  // 우측 상단 닫기(홈) 버튼 — 어느 화면에 있든 앱을 닫아요.
  // backEvent 만 구독하면 이 버튼을 아무도 처리하지 않아 눌러도 안 닫혀요.
  useEffect(() => {
    try {
      return graniteEvent.addEventListener("homeEvent", {
        onEvent: () => {
          try {
            void closeView();
          } catch {
            /* 브라우저 등 미지원 환경 */
          }
        },
      });
    } catch {
      return undefined;
    }
  }, []);

  const onStartQuiz = () => setView("quiz");

  const onQuizDone = (sel: number[]) => {
    const typeId = selectionToTypeId(sel);
    const streak = diagnose(typeId, today); // 타입 저장 + 오늘 참여를 한 번에
    track(EVENT.colorDiagnosed, { type_id: typeId });
    setUnlocked(new Set());
    setResultTypeId(typeId);
    setResultStreak(streak);
    maybeShow(() => setView("result"), "result");
  };

  const onUnlock = (section: string) => {
    watchThen(() => {
      setUnlocked((prev) => {
        const next = new Set(prev);
        next.add(section);
        return next;
      });
      track(EVENT.sectionUnlocked, { section });
    }, section);
  };

  const onGoToday = () => {
    touchDaily(today); // 오늘의 추천 확인 = 오늘 참여
    track(EVENT.dailyPickViewed, { type_id: state.typeId ?? -1 });
    setView("today");
  };

  const onExtraPick = () =>
    watchThen(() => {
      addExtra(today);
      track(EVENT.extraPickRevealed, {
        type_id: state.typeId ?? -1,
        index: state.daily.extraCount + 1,
      });
    }, "extra_pick");

  const onKeepStreak = () => watchThen(() => keepStreak(today), "streak_save");

  if (today === "") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Loader />
      </div>
    );
  }

  if (!onboarded) {
    return (
      <OnboardingScreen
        onStart={() => {
          localStorage.setItem(ONBOARDED_KEY, "1");
          setOnboarded(true);
          // 홈을 한 번 더 거치지 않고 바로 첫 질문으로 — 소개는 남기고 중간 단계만 없애요.
          setView("quiz");
          trackScreen("onboarding_done");
        }}
      />
    );
  }

  if (view === "quiz") {
    return <QuizScreen onDone={onQuizDone} onBack={() => setView("home")} />;
  }

  if (view === "result" && resultTypeId != null) {
    return (
      <ResultScreen
        typeId={resultTypeId}
        streakCount={resultStreak}
        unlocked={unlocked}
        onUnlock={onUnlock}
        onGoToday={onGoToday}
        onHome={() => setView("home")}
      />
    );
  }

  if (view === "today" && state.typeId != null) {
    return (
      <TodayScreen
        typeId={state.typeId}
        today={today}
        extraCount={state.daily.dateKey === today ? state.daily.extraCount : 0}
        onExtra={onExtraPick}
        onHome={() => setView("home")}
      />
    );
  }

  return (
    <HomeScreen
      state={state}
      today={today}
      atRisk={streakAtRisk(today)}
      onStartQuiz={onStartQuiz}
      onGoToday={onGoToday}
      onKeepStreak={onKeepStreak}
    />
  );
}

export default function App() {
  return (
    <>
      <AppScreens />
      {/* 이미지 강조형 배너 — 본문(문서 스크롤)의 맨 끝. 공통 화면 틀이 없어서
          화면마다 넣는 대신 여기 한 곳에 둬요. 어느 화면이든 하나만 보여요. */}
      <div style={{ padding: "24px 20px 0" }}>
        <ImageBannerAd />
      </div>
      {/* 배너는 화면마다 두지 않고 여기 하나만 띄워요 — 한 화면에 배너는 하나입니다.
          가려짐은 #root 의 padding-bottom(App.css)으로 막아요. */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          background: "#FFFFFF",
          padding: "0 20px",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <BannerAd />
      </div>
    </>
  );
}
