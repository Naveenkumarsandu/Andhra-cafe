import { MenuItem, Testimonial } from "./types";

export const SPECIALTY_COFFEES: MenuItem[] = [
  {
    id: "cof-1",
    name: "Araku Swarna (Golden Cup)",
    teluguName: "అరకు స్వర్ణ ఫిల్టర్ కాఫీ",
    description: "Our signature gold standard. Single-origin Arabica beans from shade-grown organic tribal plantations in Araku Valley, blended with 15% slow-roasted chicory. Smooth, rich, and naturally sweet.",
    price: "₹140",
    category: "coffee",
    badge: "Most Popular"
  },
  {
    id: "cof-2",
    name: "Godavari Dark Decoction",
    teluguName: "గోదావరి చిక్కని కాఫీ",
    description: "For the purists. A robust, double-filtered decoction with 25% rich chicory. Unapologetic body, deep earthy bitterness, and a thick velvet crema of hot whole-cream milk.",
    price: "₹160",
    category: "coffee",
    badge: "Strong"
  },
  {
    id: "cof-3",
    name: "Kona Seema Jaggery Master",
    teluguName: "బెల్లం ఫిల్టర్ కాఫీ",
    description: "Brewed over organic palm jaggery (Nattu Chakkarai) instead of white sugar. The molten jaggery introduces a smoky molasses quality that acts in harmony with the roasted chicory notes.",
    price: "₹170",
    category: "coffee",
    badge: "Heritage Special"
  },
  {
    id: "cof-4",
    name: "Misty Valley Black Gold",
    teluguName: "నల్ల కాఫీ షర్బత్",
    description: "Pure, undiluted top-chamber drip decoction served black, lightly sweetened with wild tribal forest honey and a single cardamom pod. Intense aroma.",
    price: "₹120",
    category: "coffee"
  }
];

export const ANDHRA_BREAKFAST: MenuItem[] = [
  {
    id: "bf-1",
    name: "MLA Butter Pesarattu",
    teluguName: "ఎమ్మెల్యే పెసరట్టు ఉప్మా",
    description: "Crêpe made from freshly ground whole green mung dal, smeared with homemade yellow butter and generously stuffed with aromatic ginger semolina upma. Served with fresh ginger chutney.",
    price: "₹210",
    category: "breakfast",
    badge: "Elite Classic"
  },
  {
    id: "bf-2",
    name: "Guntur Karam Ghee Idli",
    teluguName: "గుంటూరు కారం నెయ్యి ఇడ్లీ",
    description: "Four fluffier-than-clouds steamed rice-and-lentil cakes, deeply drenched in aromatic hot desi ghee and heavily sprinkled with raw fiery Guntur dry red chili podi.",
    price: "₹160",
    category: "breakfast",
    spicyLevel: 3,
    badge: "Spicy Favorite"
  },
  {
    id: "bf-3",
    name: "Rayalaseema Ghee Karappodi Vada",
    teluguName: "కడప కారప్పొడి వడ",
    description: "Two ultra-crisp black-gram donuts infused with peppercorns, split inside, layered with hot Cadapa onion-chili karam and ghee, served on a wet banana leaf.",
    price: "₹140",
    category: "breakfast",
    spicyLevel: 2
  },
  {
    id: "bf-4",
    name: "Neyyi Babai Idli with Chutney Triad",
    teluguName: "నెయ్యి బాబాయ్ ఇడ్లీ",
    description: "A single large, incredibly soft idli topped with a thick dollop of fresh farm butter and a splash of boiling ghee. Paired with a trio of fresh chutneys (Coconut, Tomato, and Roasted chana).",
    price: "₹130",
    category: "breakfast"
  }
];

export const HERITAGE_SWEETS: MenuItem[] = [
  {
    id: "sw-1",
    name: "Araku Filter Coffee Crème Caramel",
    teluguName: "ఫిల్టర్ కాఫీ పుడ్డింగ్",
    description: "A stunning east-meets-west dessert. Velvet set custard baked in a traditional copper ramekin with our own Godavari espresso decoction and caramelized palm sugar.",
    price: "₹180",
    category: "sweets",
    badge: "Chef's Creation"
  },
  {
    id: "sw-2",
    name: "Hot Bobbatlu with Elachi ghee",
    teluguName: "నెయ్యి బొబ్బట్లు",
    description: "Paper-thin, griddled flatbreads filled with a sweet, aromatic mixture of cooked chana dal, cardamom, and jaggery, served steaming hot under a lake of melted pure ghee.",
    price: "₹150",
    category: "sweets"
  },
  {
    id: "sw-3",
    name: "Spiced Pepper Maramuralu Basket",
    teluguName: "మరమరాల చాట్",
    description: "The ultimate savory coffee companion. Light puffed rice tossed with hot peanut oil, crisp roasted curry leaves, fried split chickpeas, red chili powder, and crushed garlic.",
    price: "₹90",
    category: "sweets"
  }
];

export const VINTAGE_TESTIMONIALS: Testimonial[] = [
  {
    id: "tes-1",
    name: "Suryanarayana Raju",
    location: "Visakhapatnam",
    text: "Tastes exactly like the coffee my grandmother brewed in her brass collection on Sunday mornings in Rajahmundry. The proportion of chicory is sheer perfection. No gimmicks, just pure soul.",
    stars: 5
  },
  {
    id: "tes-2",
    name: "Ananya Deshmukh",
    location: "Coffee Enthusiast & Food Critic",
    text: "The MLA Pesarattu stuffed with Upma is legendary, but it's the high-arch dabarah froth pour that caught my heart. You feel the warmth of Andhra hospitality from the very first sip.",
    stars: 5
  },
  {
    id: "tes-3",
    name: "Chandra Shekhar",
    location: "Hyderabad",
    text: "Finding jaggery-infused brass filter coffee this far from the villages was a blessing. I visited Guntur last month, and their spice levels are authentic as can be! The ghee idli has a real bite.",
    stars: 5
  }
];
