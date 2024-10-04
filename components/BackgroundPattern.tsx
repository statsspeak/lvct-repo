import React from "react";

export function BackgroundPattern() {
  return (
    <div className="fixed inset-0 z-0 opacity-5">
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern
            id="pattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="20"
              cy="20"
              r="1"
              fill="currentColor"
              className="text-lvct-purple"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pattern)" />
      </svg>
    </div>
  );
}
