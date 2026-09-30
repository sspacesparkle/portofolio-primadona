import { Nav } from "../Nav";

const services = [
  ["01", "Social Media Strategy", "Brand goals → clear, relevant, executable social direction.", "/projects#cuit"],
  ["02", "Content & Creative", "Ideas, plans, copy, briefs, and concepts built for the platform.", "/projects#batik-ndalem"],
  ["03", "Production", "From pre-production to shoot day, keeping the idea on track.", "/projects#deens-sambal"],
  ["04", "Performance Analysis", "Reading the signals, finding patterns, making the next content better.", "/experience"],
];

export default function Social() {
  return (
    <main id="main">
      <Nav active="social" />
      <section className="services shell subpage">
        <header className="section-head compact"><p className="eyebrow">Social / What I do</p><h1>From “what if?”<br />to <em>“it’s live.”</em></h1></header>
        <div className="social-intro">
          <p>I build social content from the thinking to the posting—strategy, content plans, creative briefs, production, publishing, and the learnings after.</p>
          <p className="eyebrow">Instagram · TikTok · X</p>
        </div>
        <div className="service-list">
          {services.map(([no, title, copy, href]) => <a href={href} key={no}><span>{no}</span><h3>{title}</h3><p>{copy}</p><b>View work →</b></a>)}
        </div>
        <a className="instagram-link" href="https://www.instagram.com/" target="_blank" rel="noreferrer">More work on Instagram <span>↗</span></a>
      </section>
    </main>
  );
}
