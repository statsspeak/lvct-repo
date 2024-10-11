"use client"
import React from 'react';

export function Spinner() {
  return (
    <div className="w-8 h-8 flex items-center justify-center" aria-label="Loading">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
    </div>
  );
}
