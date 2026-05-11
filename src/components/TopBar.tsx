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
        <div className="flex items-center gap-6 text-xs text-neutral-500">
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-neutral-200 transition-colors"
          >
            <Github size={16} />
            <span className="hidden sm:inline">github</span>
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-neutral-200 transition-colors"
          >
            <Linkedin size={16} />
            <span className="hidden sm:inline">linkedin</span>
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-1.5 hover:text-neutral-200 transition-colors"
          >
            <Mail size={16} />
            <span className="hidden sm:inline">email</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
