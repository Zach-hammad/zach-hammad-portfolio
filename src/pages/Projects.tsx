import ProjectCard from "@/components/ProjectCard";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Projects = () => {
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
      <div className="container max-w-6xl mx-auto py-16 px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">My Projects</h1>
          <Link to="/" className="text-primary hover:text-primary/80 transition-colors">
            ← Back to About Me
          </Link>
        </div>
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

export default Projects;