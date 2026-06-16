// 퍼스널컬러 연구소 — 코어 데이터 (전부 비게임: 6개 문항 "선택" → 결정적 퍼스널컬러 타입 "진단/추천")
// ⚠️ 사행성/랜덤 0: 고른 답 조합이 "결정적으로" 4타입 중 하나에 매핑돼요(아래 selectionToTypeId).
// ⚠️ 재미로 보는 진단 콘텐츠예요 — 의학적·단정적 진단이 아니에요.

export interface QuizOption {
  label: string;
  /** 웜/쿨 축 가중치: +1 웜 · -1 쿨 · 0 중립 */
  warm: number;
  /** 라이트/딥 축 가중치: +1 딥(진함) · -1 라이트(밝음) · 0 중립 */
  deep: number;
}

export interface Question {
  key: string;
  title: string;
  options: QuizOption[];
}

// Q1~4 = 웜/쿨 축, Q5~6 = 라이트/딥 축
export const QUESTIONS: Question[] = [
  {
    key: "vein",
    title: "손목 안쪽 혈관은 어떤 색에 가까운가요?",
    options: [
      { label: "초록빛이 돈다", warm: 1, deep: 0 },
      { label: "푸른빛·보라빛이 돈다", warm: -1, deep: 0 },
      { label: "잘 모르겠다 / 둘 다", warm: 0, deep: 0 },
    ],
  },
  {
    key: "metal",
    title: "금속 액세서리는 어떤 게 더 잘 어울리나요?",
    options: [
      { label: "골드(금색)", warm: 1, deep: 0 },
      { label: "실버(은색)", warm: -1, deep: 0 },
    ],
  },
  {
    key: "sun",
    title: "햇볕에 오래 있으면 피부가 어떻게 되나요?",
    options: [
      { label: "갈색으로 잘 그을린다", warm: 1, deep: 0 },
      { label: "빨개졌다가 원래대로 돌아온다", warm: -1, deep: 0 },
    ],
  },
  {
    key: "cloth",
    title: "얼굴이 더 화사해 보이는 옷 색은?",
    options: [
      { label: "아이보리·베이지·카멜", warm: 1, deep: 0 },
      { label: "순백·네이비·회색", warm: -1, deep: 0 },
    ],
  },
  {
    key: "vivid",
    title: "잘 어울린다는 말을 듣는 색의 느낌은?",
    options: [
      { label: "밝고 부드러운 파스텔", warm: 0, deep: -1 },
      { label: "진하고 선명한 원색", warm: 0, deep: 1 },
    ],
  },
  {
    key: "hair",
    title: "머리·눈동자 색은 어떤 편인가요?",
    options: [
      { label: "밝은 갈색 계열", warm: 0, deep: -1 },
      { label: "어둡고 진한 검정 계열", warm: 0, deep: 1 },
    ],
  },
];

export interface ColorChip {
  hex: string;
  name: string;
}

export interface ColorType {
  id: number; // 0~3
  key: "spring" | "autumn" | "summer" | "winter";
  emoji: string;
  name: string; // "봄 웜톤"
  oneLiner: string;
  summary: string; // 무료 공개
  bestColors: ColorChip[]; // 무료 공개 (베스트 컬러 4)
  styleTip: string; // 광고 보고 해금 — 상세 코디(메이크업·헤어·패션)
  avoidColors: ColorChip[]; // 광고 보고 해금 — 피해야 할 색 3
}

