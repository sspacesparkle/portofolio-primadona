import Link from "next/link";

type Page = "home" | "experience" | "projects" | "social";

export function Nav({ active }: { active: Page }) {
  const links: [Page, string, string][] = [
    ["home", "/", "Home"],
    ["experience", "/experience", "Experience"],
    ["projects", "/projects", "Projects"],
    ["social", "/social", "Social"],
  ];

  return (
    <nav className="nav shell" aria-label="Main navigation">
      <Link className="monogram" href="/" aria-label="Dedharya home">DIW</Link>
      <div className="nav-links">
        {links.map(([key, href, label]) => <Link className={active === key ? "active" : ""} href={href} key={key}>{label}</Link>)}
      </div>
      <a className="nav-cta" href="mailto:dedharyaiw21@gmail.com">Let’s talk ↗</a>
    </nav>
  );
}
