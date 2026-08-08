import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "color-type-lab",
  brand: {
    primaryColor: "#E8607D", // 로즈핑크 — 뷰티·컬러 무드
  },
  permissions: [],
  webBundleDir: "dist",
  navigationBar: {
    // 앱인토스 비게임 표준 내비게이션 바 — 좌측 뒤로가기는 모든 화면에서 동작해야 해요.
    // 끄면 "표준 내비게이션 바 미적용"으로 심사 반려돼요.
    withBackButton: true,
    withHomeButton: false,
  },
});
