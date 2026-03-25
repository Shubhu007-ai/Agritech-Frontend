const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="150px"
    viewBox="0 0 500 130" // Optimized viewbox for the combined logo
    fill="currentColor"
  >
    {/* 1. The Clean Text */}
    {/* using standard font ensures perfect curves for 'g', 'e', 'c' */}
    <text
      x="10"
      y="100"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="700"
      fontSize="85"
      letterSpacing="-2" // Tightens text to match the logo style
      fill="#ffffff"
    >
      AgriTech
    </text>

    {/* 2. The Roof / Factory Graphic */}
    {/* Positioned to sit exactly above "Tech" */}
    <g transform="translate(215, 12)">
      {/* The main swoosh and factory outline */}
      <path
        d="M0,35 Q80,25 150,22 L155,5 L165,5 L175,22 L195,22 L200,30 Q120,35 0,45 Z"
        fill="#ffffff"
      />
      
      {/* The vertical "Crop" lines on the left of the roof */}
      <rect x="10" y="20" width="3" height="15" fill="#ffffff" />
      <rect x="20" y="15" width="3" height="22" fill="#ffffff" />
      <rect x="30" y="22" width="3" height="16" fill="#ffffff" />
      <rect x="40" y="10" width="3" height="30" fill="#ffffff" />
    </g>

    {/* 3. The Three Square Dots (Colon) */}
    {/* Positioned after the 'h' */}
    <g transform="translate(370, 45)">
      <rect x="0" y="0" width="9" height="9" fill="#ffffff" />
      <rect x="0" y="14" width="9" height="9" fill="#ffffff" />
      <rect x="0" y="28" width="9" height="9" fill="#ffffff" />
    </g>
  </svg>
);

export default Logo;