// components/SignalTradingSection.tsx
"use client";

import React, { useRef, useEffect } from 'react';
import Image from 'next/image'; // Import the Image component
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { GetStartedButton } from './get-started-button';

import RiveReplacementImage from "@/assets/images/rive-replacement.png"

gsap.registerPlugin(ScrollTrigger);

interface SignalTradingSectionProps {
  // Add any props if needed
}

export function SignalTradingSection({}: SignalTradingSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null); // For the fade-in content

  useEffect(() => {
    if (sectionRef.current && contentRef.current) {
      // Set initial state for the fade-in content
      gsap.set(contentRef.current, { opacity: 0, y: 50 });

      ScrollTrigger.create({
        id: "signalTradingTrigger", // Added ID for better cleanup
        trigger: sectionRef.current,
        start: "top 80%", // Start animation when the top of the section is 80% down from viewport top
        end: "bottom top", // End when the bottom of the section hits the top of the viewport
        onEnter: () => {
          gsap.to(contentRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.6, // Increased duration for more delay/slower fade-in
            ease: "power3.out",
          });
        },
        onLeaveBack: () => { // Optional: fade out if scrolling back up past the trigger point
          gsap.to(contentRef.current, {
            opacity: 0,
            y: 50,
            duration: 0.6, // Slightly faster fade out
            ease: "power3.in",
          });
        },
        // markers: true, // Uncomment for debugging ScrollTrigger points
      });
    }

    return () => {
      ScrollTrigger.getById("signalTradingTrigger")?.kill(); // Cleanup
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="signal-trading" // Add an ID for easy navigation/linking if needed
      className="w-full min-h-screen flex items-center justify-center py-6 md:py-12 lg:py-16 relative z-10"
      style={{
        backgroundColor: '#0A0A0A', // A very dark gray, almost black, to match your theme
      }}
    >
      <div
        ref={contentRef}
        className="w-full max-w-screen-xl h-full min-h-[calc(100vh-8rem)] grid grid-rows-[1fr_1fr]
                         rounded-2xl overflow-hidden
                         border border-emerald-500 bg-emerald-500/10"
      >
        {/* Top Half: Card Body - Responsive Flex Layout */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:gap-x-12
                               p-6 md:p-10 lg:p-16 text-white">

          {/* Left Div (Header) */}
          <div className="flex-shrink-0 mb-4 lg:mb-0 lg:w-1/2 text-left">
            <h2 className="text-5xl md:text-6xl lg:text-9xl font-extrabold text-white leading-tight">
              SIGNAL TRADING
            </h2>
          </div>

          {/* Right Div (Descriptive Text and Button) */}
          <div className="flex flex-col items-start gap-6 lg:gap-10 lg:items-end w-full lg:w-1/2">
            {/* Top of Right Div (Descriptive Text) */}
            <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-4 lg:mb-8 max-w-2xl text-left lg:text-right">
              Unlock your full trading potential. Our cutting-edge signals provide precise entry and exit points, leveraging advanced analytics to maximize your returns. Experience consistent, data-driven trades designed for clarity and profitability.
            </p>
            {/* Bottom of Right Div (Button) */}
            <GetStartedButton
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-full
                                 px-6 py-3 text-md md:text-lg transition-colors duration-200
                                 inline-flex items-center space-x-2 w-full"
              size="lg"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </GetStartedButton>
          </div>
        </div>

        {/* Bottom Half: Card Footer (Image Replacement) */}
        <div className="relative flex items-center justify-center bg-black/20 overflow-hidden">
          {/* Main Image for "How Our Technique Works" */}
          <Image
            src={RiveReplacementImage} // Path to your generated image
            alt="Visual representation of SignalHunt trading process: Signal In, Entry, Target Hit"
            fill // This makes the image fill its parent container
            style={{ objectFit: 'cover' }} // Ensures the image covers the area, cropping if necessary
            sizes="(max-width: 768px) 100vw,
                   (max-width: 1200px) 70vw,
                   50vw" // Define image sizes for responsiveness based on its container
            quality={80} // Adjust image quality if needed
          />

          {/* Rive Animation Component (Commented out for later use if needed) */}
          {/*
          <div className="text-gray-500 text-center text-xl italic py-20 border border-dashed border-gray-700 w-full h-full flex items-center justify-center rounded-lg">
            [Rive Animation Component Here]
            <br />
            (e.g., A dynamic chart or signal visualization)
          </div>
          */}
        </div>
      </div>
    </section>
  );
}