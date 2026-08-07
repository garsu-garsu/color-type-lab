// 그로스 변경 검증. 실행: npm run check:color
// 홈에 "오늘의 추천 색"을 미리 보여주게 되면서, 홈과 오늘 화면이 같은 값을 써야 해요.
// 어긋나면 홈에서 본 색과 눌러서 들어간 색이 달라 사용자가 바로 알아채요.
import assert from "node:assert/strict";

import {
  COLOR_TYPES,
  QUESTIONS,
  dailyPickCount,
  dailyPickFor,
  selectionToTypeId,
} from "../src/data/color.ts";

// 1) 검색 표기 — 사람들은 "봄 웜톤"이 아니라 "봄웜톤"으로 검색해요.
const NAMES = ["봄웜톤", "가을웜톤", "여름쿨톤", "겨울쿨톤"];
COLOR_TYPES.forEach((t, i) => {
  assert.equal(t.name, NAMES[i], `타입 ${i} 이름이 검색 표기와 달라요`);
  assert.ok(!t.name.includes(" "), `"${t.name}" 에 띄어쓰기가 들어갔어요`);
});

// 2) 진단 매핑 — 소개 화면을 걷어내면서 문항 흐름을 건드렸으니 결과가 그대로인지 확인.
//    Q1~4 = 웜/쿨, Q5~6 = 라이트/딥. option index 0 = 웜 또는 라이트.
const allWarm = [0, 0, 0, 0];
const allCool = [1, 1, 1, 1];
assert.equal(selectionToTypeId([...allWarm, 0, 0]), 0, "웜+라이트 → 봄웜톤");
assert.equal(selectionToTypeId([...allWarm, 1, 1]), 1, "웜+딥 → 가을웜톤");
assert.equal(selectionToTypeId([...allCool, 0, 0]), 2, "쿨+라이트 → 여름쿨톤");
assert.equal(selectionToTypeId([...allCool, 1, 1]), 3, "쿨+딥 → 겨울쿨톤");
assert.equal(QUESTIONS.length, 6, "문항 수가 바뀌면 위 조합도 같이 고쳐야 해요");

// 3) 홈 미리보기 == 오늘 화면 첫 장. 홈은 offset 없이, 오늘 화면은 i=0 으로 부르니 같아야 해요.
for (const t of COLOR_TYPES) {
  for (const day of ["2026-08-07", "2026-08-08", "2026-12-31", "2027-01-01"]) {
    assert.deepEqual(
      dailyPickFor(t.key, day),
      dailyPickFor(t.key, day, 0),
      `${t.name} ${day}: 홈 미리보기와 오늘 화면 첫 장이 달라요`,
    );
  }
  // 날짜가 바뀌면 추천도 바뀌어야 "내일 또 열 이유"가 성립해요.
  assert.notDeepEqual(
    dailyPickFor(t.key, "2026-08-07"),
    dailyPickFor(t.key, "2026-08-08"),
    `${t.name}: 하루가 지나도 추천 색이 그대로예요`,
  );
  assert.ok(dailyPickCount(t.key) >= 2, `${t.name}: 추천 풀이 너무 적어요`);
}

console.log("✅ color-check 통과");
