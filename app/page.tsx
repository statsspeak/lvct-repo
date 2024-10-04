"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clipboard, FlaskRound, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import { BackgroundPattern } from "@/components/BackgroundPattern";
import { HealthcareIllustration } from "@/components/HealthcareIllustration";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ScrollingStats } from "@/components/ScrollingStats";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white dark:from-gray-900 dark:to-gray-800 relative">
      <BackgroundPattern />
      <div className="relative z-10">
        <header className="container mx-auto px-4 py-8">
          <nav className="flex justify-between items-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-lvct-red dark:text-lvct-red"
            >
              HPV Journey Tracker
            </motion.h1>
            <div className="space-x-4 flex items-center">
              <ThemeToggle />
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-lvct-purple hover:bg-purple-700 text-white"
              >
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-16">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-lvct-red to-lvct-purple">
              Streamline HPV Patient Care
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 mb-8">
              Efficient tracking and management for better health outcomes
            </p>
            <Button
              size="lg"
              asChild
              className="animate-pulse hover:animate-none bg-lvct-red hover:bg-red-600 text-white text-lg py-6 px-8"
            >
              <Link href="/login">Start Your Journey</Link>
            </Button>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mb-16"
          >
            <HealthcareIllustration />
          </motion.div>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            <FeatureCard
              title="Patient Registration"
              description="Easily register patients and generate unique QR codes for seamless tracking."
              icon={<Clipboard className="w-12 h-12 text-lvct-red" />}
            />
            <FeatureCard
              title="Lab Management"
              description="Efficiently manage lab tests from sample collection to result communication."
              icon={<FlaskRound className="w-12 h-12 text-lvct-purple" />}
            />
            <FeatureCard
              title="Communication Hub"
              description="Streamline patient communications and follow-ups in one central location."
              icon={<PhoneCall className="w-12 h-12 text-lvct-red" />}
            />
          </motion.section>

          <ScrollingStats />

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="text-center mb-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
          >
            <h3 className="text-4xl font-bold mb-4 text-lvct-purple">
              Empowering Healthcare Professionals
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Our platform is designed to support healthcare staff, lab
              technicians, and administrators in providing top-notch care for
              HPV patients.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="hover:bg-lvct-purple hover:text-white transition-colors duration-300 text-lg py-6 px-8"
            >
              Learn More
            </Button>
          </motion.section>
        </main>

        <footer className="bg-gray-100 dark:bg-gray-800 py-8">
          <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
            <p>&copy; 2024 HPV Journey Tracker. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            {icon}
          </motion.div>
          <CardTitle className="text-2xl text-lvct-purple">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-lg">{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}
