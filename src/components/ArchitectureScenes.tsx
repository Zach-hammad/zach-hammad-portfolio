// These scenes illustrate source paths; they do not execute the underlying projects.
export type ArchitectureKind = "apu" | "risc-v" | "lc3-vm" | "chip-8-sim";

interface SceneProps {
  stage: number;
  progress: number;
  id: string;
}

function Block({ x, y, width, label, detail, active = false }: {
  x: number; y: number; width: number; label: string; detail?: string; active?: boolean;
}) {
  return <g className={active ? "arch-block is-active" : "arch-block"}>
    <rect x={x} y={y} width={width} height={detail ? 64 : 42} rx="2" />
    <text x={x + width / 2} y={y + 26} textAnchor="middle" className="arch-label">{label}</text>
    {detail && <text x={x + width / 2} y={y + 48} textAnchor="middle" className="arch-small">{detail}</text>}
  </g>;
}

function Wire({ d, active, progress, id }: { d: string; active: boolean; progress: number; id: string }) {
  return <g>
    <path d={d} className="arch-wire" markerEnd={`url(#${id}-arrow)`} />
    {active && <>
      <path d={d} className="arch-signal" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress} opacity=".6" />
      <path d={d} className="arch-signal" pathLength="1" strokeDasharray=".055 1" strokeDashoffset={-progress * .945} strokeWidth="4" />
    </>}
  </g>;
}

function ApuScene({ stage, progress, id }: SceneProps) {
  const stages = [
    { name: "FETCH", detail: "PC → op" },
    { name: "DECODE", detail: "opcode" },
    { name: "ISSUE", detail: "dispatch" },
    { name: "CHECK", detail: "evidence" },
    { name: "RETIRE", detail: "publish" },
  ];
  return <>
    <text x="20" y="29" className="arch-small">IMMUTABLE PROGRAM</text>
    <text x="294" y="29" className="arch-small">ARCHITECTURAL STATE</text>
    <Block x={20} y={48} width={196} label="Machine executable" detail="approved image" active={stage === 0} />
    <Block x={294} y={48} width={206} label="Machine state" detail="PC · registers · flags" active={stage === 4} />
    <Wire d="M60 112V170" active={stage === 0} progress={progress} id={id} />
    <Wire d="M294 80H250V132H80V170" active={stage === 0} progress={progress} id={id} />
    <text x="269" y="71" textAnchor="middle" className="arch-small">PC</text>
    <Wire d="M460 170V112" active={stage === 4} progress={progress} id={id} />
    <text x="450" y="141" textAnchor="end" className="arch-small">state publication</text>

    <rect x="11" y="157" width="498" height="90" className="arch-region" />
    {stages.map((item, index) => <g key={item.name}>
      <Block x={20 + index * 100} y={170} width={80} label={item.name} detail={item.detail} active={stage === index} />
      {index < 4 && <Wire d={`M${100 + index * 100} 202H${120 + index * 100}`} active={stage === index + 1} progress={progress} id={id} />}
    </g>)}

    <Wire d="M260 234V294" active={stage === 2} progress={progress} id={id} />
    <text x="247" y="273" textAnchor="end" className="arch-small">dispatch</text>
    <Block x={202} y={294} width={168} label="Execution unit" detail="agent / test tool" active={stage === 2 || stage === 3} />
    <Wire d="M370 326H386V269H360V234" active={stage === 3} progress={progress} id={id} />
    <text x="399" y="294" className="arch-small">receipt</text>
    <text x="286" y="389" textAnchor="middle" className="arch-small">Slow work runs outside the Machine lock</text>

    <Block x={20} y={294} width={142} label="Trap" detail="stop / inspect" />
    <path d="M500 214H514V374H90V358" className="arch-wire arch-secondary-wire" markerEnd={`url(#${id}-arrow)`} />
    <text x="476" y="362" textAnchor="end" className="arch-small">on fault</text>
  </>;
}

