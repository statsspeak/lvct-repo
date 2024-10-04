"use client";
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const stats = [
  { label: "Patients Tracked", value: "10,000+" },
  { label: "Healthcare Providers", value: "500+" },
  { label: "Test Results Processed", value: "50,000+" },
  { label: "Patient Satisfaction", value: "98%" },
];

export function ScrollingStats() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className="py-12 bg-gradient-to-r from-purple-100 to-red-100 dark:from-gray-800 dark:to-gray-700"
    >
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center mb-8 text-lvct-purple">
          Our Impact
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="text-4xl font-bold text-lvct-red mb-2">
                {stat.value}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
