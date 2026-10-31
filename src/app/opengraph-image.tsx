import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { brand } from "@/config/brand";
import { contact } from "@/config/contact";

export const alt = `${brand.name} — car wash ${brand.serviceModeLabel}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [serif, sans, mono] = await Promise.all([
    readFile(path.join(process.cwd(), "src/assets/fonts/InstrumentSerif-Regular.ttf")),
    readFile(path.join(process.cwd(), "src/assets/fonts/Geist-Medium.ttf")),
    readFile(path.join(process.cwd(), "src/assets/fonts/Geist-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0A0A0B",
          padding: "64px 72px",
          color: "#EDE9E1",
          fontFamily: "Geist",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 18,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#9A968E",
          }}
        >
          <span>Car wash / exterior and interior</span>
          <span>{contact.city}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 152,
              letterSpacing: "0.16em",
              lineHeight: 1,
              marginLeft: -8,
            }}
          >
            {brand.name}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginTop: 34,
              paddingTop: 28,
              borderTop: "1px solid rgba(237,233,225,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 16,
                fontFamily: "Instrument Serif",
                fontSize: 62,
                lineHeight: 1,
                color: "#EDE9E1",
              }}
            >
              <span>Exterior. Interior.</span>
              <span style={{ fontStyle: "italic", color: "#C6A664" }}>Done right.</span>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 15,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#9A968E",
                paddingBottom: 8,
              }}
            >
              {brand.domain.replace("https://", "")}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 15,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#9A968E",
          }}
        >
          <span>Pay per wash / member pricing</span>
          <span style={{ display: "flex", gap: 28 }}>
            <span>Exterior</span>
            <span>Interior</span>
            <span>Complete</span>
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Instrument Serif", data: serif, style: "normal", weight: 400 },
        { name: "Geist", data: sans, style: "normal", weight: 500 },
        { name: "Geist", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
