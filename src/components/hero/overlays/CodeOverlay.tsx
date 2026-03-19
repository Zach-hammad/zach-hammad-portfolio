"use client";

/**
 * HTML text overlays for assembly (stage 4) and source code (stage 5).
 *
 * Positioned absolute over the canvas. Uses real HTML for crisp text rendering
 * rather than trying to render text in WebGL.
 */

interface CodeOverlayProps {
  progress: number;
}

/** Compute opacity for a fade-in/fade-out window. */
function fadeWindow(
  progress: number,
  fadeInStart: number,
  fadeInEnd: number,
  fadeOutStart: number,
  fadeOutEnd: number
): number {
  if (progress < fadeInStart || progress > fadeOutEnd) return 0;
  if (progress < fadeInEnd)
    return (progress - fadeInStart) / (fadeInEnd - fadeInStart);
  if (progress > fadeOutStart)
    return 1 - (progress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
  return 1;
}

const asmColor = {
  keyword: "#f87171",
  register: "#fbbf24",
  number: "#60a5fa",
  comment: "#666666",
  label: "#4ade80",
  text: "#999999",
};

const codeColor = {
  keyword: "#c084fc",
  type: "#60a5fa",
  fn: "#fbbf24",
  string: "#4ade80",
  comment: "#666666",
  punct: "#999999",
  text: "#d4d4d4",
};

function AssemblySnippet() {
  const s = asmColor;
  return (
    <pre
      className="font-mono text-base leading-relaxed select-none"
      style={{ color: s.text }}
    >
      <span style={{ color: s.comment }}>{"# RISC-V boot sequence\n"}</span>
      <span style={{ color: s.label }}>{"_start:\n"}</span>
      {"  "}
      <span style={{ color: s.keyword }}>{"la"}</span>
      {"      "}
      <span style={{ color: s.register }}>{"sp"}</span>
      {", "}
      <span style={{ color: s.label }}>{"_stack_top\n"}</span>
      {"  "}
      <span style={{ color: s.keyword }}>{"li"}</span>
      {"      "}
      <span style={{ color: s.register }}>{"a0"}</span>
      {", "}
      <span style={{ color: s.number }}>{"0x80000000\n"}</span>
      {"  "}
      <span style={{ color: s.keyword }}>{"csrw"}</span>
      {"    "}
      <span style={{ color: s.register }}>{"mtvec"}</span>
      {", "}
      <span style={{ color: s.register }}>{"a0\n"}</span>
      {"  "}
      <span style={{ color: s.keyword }}>{"jal"}</span>
      {"     "}
      <span style={{ color: s.register }}>{"ra"}</span>
      {", "}
      <span style={{ color: s.label }}>{"kernel_init\n"}</span>
      {"\n"}
      <span style={{ color: s.label }}>{"kernel_init:\n"}</span>
      {"  "}
      <span style={{ color: s.keyword }}>{"addi"}</span>
      {"    "}
      <span style={{ color: s.register }}>{"sp"}</span>
      {", "}
      <span style={{ color: s.register }}>{"sp"}</span>
      {", "}
      <span style={{ color: s.number }}>{"-32\n"}</span>
      {"  "}
      <span style={{ color: s.keyword }}>{"sd"}</span>
      {"      "}
      <span style={{ color: s.register }}>{"ra"}</span>
      {", "}
      <span style={{ color: s.number }}>{"24"}</span>
      {"("}
      <span style={{ color: s.register }}>{"sp"}</span>
      {")\n"}
      {"  "}
      <span style={{ color: s.keyword }}>{"jal"}</span>
      {"     "}
      <span style={{ color: s.register }}>{"ra"}</span>
      {", "}
      <span style={{ color: s.label }}>{"mem_init\n"}</span>
      {"  "}
      <span style={{ color: s.keyword }}>{"jal"}</span>
      {"     "}
      <span style={{ color: s.register }}>{"ra"}</span>
      {", "}
      <span style={{ color: s.label }}>{"scheduler_start\n"}</span>
    </pre>
  );
}

function SourceSnippet() {
  const s = codeColor;
  return (
    <pre
      className="font-mono text-base leading-relaxed select-none"
      style={{ color: s.text }}
    >
      <span style={{ color: s.keyword }}>{"pub fn "}</span>
      <span style={{ color: s.fn }}>{"build_system"}</span>
      <span style={{ color: s.punct }}>{"("}</span>
      <span style={{ color: s.text }}>{"config"}</span>
      <span style={{ color: s.punct }}>{": &"}</span>
      <span style={{ color: s.type }}>{"Config"}</span>
      <span style={{ color: s.punct }}>{") -> "}</span>
      <span style={{ color: s.type }}>{"Result"}</span>
      <span style={{ color: s.punct }}>{"<"}</span>
      <span style={{ color: s.type }}>{"System"}</span>
      <span style={{ color: s.punct }}>{"> {\n"}</span>
      {"    "}
      <span style={{ color: s.keyword }}>{"let "}</span>
      <span style={{ color: s.text }}>{"pipeline"}</span>
      <span style={{ color: s.punct }}>{" = "}</span>
      <span style={{ color: s.type }}>{"Pipeline"}</span>
      <span style={{ color: s.punct }}>{"::"}</span>
      <span style={{ color: s.fn }}>{"new"}</span>
      <span style={{ color: s.punct }}>{"()\n"}</span>
      {"        "}
      <span style={{ color: s.punct }}>{"."}</span>
      <span style={{ color: s.fn }}>{"stage"}</span>
      <span style={{ color: s.punct }}>{"("}</span>
      <span style={{ color: s.string }}>{'"transistors"'}</span>
      <span style={{ color: s.punct }}>{")\n"}</span>
      {"        "}
      <span style={{ color: s.punct }}>{"."}</span>
      <span style={{ color: s.fn }}>{"stage"}</span>
      <span style={{ color: s.punct }}>{"("}</span>
      <span style={{ color: s.string }}>{'"logic_gates"'}</span>
      <span style={{ color: s.punct }}>{")\n"}</span>
      {"        "}
      <span style={{ color: s.punct }}>{"."}</span>
      <span style={{ color: s.fn }}>{"stage"}</span>
      <span style={{ color: s.punct }}>{"("}</span>
      <span style={{ color: s.string }}>{'"architecture"'}</span>
      <span style={{ color: s.punct }}>{")\n"}</span>
      {"        "}
      <span style={{ color: s.punct }}>{"."}</span>
      <span style={{ color: s.fn }}>{"build"}</span>
      <span style={{ color: s.punct }}>{"();\n\n"}</span>
      {"    "}
      <span style={{ color: s.comment }}>{"// The journey from silicon\n"}</span>
      {"    "}
      <span style={{ color: s.comment }}>{"// to software, compiled.\n"}</span>
      {"    "}
      <span style={{ color: s.text }}>{"pipeline"}</span>
      <span style={{ color: s.punct }}>{"."}</span>
      <span style={{ color: s.fn }}>{"compile"}</span>
      <span style={{ color: s.punct }}>{"(config)\n"}</span>
      <span style={{ color: s.punct }}>{"}\n"}</span>
    </pre>
  );
}

export default function CodeOverlay({ progress }: CodeOverlayProps) {
  // Assembly: fade in 0.65-0.70, hold, fade out 0.78-0.82
  // Low opacity — particles carry the text, overlay is a subtle color accent.
  const asmOpacity = fadeWindow(progress, 0.65, 0.70, 0.78, 0.82) * 0.15;

  // Source code: fade in 0.82-0.87, hold through 1.0
  const codeOpacity = fadeWindow(progress, 0.82, 0.87, 1.0, 1.0) * 0.18;

  if (asmOpacity <= 0 && codeOpacity <= 0) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {asmOpacity > 0 && (
        <div
          className="absolute"
          style={{ opacity: asmOpacity, transition: "opacity 0.05s linear" }}
        >
          <AssemblySnippet />
        </div>
      )}
      {codeOpacity > 0 && (
        <div
          className="absolute"
          style={{ opacity: codeOpacity, transition: "opacity 0.05s linear" }}
        >
          <SourceSnippet />
        </div>
      )}
    </div>
  );
}
