// components/VerifiedResultsSection.tsx
"use client";

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// --- Image Imports ---
import dailyTradesImage from '@/assets/images/daily-trades.png';
import specialSignalsImage from '@/assets/images/special-signals.png';
import tradeEntryImage from '@/assets/images/trade-entry.png';
import riskRewardImage from '@/assets/images/risk-reward.png';
import abstractBgImage from '@/assets/images/abstract-bg.png'; // Your abstract background image

// Define an interface for the card data
interface ResultCardProps {
  imageSrc: StaticImageData;
  imageAlt: string;
  title: string;
  description: string;
}

// Data for your cards
const resultCardsData: ResultCardProps[] = [
  {
    imageSrc: dailyTradesImage,
    imageAlt: "Daily Trades Chart",
    title: "Daily Trades",
    description: "Consistent execution of trades with clear entry and exit points.",
  },
  {
    imageSrc: specialSignalsImage,
    imageAlt: "Special Signals Icon",
    title: "Use of Special Signals",
    description: "Leveraging proprietary indicators for high-probability setups.",
  },
  {
    imageSrc: tradeEntryImage,
    imageAlt: "Trade Entry/Target/SL illustration",
    title: "Trade Entry/Target/SL",
    description: "Precise defined levels for optimal risk management and profit taking.",
  },
  {
    imageSrc: riskRewardImage,
    imageAlt: "Risk/Reward Ratios",
    title: "Risk/Reward: 1/1, 1/2, 1/5",
    description: "Strategic planning for favorable risk-reward ratios across all trades.",
  },
];

export function VerifiedResultsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 relative bg-black">
      {/* Background Image using Next.js Image component */}
      <div className="absolute inset-0 z-0 lg:rotate-90">
        <Image
          src={abstractBgImage}
          alt="Abstract Background"
          fill={true}
          className="object-cover lg:rotate-90" // Use object-contain for horizontal view
          priority
          sizes="(max-width: 786px) 100vw, 100vw"
        />
      </div>

      {/* Main content container - Added max-w-6xl and mx-auto for overall width control */}
      <div className="relative z-10 container px-6 md:px-2 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Verified Results</h2>
            <p className="max-w-[900px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Showcasing the effectiveness of our trading strategies and tools.
            </p>
          </div>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resultCardsData.map((card, index) => (
            <Card
              key={index}
              className="flex flex-col rounded-lg overflow-hidden
                         bg-white/10 backdrop-blur-lg border border-white/20
                         text-card-foreground shadow-lg p-2 pt-4"
            >
              {/* Image container for the card */}
              <div className="relative w-full h-56 bg-gray-900 rounded-lg overflow-hidden">
                {/* Inner div to create padding around the image */}
                <div className="absolute inset-0"> {/* This div has the padding */}
                  <Image
                    src={card.imageSrc}
                    alt={card.imageAlt}
                    fill={true} // Image fills this padded inner div
                    className="object-cover rounded-lg" // Image is rounded
                  />
                </div>
              </div>
              <CardHeader className="text-center pt-4 pb-2">
                <CardTitle className="text-xl font-semibold text-white">{card.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow text-center text-sm text-gray-200 pb-4">
                <p>{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Carousel Layout */}
        <div className="lg:hidden px-8">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full relative"
          >
            <CarouselContent className="-ml-1">
              {resultCardsData.map((card, index) => (
                <CarouselItem key={index} className="pl-1 md:basis-1/2"> {/* Removed lg:basis-1/3 */}
                  <div className="p-1">
                    <Card
                      className="flex flex-col rounded-lg overflow-hidden h-full
                                 bg-white/10 backdrop-blur-lg border border-white/20
                                 text-card-foreground shadow-lg p-2 pt-4"
                    >
                       {/* Image container for the card */}
                      <div className="relative w-full h-48 bg-gray-900 rounded-lg overflow-hidden">
                        {/* Inner div to create padding around the image */}
                        <div className="absolute inset-0"> {/* This div has the padding */}
                          <Image
                            src={card.imageSrc}
                            alt={card.imageAlt}
                            fill={true} // Image fills this padded inner div
                            className="object-cover rounded-lg" // Image is rounded
                          />
                        </div>
                      </div>
                      <CardHeader className="text-center pt-4 pb-2">
                        <CardTitle className="text-2xl font-semibold text-white">{card.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow text-center text-lg text-gray-200 pb-4">
                        <p>{card.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
             {/* Container for Centered Carousel Navigation Buttons below cards */}
            {/* This div will hold and position the buttons */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex space-x-4 mt-5 w-full justify-around">
              <CarouselPrevious
                // Removed rounded-full, default Shadcn button is usually rounded-md
                className="static !left-auto !right-auto bg-white/30 text-white hover:bg-white/50
                           border border-white/50 hover:border-white/90 w-20 h-20 lg:w-24 lg:h-24" // Smaller size for mobile, optional larger for larger mobile breakpoints
              />
              <CarouselNext
                // Removed rounded-full
                className="static !left-auto !right-auto bg-white/30 text-white hover:bg-white/50
                           border border-white/50 hover:border-white/90 w-20 h-20 lg:w-24 lg:h-24"
              />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}