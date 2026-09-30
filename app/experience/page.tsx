import { Nav } from "../Nav";

const experience = [
  ["Aug 2025—Now", "PT Jasa Kreasi Setria Group", "Social Media Specialist", "Strategy · Ideation · Production · Publishing · Performance"],
  ["May 2023—May 2025", "PT Bigjava", "Social Media Specialist", "TikTok · Instagram · X · Content Strategy · Analytics"],
  ["May—Aug 2024", "Independent", "Content Creator", "Trend Research · Social-first Storytelling · Execution"],
  ["Yogyakarta", "FUNacTive", "Social Media", "Client Strategy · Monthly Content Plan · Audience Analysis"],
];

export default function Experience() {
  return (
    <main id="main">
      <Nav active="experience" />
      <section className="experience subpage">
        <div className="shell">
          <header className="section-head compact light"><p className="eyebrow">Experience</p><h1>Where I’ve<br /><em>made things happen.</em></h1></header>
          <div className="timeline">
            {experience.map(([date, company, role, scope]) => <article key={company + date}><p>{date}</p><h3>{company}</h3><h4>{role}</h4><span>{scope}</span></article>)}
          </div>
          <div className="experience-note">
            <p className="eyebrow">How I work</p>
            <h2>Understand → Explore → Create → Execute → Learn.</h2>
            <p>Trend-aware, not trend-dependent. Brand first. Simple ideas can still hit. Performance data makes the next move sharper.</p>
          </div>
          <p className="education">B.Econ · Universitas Amikom · 2020—2024 · GPA 3.71 / 4.00</p>
        </div>
      </section>
    </main>
  );
}
