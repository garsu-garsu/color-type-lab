import { Button, TextButton, Top } from "@toss/tds-mobile";

import { BannerAd } from "../components/BannerAd";
import { COLOR_TYPES, dailyPickCount, dailyPickFor } from "../data/color";

interface Props {
  typeId: number;
  today: string;
  extraCount: number; // 광고로 추가로 본 추천 수 (offset)
  onExtra: () => void; // 광고 보고 추천 하나 더
  onHome: () => void;
}

const TEXT = "#2E2730";
const SUB = "#7A6A72";

/** 저장된 내 타입 기준, 오늘의 추천 색·코디를 보여줘요(매일 회전). 광고로 하나 더 볼 수 있어요. */
export function TodayScreen({ typeId, today, extraCount, onExtra, onHome }: Props) {
  const type = COLOR_TYPES[typeId];

  // 오늘 기본 추천 + 광고로 해금한 추가 추천들.
  // 풀 개수를 넘기면 첫 추천이 그대로 다시 나오니 거기서 멈춰요.
  const total = dailyPickCount(type.key);
  const shown = Math.min(extraCount, total - 1);
  const picks = [];
  for (let i = 0; i <= shown; i++) {
    picks.push(dailyPickFor(type.key, today, i));
  }
  const exhausted = shown >= total - 1;

  return (
    <div style={{ paddingBottom: 32 }}>
      <Top
        title={<Top.TitleParagraph size={22}>오늘의 추천 색</Top.TitleParagraph>}
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>
            {`${type.emoji} ${type.name} · 오늘 어울리는 컬러`}
          </Top.SubtitleParagraph>
        }
      />

      <div style={{ padding: "8px 20px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {picks.map((pick, i) => (
            <div
              key={i}
              style={{
                background: "#FBEEF2",
                borderRadius: 18,
                padding: "18px",
                display: "flex",
                gap: 16,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: pick.hex,
                  border: "1px solid rgba(0,0,0,0.06)",
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: TEXT }}>
                  {pick.colorName}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: SUB,
                    marginTop: 4,
                  }}
                >
                  {pick.tip}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 광고 보고 추천 하나 더 — 오늘 볼 게 남았을 때만 */}
        <div style={{ marginTop: 16 }}>
          {exhausted ? (
            <div
              style={{
                textAlign: "center",
                fontSize: 14,
                color: SUB,
                lineHeight: 1.6,
              }}
            >
              오늘 추천 {total}개를 모두 봤어요. 내일 새로 바뀌어요.
            </div>
          ) : (
            <Button variant="weak" size="large" display="full" onClick={onExtra}>
              📺 광고 보고 오늘 추천 하나 더
            </Button>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 14 }}>
          <TextButton size="medium" onClick={onHome}>
            홈으로
          </TextButton>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 18,
            fontSize: 12,
            color: "#B5A6AE",
            lineHeight: 1.6,
          }}
        >
          추천 색은 매일 바뀌어요. 모든 보상은 앱 내 가상 보상이에요.
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <BannerAd slot="today" />
      </div>
    </div>
  );
}
