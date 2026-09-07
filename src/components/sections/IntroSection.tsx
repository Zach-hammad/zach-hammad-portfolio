import { roleIdentity } from "@/data/proof";

export default function IntroSection() {
  return (
    <div className="work-intro">
      <div>
        <p className="eyebrow">01 / Selected work</p>
        <h2>What I’m working on.</h2>
      </div>
      <p>{roleIdentity.intro}</p>
    </div>
  );
}
