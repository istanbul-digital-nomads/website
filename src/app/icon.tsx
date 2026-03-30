import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 20,
        background: "linear-gradient(135deg, #e34b32 0%, #a42818 74%)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        borderRadius: 6,
        fontWeight: 700,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
    >
      IN
    </div>,
    { ...size },
  );
}
