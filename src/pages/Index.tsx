import ProjectCard from "@/components/ProjectCard";
import { useTheme } from "next-themes";
import { Moon, Sun, Plus, GraduationCap, Users, Globe, Camera, Crown } from "lucide-react";

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
      imageUrl: "https://plus.unsplash.com/premium_photo-1664304792767-f7ebe9bc18da?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWxifGVufDB8fDB8fHww",
    },
    {
      title: "Web3 Development Project",
      description: "Built a Web3 application with MetaMask authentication, PostgreSQL backend, and Ethereum smart contracts for secure, decentralized operations.",
      technologies: ["Ethereum", "PostgreSQL", "MetaMask", "Smart Contracts"],
      imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
      codeUrl: "https://github.com/Zach-hammad/CS375-Project",
      demoUrl: "https://csblackjack.fly.dev/"
    },
    {
      title: "Assembly Projects Collection",
      description: "A growing collection of assembly language projects showcasing low-level programming skills and hardware interaction. More projects coming soon!",
      technologies: ["Assembly", "Low-level Programming", "Hardware Integration"],
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      codeUrl: "https://github.com/Zach-hammad/Assembly-Projects",
      comingSoon: true
    }
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
      <div className="bg-primary-dark/5 dark:bg-primary-dark py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-slide-up">
            My Academic Projects Portfolio
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up">
            A showcase of my technical projects developed during my academic journey,
            featuring CPU architecture, data science, and web development work.
          </p>
        </div>
      </div>

      {/* About Me Section */}
      <div className="py-16 px-4 bg-secondary/30">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">About Me</h2>
          
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
            <div className="bg-card rounded-lg overflow-hidden md:order-2">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                alt="Traveling and Photography"
                className="w-full h-48 object-cover"
              />
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

      {/* Projects Grid */}
      <div className="container max-w-6xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard 
              key={index} 
              {...project} 
              icon={project.comingSoon ? <Plus className="h-5 w-5" /> : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;