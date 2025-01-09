import ProjectCard from "@/components/ProjectCard";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Projects = () => {
  const projects = [
    {
      title: "RISC-V CPU Development",
      description: "Advanced implementation of a RISC-V CPU featuring branch prediction, cache management, out-of-order execution, and PC-signature hit predictor. Evolved from single-cycle to fully pipelined architecture.",
      technologies: ["C", "RISC-V", "Pipeline Architecture", "Branch Prediction"],
      imageUrl: "https://images.ctfassets.net/17si5cpawjzf/7DldvNfh97eSJVIN4m6W3q/a3d9b9facf202afea1cc1181c44c7350/Siemens_Nucleus_ReadyStart_RISC_V_Newsroom_tcm27-107856.png",
      codeUrl: "https://github.com/Zach-hammad/RISC-V",
    },
    {
      title: "Hack CPU Development",
      description: "Implementation of a Hack CPU using C programming, featuring address translations, VM translators, ALU, program counter, and memory control systems.",
      technologies: ["C", "Hardware Design", "Memory Management", "CPU Architecture"],
      imageUrl: "https://courses.cs.washington.edu/courses/cse390b/22wi/readings/images/hack_cpu.png",
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
      imageUrl: "https://cdn.corporatefinanceinstitute.com/assets/AdobeStock_130264817-1024x683.jpeg",
      codeUrl: "https://github.com/Zach-hammad/CS375-Project",
      demoUrl: "https://csblackjack.fly.dev/"
    },
    {
      title: "Assembly Projects Collection",
      description: "A growing collection of assembly language projects showcasing low-level programming skills and hardware interaction. More projects coming soon!",
      technologies: ["Assembly", "Low-level Programming", "Hardware Integration"],
      imageUrl: "https://www.investopedia.com/thmb/C7s8G-f9rvaIji0H6JqZgbBNQVo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/assemblylanguage-356836be12ae4723bbbd8e3b6e543b9f.JPG",
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