function RiscVScene({ stage, progress, id }: SceneProps) {
  const stages = [
    { short: "IF", name: "Fetch" }, { short: "ID", name: "Decode" },
    { short: "EX", name: "ALU" }, { short: "MEM", name: "Memory" },
    { short: "WB", name: "Write" },
  ];
  return <>
    <text x="20" y="29" className="arch-code">lw x5, 0(x2)</text>
    <text x="20" y="52" className="arch-small">Instruction → address → loaded value</text>
    <Block x={21} y={81} width={78} label="PC" active={stage === 0} />
    <Block x={124} y={81} width={129} label="Registers" active={stage === 1 || stage === 4} />
    <Wire d="M60 123V150" active={stage === 0} progress={progress} id={id} />
    <Wire d="M166 123V150" active={stage === 1} progress={progress} id={id} />
    {stages.map((item, index) => <g key={item.short}>
      <Block x={20 + index * 100} y={150} width={79} label={item.short} detail={item.name} active={stage === index} />
      {index < 4 && <>
        <Wire d={`M${99 + index * 100} 183H${120 + index * 100}`} active={stage === index} progress={progress} id={id} />
        <path d={`M${109 + index * 100} 140V225`} stroke="#728168" strokeWidth="3" />
      </>}
    </g>)}
    <Wire d="M460 149V102H255" active={stage === 4} progress={progress} id={id} />
    <text x="372" y="89" textAnchor="middle" className="arch-small">REGISTER WRITEBACK</text>
    <path d="M309 225V253H260V216M409 225V267H248V216" className="arch-wire arch-secondary-wire" markerEnd={`url(#${id}-arrow)`} />
    <text x="356" y="290" textAnchor="middle" className="arch-small">Forwarding paths</text>
    <path d="M160 215V273H60V216" className="arch-wire arch-secondary-wire" markerEnd={`url(#${id}-arrow)`} />
    <text x="105" y="299" textAnchor="middle" className="arch-small">Hazard control</text>
  </>;
}

function Lc3Scene({ stage, progress, id }: SceneProps) {
  return <>
    <text x="22" y="29" className="arch-code">TRAP x21 → OUT</text>
    <text x="22" y="51" className="arch-small">Example: R0 already holds x0041, the letter A</text>
    <rect x="21" y="79" width="136" height="214" className="arch-region" />
    <text x="89" y="107" textAnchor="middle" className="arch-label">Memory</text>
    <text x="89" y="129" textAnchor="middle" className="arch-small">65,536 × 16 bits</text>
    {["x3000  F021", "x3001  F025", "…", "xFE00  KBSR", "xFE02  KBDR", "xFE06  DDR"].map((word, index) => <text key={word} x="34" y={158 + index * 23} className={index === 0 && stage === 0 ? "arch-code" : "arch-small"}>{word}</text>)}
    <Block x={208} y={78} width={134} label="PC" detail={stage === 0 ? "x3000 → x3001" : "x3001"} active={stage === 0} />
    <Wire d="M208 110H169V159H155" active={stage === 0} progress={progress} id={id} />
    <Wire d="M157 176H210" active={stage === 1} progress={progress} id={id} />
    <Block x={210} y={159} width={132} label="Decode" detail="opcode 1111" active={stage === 1} />
    <Block x={208} y={251} width={134} label="R0–R7 · N/Z/P" active={stage === 2} />
    <Wire d="M277 251V223" active={stage === 2} progress={progress} id={id} />
    <Wire d="M342 193H367V156H389" active={stage === 2 || stage === 3} progress={progress} id={id} />
    <rect x="389" y="111" width="111" height="122" rx="2" className="arch-terminal" />
    <text x="444" y="138" textAnchor="middle" className="arch-small">TERMINAL</text>
    <text x="411" y="188" className="arch-terminal-letter">{stage === 3 ? "A" : "_"}</text>
    <text x="444" y="262" textAnchor="middle" className="arch-small">putchar(R0)</text>
  </>;
}

