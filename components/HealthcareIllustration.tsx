import React from "react";

export function HealthcareIllustration() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      className="w-full h-auto max-w-md mx-auto"
    >
      <circle cx="250" cy="250" r="200" fill="#E3F2FD" />
      <path
        d="M200 250 L250 300 L300 200"
        stroke="#dc3545"
        strokeWidth="20"
        fill="none"
      />
      <circle cx="250" cy="250" r="50" fill="#663399" />
      <path
        d="M225 250 L275 250 M250 225 L250 275"
        stroke="white"
        strokeWidth="10"
      />
    </svg>
  );
}
