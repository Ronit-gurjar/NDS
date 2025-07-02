// app/page.tsx (landing-page.tsx)
'use client';

import Image from "next/image";
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

import { Navbar } from "@/components/navbar";
import { ServiceCard } from "@/components/serviceCard";
import { SignalTradingSection } from '@/components/signalTradingSection';
import { MarketView } from "@/components/marketView";
import { VerifiedResultsSection } from "@/components/verifiedResultsSection";
import { ContactFAQSection } from "@/components/contactFAQSection";
import { Footer } from "@/components/footer";

import dmatChartGraphic from "@/assets/images/chart-graphic.png";
import cryptoGraphic from "@/assets/images/crypto-graphic.png";
import stocksGraphic from "@/assets/images/stocks-graphic.png";
import aiGraphic from "@/assets/images/ai-graphic.png";
import accountHandlingGraphic from "@/assets/images/account-handling-graphic.png";
import futuresTradingGraphic from "@/assets/images/futures-trading-graphic.png";

import heroBackground from "@/assets/images/triangle.png";
import heroMockup from "@/assets/images/heromockup.png";
import { ArrowRight } from "lucide-react";
import { GetStartedButton } from "@/components/get-started-button";


export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const navbarRef = useRef<HTMLElement>(null);
  const heroMockupRef = useRef<HTMLImageElement>(null);
  const heroLeftContentRef = useRef<HTMLDivElement>(null);
  const heroRightContentRef = useRef<HTMLDivElement>(null);
  const dailyReturnsRef = useRef<HTMLSpanElement>(null);
  const clientsRef = useRef<HTMLSpanElement>(null);
  const supportRef = useRef<HTMLSpanElement>(null);

  const signalTradingSectionRef = useRef<HTMLDivElement>(null);
  const marketViewSectionRef = useRef<HTMLElement>(null);
  const simpleMessageSectionRef = useRef<HTMLElement>(null);
  const verifiedResultsSectionRef = useRef<HTMLDivElement>(null);
  const servicesSectionRef = useRef<HTMLElement>(null);
  const contactFAQSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tlHero = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (heroMockupRef.current) {
        tlHero.fromTo(
          heroMockupRef.current,
          { opacity: 0, y: 50, rotation: -5 },
          { opacity: 1, y: 0, rotation: 0, duration: 1.2 }, "start+=0.1"
        );
      }

      if (heroLeftContentRef.current && heroRightContentRef.current) {
        tlHero.fromTo(
          [heroLeftContentRef.current.children, heroRightContentRef.current.children],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.0, stagger: 0.15 }, "start+=0.3"
        );
      }

      if (dailyReturnsRef.current && clientsRef.current && supportRef.current) {
        gsap.to(dailyReturnsRef.current, {
          innerText: "12.0",
          duration: 0.8,
          ease: "power1.out",
          delay: 1.5,
          onUpdate: function() {
            const currentVal = parseFloat(this.targets()[0].innerText);
            if (currentVal <= 12) {
                this.targets()[0].innerText = currentVal.toFixed(1) + "%";
            } else {
                this.targets()[0].innerText = "12.0%";
            }
          }
        });
        gsap.to(clientsRef.current, {
          innerText: 100,
          duration: 0.8,
          ease: "power1.out",
          delay: 1.6,
          snap: { innerText: 1 },
          onUpdate: function() {
            this.targets()[0].innerText = Math.round(parseFloat(this.targets()[0].innerText)) + "+";
          }
        });
        gsap.to(supportRef.current, {
          innerText: 24,
          duration: 0.8,
          ease: "power1.out",
          delay: 1.7,
          snap: { innerText: 1 },
          onUpdate: function() {
            this.targets()[0].innerText = Math.round(parseFloat(this.targets()[0].innerText)) + "/7";
          }
        });
      }

      const sections = [
        signalTradingSectionRef,
        marketViewSectionRef,
        simpleMessageSectionRef,
        verifiedResultsSectionRef,
        servicesSectionRef,
        contactFAQSectionRef,
      ];

      sections.forEach((sectionRef) => {
        if (sectionRef.current) {
          gsap.fromTo(sectionRef.current.children,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                end: "bottom top",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} className="min-h-screen bg-background text-foreground flex flex-col items-center">
      {/* Dynamic navbar - Attach ref */}
      <Navbar ref={navbarRef} heroSectionRef={heroSectionRef}/>

      {/* Hero Section */}
      <section
        ref={heroSectionRef}
        className="relative w-full min-h-screen flex items-center justify-center pt-28 pb-40 px-4 md:px-8 overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Background Triangle Image */}
        <div className="absolute inset-0 flex items-center justify-center z-0 opacity-80 pointer-events-none">
          <div className="relative w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] xl:w-[1000px] xl:h-[1000px]
                           flex items-center mt-20 lg:mt-0 justify-center">
            <Image
              src={heroBackground}
              alt="Abstract triangle background graphic for hero section"
              fill
              style={{ objectFit: 'contain' }}
              quality={100}
              priority={true}
              sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 40vw"
            />
          </div>
        </div>

        {/* Bottom Blur Overlay */}
        <div className="absolute -bottom-10 left-0 w-full h-[200px] md:h-[250px] lg:h-[300px] z-30"
             style={{
               background: 'linear-gradient(to top, var(--background) 30%, transparent 90%)',
             }}>
        </div>

        {/* Hero Content - 3 Column Layout */}
        <div className="relative z-10 w-full max-w-7xl mx-auto mt-2
                        grid grid-cols-1 md:grid-cols-3 items-center gap-10 lg:gap-16 xl:gap-20">

          {/* Left Column: Headline and Stats */}
          <div ref={heroLeftContentRef} className="flex flex-col gap-5 lg:gap-16 text-center md:text-left md:col-span-1">
            <h1 id="hero-heading" className="text-4xl lg:text-4xl font-bold leading-tight drop-shadow-md">
              Daily Trades <span className="text-emerald-500">✔</span><br/>
              Weekly Reports <span className="text-emerald-500">✔</span><br/>
              Monthly <span className="text-emerald-500">Returns</span>
            </h1>
            {/* Stats section */}
            <div className="flex justify-center md:justify-start gap-8 mt-3" role="group" aria-label="Key performance statistics">
              <div className="flex flex-col items-center md:items-start">
                <span ref={dailyReturnsRef} className="text-xl lg:text-2xl font-bold" aria-live="polite" aria-atomic="true">0%</span>
                <span className="text-sm text-muted-foreground">daily returns</span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span ref={clientsRef} className="text-xl lg:text-2xl font-bold" aria-live="polite" aria-atomic="true">0+</span>
                <span className="text-sm text-muted-foreground">clients</span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span ref={supportRef} className="text-xl lg:text-2xl font-bold">0/7</span>
                <span className="text-sm text-muted-foreground">live support</span>
              </div>
            </div>
          </div>

          {/* Middle Column: Hand Image */}
          <div className="relative md:col-span-1 h-full mt-5 min-h-[400px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[700px] pointer-events-none flex items-center justify-center">
            <div className="relative w-full h-full
                            min-w-[280px] sm:min-w-[350px] md:min-w-[400px] lg:min-w-[550px] xl:min-w-[650px]
                            aspect-[1024/682]
                            z-10 drop-shadow-2xl">
              <Image
                ref={heroMockupRef}
                src={heroMockup}
                alt="Hand holding phone displaying trading interface"
                fill
                style={{ objectFit: 'cover' }}
                quality={100}
                priority={true}
                sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 40vw"
              />
            </div>
          </div>

          {/* Right Column: Description and CTAs */}
          <div ref={heroRightContentRef} className="flex flex-col gap-4 px-2 text-center md:text-left md:col-span-1">
            <p className="text-lg text-muted-foreground drop-shadow-sm">
              Pioneering trading solutions that empower individuals to achieve maximum results with their investments.
            </p>
            {/* CTA Button & Text - Responsiveness fixed here */}
            <div className="flex flex-row justify-center items-center group mt-8 gap-4
                            bg-gray-800/70 hover:bg-gray-700/50 text-white rounded-full px-1 py-2 text-lg transition-colors duration-200">
              {/* Get Started Button */}
              <GetStartedButton
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-full px-6 py-3 text-lg transition-colors duration-200"
                size="lg"
                aria-label="Get started with SignalHunt agency services"
              >
                Get Started
              </GetStartedButton>
              <span className="flex flex-row justify-center items-center gap-3 text-base md:text-lg">
                to Learn more <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-all duration-200" aria-hidden="true" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Signal Trading Section */}
      {/* No direct changes to this div, changes are within SignalTradingSection component */}
      <div ref={signalTradingSectionRef} className="px-6 -mt-5 sm:px-6 lg:px-8">
        <SignalTradingSection />
      </div>

      {/* Market View Section */}
      <section
        ref={marketViewSectionRef}
        className="relative z-10 w-full px-4 mt-8 md:mt-16 mb-16"
        aria-labelledby="market-view-heading"
      >
        <div className="max-w-5xl mx-auto text-center mb-8">
          <h2 id="market-view-heading" className="text-3xl sm:text-4xl font-bold mb-4">Market Overview</h2>
          <p className="text-lg text-muted-foreground">
            Stay updated with real-time market data and insights.
          </p>
        </div>
        <MarketView/>
      </section>

      {/* Simple Message */}
      <section
        ref={simpleMessageSectionRef}
        className="relative z-10 text-center max-w-3xl w-full px-4 mt-8"
        aria-labelledby="message-heading"
      >
        <h2 id="message-heading" className="text-2xl sm:text-3xl font-semibold mb-4">Trade smarter. Trade with confidence.</h2>
        <p className="text-lg text-muted-foreground">
          Achieve your financial goals through strategic trading, simplified. Our agency provides well-researched, battle-tested trading signals, backed by cutting-edge analytics, enabling you to participate in global markets with confidence and ease.
        </p>
      </section>

      <div ref={verifiedResultsSectionRef} className="w-full my-12">
        <VerifiedResultsSection />
      </div>

      {/* Services Section - Dynamic Bento Grid */}
      {/* Min-heights adjusted/removed for better content-driven height and animation trigger */}
      <section
        ref={servicesSectionRef}
        className="relative z-10 max-w-6xl w-full
                   grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4
                   gap-6
                   grid-flow-row md:grid-flow-dense
                   py-16 px-4 mt-16 md:mt-24 mb-16"
        aria-labelledby="services-heading"
      >
        <h2 id="services-heading" className="sr-only">Our Services and Offerings</h2>

        <ServiceCard
          title="Account Handling"
          description="We handle your account, so you can relax and earn."
          imageSrc={accountHandlingGraphic}
          className="md:col-span-1 md:row-span-1"
          aria-label="Service: Account Handling"
        />

        <ServiceCard
          title="Crypto Trading"
          description="Dive into digital assets with our secure and intuitive crypto trading platform."
          imageSrc={cryptoGraphic}
          className="md:col-span-2 md:row-span-1"
          aria-label="Service: Crypto Trading"
        />

        <ServiceCard
          title="Stocks"
          description="Trade global stocks with real-time data and powerful analytics."
          imageSrc={stocksGraphic}
          className="md:col-span-1 md:row-span-1"
          aria-label="Service: Stocks Trading"
        />

        <ServiceCard
          title="DMAT Trading"
          description="Seamless Demat account trading with modern tools and secure infrastructure."
          imageSrc={dmatChartGraphic}
          className="md:row-start-2 md:col-start-1 md:col-span-1 md:row-span-1"
          aria-label="Service: Demat Trading"
        />

        <ServiceCard
          title="AI Algorithm Trading"
          description="Leverage AI-driven strategies to automate and optimize your trading decisions."
          imageSrc={aiGraphic}
          className="md:col-span-1 md:row-span-1"
          aria-label="Service: AI Algorithm Trading"
        />

        <ServiceCard
          title="Futures Trading"
          description="Access to global futures markets with advanced analytics."
          imageSrc={futuresTradingGraphic}
          className="md:col-span-2 md:row-span-1"
          aria-label="Service: Futures Trading"
        />
      </section>

      {/* Contact + FAQ Section */}
      <div ref={contactFAQSectionRef} className="w-full my-6">
        <ContactFAQSection />
      </div>
      <Footer />
    </main>
  );
}