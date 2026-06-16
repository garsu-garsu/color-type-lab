import { useCallback, useState } from "react";

import { isConsecutive, dayBefore } from "../lib/dateKey";

export interface ColorState {
  typeId: number | null; // 진단으로 저장한 내 퍼스널컬러 타입 (없으면 null)
  streak: { count: number; lastDateKey: string };
  daily: { dateKey: string; extraCount: number }; // 오늘 추가로 본 추천 수
  totalDays: number; // 누적 참여일 (등급용)
}

const KEY = "color:state";

const EMPTY: ColorState = {
  typeId: null,
  streak: { count: 0, lastDateKey: "" },
  daily: { dateKey: "", extraCount: 0 },
  totalDays: 0,
};

function load(): ColorState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<ColorState>;
    return {
      typeId: parsed.typeId ?? null,
      streak: parsed.streak ?? { count: 0, lastDateKey: "" },
      daily: parsed.daily ?? { dateKey: "", extraCount: 0 },
      totalDays: parsed.totalDays ?? 0,
    };
  } catch {
    return EMPTY;
  }
}

function save(state: ColorState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* 저장 실패 무시(시크릿 모드 등) */
  }
}

export function useColorState() {
  const [state, setState] = useState<ColorState>(() => load());

  const update = useCallback((next: ColorState) => {
    save(next);
    setState(next);
  }, []);

  /**
   * 진단 완료: 타입 저장 + 오늘 참여 기록을 한 번에 처리해요(단일 업데이트).
   * 타입 저장과 참여 기록을 따로 호출하면 같은 state 스냅샷을 두 번 덮어써 typeId 가 날아가요.
   */
  const diagnose = useCallback(
    (typeId: number, today: string): number => {
      const firstToday = state.daily.dateKey !== today;
      let { streak, daily, totalDays } = state;
      if (firstToday) {
        const count = isConsecutive(streak.lastDateKey, today)
          ? streak.count + 1
          : 1;
        streak = { count, lastDateKey: today };
        daily = { dateKey: today, extraCount: 0 };
        totalDays = totalDays + 1;
      }
      update({ ...state, typeId, streak, daily, totalDays });
      return streak.count;
    },
    [state, update],
  );

  /**
   * 오늘 참여(오늘의 추천 확인)를 기록해요.
   * 오늘 처음이면 연속 기록과 누적 참여일을 갱신하고, 오늘 추가 카운트를 초기화해요.
   */
  const touchDaily = useCallback(
    (today: string): number => {
      const firstToday = state.daily.dateKey !== today;
      if (!firstToday) return state.streak.count;

      const count = isConsecutive(state.streak.lastDateKey, today)
        ? state.streak.count + 1
        : 1;
      const next: ColorState = {
        ...state,
        streak: { count, lastDateKey: today },
        daily: { dateKey: today, extraCount: 0 },
        totalDays: state.totalDays + 1,
      };
      update(next);
      return count;
    },
    [state, update],
  );

  /** 광고 보고 오늘 추천 하나 더 본 뒤 호출 — 다음 추천 offset 을 1 늘려요. */
  const addExtra = useCallback(
    (today: string) => {
      const sameDay = state.daily.dateKey === today;
      update({
        ...state,
        daily: {
          dateKey: today,
          extraCount: (sameDay ? state.daily.extraCount : 0) + 1,
        },
      });
    },
    [state, update],
  );

  /** 연속 기록 끊김이 위험한 상태인지 (마지막 기록이 어제도 오늘도 아님 + 기록 있음) */
  const streakAtRisk = useCallback(
    (today: string): boolean => {
      const last = state.streak.lastDateKey;
      if (!last || state.streak.count <= 0) return false;
      if (last === today) return false;
      return !isConsecutive(last, today); // 어제가 아니면 위험
    },
    [state.streak],
  );

  /** 연속 기록 지키기(광고 보상 후): 마지막 기록일을 어제로 당겨 오늘 참여 시 이어지게 함 */
  const keepStreak = useCallback(
    (today: string) => {
      update({
        ...state,
        streak: { ...state.streak, lastDateKey: dayBefore(today) },
      });
    },
    [state, update],
  );

  return {
    state,
    diagnose,
    touchDaily,
    addExtra,
    streakAtRisk,
    keepStreak,
  };
}
