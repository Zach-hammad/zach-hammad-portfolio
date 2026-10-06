"use client";

import type { MouseEvent, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export default function ResumeSectionMenu({ children }: { children: ReactNode }) {
  function closeAfterNavigation(event: MouseEvent<HTMLDetailsElement>) {
    if (event.target instanceof Element && event.target.closest('a[href^="#"]')) {
      event.currentTarget.open = false;
    }
  }

  return (
    <details className="resume-mobile-contents" onClick={closeAfterNavigation}>
      <summary>
        Jump to section <ChevronDown size={16} aria-hidden="true" />
      </summary>
      <nav aria-label="Resume sections">
        <ul>{children}</ul>
      </nav>
    </details>
  );
}
