import { Button, TextButton, Top, useToast } from "@toss/tds-mobile";

import { BannerAd } from "../components/BannerAd";
import { canRequestNotifyConsent, requestNotifyConsent } from "../data/notify";
import { EVENT, track } from "../lib/analytics";
import { COLOR_TYPES, rankOf } from "../data/color";
import type { ColorState } from "../hooks/useColorState";

interface Props {
  state: ColorState;
  atRisk: boolean;
  onStartQuiz: () => void; // 진단 시작 / 다시 진단
  onGoToday: () => void; // 오늘의 추천 색 보기
  onKeepStreak: () => void; // 광고 보고 연속 기록 지키기
}

const PRIMARY = "#E8607D";
const TEXT = "#2E2730";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ flex: 1, textAlign: "center" }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: TEXT }}>{value}</div>
      <div style={{ fontSize: 12, color: "#A899A1", marginTop: 2 }}>{label}</div>
    </div>
  );
}

export function HomeScreen({
  state,
  atRisk,
  onStartQuiz,
  onGoToday,
  onKeepStreak,
}: Props) {
  const toast = useToast();
  const rank = rankOf(state.totalDays);
  const myType = state.typeId != null ? COLOR_TYPES[state.typeId] : null;

  const onNotify = async () => {
    const r = await requestNotifyConsent();
    if (r != null) {
      track(EVENT.notifyConsent, { result: r });
      if (r !== "agreementRejected") toast.openToast("매일 알림을 받아요!");
    }
  };

  return (
    <div style={{ paddingBottom: 32 }}>
      <Top
        title={<Top.TitleParagraph size={28}>퍼스널컬러 연구소</Top.TitleParagraph>}
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>
            나에게 어울리는 색을 찾고, 매일 추천받아요
          </Top.SubtitleParagraph>
        }
      />

      <div style={{ padding: "8px 20px 0" }}>
        {myType == null ? (
          /* 아직 진단 전 — 진단 유도 */
          <>
            <div
              style={{
                marginTop: 8,
                background: "linear-gradient(160deg, #FFF1F5 0%, #FCE0E8 100%)",
                borderRadius: 20,
                padding: "32px 20px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 52 }}>🎨</div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: TEXT,
                  marginTop: 10,
                }}
              >
                내 퍼스널컬러는 무슨 타입일까?
              </div>
              <div
                style={{ fontSize: 14, color: "#7A6A72", marginTop: 8, lineHeight: 1.6 }}
              >
                6가지 질문으로 알아보는 나만의 컬러 타입
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <Button size="large" display="full" onClick={onStartQuiz}>
                내 퍼스널컬러 진단하기
              </Button>
            </div>
          </>
        ) : (
          /* 진단 완료 — 내 타입 + 오늘의 추천 */
          <>
            <div
              style={{
                display: "flex",
                background: "#FBEEF2",
                borderRadius: 16,
                padding: "16px 8px",
              }}
            >
              <Stat label="등급" value={rank.emoji} />
              <Stat label="연속 기록" value={`${state.streak.count}일`} />
              <Stat label="내 타입" value={myType.emoji} />
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: 13,
                color: PRIMARY,
                fontWeight: 700,
                marginTop: 8,
              }}
            >
              {rank.label}
            </div>

            {atRisk && (
              <div
                style={{
                  marginTop: 16,
                  background: "#FFF1F4",
                  borderRadius: 14,
                  padding: "14px 16px",
                }}
              >
                <div style={{ fontSize: 14, color: "#8A2B47", marginBottom: 10 }}>
                  😢 연속 기록이 끊길 위기예요. 지금 지킬 수 있어요.
                </div>
                <Button variant="weak" display="full" onClick={onKeepStreak}>
                  📺 광고 보고 연속 기록 지키기
                </Button>
              </div>
            )}

            {/* 내 타입 카드 */}
            <div
              style={{
                marginTop: 16,
                textAlign: "center",
                background: "linear-gradient(160deg, #FFF1F5 0%, #FCE0E8 100%)",
                borderRadius: 16,
                padding: "20px",
              }}
            >
              <div style={{ fontSize: 13, color: "#A899A1" }}>내 퍼스널컬러</div>
              <div style={{ fontSize: 44, marginTop: 4 }}>{myType.emoji}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: TEXT }}>
                {myType.name}
              </div>
              <div style={{ fontSize: 13, color: "#7A6A72", marginTop: 6 }}>
                {myType.oneLiner}
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <Button size="large" display="full" onClick={onGoToday}>
                오늘의 추천 색 보기
              </Button>
            </div>
            <div style={{ marginTop: 12 }}>
              <Button
                variant="weak"
                size="large"
                display="full"
                onClick={onStartQuiz}
              >
                다시 진단하기
              </Button>
            </div>
          </>
        )}

        {canRequestNotifyConsent() && (
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <TextButton size="medium" onClick={onNotify}>
              매일 알림 받기
            </TextButton>
          </div>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <BannerAd slot="home" />
      </div>
    </div>
  );
}
