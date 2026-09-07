import React from "react";
import { ImageResponse } from "next/og";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { roleIdentity } from "../src/data/proof";
import { site } from "../src/data/site";

// Render during the build: social crawlers receive a static PNG without JavaScript.
const image = new ImageResponse(
  <div
    style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      padding: "64px 72px", background: "#080a09", color: "#e8e3d8",
      borderLeft: "18px solid #17553c",
    }}
  >
    <div style={{ display: "flex", fontSize: 22, color: "#96b6a2" }}>
      SOFTWARE ENGINEER
    </div>
    <div style={{ display: "flex", fontSize: 76, marginTop: 40, letterSpacing: -3 }}>
      {roleIdentity.name}
    </div>
    <div style={{ display: "flex", fontSize: 48, marginTop: 12 }}>
      I build AI software.
    </div>
    <div style={{ display: "flex", fontSize: 24, color: "#a5aca3", marginTop: 30 }}>
      AI products · Runtime systems · Computer architecture
    </div>
    <div
      style={{
        display: "flex", marginTop: "auto", paddingTop: 24,
        borderTop: "1px solid #293a31", fontSize: 22, color: "#b9a77a",
      }}
    >
      {new URL(site.url).hostname}
    </div>
  </div>,
  { width: site.socialImage.width, height: site.socialImage.height },
);

const output = fileURLToPath(new URL(`../public${site.socialImage.url}`, import.meta.url));
await mkdir(fileURLToPath(new URL("../public/images/", import.meta.url)), { recursive: true });
await writeFile(output, Buffer.from(await image.arrayBuffer()));
console.log("Generated 1200 × 630 social preview.");
