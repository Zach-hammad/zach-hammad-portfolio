import { Users } from "lucide-react";

const BJJSection = () => {
  return (
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
  );
};

export default BJJSection;