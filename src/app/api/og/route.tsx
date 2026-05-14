import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Istanbul Digital Nomads";
  const description =
    searchParams.get("description") ||
    "Build a real digital life in Istanbul with weekly coworking, local guides, and fast local answers.";

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f1117",
        backgroundImage:
          "radial-gradient(circle at 24% 24%, #a93226 0%, transparent 48%), radial-gradient(circle at 80% 20%, #f39c12 0%, transparent 36%), radial-gradient(circle at 78% 78%, rgba(39,174,96,0.72) 0%, transparent 34%)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 80px",
          maxWidth: "900px",
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: "#e74c3c",
            marginBottom: 16,
            letterSpacing: "0.08em",
          }}
        >
          ISTANBUL DIGITAL NOMADS
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#fafafa",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: 20,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#99a3ad",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 40,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 18,
          color: "#85929e",
        }}
      >
        istanbulnomads.com
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
