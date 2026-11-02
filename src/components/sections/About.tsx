import { COMPETENCIES, SKILLS } from '../../data/profile';
import styles from './About.module.css';

export default function About() {
  return (
    <section id="about" className={`section ${styles.about}`} aria-labelledby="about-title">
      <div className="eyebrow" data-reveal>
        <span>ABOUT / CORE COMPETENCIES</span>
        <span>02</span>
      </div>
      <div className={styles.top}>
        <h2 id="about-title" className="h-section" data-reveal>From design to build, to deployment.</h2>
        <p className="lead" data-reveal>
          LangGraph 에이전트와 RAG 파이프라인을 설계하고, FastAPI 백엔드와 AWS 인프라로 실제 서비스까지 연결합니다.
          지표가 오르는 수정보다 원인을 고치는 수정을 고릅니다.
        </p>
      </div>

      <div className={styles.cards} data-reveal-group>
        {COMPETENCIES.map((c) => (
          <div key={c.no} className={styles.card}>
            <span className={styles.cardNo}>{c.no}</span>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>

      <div id="skills" className={styles.skillsBlock}>
        <div className="eyebrow" data-reveal>
          <span>SKILLS</span>
          <span>{SKILLS.length} GROUPS</span>
        </div>
        <div className={styles.skills} data-reveal-group>
          {SKILLS.map((g) => (
            <div key={g.group} className={styles.row}>
              <span className={styles.group}>{g.group}</span>
              <div className={styles.items}>
                {g.items.map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
