import { Button, TextButton, Top, useToast } from "@toss/tds-mobile";

import { BannerAd } from "../components/BannerAd";
import { canRequestNotifyConsent, requestNotifyConsent } from "../data/notify";
import { shareResult } from "../data/share";
import { EVENT, track } from "../lib/analytics";
import { COLOR_TYPES, dailyPickFor, rankOf } from "../data/color";
import type { ColorState } from "../hooks/useColorState";

interface Props {
  state: ColorState;
  today: string; // KST 오늘 날짜 키 — 오늘의 추천 색 미리보기에 사용
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
  today,
  atRisk,
  onStartQuiz,
  onGoToday,
  onKeepStreak,
}: Props) {
  const toast = useToast();
  const rank = rankOf(state.totalDays);
  const myType = state.typeId != null ? COLOR_TYPES[state.typeId] : null;
  // 오늘의 추천 색 첫 장 — 오늘의 추천 화면과 같은 값이라 홈에서 미리 보여줘도 어긋나지 않아요.
  const todayPick = myType != null ? dailyPickFor(myType.key, today) : null;

  const onShare = async () => {
    if (state.typeId == null) return;
    const ok = await shareResult(state.typeId);
    if (ok) {
      track(EVENT.shareCompleted, { context: "home" });
      toast.openToast("공유했어요!");
    }
  };

  const onNotify = async () => {
    const r = await requestNotifyConsent();
    if (r != null) {
      track(EVENT.notifyConsent, { result: r });
      if (r !== "agreementRejected") toast.openToast("매일 알림을 받아요!");
    }
  };

  return (
    <div style={{ paddingBottom: 32 }}>
      {/* 앱 이름은 토스 상단 바가 이미 보여줘요. 여기서 또 쓰면 헤더가 겹쳐 보여
          "자체 헤더 중복"으로 심사 반려돼요. 대신 무엇을 얻는지를 적어요. */}
      <Top
        title={<Top.TitleParagraph size={28}>퍼스널컬러 진단</Top.TitleParagraph>}
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>
            퍼스널컬러 진단부터 매일 어울리는 추천 색까지
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
                나는 웜톤일까, 쿨톤일까?
              </div>
              <div
                style={{ fontSize: 14, color: "#7A6A72", marginTop: 8, lineHeight: 1.6 }}
              >
                봄웜톤·여름쿨톤·가을웜톤·겨울쿨톤 중 내 타입은?
                <br />
                질문 6개면 나와요.
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

            {/* 오늘의 추천 색 미리보기 — 매일 바뀌는 걸 홈 첫 화면에서 바로 보여줘야
                다시 열 이유가 돼요. 이미 아는 내 타입 카드보다 위에 둬요. */}
            {todayPick != null && (
              <div
                style={{
                  marginTop: 16,
                  background: "#FBEEF2",
                  borderRadius: 16,
                  padding: "16px 18px",
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: todayPick.hex,
                    border: "1px solid rgba(0,0,0,0.06)",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontSize: 12, color: "#A899A1" }}>
                    오늘 어울리는 색
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: TEXT }}>
                    {todayPick.colorName}
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: 12 }}>
              <Button size="large" display="full" onClick={onGoToday}>
                오늘의 코디 팁 보기
              </Button>
            </div>

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

        {/* 결과 화면을 다시 보지 않는 재방문자에게도 공유 동선을 열어둬요. */}
        {myType != null && (
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <TextButton size="medium" onClick={onShare}>
              친구에게 내 컬러 공유하기
            </TextButton>
          </div>
        )}

        {canRequestNotifyConsent() && (
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <TextButton size="medium" onClick={onNotify}>
              매일 아침 추천 색 알림 받기
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
