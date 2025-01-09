import { GraduationCap } from "lucide-react";

const EducationSection = () => {
  return (
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
          src="/lovable-uploads/e956f62c-f8e9-47e5-a420-2072fd1ce061.png"
          alt="Drexel University campus"
          className="w-full h-48 object-cover"
        />
      </div>
    </div>
  );
};

export default EducationSection;