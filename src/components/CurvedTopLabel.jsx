// components/CurvedTopLable.jsx
import React from "react";

/**
 * CurvedTopLable
 * - src: image path (public folder or absolute URL)
 * - text: label to render along the arc (starts at top and sweeps toward the right)
 * - size: diameter (px) of the globe image
 * - imgPadding: small gap between the globe edge and the text arc
 * - fontSize: px size of the curved text
 * - id: unique id suffix for defs (required if multiple on one page)
 */
export default function CurvedTopLabel({
  src = "/welcome-pack.jpg",
  text = "WELCOME PACK",
  size = 130,
  imgPadding = 6,
  fontSize = 18,
  id = "curvedTopRight",
}) {
  // compute padding to accommodate glyph extents (bigger font -> bigger pad)
  const pad = Math.max(Math.ceil(fontSize * 1.8), 14);
  const svgSize = size + pad * 2;
  const cx = svgSize / 2;
  const cy = svgSize / 2;

  // image radius and position (image remains exactly `size` px)
  const imgRadius = size / 2 - imgPadding - 6;
  const imgX = (svgSize - size) / 2;
  const imgY = imgX;

  // position text a bit outside the image; depends on pad so large fonts move outward
  const textRadius = imgRadius + imgPadding + Math.max(8, pad * 0.6);

  // arc path: from top to right (clockwise)
  const arcD = `M ${cx} ${
    cy - textRadius
  } A ${textRadius} ${textRadius} 0 0 1 ${cx + textRadius} ${cy}`;

  return (
    <div style={{ width: svgSize, height: svgSize, display: "inline-block" }}>
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={text}
        style={{ overflow: "visible" }}
      >
        <defs>
          <clipPath id={`${id}-clip`}>
            <circle cx={cx} cy={cy} r={imgRadius} />
          </clipPath>

          <path id={`${id}-arc`} d={arcD} fill="none" />
        </defs>

        {/* draw the globe image centered and clipped to a circle */}
        <image
          href={src}
          x={imgX}
          y={imgY}
          width={size}
          height={size}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${id}-clip)`}
        />

        {/* subtle ring */}
        <circle
          cx={cx}
          cy={cy}
          r={imgRadius}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="1"
        />

        {/* curved text along the arc */}
        <text
          style={{
            fontFamily: "Inter, Arial, sans-serif",
            fontWeight: 700,
            letterSpacing: "1px",
          }}
          fontSize={fontSize}
        >
          <textPath
            href={`#${id}-arc`}
            startOffset="0"
            textAnchor="start"
            dominantBaseline="middle"
          >
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
