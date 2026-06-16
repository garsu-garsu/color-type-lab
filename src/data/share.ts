import { getTossShareLink, share } from "@apps-in-toss/web-framework";

import { isInTossApp } from "../lib/tossEnv";

/**
 * 내 퍼스널컬러 진단 결과를 공유해요. (토스 공유 링크 + 메시지)
 * 공유 시트가 정상적으로 뜨고 끝나면 true. 브라우저(둘러보기)에서는 개발 편의상 통과(true).
 */
export async function shareResult(typeLabel: string): Promise<boolean> {
  const text = `내 퍼스널컬러는 "${typeLabel}" 🎨 너의 퍼스널컬러는? [퍼스널컬러 연구소]`;
  if (!isInTossApp()) return true; // 브라우저 개발 환경
  try {
    let link = "";
    try {
      link = await getTossShareLink("/");
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
