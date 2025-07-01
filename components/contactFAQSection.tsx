// components/ContactFAQSection.tsx
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircle } from 'lucide-react'; // Using Mail icon, as discussed

// FAQ Data (remains the same)
const faqs = [
  {
    id: "faq-1",
    question: "What kind of trades do you offer?",
    answer: "We offer daily trades across various instruments including stocks, crypto, and futures, focusing on strategies designed for consistent performance. Our approach is tailored to market conditions for optimal results."
  },
  {
    id: "faq-2",
    question: "How do your special signals work?",
    answer: "Our special signals are generated using proprietary algorithms and advanced market analysis. They identify high-probability entry and exit points, providing our expert traders with crucial insights for managed accounts."
  },
  {
    id: "faq-3",
    question: "What is your typical risk/reward ratio?",
    answer: "We meticulously plan each trade aiming for highly favorable risk/reward ratios such as 1:1, 1:2, and even 1:5. This strategic approach maximizes potential returns while strictly managing downside exposure."
  },
  {
    id: "faq-4",
    question: "Do you offer account handling services?",
    answer: "Yes, our comprehensive account handling service allows you to relax while our experienced traders manage your account. We apply our proven strategies to aim for optimal results without you having to be actively involved."
  },
  {
    id: "faq-5",
    question: "How do I get started?",
    answer: "To get started with SignalHunt, simply click the 'Contact Us' button above to reach out for a personalized consultation. Our dedicated team will then guide you through the seamless onboarding process."
  }
];

export function ContactFAQSection() {

  const whatsappNumber = process.env.NEXT_PUBLIC_BUSINESS_NO; 

  const handleContactClick = () => {
    window.location.href = `https://wa.me/${whatsappNumber}`;
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background text-foreground container mx-auto px-8 md:px-12 max-w-6xl">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
        {/* Changed text-primary-foreground to text-white for better contrast */}
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-emerald-500">
          Get in Touch & FAQs
        </h1>
      </div>

      {/* Contact Section */}
      <div className="p-6 md:p-8 rounded-lg shadow-xl mb-16 flex flex-col md:flex-row items-center justify-between gap-6 bg-blue-500">
        <div className="text-center md:text-left max-w-2xl">
          {/* Changed text-primary-foreground to text-white for better contrast */}
          <h2 className="text-2xl font-bold text-white mb-2">Ready to Boost Your Trades?</h2>
          {/* Changed text-muted-foreground to text-gray-200 for better contrast */}
          <p className="text-white/70 text-lg">
            If you want to achieve maximum results with your trades, don&apos;t hesitate. Contact us now to learn how we can help you succeed.
          </p>
        </div>
        <Button
          onClick={handleContactClick}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-semibold rounded-lg shadow-md transition-transform duration-200 transform hover:scale-105 flex items-center gap-2"
        >
          Contact Us <MessageCircle className="w-10 h-10" />
        </Button>
      </div>

      {/* FAQ Section */}
      <div className="space-y-8">
        <div className="text-center">
          {/* Changed text-primary-foreground to text-white for better contrast */}
          <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
          {/* Changed text-muted-foreground to text-gray-300 for better contrast */}
          <p className="text-white/70 mt-2">Find answers to common inquiries about our services.</p>
        </div>
        <Accordion type="single" collapsible className="w-full max-w-3xl px-4 mt-4 md:mt-10 mx-auto">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              {/* Changed text-primary-foreground to text-white for better contrast */}
              <AccordionTrigger className="text-lg font-medium text-white/70 hover:text-white">
                {faq.question}
              </AccordionTrigger>
              {/* Changed text-muted-foreground to text-white/70 for better contrast */}
              <AccordionContent className="text-white/70 text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}