export const PROFILE = {
  name: '박재경',
  nameEn: 'Park Jaekyung',
  role: 'AI Engineer · Backend Developer',
  tagline: 'LLM · RAG 파이프라인부터 백엔드 · 배포까지, 서비스 전 과정을 만든 개발자',
  intro: 'Agent·RAG 설계부터 백엔드, AWS 배포까지 — 서비스의 전 과정을 직접 만들어 온 AI 서비스 개발자 박재경입니다.',
};

export const COMPETENCIES = [
  { no: '01', title: 'AI 에이전트 · LLM', desc: 'LangGraph 에이전트, Rule Engine + LLM 하이브리드 판별, JSON 스키마 기반 출력 제어' },
  { no: '02', title: 'RAG · AI 모델 적용', desc: '임베딩 · FAISS 벡터 검색 파이프라인, RAGAS 품질 평가, STT · OCR · YOLO 모델 검증 후 서비스 연동' },
  { no: '03', title: '백엔드 · 클라우드', desc: 'FastAPI · SQLAlchemy REST API, MySQL · PostgreSQL 모델링, AWS · Docker 배포 환경 구성' },
  { no: '04', title: '프로젝트 리딩', desc: 'PM(팀장)으로 요구사항 정의, 아키텍처 설계, 일정 관리' },
];

export const SKILLS: { group: string; items: string[] }[] = [
  { group: 'AGENT · LLM', items: ['LangGraph', 'Tool Calling', 'MCP', 'IBM watsonx.ai', 'Gemini API', 'Ollama', 'Qwen', 'Prompt Engineering', 'RAGAS'] },
  { group: 'RAG · SEARCH', items: ['LangChain', 'FAISS', 'bge-m3', 'KURE-v1', 'pgvector', 'Docling'] },
  { group: 'VISION · SPEECH · ML', items: ['Whisper large-v3-turbo', 'PaddleOCR', 'YOLO', 'OpenCV', 'XGBoost', 'NetworkX', 'ffmpeg'] },
  { group: 'BACKEND', items: ['Python', 'FastAPI', 'SQLAlchemy', 'JWT', 'MySQL', 'PostgreSQL', 'Oracle', 'Java', 'C/C++', 'C# (.NET)'] },
  { group: 'FRONTEND · API', items: ['React', 'Next.js', 'Vite', 'JavaScript', 'Slack API', 'Google Calendar API', 'Kakao Map API'] },
  { group: 'INFRA · DEVOPS', items: ['AWS (S3 · CloudFront · ECS Fargate · RDS · EC2)', 'Docker', 'Kubernetes', 'Red Hat OpenShift', 'Vercel', 'Git'] },
];

export const JOURNEY = [
  { period: '2026.08 — 10', type: 'EDUCATION', title: '심화 생성형 AI활용 인재양성과정', desc: '하이미디어 신촌캠퍼스 · 현업 개발자 멘토링 기반 생성형 AI 서비스 기획·개발 팀 프로젝트' },
  { period: '2026.02 — 08', type: 'EDUCATION', title: 'IBM x Red Hat AI Transformation (AX) Academy', desc: '하이미디어 종로캠퍼스 · Python, React, FastAPI 풀스택과 Docker, Kubernetes, OpenShift, AWS 실습' },
  { period: '2025.12 — 2026.01', type: 'WORK', title: '소프트넷 · 인턴 (계약직)', desc: '병원 ERP 시스템 유지보수 및 기능 개선 · C# .NET (Windows Forms)' },
  { period: '2024.03 — 2026.02', type: 'DEGREE', title: '성결대학교 컴퓨터공학과', desc: '편입 · 졸업 (2022–2024 나사렛대학교 IT인공지능학과)' },
];

export const CERTS = [
  { name: 'SQLD', date: '2024.04', org: '한국데이터산업진흥원' },
  { name: '리눅스마스터 2급', date: '2024.08', org: 'KAIT' },
  { name: 'MOS PowerPoint · Word', date: '2024.11', org: 'YBM IT' },
  { name: '컴퓨터활용능력 2급', date: '2025.10', org: '대한상공회의소' },
];

// Contact 섹션 상단 · 기본 정보
export const PROFILE_INFO = [
  { k: 'NAME', v: '박재경 · Park Jaekyung' },
  { k: 'POSITION', v: 'AI 서비스 개발 · 백엔드' },
  { k: 'EDUCATION', v: '성결대학교 컴퓨터공학과 졸업' },
  { k: 'LOCATION', v: '경기도 안양시' },
];

// 전화번호는 사이트에 노출하지 않음 (CLAUDE.md)
export const CONTACTS = [
  { label: 'EMAIL', value: 'pjg0525@naver.com', href: 'mailto:pjg0525@naver.com', external: false },
  { label: 'GITHUB', value: 'PARKJAEKYUNG0525', href: 'https://github.com/PARKJAEKYUNG0525', external: true },
  { label: 'BLOG', value: 'blog.naver.com/jaekyung_dev', href: 'https://blog.naver.com/jaekyung_dev', external: true },
];
