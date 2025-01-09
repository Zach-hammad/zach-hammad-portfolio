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
          src="https://patch.com/img/cdn20/users/22848544/20190322/124529/styles/raw/public/processed_images/54518853_2113551365349288_5433152407037018112_n-1553272384-4984.jpg"
          alt="Chess team with trophies"
          className="w-full h-48 object-cover object-center"
        />
      </div>
    </div>
  );
};

export default ChessSection;