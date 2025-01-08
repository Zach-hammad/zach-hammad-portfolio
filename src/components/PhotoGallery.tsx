import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Globe, Camera } from "lucide-react";

// This will be replaced with actual Instagram photos once API integration is set up
const PLACEHOLDER_PHOTOS = [
  {
    src: "/lovable-uploads/a158a666-15c0-46df-b705-d2fc0d429317.png",
    alt: "Coastal View"
  },
  {
    src: "/lovable-uploads/6e7ede49-e35c-4afb-8d4d-bb5f2fb97d2f.png",
    alt: "Grand Canyon"
  },
  {
    src: "/lovable-uploads/2077d59a-3014-4e05-b8d1-499936f71ba1.png",
    alt: "Library"
  },
  {
    src: "/lovable-uploads/46157ab5-592f-45b0-9333-a9b23bd8a892.png",
    alt: "Paris"
  }
];

const PhotoGallery = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-card rounded-lg overflow-hidden md:order-2 p-6">
        <Carousel className="w-full">
          <CarouselContent>
            {PLACEHOLDER_PHOTOS.map((photo, index) => (
              <CarouselItem key={index}>
                <img 
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-[300px] object-cover rounded-lg"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className="space-y-4 md:order-1">
        <div className="flex items-center gap-2 text-primary">
          <div className="flex gap-2">
            <Globe className="h-6 w-6" />
            <Camera className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold">Traveling & Photography</h3>
        </div>
        <p className="text-muted-foreground">
          My passion for traveling and photography allows me to explore different 
          cultures and capture unique moments. These experiences have broadened my 
          perspective and enhanced my creative approach to problem-solving in engineering.
        </p>
      </div>
    </div>
  );
};

export default PhotoGallery;