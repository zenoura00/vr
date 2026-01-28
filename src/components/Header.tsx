"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Search, Globe, Menu, X } from "lucide-react";

const navItems = [
  { name: "Hogar", href: "#", hasDropdown: false },
  { name: "Soluciones", href: "#", hasDropdown: true },
  { name: "Productos", href: "#", hasDropdown: true },
  { name: "Services", href: "#", hasDropdown: true },
  { name: "About Felicity", href: "#", hasDropdown: true },
];

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg md:text-xl">f</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base md:text-lg tracking-wider">
                  <span className="text-orange-500 font-semibold">F</span>
                  <span className="text-gray-700">elicity</span>
                  <span className="text-gray-500 hidden sm:inline">solar</span>
                  <sup className="text-gray-400 text-xs hidden sm:inline">®</sup>
                </span>
                <span className="text-[10px] md:text-xs text-gray-400 italic -mt-1 hidden md:block">
                  Make life full of hope
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 flex-1 justify-center">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => item.hasDropdown && setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-gray-700 hover:text-orange-500 transition-colors text-sm font-medium py-2"
                >
                  {item.name}
                  {item.hasDropdown && (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Link>
                {item.hasDropdown && openDropdown === item.name && (
                  <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-48 z-50 border border-gray-100">
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500"
                    >
                      Option 1
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500"
                    >
                      Option 2
                    </Link>
                  </div>
                )}
              </div>
            ))}
            <Link
              href="#"
              className="text-gray-700 hover:text-orange-500 transition-colors text-sm font-medium"
            >
              Contáctenos
            </Link>
            <button
              type="button"
              className="text-gray-600 hover:text-orange-500 transition-colors"
              aria-label="Language"
            >
              <Globe className="w-5 h-5" />
            </button>
          </nav>

          {/* Right Side - Search & Menu */}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-orange-500 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden p-2 text-gray-600 hover:text-orange-500"
              aria-label="Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-3 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center justify-between px-3 py-2.5 text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                  {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </Link>
              ))}
              <Link
                href="#"
                className="px-3 py-2.5 text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contáctenos
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
