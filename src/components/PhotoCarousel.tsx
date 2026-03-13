"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoCarouselProps {
  images: { src: string; alt: string }[];
}

export default function PhotoCarousel({ images }: PhotoCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative group">
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {images.map((image, index) => (
            <div key={index} className="flex-none w-full min-w-0">
              <div className="relative aspect-[4/3]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={scrollPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Previous image"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Next image"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
