import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { PROJECTS } from '../../data/projects';
import styles from './ProjectDetail.module.css';

const pad = (n: number) => String(n).padStart(2, '0');
const EASE = [0.22, 1, 0.36, 1] as const;

interface Props {
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

/** 프로젝트 상세 — 오른쪽에서 슬라이드 인 하는 패널 */
export default function ProjectDetail({ index, onClose, onNext, onPrev }: Props) {
  const p = PROJECTS[index];
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  // 프로젝트 전환 시 맨 위로 + 닫기 버튼에 포커스
  useEffect(() => {
    panel.current?.scrollTo({ top: 0 });
    closeBtn.current?.focus({ preventScroll: true });
  }, [index]);

  // 포커스 트랩
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !panel.current) return;
    const f = panel.current.querySelectorAll<HTMLElement>('button, a[href]');
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { root: panel, once: true, amount: 0.15 },
        transition: { duration: 0.7, ease: EASE },
      };

  const psr = [
    { k: '문제', v: p.problem },
    { k: '해결', v: p.solution },
    { k: '흐름', v: p.flow },
  ];

  return (
    <>
      <motion.div
        className={styles.backdrop}
        onClick={onClose}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0.01 : 0.35 }}
      />
      <motion.div
        ref={panel}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        data-lenis-prevent
        onKeyDown={onKeyDown}
        initial={reduce ? { opacity: 0 } : { x: '100%' }}
        animate={reduce ? { opacity: 1 } : { x: 0 }}
        exit={reduce ? { opacity: 0 } : { x: '100%' }}
        transition={{ duration: reduce ? 0.01 : 0.6, ease: EASE }}
      >
        <div className={styles.bar}>
          <span className={styles.barLabel}>
            {pad(index + 1)} / {pad(PROJECTS.length)}
            <span className={styles.barBy}> · A PROJECT BY 박재경</span>
          </span>
          <div className={styles.barActions}>
            <button type="button" className="pill pill--sm" onClick={onPrev}>
              ← Prev
            </button>
            <button type="button" className="pill pill--sm" onClick={onNext}>
              Next →
            </button>
            <button type="button" ref={closeBtn} className="pill pill--sm pill--solid" onClick={onClose}>
              Close ✕
            </button>
          </div>
        </div>

        <motion.div
          key={p.key}
          className={styles.body}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <header className={styles.head}>
            <span className={styles.kindEn}>{p.kindEn}</span>
            <h2 id="detail-title" className={styles.title}>{p.name}</h2>
            <p className={styles.summary}>{p.summary}</p>
            <div className={styles.tags}>
              {p.tags.map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </header>

          <motion.div className={styles.meta} {...fade}>
            {p.meta.map((m) => (
              <div key={m.k}>
                <span className={styles.kLabel}>{m.k}</span>
                <span className={styles.metaVal}>
                  {m.k === 'GITHUB' ? (
                    <a href={`https://github.com/${m.v}`} target="_blank" rel="noopener noreferrer">{m.v} ↗</a>
                  ) : (
                    m.v
                  )}
                </span>
              </div>
            ))}
          </motion.div>

          {p.video ? (
            <motion.div className={styles.shot} {...fade}>
              <video
                className={styles.shotVideo}
                src={p.video}
                autoPlay
                muted
                loop
                playsInline
                aria-label={`${p.name} 시연 영상`}
              />
            </motion.div>
          ) : (
            <motion.div className={styles.shot} {...fade} role="img" aria-label={`${p.name} 화면 (준비 중)`}>
              <span className={styles.shotName}>{p.name}</span>
            </motion.div>
          )}

          <div className={styles.psr}>
            {psr.map((x) => (
              <motion.div key={x.k} className={styles.psrItem} {...fade}>
                <span className={styles.psrK}>{x.k}</span>
                <span className={styles.psrV}>{x.v}</span>
              </motion.div>
            ))}
          </div>

          {p.pipelines && (
            <section className={styles.block}>
              <span className="eyebrow">PIPELINE DESIGN</span>
              <h3 className={styles.h3}>어떻게 설계했는가.</h3>
              {p.pipelines.map((pl, k) => (
                <motion.div key={pl.title} className={styles.pipeline} {...fade}>
                  <div className={styles.plHead}>
                    <span className={styles.plNo}>P{k + 1}</span>
                    <span className={styles.plTitle}>{pl.title}</span>
                  </div>
                  <p className={styles.plDesc}>{pl.desc}</p>
                  <ol className={styles.steps}>
                    {pl.steps.map((st, n) => (
                      <li key={st.name} className={`${styles.step}${st.mine ? ` ${styles.mine}` : ''}`}>
                        <div className={styles.stepTop}>
                          <span className={styles.stepNo}>{pad(n + 1)} →</span>
                          {st.mine && <span className={styles.badge}>MY PART</span>}
                        </div>
                        <span className={styles.stepName}>{st.name}</span>
                        <span className={styles.stepTool}>{st.tool}</span>
                        <div className={styles.stepLines}>
                          {st.lines.map((ln) => (
                            <span key={ln}>{ln}</span>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              ))}
              {p.arch && (
                <motion.div className={styles.archBlock} {...fade}>
                  <span className={styles.plTitle}>시스템 아키텍처 · 배포</span>
                  <div className={styles.arch}>
                    {p.arch.map((a) => (
                      <div key={a.k}>
                        <span className={styles.kLabel}>{a.k}</span>
                        <span className={styles.archVal}>{a.v}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </section>
          )}

          <div className={styles.twoCol}>
            <motion.div className={styles.col} {...fade}>
              <h3 className={styles.colTitle}>담당 업무</h3>
              {p.tasks.map((t) => (
                <div key={t.t} className={styles.task}>
                  <span className={styles.taskT}>{t.t}</span>
                  <span className={styles.taskD}>{t.d}</span>
                </div>
              ))}
            </motion.div>
            <motion.div className={styles.col} {...fade}>
              <h3 className={styles.colTitle}>기술 스택</h3>
              {p.stack.map((s) => (
                <div key={s.k} className={styles.stackRow}>
                  <span className={styles.stackK}>{s.k}</span>
                  <span className={styles.stackV}>{s.v}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <section className={styles.block}>
            <span className="eyebrow">TROUBLESHOOTING</span>
            <h3 className={styles.h3} style={{ marginBottom: 20 }}>원인부터 해결했습니다.</h3>
            {p.troubles.map((tr, j) => (
              <motion.div key={tr.t} className={styles.trouble} {...fade}>
                <div className={styles.trHead}>
                  <span className={styles.trNo}>{pad(j + 1)}</span>
                  <span className={styles.trTitle}>{tr.t}</span>
                  <span className={styles.trMetric}>{tr.metric}</span>
                </div>
                <div className={styles.trBody}>
                  <div><span className={styles.trLbl}>문제</span><span className={styles.trTxt}>{tr.p}</span></div>
                  <div><span className={styles.trLbl}>해결</span><span className={styles.trTxt}>{tr.s}</span></div>
                  <div className={styles.trResult}><span className={styles.trLbl}>결과</span><span className={styles.trTxt}>{tr.r}</span></div>
                </div>
              </motion.div>
            ))}
          </section>

          <div className={styles.navBtns}>
            <button type="button" className="pill" onClick={onPrev}>
              ← {PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length].name}
            </button>
            <button type="button" className="pill" onClick={onNext}>
              {PROJECTS[(index + 1) % PROJECTS.length].name} →
            </button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
