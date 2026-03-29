import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Istanbul Digital Nomads";
  const description =
    searchParams.get("description") ||
    "A community for remote workers, freelancers, and digital nomads in Istanbul.";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #1e3a8a 0%, transparent 50%), radial-gradient(circle at 75% 75%, #2563eb 0%, transparent 50%)",
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
              color: "#60a5fa",
              marginBottom: 16,
              letterSpacing: "0.05em",
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
              color: "#a3a3a3",
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
            color: "#737373",
          }}
        >
          istanbulnomads.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
