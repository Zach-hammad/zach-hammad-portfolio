import { Link } from "react-router-dom";

const AboutHero = () => {
  return (
    <div className="bg-primary-dark/5 dark:bg-primary-dark py-20 px-4">
      <div className="container max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-slide-up">
          Zacharia Hammad
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up mb-6">
        I am a Computer Engineering student at Drexel University, graduating in June 2025. Outside academics, I practice Brazilian Jiu-Jitsu and assist in teaching children’s classes. I am passionate about traveling, photography, and chess, where my team won state and national championships.
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