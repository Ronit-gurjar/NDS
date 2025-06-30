// components/Navbar.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LogoTrigger } from './logoTrigger';
import { GetStartedButton } from '@/components/get-started-button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import logo from "../public/logo-full.svg"

gsap.registerPlugin(ScrollTrigger);

// Define props for Navbar. Note: The 'ref' prop itself is NOT part of this interface,
// as it's handled by React.forwardRef.
interface NavbarProps {
  heroSectionRef: React.RefObject<HTMLElement | null>;
}

// Wrap the Navbar component with React.forwardRef
// The 'ref' argument here is the ref passed from the parent (page.tsx)
export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(({ heroSectionRef }, ref) => {
  const [isScrolled, setIsScrolled] = useState(false);
  // Use the forwarded ref for the main nav container if the parent needs to animate it
  // Otherwise, you could still use navContainerRef for internal animations if ref is null
  const navInternalRef = useRef<HTMLElement>(null); // Internal ref for Navbar's own animations
  const animatedInnerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // Combine the forwarded ref with an internal ref
  // This allows the parent (page.tsx) to control the Navbar's top-level element (for fade-in)
  // AND allows Navbar.tsx to access its own main container for other internal logic (like scroll animations)
  const setCombinedRef = useCallback((node: HTMLElement | null) => {
    // Set the internal ref
    navInternalRef.current = node;

    // If a forwarded ref exists, set it too
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  }, [ref]);


  // Effect for initial Navbar fade-in animation
  useEffect(() => {
    // Only animate if the ref is available
    if (navInternalRef.current) {
      gsap.fromTo(
        navInternalRef.current,
        { opacity: 0, y: -50 }, // Start state: hidden, 50px up
        { opacity: 1, y: 0, duration: 1.0, ease: "power3.out", delay: 0.2 } // End state: visible, at original position
      );
    }
  }, []); // Empty dependency array means this runs once on mount

  // Effect for scroll-triggered Navbar shrinking/styling
  useEffect(() => {
    if (heroSectionRef.current) {
      // Ensure any previous ScrollTrigger with this ID is killed to prevent duplicates
      ScrollTrigger.getById("heroTrigger")?.kill();

      ScrollTrigger.create({
        id: "heroTrigger", // Assign an ID to easily kill it later
        trigger: heroSectionRef.current,
        start: "bottom top", // Trigger when the bottom of hero section hits top of viewport
        toggleActions: "play reverse play reverse", // Play on enter, reverse on leave
        onEnter: () => setIsScrolled(true),
        onLeaveBack: () => setIsScrolled(false),
        // markers: true, // Uncomment for debugging ScrollTrigger
      });
    }

    // Cleanup function for ScrollTrigger
    return () => {
      ScrollTrigger.getById("heroTrigger")?.kill();
    };
  }, [heroSectionRef]); // Re-run if heroSectionRef changes (though unlikely)


  // Effect for GSAP animations based on isScrolled state
  useEffect(() => {
    if (animatedInnerRef.current && logoWrapperRef.current && buttonRef.current) {
      const commonTweenProps = {
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto" as "auto", // Type assertion for overwrite property
      };

      if (isScrolled) {
        gsap.to(animatedInnerRef.current, {
          paddingLeft: 16,
          paddingRight: 16,
          borderRadius: 9999, // Makes it fully rounded (pill shape)
          backgroundColor: 'rgba(23, 23, 23, 0.4)', // Dark background with transparency
          backdropFilter: 'blur(10px)', // Blur effect
          gap: 24, // Smaller gap between logo and buttons
          // Responsive width adjustment for scrolled state
          width: window.innerWidth >= 768 ? '50vw' : 'calc(100% - 2rem)',
          borderWidth: 1, // Add border
          borderColor: 'rgba(110, 231, 183, 0.4)', // Emerald-300 with 40% opacity
          borderStyle: 'solid',
          ...commonTweenProps,
        });

        // Shrink logo and buttons
        gsap.to([logoWrapperRef.current, buttonRef.current.querySelector('button')], {
          scale: 0.8, // Make them smaller
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 4,
          paddingBottom: 4,
          fontSize: '0.875rem', // Smaller font size
          ...commonTweenProps,
        });

      } else {
        // Create a timeline for a more controlled "unscrolled" animation
        const tl = gsap.timeline({ ...commonTweenProps, overwrite: 'auto' });

        // Expand logo and buttons first
        tl.to([logoWrapperRef.current, buttonRef.current.querySelector('button')], {
          scale: 1,
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 4,
          paddingBottom: 4,
          fontSize: '1rem',
        }, 0); // Start at the same time as inner container (position 0)

        // Then expand inner container
        tl.to(animatedInnerRef.current, {
          paddingLeft: 24,
          paddingRight: 24,
          borderRadius: 0, // No border-radius (square corners)
          backgroundColor: 'transparent', // Transparent background
          backdropFilter: 'none', // Remove blur
          gap: 32, // Larger gap
          width: '100%', // Full width
          borderWidth: 0, // Remove border
          borderColor: 'transparent',
          borderStyle: 'none',
          ...commonTweenProps,
        }, 0); // Start at the same time as logo/buttons (position 0)
      }
    }
  }, [isScrolled]); // Re-run when isScrolled state changes

  return (
    <nav
      ref={setCombinedRef} // Use the combined ref setter here
      className={`fixed top-4 z-50 flex items-center justify-center w-full`}
      style={{
        backgroundColor: 'transparent', // Ensure base is transparent
      }}
    >
      <div
        ref={animatedInnerRef}
        className={`flex items-center py-1 h-full justify-between
          ${!isScrolled ? 'px-4' : 'px-2'}
        `}
        style={{
          // Base styles for the inner container (will be overridden by GSAP)
          backgroundColor: 'transparent',
          borderRadius: '0px',
          backdropFilter: 'none',
          gap: isScrolled ? '24px' : '32px', // Tailwind classes will set initial, GSAP animates
          width: '100%',
          position: 'relative',
          borderWidth: '0px',
          borderStyle: 'none',
          borderColor: 'transparent',
        }}
      >
        <LogoTrigger>
          <div ref={logoWrapperRef} className="flex-shrink-0">
            <Image
              src={logo}
              alt="SignalHunt Logo"
              width={100}
              height={30}
              priority
              className="h-auto"
            />
          </div>
        </LogoTrigger>
        <div ref={buttonRef} className="flex flex-row gap-4">
          <Button
            onClick={() => router.push('/login')}
            className=" bg-background hover:bg-accent border border-emerald-500 text-white font-semibold rounded-full px-2.5 py-1 text-md transition-colors duration-200"
            size="sm"
          >
            Login
          </Button>
          <GetStartedButton
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-full px-2.5 py-1 text-md transition-colors duration-200"
            size="sm"
          >
            Get Started
          </GetStartedButton>
        </div>
      </div>
    </nav>
  );
});

// Add a display name for better debugging in React DevTools
Navbar.displayName = 'Navbar';