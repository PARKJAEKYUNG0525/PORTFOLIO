export interface KV {
  k: string;
  v: string;
}

export interface PipelineStep {
  name: string;
  tool: string;
  lines: string[];
  mine: boolean;
}

export interface Pipeline {
  title: string;
  desc: string;
  steps: PipelineStep[];
}

export interface Task {
  t: string;
  d: string;
}

export interface Trouble {
  t: string;
  metric: string;
  p: string;
  s: string;
  r: string;
}

export interface Project {
  key: string;
  name: string;
  kind: string;
  kindEn: string;
  role: string;
  period: string;
  metric: string;
  metricLabel: string;
  summary: string;
  /** 상세 화면 · 영상 아래 프로젝트 소개 */
  intro: string;
  tags: string[];
  meta: KV[];
  problem: string;
  solution: string;
  flow: string;
  video?: string;
  pipelines?: Pipeline[];
  arch?: KV[];
  tasks: Task[];
  stack: KV[];
  troubles: Trouble[];
}

export const PROJECTS: Project[] = [
  {
    key: 'autune',
    name: 'AUTUNE',
    kind: '회의 인텔리전스',
    kindEn: 'MEETING INTELLIGENCE · TEAM PROJECT',
    role: '갭 탐지 모듈',
    period: '2026.09 — 10',
    metric: 'NLP + Graph + LLM Agent',
    metricLabel: 'spaCy · NetworkX PageRank · KURE-v1 · LangGraph',
    summary:
      '회의 녹음 하나로 할 일, 빠진 논의, 번복된 결정을 자동으로 찾아 Slack으로 알려주는 회의 인텔리전스 서비스.',
    tags: ['Next.js', 'FastAPI', 'spaCy', 'KURE-v1', 'NetworkX', 'Gemini API', 'LangGraph', 'PostgreSQL · pgvector', 'Slack API', 'Google Calendar', 'AWS'],
    meta: [
      { k: 'PERIOD', v: '2026.09.08 — 10.20' },
      { k: 'TEAM', v: '5명 · 1인 1모듈 풀스택' },
      { k: 'ROLE', v: '모듈 C 갭 탐지, 리포트 화면, Slack 연동' },
      { k: 'GITHUB', v: 'AI-X-16-1/AUTUNE' },
    ],
    intro:
      '회의 녹음을 대본으로 바꾸고 할 일 · 결정 추출, 빠진 논의 탐지, 과거 회의와의 맥락 연결을 거쳐 회의 등급과 주간 리포트까지 만드는 5개 모듈 서비스. 동의한 참석자의 발화만 분석하고 결과는 Slack 팀 채널로 전달. 그중 회의 유형별 팀 템플릿과 대조해 빠진 논의를 위험도 순으로 알리는 갭 탐지 모듈 담당.',
    problem: '회의가 끝나면 무엇을 정했고 무엇을 놓쳤는지 흐려집니다.',
    solution: '녹음에서 할 일, 빠진 논의, 번복된 결정을 찾아 팀에 알립니다. 동의한 참석자의 발화만 분석합니다.',
    flow: '음성 → 대본 → 할 일·결정 추출 → 누락 논의 탐지 → 회의 간 맥락 연결 → 인텔리전스, 5개 모듈 파이프라인',
    video: '/assets/autune-demo.mp4',
    pipelines: [
      {
        title: '모듈 파이프라인',
        desc: '5개 모듈을 1인 1모듈 풀스택으로 개발, 모듈 간 계약(GapReport.measured)으로 연동',
        steps: [
          { name: 'A · 음성 → 대본', tool: 'Whisper · pyannote 3.1', lines: ['hotwords로 용어 정확도 31% → 86%', '화자 분리 오류율 14%, 분리 후 원본 음성 즉시 삭제', '개인정보 마스킹 누락 28건 → 1건', '1초 침묵 기준 실시간 전사, 표시 7초 → 1.7초'], mine: false },
          { name: 'B · 할 일·결정 추출', tool: 'LLM + 규칙', lines: ['LLM으로 할 일 · 결정 분류', '담당자 · 기한은 규칙으로 채움', '사람이 확인한 항목만 내보냄'], mine: false },
          { name: 'C · 누락 논의 탐지', tool: 'MY PART', lines: ['spaCy 개체 추출 · 규칙 + LLM 관계 추출', 'NetworkX 토픽 그래프 — PageRank · 매개 중심성', 'KURE-v1 임베딩 + LLM으로 팀 템플릿 대조', '위험도 점수 계산 후 결과 전달'], mine: true },
          { name: 'D · 회의 간 맥락 연결', tool: 'KURE-v1 · BM25 · bge-reranker', lines: ['임베딩 + BM25로 과거 회의 후보 탐색', 'bge-reranker로 같은 안건 연결', 'LLM은 연결 확정 직전만, 안건당 1회 호출', 'NLI + 번복 단서로 결정 유지 · 수정 · 번복 판정'], mine: false },
          { name: 'E · 인텔리전스', tool: 'Dashboard', lines: ['B · C · D 결과 종합, 회의별 A~F 등급', '주간 리포트 생성', '재논의 가능성 높은 결정 예측'], mine: false },
          { name: 'Slack 알림', tool: 'Slack App', lines: ['갭 질문 · 리포트 전달'], mine: false },
        ],
      },
      {
        title: 'C · 갭 탐지 파이프라인',
        desc: '녹취록에서 토픽과 관계를 뽑아 그래프로 중요도를 계산하고, 팀 템플릿과 대조해 빠진 항목을 위험도 순으로 알린 뒤 후속 회의까지 제안',
        steps: [
          { name: '개체 추출', tool: 'spaCy ko_core_news_lg', lines: ['형태소 태그로 조사 유무 · 개수 판별', '조사 사전 + 받침 규칙으로 분리', '"리스크는" → 리스크'], mine: true },
          { name: '관계 추출', tool: '규칙 + LLM 보조', lines: ['의존 — 필요 · 있어야 · 없으면', '차단 — 때문에 · 막혀 · 안 잡', '대안 — 대신 · 말고 · vs', '애매한 쌍만 LLM 확인 후 DB 저장'], mine: true },
          { name: '토픽 그래프', tool: 'NetworkX', lines: ['토픽 = 노드, 관계 = 엣지', 'PageRank — 중요 토픽과 연결된 정도', '매개 중심성 — 토픽 사이를 잇는 정도', '발화 수로 보정, 최고점 1로 정규화'], mine: true },
          { name: '팀 템플릿 대조', tool: '회의 유형별 체크리스트', lines: ['가중치에 따라 충족 · 미흡 · 누락 판정', '성공 기준 · 담당자와 기한 0.9', '리스크 · 예외 처리 0.8', '의존성 · 다음 단계 0.7'], mine: true },
          { name: '발화 의미 인식', tool: 'KURE-v1 임베딩 → LLM', lines: ['템플릿 항목과 발화를 임베딩으로 대조', '단어가 아니라 뜻이 같은지 판단', '"제가 할게요"도 담당자 지정으로 인식', '애매한 구간만 LLM 확인'], mine: true },
          { name: '리스크 스코어링', tool: '누락 항목 우선순위', lines: ['위험도 = 0.4×체크리스트 가중치', '+ 0.4×논의 비중 부족 + 0.2×침묵 비율', '0.7↑ high · 0.5↑ medium'], mine: true },
          { name: '결과 전달', tool: 'GapReport', lines: ['누락 목록 · 위험도 · 추천 질문 → 모듈 E', 'Slack 팀 채널에 리포트 공유', '동의 없는 발화는 ‘측정 안 함’ (measured)'], mine: true },
          { name: '후속 회의 제안', tool: 'LangGraph Follow-up 서브에이전트', lines: ['미흡 · 미해결 항목을 담당자에게 Slack 질문', '팀장 승인 전에는 실행 안 함', '승인자 본인 캘린더에만 등록', '판단 → 승인 → 캘린더 · Slack'], mine: true },
        ],
      },
    ],
    arch: [
      { k: 'Client', v: '브라우저' },
      { k: 'Frontend', v: 'Next.js · 모듈별 화면' },
      { k: 'Backend', v: 'FastAPI · 모듈 A–E' },
      { k: 'Database', v: 'PostgreSQL · pgvector' },
      { k: 'External', v: 'Slack App · Google Calendar' },
      { k: 'Deploy', v: 'Docker 컨테이너 · 사내 유휴 PC 서버' },
    ],
    tasks: [
      { t: '갭 탐지 파이프라인', d: '개체·관계 추출, NetworkX PageRank 토픽 그래프, 팀 템플릿 대조, 리스크 스코어링 순으로 빠진 논의 탐지' },
      { t: '발화 의미 인식', d: 'KURE-v1 임베딩 1차 비교 후 애매한 구간(0.45–0.6)만 Gemini로 확인 — LLM 전송량 55% 감소' },
      { t: '후속 일정 에이전트', d: 'LangGraph로 후속 논의를 Slack Block Kit 카드로 제안, 승인 시 본인 Google 캘린더에 등록' },
      { t: '갭 리포트 화면 · Slack 앱', d: '담당 모듈의 리포트 UI 직접 개발, 팀 워크스페이스로 알림과 리포트 전송' },
    ],
    stack: [
      { k: 'Frontend', v: 'Next.js' },
      { k: 'Backend', v: 'FastAPI' },
      { k: 'AI', v: 'Gemini API, KURE-v1, spaCy, NetworkX PageRank' },
      { k: 'Agent', v: 'LangGraph' },
      { k: 'Database', v: 'PostgreSQL + pgvector' },
      { k: '연동', v: 'Slack App (Block Kit), Google Calendar' },
      { k: 'Deploy', v: 'Docker' },
    ],
    troubles: [
      {
        t: '한국어 조사 처리로 토픽 추출 정밀도 개선',
        metric: '0.67 → 0.89',
        p: '명사 토큰만 토픽 후보로 인정해 "리스크는", "일정은"처럼 조사가 붙은 핵심 단어가 누락. 첫 측정 정밀도 0.6667, 오탐 7건.',
        s: '형태소 태그는 조사 부착 여부 판단에만 쓰고, 실제 분리는 조사 목록 최장 일치로 처리. 구현 전 회귀 테스트 6개 작성.',
        r: '템플릿 수정 없이 추출 오탐 2건 → 0건, 정밀도 0.6667 → 0.7778 → 0.8889',
      },
      {
        t: '‘갭 없음’과 ‘측정 안 함’을 구분하는 모듈 간 계약',
        metric: 'GapReport.measured',
        p: '동의하지 않은 참석자의 발화가 제외되면서, 이미 합의한 내용이 ‘논의되지 않음’으로 잘못 보고될 위험.',
        s: '발화 수 기준 커버리지를 계산하고, 동의가 없으면 ‘측정하지 않음’으로 반환하도록 measured 필드를 담당자와 합의해 추가.',
        r: '거짓 갭 보고 차단, 하위 점수 집계 모듈로의 오류 전파 방지',
      },
      {
        t: '타인 캘린더에 쓰던 기능의 권한 재설계',
        metric: '최소 권한',
        p: '담당자 지정 질문 시 승인하지 않은 일정이 팀원 캘린더에 등록되는 구조 — 팀 리뷰에서 프라이버시 원칙 위반으로 판단.',
        s: '질문은 Slack 멘션으로 대체, ‘다음 회의 잡기’는 버튼을 누른 본인 캘린더에만 최소 OAuth scope로 등록. 갭 철회·만료 시 자동 삭제.',
        r: '문제 버전 즉시 롤백, 권한 범위를 축소한 수정 버전 배포',
      },
    ],
  },
  {
    key: 'happme',
    name: 'HAPP:ME',
    kind: '청년정책 매칭',
    kindEn: 'POLICY MATCHING · TEAM PROJECT',
    role: 'PM(팀장)',
    period: '2026.06 — 08',
    metric: 'Rule Engine + Parent-Child RAG + LLM',
    metricLabel: 'Docling · bge-m3 · FAISS / pgvector · LLM Rerank · RAGAS',
    summary:
      '부처와 지자체별로 흩어진 4,000여 건의 청년정책을 사용자 상황에 맞춰 찾아주는 Rule Engine + RAG 기반 서비스.',
    tags: ['React', 'FastAPI', 'bge-m3', 'FAISS', 'watsonx LLM', 'RAGAS', 'MySQL', 'AWS ECS'],
    meta: [
      { k: 'PERIOD', v: '2026.06.10 — 08.04' },
      { k: 'TEAM', v: '4명' },
      { k: 'ROLE', v: 'PM(팀장) · 상황매칭 · 맞춤정책 추천' },
      { k: 'SCALE', v: '청년정책 4,000여 건' },
    ],
    intro:
      '부처 · 지자체별로 흩어진 청년정책 4,000여 건을 한곳에서 찾는 정책 매칭 서비스. 상황을 문장으로 입력하면 Rule Engine이 8개 조건으로 자격을 거르고, RAG 검색과 LLM이 질문 의도에 맞는 정책을 골라 근거와 함께 안내. PDF 공고문 분석, 카카오맵 기반 지역 혜택 검색 제공. PM으로 팀을 이끌며 매칭 · 추천 파이프라인과 AWS 배포 담당.',
    problem: '자격 조건이 정책마다 제각각이라 받을 수 있는 혜택을 찾기 어렵습니다.',
    solution: '상황을 문장으로 입력받아 자격을 판정하고, 지금 신청 가능한 정책을 추천합니다.',
    flow: '상황 입력 → Rule Engine 8개 조건 → bge-m3 Top-10 → LLM 후보 선택 → 추천',
    video: '/assets/happme-demo.mp4',
    pipelines: [
      {
        title: '상황매칭 · 정책 Q&A',
        desc: 'Rule Engine으로 자격을 거르고, 임베딩 검색 후 LLM을 두 번 나눠 호출하는 Retrieve → Rerank → Generate 구조',
        steps: [
          { name: '상황 · 질문 입력', tool: 'Natural language', lines: ['사용자가 상황을 문장으로 입력'], mine: false },
          { name: 'Rule Engine', tool: '8개 조건 판정', lines: ['나이 · 소득 · 지역 · 취업 상태 등', '4,000여 건 정책 자격 필터링'], mine: true },
          { name: '유사도 검색', tool: 'bge-m3 + FAISS', lines: ['질문 임베딩 → 벡터 검색', '유사도 Top-10 후보 추출'], mine: true },
          { name: 'LLM 1차 · Rerank', tool: 'watsonx LLM', lines: ['후보의 정책명만 전달', '질문 의도에 맞는 1건 선택'], mine: true },
          { name: 'LLM 2차 · Generate', tool: 'watsonx LLM', lines: ['선택된 정책의 상세 정보만 컨텍스트로', '근거 기반 최종 답변 생성'], mine: true },
        ],
      },
      {
        title: 'PDF 공고문 분석',
        desc: '문자열 → 임베딩 → LLM 검증의 3단계 폴백으로, 애매한 구간에서만 LLM을 호출',
        steps: [
          { name: 'PDF 업로드', tool: 'Document', lines: ['정책 공고문 업로드'], mine: false },
          { name: 'OCR', tool: 'Text extraction', lines: ['텍스트 · 정책명 추출'], mine: false },
          { name: '정책명 직접 매칭', tool: 'String match', lines: ['DB 정책명과 문자열 비교'], mine: true },
          { name: 'bge-m3 재매칭', tool: 'Embedding fallback', lines: ['실패 시 임베딩 유사도로 폴백', 'top1이 임계값 이상이면 자동 확정'], mine: true },
          { name: 'LLM 검증', tool: 'Threshold + LLM', lines: ['후보 간 점수 차가 작은 모호 구간만', 'LLM이 최종 판정'], mine: true },
        ],
      },
      {
        title: 'RAG 인덱싱 · 검색',
        desc: 'MySQL 정책을 bge-m3로 임베딩해 .npy 캐시로 저장하고, 서버 기동 시 FAISS 인덱스를 구성해 재임베딩 없이 검색',
        steps: [
          { name: '정책 원천', tool: 'RDS MySQL', lines: ['청년정책 4,000여 건'], mine: false },
          { name: '임베딩', tool: 'bge-m3', lines: ['정책 텍스트 → 벡터'], mine: true },
          { name: '캐시 저장', tool: '.npy cache', lines: ['매번 재임베딩하지 않음'], mine: true },
          { name: 'FAISS 인덱스', tool: 'Vector index', lines: ['서버 기동 시 캐시 로드', '빠른 유사도 검색'], mine: true },
          { name: '품질 평가', tool: 'RAGAS', lines: ['Faithfulness — 환각 여부', 'Answer Relevancy — 질문 적합도', 'Context Precision · Recall', 'judge LLM 교차 검증'], mine: true },
        ],
      },
      {
        title: '개인 스터디 · parent-child 청킹 RAG',
        desc: '작은 청크(child)로 검색 정확도를, 상위 섹션(parent) 전달로 문맥 보존을 함께 확보 — 임베딩 · 검색 · parent 전달은 직접 구현',
        steps: [
          { name: '문서', tool: 'PDF · Word', lines: ['원본 문서 입력'], mine: false },
          { name: '마크다운 변환', tool: 'Docling', lines: ['문서 구조 보존 변환'], mine: true },
          { name: '섹션 분할 (parent)', tool: 'MarkdownHeaderTextSplitter', lines: ['헤더 기준 가장 작은 섹션'], mine: true },
          { name: '청크 분할 (child)', tool: 'RecursiveCharacterTextSplitter', lines: ['약 120자 재귀 청킹', '문단 → 줄바꿈 → 문장 → 띄어쓰기 순'], mine: true },
          { name: '저장', tool: 'PostgreSQL · pgvector', lines: ['child 벡터 + parent 원문'], mine: true },
          { name: '검색 · 답변', tool: 'child → parent → LLM', lines: ['child 유사도 검색', '연결된 parent 섹션을 문맥으로 전달'], mine: true },
        ],
      },
    ],
    arch: [
      { k: 'CDN · Frontend', v: 'CloudFront → S3 (React · Vite 빌드)' },
      { k: 'Load balancer', v: 'ALB' },
      { k: 'Backend', v: 'ECS Fargate · FastAPI (ECR 이미지)' },
      { k: 'Database', v: 'RDS MySQL · 청년정책 4,000여 건' },
      { k: 'AI server', v: 'GPU EC2 · 임베딩 · 문서분석 분리 운영' },
      { k: 'External', v: 'IBM watsonx LLM · Kakao Map API' },
    ],
    tasks: [
      { t: 'Rule Engine 설계', d: '나이, 소득, 지역, 취업 상태 등 8개 조건으로 4,000여 건 정책의 자격 판정 로직 구현' },
      { t: 'RAG 기반 상황매칭', d: 'bge-m3 임베딩 + FAISS 벡터 검색 + LLM을 잇는 2단계 파이프라인, .npy 캐시로 기동 시간 단축' },
      { t: 'LLM 활용 · 품질 평가', d: '소득 산정, 일정 추출, 요약 등 5개 기능에 LLM 적용, RAGAS 평가와 judge 교차검증' },
      { t: 'AWS 인프라 · 카카오맵', d: 'S3+CloudFront, ECR+ECS Fargate, RDS MySQL 배포 · 위치 기반 지역혜택 검색' },
    ],
    stack: [
      { k: 'Frontend', v: 'React, Vite' },
      { k: 'Backend', v: 'Python, FastAPI, SQLAlchemy' },
      { k: 'AI', v: 'watsonx LLM, bge-m3, FAISS, RAGAS' },
      { k: 'Database', v: 'MySQL' },
      { k: 'Deploy', v: 'S3 · CloudFront, ECR · ECS Fargate · ALB, RDS, GPU EC2' },
      { k: 'API', v: 'Kakao Map API' },
    ],
    troubles: [
      {
        t: '2단계 검색 구조로 정확도와 토큰 효율 개선',
        metric: 'Retrieve → Rerank → Generate',
        p: '임베딩 유사도 단일 검색으로는 의도와 어긋난 정책이 상위에 노출되고, 본문 일괄 주입 시 토큰이 늘고 무관한 정보가 섞임.',
        s: 'Top-10 후보의 정책명만 LLM에 전달해 1건을 재선택하고, 선택된 정책의 상세 정보만 컨텍스트로 최종 답변 생성.',
        r: '요청당 입력 토큰 감소, 질문 의도에 맞는 정책 선택 정확도 향상',
      },
      {
        t: '다단계 폴백으로 PDF 공고문 매칭',
        metric: '59% → 92%',
        p: 'PDF 정책명과 DB 정책명의 표기 차이로 문자열 매칭이 실패하고, 임계값 경계 구간에서는 정답 판별이 불가능.',
        s: '문자열 매칭 → bge-m3 임베딩 → LLM 검증의 3단계 폴백. 후보 간 점수 차가 작은 모호 구간에서만 LLM이 최종 판정.',
        r: '매칭 정확도 59% → 92%, LLM 호출을 모호 구간으로 한정해 비용 최소화',
      },
      {
        t: '후속 스터디 · parent-child 청킹 RAG',
        metric: 'Docling · pgvector',
        p: '청크가 작으면 문맥이 부족하고, 크면 무관한 내용이 섞이는 트레이드오프.',
        s: 'Docling으로 마크다운 변환 후 헤더 기준 섹션(parent)과 120자 청크(child)로 분할, child로 검색하고 parent를 LLM에 전달.',
        r: '작은 청크로 검색 정확도를, parent 전달로 문맥 보존을 함께 확보',
      },
    ],
  },
  {
    key: 'cardn',
    name: 'CARD:N',
    kind: '명함 인맥 관리',
    kindEn: 'RELATIONSHIP MEMORY · TEAM PROJECT',
    role: 'STT · LLM 요약',
    period: '2026.08 — 09',
    metric: 'STT + OCR + LLM',
    metricLabel: 'Whisper turbo · PaddleOCR · Gemini JSON Schema',
    summary: '명함 정보와 대화 기록, 관계도를 한곳에 모아 다음 만남에서 바로 꺼내 볼 수 있게 돕는 인맥 관리 서비스.',
    tags: ['React', 'FastAPI', 'Whisper turbo', 'ffmpeg', 'Gemini API', 'MySQL'],
    meta: [
      { k: 'PERIOD', v: '2026.08.21 — 09.21' },
      { k: 'TEAM', v: '5명' },
      { k: 'ROLE', v: '음성 대화 분석 (STT · LLM 요약)' },
      { k: 'GITHUB', v: 'AI-X-16-1/CARD-N' },
    ],
    intro:
      '명함을 촬영해 인물을 등록하고, 그 사람과 나눈 대화를 녹음하면 요약과 후속 할 일까지 인물 기록에 연결하는 인맥 관리 서비스. 다음 만남 전에 명함 정보, 지난 대화, 관계도를 한 화면에서 확인. 대화 녹음을 텍스트로 바꾸고 Gemini로 관심사 · 주제 · 후속 할 일을 추출하는 음성 대화 분석 파트 담당.',
    problem: '명함은 쌓이는데 “이 사람과 무슨 이야기를 했는지”는 남지 않습니다.',
    solution: '명함 정보 · 대화 기록 · 관계도를 한곳에 모아 다음 만남에서 바로 조회합니다.',
    flow: '명함 촬영 → 인물 등록 → 대화 녹음(STT) → 요약 · 핵심 추출 → 인물 기록 연결',
    video: '/assets/cardn-demo.mp4',
    tasks: [
      { t: 'STT 모델 선정 · 검증', d: '브라우저 테스트 앱으로 Whisper 계열을 비교해 large-v3-turbo 채택 (한국어 정확도 약 95%)' },
      { t: '음성 → 텍스트 파이프라인', d: '포맷 변환, 16kHz 리샘플링, 무음 정리 후 청크 단위 순차 처리' },
      { t: 'LLM 대화 요약 · 스키마 설계', d: 'Gemini로 관심사, 주제, 후속 할 일 추출. JSON 스키마 고정과 근거 없는 항목 생성 제한' },
      { t: '인물 기록 연동 API', d: '요약 결과를 명함 속 인물 프로필에 연결해 다음 만남에 바로 조회' },
    ],
    stack: [
      { k: 'Frontend', v: 'React' },
      { k: 'Backend', v: 'Python, FastAPI' },
      { k: 'AI', v: 'Whisper large-v3-turbo, Gemini API, PaddleOCR' },
      { k: 'Audio', v: 'ffmpeg' },
      { k: 'Database', v: 'MySQL, Graph DB' },
    ],
    troubles: [
      {
        t: 'STT 추론 지연 단축',
        metric: 'RTF < 0.4',
        p: 'Whisper large 계열의 추론 지연으로 대화가 끝난 뒤 결과 확인까지 대기 시간 발생.',
        s: '디코더 레이어를 줄인 large-v3-turbo로 교체, ffmpeg 16kHz 모노 리샘플링과 무음 제거 후 청크 분할, 모델은 기동 시 1회만 로딩.',
        r: '53초 오디오를 10초대에 처리, 한국어 정확도 약 95% 유지',
      },
      {
        t: '구어체 입력의 요약 환각 억제',
        metric: 'JSON Schema',
        p: '필러와 끊긴 문장이 많은 STT 결과를 넣으면 호출마다 형식이 달라지고 원문에 없는 내용이 생성됨.',
        s: 'summary · interests · topics · follow_ups 필드로 스키마를 고정하고, 근거 없는 항목은 빈 값을 반환하도록 제약.',
        r: '별도 후처리 없이 인물 프로필 API에 바로 저장, 요약 일관성 확보',
      },
    ],
  },
];
