import ProjectCard from "@/components/ProjectCard";

const Index = () => {
  const projects = [
    {
      title: "Student Management System",
      description: "A full-stack application to manage student records, courses, and grades.",
      technologies: ["React", "Node.js", "MongoDB"],
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      demoUrl: "https://demo.example.com",
      codeUrl: "https://github.com/example/project",
    },
    {
      title: "Weather Dashboard",
      description: "Real-time weather monitoring dashboard with interactive maps.",
      technologies: ["JavaScript", "OpenWeather API", "Leaflet"],
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    },
    {
      title: "Library Management System",
      description: "Digital system for managing books, memberships, and loans.",
      technologies: ["React", "Firebase", "Tailwind CSS"],
      imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570",
      codeUrl: "https://github.com/example/library",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-light py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark mb-6 animate-slide-up">
            My School Projects Portfolio
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slide-up">
            Welcome to my portfolio! Here you'll find a collection of projects I've worked on
            during my academic journey. Each project represents different skills and
            technologies I've learned along the way.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container max-w-6xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;