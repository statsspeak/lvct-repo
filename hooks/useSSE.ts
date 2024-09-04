"use client"
import { useState, useEffect } from "react";

export function useSSE<T>(url: string, role: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setData(parsedData);
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      setError("Failed to connect to server");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [url, role]);

  return { data, error };
}
