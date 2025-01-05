import { useTheme } from "next-themes";
import { Moon, Sun, GraduationCap, Users, Globe, Camera, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Index = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-4 right-4 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="h-6 w-6" />
        ) : (
          <Moon className="h-6 w-6" />
        )}
      </button>

      {/* Hero Section */}
      <div className="bg-primary-dark/5 dark:bg-primary-dark py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-slide-up">
            About Me
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up mb-6">
            A Computer Engineering student at Drexel University with diverse interests and achievements.
          </p>
          <Link 
            to="/projects" 
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            View My Projects →
          </Link>
        </div>
      </div>

      {/* About Me Section */}
      <div className="py-16 px-4 bg-secondary/30">
        <div className="container max-w-4xl mx-auto">
          {/* Education */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <GraduationCap className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Education</h3>
              </div>
              <p className="text-muted-foreground">
                I'm Zach Hammad, a Computer Engineering student at Drexel University, 
                set to graduate in June 2025. My academic journey has equipped me with 
                strong foundations in both hardware and software development.
              </p>
            </div>
            <div className="bg-card rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                alt="Education"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>

          {/* Brazilian Jiu Jitsu */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-card rounded-lg overflow-hidden md:order-2">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                alt="Brazilian Jiu Jitsu"
                className="w-full h-48 object-cover"
              />
            </div>
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
          </div>

          {/* Chess */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Crown className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Chess Champion</h3>
              </div>
              <p className="text-muted-foreground">
                I'm proud to have been part of a championship-winning chess team that secured 
                both state and national titles. Chess has sharpened my strategic thinking and 
                problem-solving abilities, skills that translate well into my engineering work.
              </p>
            </div>
            <div className="bg-card rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                alt="Chess"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>

          {/* Hobbies */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-lg overflow-hidden md:order-2 p-6">
              <Carousel className="w-full">
                <CarouselContent>
                  <CarouselItem>
                    <img 
                      src="/lovable-uploads/a158a666-15c0-46df-b705-d2fc0d429317.png"
                      alt="Coastal View"
                      className="w-full h-[300px] object-cover rounded-lg"
                    />
                  </CarouselItem>
                  <CarouselItem>
                    <img 
                      src="/lovable-uploads/6e7ede49-e35c-4afb-8d4d-bb5f2fb97d2f.png"
                      alt="Grand Canyon"
                      className="w-full h-[300px] object-cover rounded-lg"
                    />
                  </CarouselItem>
                  <CarouselItem>
                    <img 
                      src="/lovable-uploads/2077d59a-3014-4e05-b8d1-499936f71ba1.png"
                      alt="Library"
                      className="w-full h-[300px] object-cover rounded-lg"
                    />
                  </CarouselItem>
                  <CarouselItem>
                    <img 
                      src="/lovable-uploads/46157ab5-592f-45b0-9333-a9b23bd8a892.png"
                      alt="Paris"
                      className="w-full h-[300px] object-cover rounded-lg"
                    />
                  </CarouselItem>
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
        </div>
      </div>
    </div>
  );
};

export default Index;
