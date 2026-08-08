import { getTossShareLink, share } from "@apps-in-toss/web-framework";

import { COLOR_TYPES } from "./color";
import { isInTossApp } from "../lib/tossEnv";

// getTossShareLink 는 "intoss://" 로 시작하는 딥링크만 받아요. "/" 를 넘기면 링크가
// 만들어지지 않고, 아래 catch 가 그걸 삼켜서 텍스트만 공유돼요(= 받은 사람이 들어올 길이 없음).
// apps-in-toss.config.ts 의 appName 과 같아야 해요.
const DEEP_LINK = "intoss://color-type-lab";
const OG_IMAGE =
  "https://static.toss.im/appsintoss/13203/1f4dff41-83e1-455e-b601-7030846bfe7f.png";

/**
 * 내 퍼스널컬러 진단 결과를 공유해요. (토스 공유 링크 + 메시지)
 * 받는 사람이 뭘 받았는지 바로 알도록 타입·베스트 컬러·앱 이름을 문구에 담아요.
 * 공유 시트가 정상적으로 뜨고 끝나면 true. 브라우저(둘러보기)에서는 개발 편의상 통과(true).
 */
export async function shareResult(typeId: number): Promise<boolean> {
  const type = COLOR_TYPES[typeId];
  const colors = type.bestColors
    .slice(0, 3)
    .map((c) => c.name)
    .join("·");
  const text = `내 퍼스널컬러는 ${type.emoji} ${type.name}!\n어울리는 색은 ${colors} 래요.\n너는 웜톤일까 쿨톤일까? 질문 6개면 나와요 👉 [퍼스널컬러 연구소]`;
  if (!isInTossApp()) return true; // 브라우저 개발 환경
  try {
    let link = "";
    try {
      link = await getTossShareLink(DEEP_LINK, OG_IMAGE);
    } catch {
      /* 링크 실패해도 텍스트만으로 공유 진행 */
    }
    const message = link !== "" ? `${text}\n${link}` : text;
    await share({ message });
    return true;
  } catch {
    return false;
  }
}
