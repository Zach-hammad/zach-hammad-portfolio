import { Crown } from "lucide-react";

const ChessSection = () => {
  return (
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
      <div className="bg-card rounded-lg overflow-hidden border border-border shadow-sm">
        <img 
          src="/lovable-uploads/84fa6c16-d68d-4ff1-916f-114a70c05331.png"
          alt="Chess team with trophies"
          className="w-full h-48 object-cover object-center"
        />
      </div>
    </div>
  );
};

export default ChessSection;