import { Button, Top } from "@toss/tds-mobile";

interface Props {
  onStart: () => void;
}

const TEXT = "#2E2730";
const SUB = "#7A6A72";

const STEPS = [
  {
    emoji: "🎨",
    title: "6가지 질문에 답해요",
    body: "혈관 색·어울리는 액세서리처럼 쉬운 질문이에요. 고른 답에 따라 타입이 정해져요(랜덤 아님).",
  },
  {
    emoji: "🌈",
    title: "내 타입과 베스트 컬러를 봐요",
    body: "봄·여름·가을·겨울 4가지 톤 중 하나가 나와요. 광고를 보면 상세 코디와 피하면 좋은 색까지 열려요.",
  },
  {
    emoji: "🔥",
    title: "매일 추천 색을 받아요",
    body: "타입을 저장하면 매일 어울리는 색이 새로 도착해요. 매일 확인하면 연속 기록과 등급이 올라가요.",
  },
];

/** 첫 실행에 한 번만 보여주는 소개 화면. */
export function OnboardingScreen({ onStart }: Props) {
  return (
    <div style={{ paddingBottom: 32 }}>
      <Top
        title={
          <Top.TitleParagraph size={26}>퍼스널컬러 연구소</Top.TitleParagraph>
        }
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>
            나에게 어울리는 색을 찾고, 매일 추천받아요
          </Top.SubtitleParagraph>
        }
      />

      <div style={{ padding: "8px 20px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {STEPS.map((s) => (
            <div
              key={s.title}
              style={{
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                background: "#FBEEF2",
                borderRadius: 16,
                padding: "16px 18px",
              }}
            >
              <div style={{ fontSize: 28, lineHeight: 1.2 }}>{s.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>
                  {s.title}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: SUB,
                    marginTop: 4,
                  }}
                >
                  {s.body}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 22 }}>
          <Button size="xlarge" display="full" onClick={onStart}>
            시작하기
          </Button>
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
          재미로 보는 퍼스널컬러 진단 콘텐츠예요. 의학적 진단이 아니에요.
          <br />
          모든 보상은 앱 내 가상 보상이에요.
        </div>
      </div>
    </div>
  );
}
