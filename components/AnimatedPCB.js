// components/AnimatedPCB.js
import React from 'react';

// You might put your CSS here, or in a global stylesheet, or a CSS module
const pcbStyles = `
  .pcb-board {
    fill: #199f4b; /* Match your background green */
    stroke: #0f7a36; /* Darker green for board edge/details */
    stroke-width: 2;
  }
  .pcb-pads {
    fill: #b8860b; /* Gold/Bronze color for pads */
  }
  .pcb-trace {
    fill: none;
    stroke: #2eeb71; /* Brighter green for active trace flow */
    stroke-width: 4;
    stroke-linecap: round;
    stroke-linejoin: round;
    /* Initial state for animation */
    stroke-dasharray: 1000; /* Needs to be larger than the longest path */
    stroke-dashoffset: 1000;
    animation: trace-flow 8s linear infinite; /* Apply animation */
  }

  /* Define the keyframe animation */
  @keyframes trace-flow {
    0% {
      stroke-dashoffset: 1000;
      opacity: 0.7;
    }
    50% {
      stroke-dashoffset: 0;
      opacity: 1;
    }
    100% {
      stroke-dashoffset: -1000; /* Moves the "light" completely through */
      opacity: 0.7;
    }
  }

  /* Dark mode adjustments for PCB elements */
  @media (prefers-color-scheme: dark) {
    .dark .pcb-board {
      fill: #222; /* Darker board in dark mode */
      stroke: #444;
    }
    .dark .pcb-trace {
      stroke: #00ff00; /* Neon green in dark mode */
    }
  }
`;

function AnimatedPCB() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Inject styles dynamically (or use a separate CSS file) */}
      <style>{pcbStyles}</style> 

      {/* Your SVG goes here */}
      <svg 
        width="600" 
        height="400" 
        viewBox="0 0 600 400" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-lg dark:bg-black bg-[#199f4b] rounded-lg shadow-lg"
      >
        {/* Background for the SVG itself, might need adjustment based on how it integrates */}
        <rect x="0" y="0" width="600" height="400" className="pcb-board" />

        {/* Example components and pads */}
        <circle cx="100" cy="100" r="15" className="pcb-pads" />
        <circle cx="500" cy="300" r="15" className="pcb-pads" />
        <rect x="250" y="50" width="100" height="30" rx="5" ry="5" className="pcb-pads" /> {/* Example chip */}

        {/* Animated traces - each trace should be a path */}
        <path 
          d="M 100 100 L 200 100 C 250 100 250 150 250 150 L 250 200" 
          className="pcb-trace" 
        />
        <path 
          d="M 500 300 L 400 300 L 400 250 L 350 250" 
          className="pcb-trace" 
          style={{ animationDelay: '2s', strokeDasharray: '600', strokeDashoffset: '600', animationDuration: '6s' }} 
        />
        {/* Add more paths for a complex circuit */}

        {/* Silkscreen text example */}
        <text x="30" y="30" font-family="monospace" font-size="16" fill="#A0A0A0" className="dark:fill-[#666]">
          ROBOTICS REV 1.0
        </text>

        {/* You can add more SVG elements here: resistors, capacitors, more traces, silkscreen details */}

      </svg>
    </div>
  );
}

export default AnimatedPCB;