export const COLOR_TYPES: ColorType[] = [
  {
    id: 0,
    key: "spring",
    emoji: "🌸",
    name: "봄 웜톤",
    oneLiner: "화사하고 생기 넘치는 따뜻한 컬러",
    summary:
      "맑고 밝은 색이 얼굴을 환하게 밝혀주는 타입이에요. 따뜻하면서도 가벼운 컬러가 생기를 더해 어려 보이고 화사한 인상을 줘요. 코랄과 피치처럼 화사한 색에서 가장 빛나요.",
    bestColors: [
      { hex: "#FF6F61", name: "코랄" },
      { hex: "#FFB997", name: "피치" },
      { hex: "#FFE066", name: "라이트옐로우" },
      { hex: "#A7D676", name: "애플그린" },
    ],
    styleTip:
      "메이크업은 코랄·피치 계열 블러셔와 립이 생기를 살려줘요. 헤어는 밝은 갈색·애시브라운이 잘 어울리고, 패션은 아이보리·라이트베이지 바탕에 비비드 포인트 컬러를 더하면 화사해요.",
    avoidColors: [
      { hex: "#5A1A2B", name: "다크버건디" },
      { hex: "#6E6E6E", name: "칙칙한 그레이" },
      { hex: "#1A1A1A", name: "블랙" },
    ],
  },
  {
    id: 1,
    key: "autumn",
    emoji: "🍂",
    name: "가을 웜톤",
    oneLiner: "깊고 그윽한 어스 톤의 따뜻한 컬러",
    summary:
      "깊고 따뜻한 어스 톤이 분위기를 완성해주는 타입이에요. 차분하면서 고급스러운 색이 피부를 안정감 있게 받쳐줘 그윽하고 성숙한 매력을 살려줘요. 카멜과 올리브 같은 색이 잘 어울려요.",
    bestColors: [
      { hex: "#D9A038", name: "머스타드" },
      { hex: "#B5733A", name: "카멜" },
      { hex: "#6E7B3D", name: "올리브" },
      { hex: "#B5462F", name: "벽돌" },
    ],
    styleTip:
      "메이크업은 브릭·테라코타 립과 브라운 섀도가 그윽함을 살려줘요. 헤어는 다크브라운·초콜릿이 안정적이고, 패션은 카멜·올리브·머스타드의 어스 톤이 분위기를 완성해요.",
    avoidColors: [
      { hex: "#FF4FA3", name: "형광 핑크" },
      { hex: "#BFC7D1", name: "실버그레이" },
      { hex: "#BFE0F5", name: "파스텔블루" },
    ],
  },
  {
    id: 2,
    key: "summer",
    emoji: "💧",
    name: "여름 쿨톤",
    oneLiner: "부드럽고 시원한 우아한 쿨 컬러",
    summary:
      "부드럽고 시원한 색이 우아함을 더해주는 타입이에요. 채도가 낮은 파스텔과 쿨 톤이 피부를 맑고 투명하게 보이게 해줘요. 라벤더와 로즈핑크처럼 은은한 색에서 가장 빛나요.",
    bestColors: [
      { hex: "#B7A6E0", name: "라벤더" },
      { hex: "#9DC3E6", name: "파우더블루" },
      { hex: "#E8A0BC", name: "로즈핑크" },
      { hex: "#9BD4C4", name: "민트" },
    ],
    styleTip:
      "메이크업은 로즈·모브 핑크 립과 라벤더 섀도가 부드러움을 살려줘요. 헤어는 애시브라운·라벤더 계열이 잘 맞고, 패션은 파스텔·소프트 그레이로 시원하고 우아하게 연출돼요.",
    avoidColors: [
      { hex: "#C9912B", name: "머스타드" },
      { hex: "#FF7A1A", name: "오렌지" },
      { hex: "#B5733A", name: "카멜" },
    ],
  },
  {
    id: 3,
    key: "winter",
    emoji: "❄️",
    name: "겨울 쿨톤",
    oneLiner: "선명하고 도시적인 카리스마 쿨 컬러",
    summary:
      "선명하고 대비가 강한 색을 멋지게 소화하는 타입이에요. 또렷한 컬러가 이목구비를 살려 도시적이고 시크한 인상을 완성해줘요. 퓨어 화이트와 로열 블루처럼 분명한 색에서 가장 빛나요.",
    bestColors: [
      { hex: "#2E5BD4", name: "로열블루" },
      { hex: "#D6266F", name: "푸시아" },
      { hex: "#EDF1F7", name: "퓨어화이트" },
      { hex: "#7A1F3D", name: "버건디" },
    ],
    styleTip:
      "메이크업은 푸시아·레드 립과 또렷한 아이라인이 카리스마를 살려줘요. 헤어는 블랙·다크애시가 선명함을 받쳐주고, 패션은 화이트·네이비·블랙의 대비가 도시적인 무드를 완성해요.",
    avoidColors: [
      { hex: "#D8C6A8", name: "흐린 베이지" },
      { hex: "#7A7A4E", name: "카키" },
      { hex: "#FFC9A3", name: "살구" },
    ],
  },
];

export const TOTAL_TYPES = COLOR_TYPES.length;

/**
 * 선택(각 옵션 index)을 받아 퍼스널컬러 타입 id 를 "결정적"으로 계산해요.
 * warm 합(Q1~4) ≥ 0 → 웜, deep 합(Q5~6) ≥ 0 → 딥.
 * 웜+라이트=봄(0) · 웜+딥=가을(1) · 쿨+라이트=여름(2) · 쿨+딥=겨울(3). 랜덤 없음.
 */
export function selectionToTypeId(sel: number[]): number {
  let warm = 0;
  let deep = 0;
  QUESTIONS.forEach((q, i) => {
    const opt = q.options[sel[i] ?? 0];
    if (opt) {
      warm += opt.warm;
      deep += opt.deep;
    }
  });
  const isWarm = warm >= 0;
  const isDeep = deep >= 0;
  if (isWarm) return isDeep ? 1 : 0; // 가을 : 봄
  return isDeep ? 3 : 2; // 겨울 : 여름
}

export interface DailyPick {
  hex: string;
  colorName: string;
  tip: string; // 오늘의 코디 팁
}

