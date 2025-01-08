import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import AboutHero from "@/components/AboutHero";
import EducationSection from "@/components/EducationSection";
import BJJSection from "@/components/BJJSection";
import ChessSection from "@/components/ChessSection";
import TravelGallery from "@/components/TravelGallery";

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
      <AboutHero />

      {/* About Me Section */}
      <div className="py-16 px-4 bg-secondary/30">
        <div className="container max-w-4xl mx-auto space-y-16">
          <EducationSection />
          <BJJSection />
          <ChessSection />
          <TravelGallery />
        </div>
      </div>
    </div>
  );
};

export default Index;