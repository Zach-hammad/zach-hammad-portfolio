import { PersonalSection } from "@/lib/types";

export const personalSections: PersonalSection[] = [
  {
    title: "Brazilian Jiu-Jitsu",
    description:
      "I practice BJJ and help teach the kids' class. The discipline, patience, and mentorship translate directly into how I approach engineering problems.",
    images: [
      { src: "/images/bjj/training-1.png", alt: "BJJ training session" },
      { src: "/images/bjj/training-2.png", alt: "BJJ training session" },
      { src: "/images/bjj/group-1.png", alt: "BJJ group photo" },
      { src: "/images/bjj/training-3.png", alt: "BJJ training session" },
      { src: "/images/bjj/group-2.png", alt: "BJJ group with students" },
    ],
  },
  {
    title: "Chess",
    description:
      "My high school chess team won both state and national championships. Chess sharpened my strategic thinking and pattern recognition — skills I use daily in engineering.",
  },
  {
    title: "Travel & Photography",
    description:
      "Exploring different cultures and capturing moments through photography broadens how I think about problems and design.",
    images: [
      { src: "/images/travel/coastal.png", alt: "Coastal view" },
      { src: "/images/travel/grand-canyon.png", alt: "Grand Canyon" },
      { src: "/images/travel/library.png", alt: "Library" },
      { src: "/images/travel/paris.png", alt: "Paris" },
    ],
  },
];
