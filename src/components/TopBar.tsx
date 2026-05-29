import { Github, Linkedin, Mail } from "lucide-react";
import { contact } from "@/data/contact";

/**
 * Fixed top bar with name + contact links.
 * Always visible — gives recruiters immediate access without scrolling.
 */
export default function TopBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 font-mono backdrop-blur-sm bg-[#0a0a0a]/80">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="text-sm text-neutral-300 tracking-wide font-medium">
          Zacharia Hammad
        </span>
        <div className="flex items-center gap-2 text-xs text-neutral-400 sm:gap-6">
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-sm hover:text-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors sm:min-h-0 sm:min-w-0"
          >
            <Github size={16} />
            <span className="hidden sm:inline">github</span>
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-sm hover:text-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors sm:min-h-0 sm:min-w-0"
          >
            <Linkedin size={16} />
            <span className="hidden sm:inline">linkedin</span>
          </a>
          <a
            href={`mailto:${contact.email}`}
            aria-label="Email"
            className="flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-sm hover:text-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors sm:min-h-0 sm:min-w-0"
          >
            <Mail size={16} />
            <span className="hidden sm:inline">email</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
