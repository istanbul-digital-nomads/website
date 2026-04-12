import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 100,
        background:
          "linear-gradient(135deg, #f56d57 0%, #c8351f 55%, #7f231a 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        borderRadius: 36,
        fontWeight: 700,
        boxShadow: "inset 0 2px 0 rgba(255,255,255,0.18)",
      }}
    >
      IN
    </div>,
    { ...size },
  );
}
