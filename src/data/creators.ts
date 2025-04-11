/** @format */

export interface Creator {
  id: number;
  name: string;
  description: string;
  image: string;
  coffees: number;
}

export const creators: Creator[] = [
  {
    id: 1,
    name: "Alice Johnson",
    description: "Frontend wizard & UI/UX enthusiast",
    image: "https://i.pravatar.cc/150?img=26",
    coffees: 58,
  },
  {
    id: 2,
    name: "Dev Dave",
    description: "Building dev tools and open source libraries",
    image: "https://i.pravatar.cc/150?img=53",
    coffees: 74,
  },
  {
    id: 3,
    name: "Sina Sam",
    description: "Digital illustrator & coffee addict",
    image: "https://i.pravatar.cc/150?img=5",
    coffees: 91,
  },
];
