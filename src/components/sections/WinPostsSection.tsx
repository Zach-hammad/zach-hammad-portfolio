import { ArrowUpRight } from "lucide-react";
import { winPosts } from "@/data/winPosts";

type WinPost = (typeof winPosts)[number];

function WinPostCard({ post }: { post: WinPost }) {
  return (
    <article
      className={post.embedUrl ? "win-post" : "win-post win-post-compact"}
      aria-labelledby={`${post.id}-title`}
    >
      <div className="win-post-copy">
        <p className="eyebrow">
          {post.embedUrl ? `${post.result} / ${post.event}` : post.event}
        </p>
        <h3 id={`${post.id}-title`}>{post.project}</h3>
        {!post.embedUrl && (
          <p className="win-post-award">Track winner · {post.result}</p>
        )}
        <p className="win-post-description">{post.description}</p>
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
        {post.embedUrl && <p>Team announcement by {post.author}.</p>}
        <div className="win-post-links">
          {post.awardUrl && (
            <a
              className="text-link"
              href={post.awardUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Award result: ${post.project} (opens in a new tab)`}
            >
              Award result
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
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
      </div>
    </article>
  );
}

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
          A senior design championship and two hackathon track wins:
          projects my teammates and I built together.
        </p>
      </div>
      <div className="win-posts-grid">
        {winPosts.filter((post) => post.embedUrl).map((post) => (
          <WinPostCard key={post.id} post={post} />
        ))}
        <div className="win-posts-links">
          {winPosts.filter((post) => !post.embedUrl).map((post) => (
            <WinPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
