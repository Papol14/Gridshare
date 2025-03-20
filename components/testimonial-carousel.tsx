"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote: "Gridshare has revolutionized how our team collaborates on data projects. The interface is intuitive and the features are powerful.",
    author: "John Paul Escalona",
    position: "Data Analyst at TechCorp",
    avatar: "SJ",
  },
  {
    quote: "The real-time collaboration features have made our remote work seamless. It's like having everyone in the same room.",
    author: "John Paul Escalona",
    position: "Project Manager at InnovateCo",
    avatar: "MC",
  },
  {
    quote: "Security was our main concern, and Gridshare exceeded our expectations. The audit logs and access controls are excellent.",
    author: "John Paul Escalona",
    position: "Security Officer at SecureData",
    avatar: "EW",
  },
  {
    quote: "The customer support team is exceptional. They're always ready to help and provide quick solutions.",
    author: "John Paul Escalona",
    position: "Operations Director at DataFlow",
    avatar: "DM",
  },
  {
    quote: "Gridshare's analytics features have helped us make better data-driven decisions. It's an essential tool for our business.",
    author: "John Paul Escalona",
    position: "Business Analyst at Analytics Pro",
    avatar: "LT",
  },
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setCurrentIndex((current) =>
          current === testimonials.length - 1 ? 0 : current + 1
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsAnimating(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < testimonials.length - 1) {
      goToSlide(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
    setIsAnimating(false);
  };

  const goToSlide = (index: number) => {
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="relative overflow-hidden">
      <div
        ref={containerRef}
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-roledescription="carousel"
        aria-label="Testimonials"
      >
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="min-w-full px-4"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${testimonials.length}`}
          >
            <Card className="mx-auto max-w-2xl transition-all duration-300 hover:shadow-lg">
              <CardContent className="flex flex-col items-center p-4 sm:p-6 text-center">
                <Avatar className="h-12 w-12 sm:h-16 sm:w-16 transition-transform duration-300 hover:scale-110">
                  <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <blockquote className="mt-4 sm:mt-6 text-base sm:text-lg">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="mt-3 sm:mt-4">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.position}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#317B22] disabled:opacity-50 transition-all duration-200"
        onClick={() => goToSlide(currentIndex - 1)}
        disabled={currentIndex === 0 || isAnimating}
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#317B22] disabled:opacity-50 transition-all duration-200"
        onClick={() => goToSlide(currentIndex + 1)}
        disabled={currentIndex === testimonials.length - 1 || isAnimating}
        aria-label="Next testimonial"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots indicator */}
      <div 
        className="mt-6 flex justify-center space-x-2"
        role="tablist"
        aria-label="Testimonial slides"
      >
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-200",
              index === currentIndex 
                ? "bg-[#317B22] scale-125" 
                : "bg-[#67E0A3] hover:bg-[#317B22]"
            )}
            onClick={() => goToSlide(index)}
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`Go to testimonial ${index + 1}`}
            disabled={isAnimating}
          />
        ))}
      </div>
    </div>
  );
}