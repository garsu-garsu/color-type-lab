import { Button, TextButton, Top } from "@toss/tds-mobile";
import { useState } from "react";

import { QUESTIONS } from "../data/color";

interface Props {
  onDone: (sel: number[]) => void;
  onBack: () => void;
}

/** 6개 문항을 차례로 골라요. 다 고르면 결정적으로 퍼스널컬러 타입이 정해져요. */
export function QuizScreen({ onDone, onBack }: Props) {
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<number[]>([]);

  const question = QUESTIONS[step];

  const pick = (idx: number) => {
    const next = [...sel, idx];
    if (step + 1 >= QUESTIONS.length) {
      onDone(next);
      return;
    }
    setSel(next);
    setStep(step + 1);
  };

  return (
    <div style={{ paddingBottom: 32 }}>
      <Top
        title={<Top.TitleParagraph size={22}>{question.title}</Top.TitleParagraph>}
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>
            {`${step + 1} / ${QUESTIONS.length} · 가장 가까운 걸 골라요`}
          </Top.SubtitleParagraph>
        }
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: "20px 24px 0",
        }}
      >
        {question.options.map((opt, idx) => (
          <Button
            key={idx}
            size="large"
            display="full"
            variant="weak"
            onClick={() => pick(idx)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 18 }}>
        <TextButton size="medium" onClick={onBack}>
          그만두기
        </TextButton>
      </div>
    </div>
  );
}
