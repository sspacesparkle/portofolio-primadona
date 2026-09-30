import { Nav } from "../Nav";

const projects = [
  {
    no: "01", id: "deens-sambal", title: "Deen’s Sambal", meta: "Branding · Short Film · 2022", tone: "chili",
    youtube: "https://www.youtube.com/results?search_query=Deen%27s+Sambal+short+film",
    statement: "Making a local product feel bigger through story.",
    problem: "A local SME needed more than product promotion—it needed a brand story people could remember.",
    approach: "Brand development, creative concept, and short-film production shaped into one clear visual narrative.",
    tags: ["Brand Development", "Creative Concept", "Short Film"],
  },
  {
    no: "02", id: "batik-ndalem", title: "Batik nDalem ARJS", meta: "Branding · Short Film · 2023", tone: "batik",
    youtube: "https://www.youtube.com/results?search_query=Batik+nDalem+ARJS+short+film",
    statement: "Tradition, reframed for a modern audience.",
    problem: "How can a traditional product stay rooted in culture while speaking to a younger audience?",
    approach: "A short-film concept and brand communication direction built around visual storytelling—not hard selling.",
    tags: ["Brand Communication", "Storytelling", "Content Development"],
  },
  {
    no: "03", id: "cuit", title: "CUIT", meta: "Creative Content · Aug—Sep 2022", tone: "cuit",
    youtube: "https://www.youtube.com/results?search_query=CUIT+creative+content+Dedharya",
    statement: "Turning what’s happening now into what comes next.",
    problem: "Fast-moving platform culture calls for ideas that feel current without becoming a copy of the trend.",
    approach: "Industry observation and trend research translated into fresh content ideas and creative strategy.",
    tags: ["Trend Research", "Content Ideation", "Creative Strategy"],
  },
];

export default function Projects() {
  return (
    <main id="main">
      <Nav active="projects" />
      <section className="work shell subpage">
        <header className="section-head">
          <p className="eyebrow">Projects / 2022—2023</p>
          <a className="work-title-link" href="https://www.youtube.com/results?search_query=Dedharya+creative+portfolio" target="_blank" rel="noreferrer">
            <h1>Small brands.<br /><em>Big story energy.</em></h1><span>YouTube ↗</span>
          </a>
        </header>
        <div className="project-list">
          {projects.map((project) => (
            <article className="project" id={project.id} key={project.title}>
              <a className={`project-art ${project.tone}`} href={project.youtube} target="_blank" rel="noreferrer" aria-label={`Watch ${project.title} on YouTube`}>
                <span className="art-no">{project.no}</span><span className="art-word">{project.title}</span><span className="art-stamp">CASE<br />STUDY</span><span className="watch-label">Watch on YouTube ↗</span>
              </a>
              <div className="project-copy">
                <p className="eyebrow">{project.meta}</p><h3>{project.statement}</h3>
                <dl><div><dt>The brief</dt><dd>{project.problem}</dd></div><div><dt>The move</dt><dd>{project.approach}</dd></div></dl>
                <ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
