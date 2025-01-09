import { Users } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const BJJ_PHOTOS = [
  {
    src: "/lovable-uploads/1fd42820-74ec-4745-bfa9-e2824c435112.png",
    alt: "BJJ Training Session 1"
  },
  {
    src: "/lovable-uploads/84fa6c16-d68d-4ff1-916f-114a70c05331.png",
    alt: "BJJ Training Session 2"
  },
  {
    src: "/lovable-uploads/403795dc-4411-4ae0-afb2-65de504c390f.png",
    alt: "BJJ Group Photo"
  },
  {
    src: "/lovable-uploads/6325b319-ba18-43a2-9a41-04143fbaff5c.png",
    alt: "BJJ Training Session 3"
  },
  {
    src: "/lovable-uploads/3f848bb8-007a-4deb-99a5-1bbb0272b133.png",
    alt: "BJJ Group Photo with Students"
  }
];

const BJJSection = () => {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4 md:order-1">
          <div className="flex items-center gap-2 text-primary">
            <Users className="h-6 w-6" />
            <h3 className="text-xl font-semibold">Brazilian Jiu Jitsu</h3>
          </div>
          <p className="text-muted-foreground">
            Beyond academics, I'm deeply involved in Brazilian Jiu Jitsu, where I not 
            only practice but also help teach the kids' class. This experience has taught 
            me valuable lessons in discipline, patience, and the importance of mentoring others.
          </p>
        </div>
        <div className="bg-card rounded-lg overflow-hidden md:order-2 p-6">
          <Carousel className="w-full">
            <CarouselContent>
              {BJJ_PHOTOS.map((photo, index) => (
                <CarouselItem key={index}>
                  <img 
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-[400px] object-cover rounded-lg"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default BJJSection;