const spriteBytes = [0xf0, 0x90, 0x90, 0x90, 0xf0];
const keypad = ["1", "2", "3", "C", "4", "5", "6", "D", "7", "8", "9", "E", "A", "0", "B", "F"];

function Chip8Scene({ stage, progress, id }: SceneProps) {
  const rowsDrawn = stage < 3 ? 0 : Math.min(5, Math.ceil(progress * 5));
  return <>
    <text x="22" y="29" className="arch-code">D015 → draw a five-row sprite</text>
    <text x="22" y="51" className="arch-small">I = 0 · V0 = 30 · V1 = 13</text>
    <Block x={21} y={78} width={134} label="4 KB memory" detail="ROM at 0x200" active={stage === 0} />
    <Wire d="M155 109H200" active={stage === 0} progress={progress} id={id} />
    <Block x={200} y={78} width={128} label="Decode" detail="16-bit opcode" active={stage === 1} />
    <Block x={367} y={78} width={133} label="V0–VF · I" detail="16 registers" active={stage === 2} />
    <Wire d="M328 109H367" active={stage === 2} progress={progress} id={id} />
    <text x="21" y="179" className="arch-small">SPRITE AT I</text>
    {spriteBytes.map((byte, row) => <g key={row}>
      <text x="22" y={202 + row * 20} className="arch-small">{byte.toString(16).toUpperCase()}</text>
      {Array.from({ length: 8 }, (_, bit) => <rect key={bit} x={54 + bit * 10} y={190 + row * 20} width="8" height="14" fill={byte & (1 << (7 - bit)) ? "#b9a77a" : "#22362a"} />)}
    </g>)}
    <Wire d="M136 237H206" active={stage === 3} progress={progress} id={id} />
    <Wire d="M432 142V180H407V195" active={stage === 2} progress={progress} id={id} />
    <text x="287" y="176" textAnchor="middle" className="arch-small">64 × 32 / XOR DISPLAY</text>
    <rect x="207" y="189" width="194" height="98" fill="#090f0b" stroke="#59694e" />
    <rect x="208" y="190" width="192" height="96" fill={`url(#${id}-pixels)`} />
    {spriteBytes.flatMap((byte, row) => Array.from({ length: 8 }, (_, bit) => byte & (1 << (7 - bit)) ? <rect key={`${row}-${bit}`} x={208 + (30 + bit) * 3} y={190 + (13 + row) * 3} width="2.6" height="2.6" fill="#d6dfa9" opacity={row < rowsDrawn ? 1 : 0} /> : null))}
    <text x="301" y="309" textAnchor="middle" className="arch-small">VF = 0 · no collision</text>
    {keypad.map((key, index) => <g key={key}>
      <rect x={427 + index % 4 * 19} y={193 + Math.floor(index / 4) * 22} width="16" height="19" className="arch-key" />
      <text x={435 + index % 4 * 19} y={207 + Math.floor(index / 4) * 22} textAnchor="middle" className="arch-key-label">{key}</text>
    </g>)}
    <text x="465" y="301" textAnchor="middle" className="arch-small">KEYPAD</text>
  </>;
}

export default function ArchitectureScene({ kind, ...props }: SceneProps & { kind: ArchitectureKind }) {
  return <svg viewBox={kind === "apu" ? "0 0 520 408" : "0 0 520 328"} fill="none" className="architecture-scene" aria-hidden="true">
    <defs>
      <marker id={`${props.id}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 1L8 5L0 9" fill="none" stroke="#82917a" strokeWidth="1.5" /></marker>
      <pattern id={`${props.id}-pixels`} width="3" height="3" patternUnits="userSpaceOnUse" x="208" y="190"><path d="M3 0H0V3" stroke="#283728" strokeWidth=".4" /></pattern>
    </defs>
    {kind === "apu" && <ApuScene {...props} />}
    {kind === "risc-v" && <RiscVScene {...props} />}
    {kind === "lc3-vm" && <Lc3Scene {...props} />}
    {kind === "chip-8-sim" && <Chip8Scene {...props} />}
  </svg>;
}
