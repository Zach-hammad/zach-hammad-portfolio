import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import AboutHero from "@/components/AboutHero";
import EducationSection from "@/components/EducationSection";
import BJJSection from "@/components/BJJSection";
import ChessSection from "@/components/ChessSection";
import TravelGallery from "@/components/TravelGallery";

const Index = () => {
  const { theme, setTheme } = useTheme();

  const projects = [
    {
      title: "RISC-V CPU Development",
      description: "Advanced implementation of a RISC-V CPU featuring branch prediction, cache management, out-of-order execution, and PC-signature hit predictor. Evolved from single-cycle to fully pipelined architecture.",
      technologies: ["C", "RISC-V", "Pipeline Architecture", "Branch Prediction"],
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      codeUrl: "https://github.com/Zach-hammad/RISC-V",
    },
    {
      title: "Hack CPU Development",
      description: "Implementation of a Hack CPU using C programming, featuring address translations, VM translators, ALU, program counter, and memory control systems.",
      technologies: ["C", "Hardware Design", "Memory Management", "CPU Architecture"],
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      codeUrl: "https://github.com/Zach-hammad/HACK-CPU-Project",
    },
    {
      title: "MLB Data Science Project",
      description: "Developed predictive models using MLB API and web scraping, analyzing player performance trends and creating algorithms for game and season predictions.",
      technologies: ["Python", "Machine Learning", "Web Scraping", "Statistical Analysis"],
      imageUrl: "https://images.unsplash.com/photo-1508802244473-4e46d606e024",
    },
    {
      title: "Web3 Development Project",
      description: "Built a Web3 application with MetaMask authentication, PostgreSQL backend, and Ethereum smart contracts for secure, decentralized operations.",
      technologies: ["Ethereum", "PostgreSQL", "MetaMask", "Smart Contracts"],
      imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
      codeUrl: "https://github.com/Zach-hammad/CS375-Project",
      demoUrl: "https://github.com/Zach-hammad/CS375-Project"
    },
  ];

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