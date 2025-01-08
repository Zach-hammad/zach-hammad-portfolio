import { Link } from "react-router-dom";

const AboutHero = () => {
  return (
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
  );
};

export default AboutHero;