import { ArrowUpRight } from "lucide-react";
import { winPosts } from "@/data/winPosts";

export default function WinPostsSection() {
  return (
    <section
      id="team-wins"
      className="shell win-posts"
      aria-labelledby="team-wins-title"
    >
      <div className="work-intro">
        <div>
          <p className="eyebrow">Senior design & hackathons</p>
          <h2 id="team-wins-title">Team wins.</h2>
        </div>
        <p>
          From nine months of senior design to a weekend at a hackathon:
          projects my teammates and I built, and the moments we celebrated.
        </p>
      </div>
      <div className="win-posts-grid">
        {winPosts.map((post) => (
          <article
            key={post.id}
            className="win-post"
            aria-labelledby={`${post.id}-title`}
          >
            <div className="win-post-copy">
              <p className="eyebrow">{post.result} / {post.event}</p>
              <h3 id={`${post.id}-title`}>{post.project}</h3>
              <p className="win-post-description">{post.description}</p>
              {post.detail && <p className="win-post-description">{post.detail}</p>}
              {post.technologies.length > 0 && (
                <ul className="technology-list" aria-label={`${post.project} technologies`}>
                  {post.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              )}
            </div>
            {post.embedUrl && (
              <iframe
                className="win-post-embed"
                src={post.embedUrl}
                title={`${post.project}: ${post.event} win on LinkedIn`}
                width="504"
                height="628"
                loading="lazy"
                allowFullScreen
              />
            )}
            <div className="win-post-source">
              <p>Team announcement by {post.author}.</p>
              <a
                className="text-link"
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${post.linkLabel}: ${post.project} (opens in a new tab)`}
              >
                {post.linkLabel}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
