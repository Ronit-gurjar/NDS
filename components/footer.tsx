// components/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogoTrigger } from './logoTrigger';
import logo from "../public/logo-full.svg"

// Define your services and their corresponding messages
  const services = [
    { name: "Signal Trading", message: "Hey there, I'm interested in your Signal Trading service. Can you tell me more?" },
    { name: "Account Handling", message: "Hey there, I'd like to inquire about your Account Handling service." },
    { name: "Daily Trades", message: "Hey there, I want to know more about your Daily Trades service." },
    { name: "Crypto Trading", message: "Hey there, I'm interested in your Crypto Trading service." },
    { name: "Stocks Trading", message: "Hey there, I want to learn about your Stocks Trading service." },
    { name: "Futures Trading", message: "Hey there, I'm interested in your Futures Trading service. How does it work?" },
  ];

  const whatsAppNumber = process.env.NEXT_PUBLIC_BUSINESS_NO

export function Footer() {
  return (
    <footer className="w-full bg-black text-white py-12 md:py-16 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        {/* Top section: Logo/Description and Navigation Links */}
        {/* Main grid for desktop (4 cols) and mobile (1 col) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8 md:gap-x-12 lg:gap-x-16 pb-12 md:pb-16">

          {/* Column 1: Logo and Company Description (Always full width on mobile) */}
          <div className="flex flex-col items-center md:items-start md:justify-between space-y-4 text-center md:text-left">
            <LogoTrigger>
              <div className="flex-shrink-0">
                <Image
                  src={logo} // Correct path to your SVG
                  alt="SignalHunt Logo"
                  width={180} // Set your desired initial width
                  height={420} // Set your desired initial height
                  priority
                  className="h-auto" // Ensures image scales responsively and maintains aspect ratio
                />
              </div>
            </LogoTrigger>
            <p className="text-gray-400 text-sm max-w-xs mx-auto md:mx-0">
              Pioneering trading solutions that empower individuals to achieve maximum results with their investments.
            </p>
          </div>

          {/* NEW Wrapper for Product, Company, and Social sections */}
          {/* On desktop (md), this wrapper spans the remaining 3 columns. On mobile, it's a single column from the main grid. */}
          <div className="col-span-1 md:col-span-3">
            {/* Inner grid for Product, Company, Social */}
            {/* On mobile (default), this is a 2-column grid. On desktop (md), it's a 3-column grid. */}
            <div className="grid grid-cols-2 gap-y-8 gap-x-4 md:grid-cols-3 md:gap-x-12">

              {/* Column 2: Product Links (takes 1 of 2 columns on mobile, 1 of 3 on desktop within wrapper) */}
              <div className="flex flex-col items-center sm:items-start space-y-4 text-center sm:text-left">
                <h3 className="text-lg font-semibold text-white">Services</h3>
                <nav className="flex flex-col space-y-2 text-sm text-gray-400">
                  {services.map((service, index) => (
                    <Link
                      key={index} // Using index as key is acceptable here since the list is static
                      href={`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(service.message)}`}
                      target="_blank" // Opens in a new tab
                      rel="noopener noreferrer" // Recommended for security when using target="_blank"
                      className="hover:text-green-500 transition-colors"
                    >
                      {service.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Column 3: Company Links (takes 1 of 2 columns on mobile, 1 of 3 on desktop within wrapper) */}
              <div className="flex flex-col items-center sm:items-start space-y-4 text-center sm:text-left">
                <h3 className="text-lg font-semibold text-white">Company</h3>
                <nav className="flex flex-col space-y-2 text-sm text-gray-400">
                  <Link href="#" className="hover:text-green-500 transition-colors">About Us</Link>
                  <Link href="#" className="hover:text-green-500 transition-colors">Contact</Link>
                  <Link href="#faq-section" className="hover:text-green-500 transition-colors">FAQ</Link>
                </nav>
              </div>

              {/* Column 4: Social Links (Spans 2 columns on mobile to appear below, 1 of 3 on desktop within wrapper) */}
              <div className="col-span-2 md:col-span-1 flex flex-col items-center sm:items-start space-y-4 text-center sm:text-left">
                <h3 className="text-lg font-semibold text-white">Social</h3>
                <nav className="flex flex-col space-y-2 text-sm text-gray-400">
                  <Link href="https://www.instagram.com/signal.hunt" className="hover:text-green-500 transition-colors">Instagram</Link>
                  <Link href="https://x.com/signal_hunt" className="hover:text-green-500 transition-colors">Twitter 𝕏</Link>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section: Copyright and Legal Links (remains largely the same) */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 space-y-4 md:space-y-0 text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} SignalHunt. All rights reserved.</p>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
            <Link href="#" className="hover:text-green-500 transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-green-500 transition-colors">Privacy & Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}