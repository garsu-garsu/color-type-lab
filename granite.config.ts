import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "color-type-lab",
  brand: {
    displayName: "퍼스널컬러 연구소", // 화면에 노출될 한글 앱 이름
    primaryColor: "#E8607D", // 로즈핑크 — 뷰티·컬러 무드
    icon: "https://static.toss.im/appsintoss/13203/1f4dff41-83e1-455e-b601-7030846bfe7f.png", // 배포 시 아이콘 이미지 주소
  },
  web: {
    host: "localhost",
    port: 5173,
    commands: {
      dev: "vite dev",
      build: "vite build",
    },
  },
  permissions: [],
  outdir: "dist",
  // 심사 반려(관상 셀프 분석): 네이티브 뒤로가기와 앱 자체 화면 이동이 겹쳐 보인다는
  // 지적을 받아 네이티브 뒤로가기를 껐어요. 화면 안의 버튼과 시스템 뒤로가기로 이동해요.
  navigationBar: { withBackButton: false, withHomeButton: false },
});
