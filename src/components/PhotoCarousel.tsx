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
  const controlClass =
    "absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-neutral-100 opacity-100 md:opacity-0 shadow-sm ring-1 ring-neutral-700 transition-opacity hover:bg-neutral-900 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-neutral-100 md:group-hover:opacity-100";

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
        className={`${controlClass} left-2`}
        aria-label="Previous image"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={scrollNext}
        className={`${controlClass} right-2`}
        aria-label="Next image"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
