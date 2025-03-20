"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Grid2X2, Mail, Info, Menu, X, BookOpen } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const navigation = [
  { name: "Sheets", href: "/sheets", icon: Grid2X2 },
  { name: "Blog", href: "/blog", icon: BookOpen },
  { name: "Contact", href: "/contact", icon: Mail },
  { name: "About", href: "/about", icon: Info },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle scroll effect with debounce
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    setIsScrolled(scrollPosition > 10);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  if (!isMounted) return null;

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200",
      isScrolled && "shadow-sm"
    )}>
      <nav className="container flex h-16 items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center space-x-2 transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#317B22] rounded-md"
        >
          <Grid2X2 className="h-6 w-6" style={{ color: "#2A4D14" }} />
          <span className="text-xl font-bold" style={{ color: "#2A4D14" }}>
            Gridshare
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden rounded-md p-2 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-[#317B22] transition-colors duration-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "nav-link",
                  isActive ? "nav-link-active" : "nav-link-inactive"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Mobile navigation */}
        <div 
          id="mobile-menu"
          className={cn(
            "mobile-nav",
            isMobileMenuOpen ? "mobile-nav-open" : "mobile-nav-closed"
          )}
        >
          <div className="container py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "nav-link w-full",
                    isActive ? "nav-link-active" : "nav-link-inactive"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}