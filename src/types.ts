export interface CustomBlend {
  blendName: string;
  tagline: string;
  sensoryProfile: string;
  tastingNotes: string[];
  brewingGuide: string[];
  culturalPairingStory: string;
}

export interface MenuItem {
  id: string;
  name: string;
  teluguName: string;
  description: string;
  price: string;
  category: "coffee" | "breakfast" | "sweets";
  badge?: string;
  spicyLevel?: number; // 0-3 for spicy dishes
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  stars: number;
}
