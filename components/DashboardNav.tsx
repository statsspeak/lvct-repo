"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/SignOutButton";
import { Menu, X } from "lucide-react";

const navItems = {
  ADMIN: [
    { href: "/dashboard/admin", label: "Overview" },
    { href: "/dashboard/admin/users", label: "Manage Users" },
    { href: "/dashboard/admin/invite-user", label: "Invite Users" },
    { href: "/dashboard/admin/audit-logs", label: "Audit Logs" },
    { href: "/dashboard/admin/analytics", label: "Analytics" },
  ],
  STAFF: [
    { href: "/dashboard/staff", label: "Overview" },
    { href: "/dashboard/staff/patients", label: "Patients" },
    { href: "/dashboard/staff/register-patient", label: "Register Patient" },
  ],
  LAB_TECHNICIAN: [
    { href: "/dashboard/lab-technician", label: "Overview" },
    { href: "/dashboard/lab-technician/tests", label: "Manage Tests" },
    { href: "/dashboard/lab-technician/scan-qr", label: "Scan QR Code" },
    { href: "/dashboard/lab-technician/record-test", label: "Record New Test" },
    { href: "/dashboard/lab-technician/analytics", label: "Test Analytics" },
  ],
  CALL_CENTER_AGENT: [
    { href: "/dashboard/call-center-agent", label: "Overview" },
    {
      href: "/dashboard/call-center-agent/communications",
      label: "Communications",
    },
    { href: "/dashboard/call-center-agent/follow-ups", label: "Follow-ups" },
    {
      href: "/dashboard/call-center-agent/appointments",
      label: "Appointments",
    },
  ],
} as const;

type UserRole = keyof typeof navItems;

interface DashboardNavProps {
  userRole: UserRole;
}

export function DashboardNav({ userRole }: DashboardNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const items = navItems[userRole];

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <nav className="bg-white shadow-sm" aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-xl font-semibold text-lvct-purple">
                HPV Tracker
              </span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? "bg-lvct-red text-white"
                      : "text-gray-700 hover:bg-lvct-purple hover:text-white"
                  }`}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
              <SignOutButton />
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <Button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-white hover:bg-lvct-purple focus:outline-none focus:ring-2 focus:ring-inset focus:ring-lvct-red"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? "bg-lvct-red text-white"
                    : "text-gray-700 hover:bg-lvct-purple hover:text-white"
                }`}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
            <SignOutButton />
          </div>
        </div>
      )}
    </nav>
  );
}
