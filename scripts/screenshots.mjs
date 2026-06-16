// 퍼스널컬러 연구소 — 전체 화면 스크린샷 (Playwright)
// 진단 → 결과(광고 해금) → 오늘의 추천 → 홈(타입 저장됨) 플로우를 한 번 돌려 캡처해요.
// 사전조건: dev 서버(http://localhost:5173) 실행. 광고/Supabase 키 없이도 흐름이 안 끊겨요.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:5173/";
const OUT = "screenshots";
mkdirSync(OUT, { recursive: true });

const VIEWPORT = { width: 390, height: 844 };
let n = 0;

async function shot(page, name) {
  n += 1;
  const file = `${OUT}/${String(n).padStart(2, "0")}-${name}.png`;
  await page.waitForTimeout(450);
  await page.screenshot({ path: file });
  console.log("📸", file);
}

/** 활성화된 버튼/요소 클릭 (비활성 버튼은 제외) */
async function tap(page, text) {
  const btn = page
    .getByRole("button", { name: text })
    .and(page.locator(":not([disabled])"))
    .first();
  if (await btn.count()) {
    await btn.click();
    return;
  }
  await page.getByText(text, { exact: false }).first().click();
}

async function waitText(page, text, timeout = 15000) {
  await page.getByText(text, { exact: false }).first().waitFor({ timeout });
}

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();

// ── 홈 (진단 전) ──
await page.goto(BASE, { waitUntil: "networkidle" });
await waitText(page, "퍼스널컬러 연구소");
await shot(page, "home-intro"); // 01

// ── 진단 시작 → 6문항 (봄 웜톤: 웜 답 + 라이트 답) ──
await tap(page, "내 퍼스널컬러 진단하기");
await waitText(page, "손목 안쪽 혈관");
await shot(page, "quiz"); // 02
await tap(page, "초록빛이 돈다"); // Q1 warm
await tap(page, "골드"); // Q2 warm
await tap(page, "갈색으로 잘 그을린다"); // Q3 warm
await tap(page, "아이보리"); // Q4 warm
await tap(page, "밝고 부드러운 파스텔"); // Q5 light
await tap(page, "밝은 갈색 계열"); // Q6 light → 봄 웜톤

// ── 결과 ──
await waitText(page, "내 퍼스널컬러가 나왔어요");
await shot(page, "result"); // 03

// ── 광고로 상세 섹션 해금 (브라우저는 즉시 통과) ──
await tap(page, "코디 분석 열기");
await waitText(page, "메이크업");
await tap(page, "피할 색 열기");
await page.waitForTimeout(300);
await shot(page, "result-unlocked"); // 04

// ── 오늘의 추천 ──
await tap(page, "오늘의 추천 색 보기");
await waitText(page, "오늘의 추천 색");
await shot(page, "today"); // 05
await tap(page, "오늘 추천 하나 더");
await page.waitForTimeout(400);
await shot(page, "today-extra"); // 06

// ── 홈 (타입 저장됨) ──
await tap(page, "홈으로");
await waitText(page, "내 퍼스널컬러");
await shot(page, "home"); // 07

await browser.close();
console.log(`\n✅ 완료: ${n}장 → ${OUT}/`);
