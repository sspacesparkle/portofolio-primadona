const projects = [
  {
    no: "01",
    title: "Deen’s Sambal",
    meta: "Branding · Short Film · 2022",
    tone: "chili",
    statement: "Making a local product feel bigger through story.",
    problem: "A local SME needed more than product promotion—it needed a brand story people could remember.",
    approach: "Brand development, creative concept, and short-film production shaped into one clear visual narrative.",
    tags: ["Brand Development", "Creative Concept", "Short Film"],
  },
  {
    no: "02",
    title: "Batik nDalem ARJS",
    meta: "Branding · Short Film · 2023",
    tone: "batik",
    statement: "Tradition, reframed for a modern audience.",
    problem: "How can a traditional product stay rooted in culture while speaking to a younger audience?",
    approach: "A short-film concept and brand communication direction built around visual storytelling—not hard selling.",
    tags: ["Brand Communication", "Storytelling", "Content Development"],
  },
  {
    no: "03",
    title: "CUIT",
    meta: "Creative Content · Aug—Sep 2022",
    tone: "cuit",
    statement: "Turning what’s happening now into what comes next.",
    problem: "Fast-moving platform culture calls for ideas that feel current without becoming a copy of the trend.",
    approach: "Industry observation and trend research translated into fresh content ideas and creative strategy.",
    tags: ["Trend Research", "Content Ideation", "Creative Strategy"],
  },
];

const services = [
  ["01", "Social Media Strategy", "Brand goals → clear, relevant, executable social direction."],
  ["02", "Content & Creative", "Ideas, plans, copy, briefs, and concepts built for the platform."],
  ["03", "Production", "From pre-production to shoot day, keeping the idea on track."],
  ["04", "Performance Analysis", "Reading the signals, finding patterns, making the next content better."],
];

const experience = [
  ["Aug 2025—Now", "PT Jasa Kreasi Setria Group", "Social Media Specialist", "Strategy · Ideation · Production · Publishing · Performance"],
  ["May 2023—May 2025", "PT Bigjava", "Social Media Specialist", "TikTok · Instagram · X · Content Strategy · Analytics"],
  ["May—Aug 2024", "Independent", "Content Creator", "Trend Research · Social-first Storytelling · Execution"],
  ["Yogyakarta", "FUNacTive", "Social Media", "Client Strategy · Monthly Content Plan · Audience Analysis"],
];

export default function Home() {
  return (
    <main>
      <nav className="nav shell" aria-label="Main navigation">
        <a className="monogram" href="#top" aria-label="Dedharya home">DIW</a>
        <div className="nav-links">
          <a href="#work">Work</a><a href="#about">About</a><a href="#experience">Experience</a>
        </div>
        <a className="nav-cta" href="mailto:dedharyaiw21@gmail.com">Let’s talk ↗</a>
      </nav>

      <section className="hero shell" id="top">
        <p className="eyebrow reveal">Social Media · Content · Creative</p>
        <h1 className="reveal delay-1">Ideas people<br />actually want<br /><em>to see.</em></h1>
        <div className="hero-bottom reveal delay-2">
          <p>I’m <strong>Dedharya</strong>—a Social Media Specialist turning brand goals, audience insight, and online culture into content with a point.</p>
          <a className="round-link" href="#work" aria-label="See selected work"><span>See<br />the work</span><b>↓</b></a>
        </div>
        <div className="scribble" aria-hidden="true">think<br /><span>→ make</span><br />→ learn</div>
      </section>

      <section className="work shell" id="work">
        <header className="section-head">
          <p className="eyebrow">Selected work / 2022—2023</p>
          <h2>Small brands.<br /><em>Big story energy.</em></h2>
        </header>
        <div className="project-list">
          {projects.map((project) => (
            <article className="project" key={project.title}>
              <div className={`project-art ${project.tone}`} aria-hidden="true">
                <span className="art-no">{project.no}</span><span className="art-word">{project.title}</span><span className="art-stamp">CASE<br />STUDY</span>
              </div>
              <div className="project-copy">
                <p className="eyebrow">{project.meta}</p><h3>{project.statement}</h3>
                <dl>
                  <div><dt>The brief</dt><dd>{project.problem}</dd></div>
                  <div><dt>The move</dt><dd>{project.approach}</dd></div>
                </dl>
                <ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about" id="about">
        <div className="shell about-grid">
          <p className="eyebrow">About / the short version</p>
          <div>
            <h2>Creative instinct starts the conversation. <em>Data shows where to go next.</em></h2>
            <div className="about-copy">
              <p>I work across strategy, ideation, content planning, production, execution, and performance analysis. The goal is simple: make content that feels right for the audience and still makes sense for the brand.</p>
              <p>My Economics background adds another lens—consumer behavior, business goals, and the bigger picture behind every creative decision.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="services shell">
        <header className="section-head compact"><p className="eyebrow">What I do</p><h2>From “what if?”<br />to <em>“it’s live.”</em></h2></header>
        <div className="service-list">
          {services.map(([no, title, copy]) => <article key={no}><span>{no}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="experience" id="experience">
        <div className="shell">
          <header className="section-head compact light"><p className="eyebrow">Experience</p><h2>Where I’ve<br /><em>made things happen.</em></h2></header>
          <div className="timeline">
            {experience.map(([date, company, role, scope]) => <article key={company + date}><p>{date}</p><h3>{company}</h3><h4>{role}</h4><span>{scope}</span></article>)}
          </div>
          <p className="education">B.Econ · Universitas Amikom · 2020—2024 · GPA 3.71 / 4.00</p>
        </div>
      </section>

      <footer className="contact shell" id="contact">
        <p className="eyebrow">Jakarta, Indonesia · Open to creative opportunities</p>
        <h2>Let’s make<br />something <em>worth seeing.</em></h2>
        <a href="mailto:dedharyaiw21@gmail.com">dedharyaiw21@gmail.com <span>↗</span></a>
        <div className="footer-line"><span>Social Media Specialist · Content Strategist · Creative Thinker</span><span>© 2026 Dedharya</span></div>
      </footer>
    </main>
  );
}