// 타입별 "오늘의 추천 색" 풀 — 날짜로 회전(콘텐츠 회전, 랜덤 아님)
export const DAILY_PICKS: Record<ColorType["key"], DailyPick[]> = {
  spring: [
    { hex: "#FF6F61", colorName: "코랄", tip: "오늘은 코랄 립 하나로 생기를 더해보세요. 화사한 인상이 살아나요." },
    { hex: "#FFB997", colorName: "피치", tip: "피치 톤 니트나 블러셔로 부드럽고 화사한 분위기를 연출해보세요." },
    { hex: "#FFE066", colorName: "라이트옐로우", tip: "밝은 옐로우 포인트가 오늘 기분까지 환하게 만들어줘요." },
    { hex: "#A7D676", colorName: "애플그린", tip: "싱그러운 연두 컬러 아이템으로 봄 같은 생기를 더해보세요." },
    { hex: "#FFA8C5", colorName: "라이트로즈", tip: "맑은 로즈 핑크로 사랑스러운 무드를 완성해보세요." },
    { hex: "#7FD1C4", colorName: "라이트민트", tip: "시원한 민트 포인트가 화사한 봄 톤과 잘 어울려요." },
  ],
  autumn: [
    { hex: "#D9A038", colorName: "머스타드", tip: "머스타드 컬러 아이템으로 그윽하고 고급스러운 분위기를 더해보세요." },
    { hex: "#B5733A", colorName: "카멜", tip: "카멜 코트나 니트는 가을 웜톤의 시그니처예요. 오늘 활용해보세요." },
    { hex: "#6E7B3D", colorName: "올리브", tip: "올리브 그린으로 차분하면서 세련된 무드를 연출해보세요." },
    { hex: "#B5462F", colorName: "벽돌", tip: "벽돌빛 테라코타 립이나 의상으로 깊은 매력을 살려보세요." },
    { hex: "#8C5A2B", colorName: "초콜릿브라운", tip: "초콜릿 브라운 톤이 오늘 당신을 안정감 있게 받쳐줘요." },
    { hex: "#C8923D", colorName: "골드", tip: "은은한 골드 액세서리가 웜톤 피부를 더 화사하게 만들어줘요." },
  ],
  summer: [
    { hex: "#B7A6E0", colorName: "라벤더", tip: "라벤더 컬러로 부드럽고 우아한 분위기를 연출해보세요." },
    { hex: "#9DC3E6", colorName: "파우더블루", tip: "은은한 파우더 블루가 피부를 맑고 시원하게 보이게 해줘요." },
    { hex: "#E8A0BC", colorName: "로즈핑크", tip: "로즈 핑크 립으로 화사하면서 부드러운 무드를 완성해보세요." },
    { hex: "#9BD4C4", colorName: "민트", tip: "소프트 민트 포인트가 여름 쿨톤의 청량함을 살려줘요." },
    { hex: "#C9BBE0", colorName: "모브", tip: "모브 톤 섀도나 의상으로 은은하고 세련된 매력을 더해보세요." },
    { hex: "#A8B8D8", colorName: "블루그레이", tip: "차분한 블루 그레이가 오늘 우아한 분위기를 완성해줘요." },
  ],
  winter: [
    { hex: "#2E5BD4", colorName: "로열블루", tip: "선명한 로열 블루로 또렷하고 도시적인 인상을 연출해보세요." },
    { hex: "#D6266F", colorName: "푸시아", tip: "푸시아 핑크 립 하나로 카리스마 있는 무드를 완성해보세요." },
    { hex: "#EDF1F7", colorName: "퓨어화이트", tip: "깨끗한 화이트가 겨울 쿨톤의 이목구비를 또렷하게 살려줘요." },
    { hex: "#7A1F3D", colorName: "버건디", tip: "딥 버건디로 시크하고 강렬한 매력을 더해보세요." },
    { hex: "#1A1A1A", colorName: "블랙", tip: "선명한 블랙 앤 화이트 대비로 도시적인 시크함을 연출해보세요." },
    { hex: "#157A6E", colorName: "에메랄드", tip: "또렷한 에메랄드 그린이 쿨톤 피부를 더 돋보이게 해줘요." },
  ],
};

/** dateKey(YYYY-MM-DD)를 안정적인 정수 해시로 — 오늘의 추천을 결정적으로 고르기 위함 */
export function dateHash(dateKey: string): number {
  let h = 0;
  for (let i = 0; i < dateKey.length; i++) {
    h = (h * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** 타입 + 오늘 날짜 + offset(추가로 본 개수) → 결정적 추천 1개 */
export function dailyPickFor(
  typeKey: ColorType["key"],
  dateKey: string,
  offset = 0,
): DailyPick {
  const pool = DAILY_PICKS[typeKey];
  const idx = (dateHash(dateKey) + offset) % pool.length;
  return pool[idx];
}

export interface Rank {
  label: string;
  emoji: string;
  min: number; // 누적 참여일 하한
}

export const RANKS: Rank[] = [
  { label: "컬러 입문", emoji: "🌱", min: 0 },
  { label: "컬러 탐색가", emoji: "🔍", min: 3 },
  { label: "컬러 분석가", emoji: "🎨", min: 7 },
  { label: "컬러 전문가", emoji: "💎", min: 14 },
  { label: "컬러 마스터", emoji: "👑", min: 30 },
];

export function rankOf(totalDays: number): Rank {
  let r = RANKS[0];
  for (const rank of RANKS) if (totalDays >= rank.min) r = rank;
  return r;
}
