import { Button, TextButton, Top, useToast } from "@toss/tds-mobile";

import { BannerAd } from "../components/BannerAd";
import { shareResult } from "../data/share";
import { EVENT, track } from "../lib/analytics";
import { COLOR_TYPES, type ColorChip } from "../data/color";

interface Props {
  typeId: number;
  streakCount: number;
  unlocked: Set<string>; // 광고로 해금한 섹션 키
  onUnlock: (section: string) => void;
  onGoToday: () => void; // 오늘의 추천 보러가기
  onHome: () => void;
}

const TEXT = "#2E2730";
const SUB = "#7A6A72";

function Swatch({ chip, size = 52 }: { chip: ColorChip; size?: number }) {
  return (
    <div style={{ textAlign: "center", width: size + 8 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 14,
          background: chip.hex,
          border: "1px solid rgba(0,0,0,0.06)",
          margin: "0 auto",
        }}
      />
      <div style={{ fontSize: 11, color: SUB, marginTop: 6 }}>{chip.name}</div>
    </div>
  );
}

export function ResultScreen({
  typeId,
  streakCount,
  unlocked,
  onUnlock,
  onGoToday,
  onHome,
}: Props) {
  const toast = useToast();
  const type = COLOR_TYPES[typeId];

  const onShare = async () => {
    const ok = await shareResult(`${type.emoji} ${type.name}`);
    if (ok) {
      track(EVENT.shareCompleted, { context: "result" });
      toast.openToast("공유했어요!");
    }
  };

  const styleOpen = unlocked.has("style");
  const avoidOpen = unlocked.has("avoid");

  return (
    <div style={{ paddingBottom: 32 }}>
      <Top
        title={
          <Top.TitleParagraph size={22}>
            내 퍼스널컬러가 나왔어요
          </Top.TitleParagraph>
        }
      />

      <div style={{ padding: "8px 20px 0" }}>
        {/* 결과 카드 */}
        <div
          style={{
            background: "linear-gradient(160deg, #FFF1F5 0%, #FCE0E8 100%)",
            borderRadius: 20,
            padding: "28px 20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 64, lineHeight: 1.1 }}>{type.emoji}</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: TEXT }}>
            {type.name}
          </div>
          <div style={{ fontSize: 15, color: SUB, marginTop: 8 }}>
            {type.oneLiner}
          </div>
        </div>

        {/* 총평 (무료) */}
        <div
          style={{
            marginTop: 16,
            background: "#FBEEF2",
            borderRadius: 16,
            padding: "16px 18px",
            fontSize: 15,
            lineHeight: 1.7,
            color: TEXT,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>총평</div>
          {type.summary}
        </div>

        {/* 베스트 컬러 (무료) */}
        <div
          style={{
            marginTop: 12,
            background: "#FBEEF2",
            borderRadius: 16,
            padding: "16px 18px",
          }}
        >
          <div style={{ fontWeight: 700, color: TEXT, fontSize: 15, marginBottom: 14 }}>
            🎨 나에게 어울리는 베스트 컬러
          </div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {type.bestColors.map((c) => (
              <Swatch key={c.name} chip={c} />
            ))}
          </div>
        </div>

        {/* 상세 코디 분석 — 광고 해금 */}
        <div
          style={{
            marginTop: 12,
            background: styleOpen ? "#FFF6F9" : "#FBEEF2",
            border: styleOpen ? "1px solid #F3D6E0" : "1px solid transparent",
            borderRadius: 16,
            padding: "16px 18px",
          }}
        >
          <div style={{ fontWeight: 700, color: TEXT, fontSize: 15 }}>
            💄 상세 코디 분석 (메이크업·헤어·패션)
          </div>
          {styleOpen ? (
            <div style={{ marginTop: 8, fontSize: 15, lineHeight: 1.7, color: TEXT }}>
              {type.styleTip}
            </div>
          ) : (
            <div style={{ marginTop: 10 }}>
              <Button
                size="medium"
                variant="weak"
                display="full"
                onClick={() => onUnlock("style")}
              >
                📺 광고 보고 코디 분석 열기
              </Button>
            </div>
          )}
        </div>

        {/* 피해야 할 색 — 광고 해금 */}
        <div
          style={{
            marginTop: 12,
            background: avoidOpen ? "#FFF6F9" : "#FBEEF2",
            border: avoidOpen ? "1px solid #F3D6E0" : "1px solid transparent",
            borderRadius: 16,
            padding: "16px 18px",
          }}
        >
          <div style={{ fontWeight: 700, color: TEXT, fontSize: 15 }}>
            🚫 피하면 좋은 색
          </div>
          {avoidOpen ? (
            <div
              style={{
                marginTop: 14,
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              {type.avoidColors.map((c) => (
                <Swatch key={c.name} chip={c} />
              ))}
            </div>
          ) : (
            <div style={{ marginTop: 10 }}>
              <Button
                size="medium"
                variant="weak"
                display="full"
                onClick={() => onUnlock("avoid")}
              >
                📺 광고 보고 피할 색 열기
              </Button>
            </div>
          )}
        </div>

        {/* 연속 기록 */}
        <div style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: SUB }}>
          🔥 연속 기록 {streakCount}일째
        </div>

        {/* 액션 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginTop: 16,
          }}
        >
          <Button size="large" display="full" onClick={onGoToday}>
            오늘의 추천 색 보기
          </Button>
          <Button variant="weak" display="full" onClick={onShare}>
            결과 공유하기
          </Button>
          <div style={{ textAlign: "center" }}>
            <TextButton size="medium" onClick={onHome}>
              홈으로
            </TextButton>
          </div>
        </div>

        {/* 면책 */}
        <div
          style={{
            textAlign: "center",
            marginTop: 18,
            fontSize: 12,
            color: "#B5A6AE",
            lineHeight: 1.6,
          }}
        >
          재미로 보는 퍼스널컬러 진단 콘텐츠예요. 모든 보상은 앱 내 가상 보상이에요.
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <BannerAd slot="result" />
      </div>
    </div>
  );
}
