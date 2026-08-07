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
  navigationBar: { withBackButton: true, withHomeButton: false },
});
