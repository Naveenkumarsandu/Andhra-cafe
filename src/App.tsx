import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Coffee,
  MapPin,
  Clock,
  Instagram,
  Phone,
  Bookmark,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  X,
  Sparkles,
  Award,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Heart,
  Search,
  SlidersHorizontal,
  Bell,
  Utensils,
  ChevronRight,
  TrendingUp,
  Share2,
  Menu
} from "lucide-react";
import {
  SPECIALTY_COFFEES,
  ANDHRA_BREAKFAST,
  HERITAGE_SWEETS,
  VINTAGE_TESTIMONIALS
} from "./data";
import { MenuItem } from "./types";
import FilterVisualizer from "./components/FilterVisualizer";
import CoffeeSommelier from "./components/CoffeeSommelier";
import RamarajuChat from "./components/RamarajuChat";

// High-quality image references
const HERO_IMAGE_URL = "/src/assets/images/andhra_cafe_hero_1779694284573.png";
const BREAKFAST_IMAGE_URL = "/src/assets/images/andhra_breakfast_1779694303895.png";
const PLANTER_IMAGE_URL = "/src/assets/images/araku_plantation_1779694326972.png";

export default function App() {
  const [activeTab, setActiveTab] = useState<"explore" | "craft" | "trace" | "chat">("explore");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"all" | "coffee" | "breakfast" | "sweets">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number; sweetOption?: string; toppingsOption?: string }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  // Custom Toppings / Sweetener choices when adding from detail view
  const [customSweetness, setCustomSweetness] = useState("Traditional");
  const [customTopping, setCustomTopping] = useState("Extra Ghee");

  // Table selector simulation
  const [tableNumber, setTableNumber] = useState<string>("T-4");
  
  // Live order processing screen
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderStep, setOrderStep] = useState(0);

  // Dynamic Island states
  const [islandMessage, setIslandMessage] = useState<string | null>(null);
  const [islandIsActive, setIslandIsActive] = useState(false);

  // Promotion Carousel Slides
  const [promoSlide, setPromoSlide] = useState(0);
  const promos = [
    {
      title: "Araku Swarna Deal!",
      desc: "Get 40% OFF this Sunday's golden-pour filter coffee.",
      badge: "Sunday Special",
      color: "from-brand-mahogany to-brand-saddle"
    },
    {
      title: "Guntur Karam Secret",
      desc: "Butter Idlis drenched in fiery podi & homemade cream.",
      badge: "Trending Now",
      color: "from-amber-900 to-rose-950"
    },
    {
      title: "The MLA Feast",
      desc: "Pesarattu crepe stuffed with hot cardamom-kissed upma.",
      badge: "Elite Classic",
      color: "from-brand-coffee to-brand-taupe"
    }
  ];

  // Auto scroll promotion carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setPromoSlide((prev) => (prev + 1) % promos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Trigger brief Dynamic Island alert banner
  const triggerIslandAlert = (message: string) => {
    setIslandMessage(message);
    setIslandIsActive(true);
    setTimeout(() => {
      setIslandIsActive(false);
      setTimeout(() => setIslandMessage(null), 300);
    }, 3000);
  };

  // Menu board aggregation
  const fullMenu = [...SPECIALTY_COFFEES, ...ANDHRA_BREAKFAST, ...HERITAGE_SWEETS];
  
  // Filtering menu items based on active tab category & search input
  const filteredMenu = fullMenu.filter((item) => {
    const matchesCategory = activeCategory === "all" ? true : item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.teluguName.includes(searchQuery) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Assign image based on item categories
  const getItemImage = (category: string, id: string) => {
    if (category === "coffee") return HERO_IMAGE_URL;
    if (category === "breakfast") return BREAKFAST_IMAGE_URL;
    return PLANTER_IMAGE_URL;
  };

  // Add item to shopping tray
  const addToCart = (item: MenuItem, overrideSweet?: string, overrideTopping?: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) => (i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { item, quantity: 1, sweetOption: overrideSweet || "Standard", toppingsOption: overrideTopping || "Standard" }];
    });
    
    triggerIslandAlert(`Added ${item.name}! ☕`);
  };

  // Modify cart item quantity
  const updateQuantity = (itemId: string, val: number) => {
    setCart((prev) => {
      return prev
        .map((i) => {
          if (i.item.id === itemId) {
            const nextQty = i.quantity + val;
            return { ...i, quantity: nextQty };
          }
          return i;
        })
        .filter((i) => i.quantity > 0);
    });
  };

  // Total sums
  const totalItemsCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotalPrice = cart.reduce((acc, curr) => {
    const rawNum = parseInt(curr.item.price.replace("₹", ""));
    return acc + rawNum * curr.quantity;
  }, 0);

  // Simulated Order Progress Handler
  const startCheckoutProgress = () => {
    if (cart.length === 0) return;
    setCartOpen(false);
    setOrderProcessing(true);
    setOrderStep(0);
    triggerIslandAlert("Stoking Boiler! 🔥");

    const timer1 = setTimeout(() => {
      setOrderStep(1);
      triggerIslandAlert("Slow-dripping... ⏳");
    }, 3000);

    const timer2 = setTimeout(() => {
      setOrderStep(2);
      triggerIslandAlert("Frothing High! 🌪️");
    }, 6000);

    const timer3 = setTimeout(() => {
      setOrderStep(3);
      triggerIslandAlert("Arrived at Room! 🎉");
    }, 9000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const completeCheckoutOrder = () => {
    setCart([]);
    setOrderProcessing(false);
    setOrderStep(0);
    setActiveTab("explore");
  };

  return (
    <div className="bg-brand-cream text-brand-coffee min-h-screen selection:bg-brand-mahogany selection:text-brand-cream relative overflow-x-hidden font-sans">
      
      {/* Decorative ambient background warm lights */}
      <div className="absolute top-10 left-10 w-[600px] h-[600px] bg-brand-stone/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-24 right-10 w-[700px] h-[700px] bg-brand-saddle/5 rounded-full blur-3xl pointer-events-none" />

      {/* --- TOP STICKY HEADER NAVIGATION --- */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-beige flex-none shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand Identifier */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-brand-mahogany border-2 border-brand-stone flex items-center justify-center font-serif text-base font-bold text-brand-cream shadow-md relative group select-none">
              AC
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-serif font-extrabold tracking-tight text-[#111111] leading-none">
                  Andhra Cafe
                </span>
                <span className="text-[9px] bg-brand-saddle/10 text-brand-saddle font-mono font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Est. 1982
                </span>
              </div>
              <span className="text-[10px] font-mono text-brand-taupe block font-semibold leading-tight">
                Authentic Araku Valley Drip
              </span>
            </div>
          </div>

          {/* Desktop Tab Navigation Links with Sliding Interactive Pill */}
          <nav className="hidden md:flex items-center gap-1 bg-brand-cream/50 p-1 rounded-xl border border-brand-beige">
            {[
              { id: "explore", label: "Explore Menu", icon: Utensils, hint: "Double Filtered Drips" },
              { id: "craft", label: "Coffee Craft Lab", icon: Sparkles, hint: "Chicory Ratios" },
              { id: "trace", label: "Trace Extraction", icon: Clock, hint: "Gravitational Cycles" },
              { id: "chat", label: "Ask Barista", icon: Coffee, hint: "Mouth-feel Secrets" }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    triggerIslandAlert(`Viewing ${tab.label}! 📁`);
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 relative rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-mono font-bold uppercase tracking-wider overflow-hidden group select-none"
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-brand-mahogany border border-brand-saddle/30 rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${isActive ? "text-brand-cream animate-pulse" : "text-brand-taupe group-hover:text-brand-mahogany"}`} />
                  <span className={`transition-colors duration-150 ${isActive ? "text-brand-cream" : "text-brand-coffee group-hover:text-brand-mahogany"}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Interactive Seating Selections, Active Basket, and Hamburger Control */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Inline Seating Table Selection for Desktop users */}
            <div className="hidden lg:flex items-center gap-2 bg-brand-cream px-3 py-1.5 rounded-xl border border-brand-beige">
              <MapPin className="w-3.5 h-3.5 text-brand-saddle" />
              <div className="text-left leading-none">
                <span className="text-[8px] font-mono text-brand-taupe block leading-none font-bold">DESK SEATING</span>
                <select
                  value={tableNumber}
                  onChange={(e) => {
                    setTableNumber(e.target.value);
                    triggerIslandAlert(`Moved to Desk ${e.target.value}! 📍`);
                  }}
                  className="bg-transparent text-xs font-bold text-brand-coffee border-none focus:outline-none p-0 cursor-pointer pr-4"
                >
                  <option value="Table T-1">Table T-1 (East Window)</option>
                  <option value="Table T-2">Table T-2 (The Veranda)</option>
                  <option value="Table T-3">Table T-3 (Velvet Alcove)</option>
                  <option value="Table T-4">Table T-4 (Old Oak Cozy)</option>
                  <option value="Table T-5">Table T-5 (Barista Counter)</option>
                  <option value="Express Pickup">Takeaway / Self-Pickup</option>
                </select>
              </div>
            </div>

            {/* Shopping Basket Controller Tray button */}
            <button
              onClick={() => setCartOpen(true)}
              className="p-2.5 sm:px-4 sm:py-2 bg-brand-mahogany text-brand-cream rounded-xl hover:bg-brand-saddle active:scale-95 transition-all text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-sm relative"
            >
              <ShoppingBag className="w-4 h-4 text-brand-stone" />
              <span className="hidden sm:inline">Active Tray</span>
              <div className="bg-brand-stone text-brand-coffee px-1.5 py-0.5 rounded-md text-[10px] font-extrabold flex items-center justify-center min-w-5 h-5 leading-none">
                {totalItemsCount}
              </div>
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-600 rounded-full animate-ping" />
              )}
            </button>

            {/* Beautiful responsive Hamburger action menu button for mobile/tablet screens */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 bg-brand-cream border border-brand-beige rounded-xl text-brand-coffee hover:bg-brand-beige active:scale-95 transition-all cursor-pointer shadow-2xs flex items-center justify-center"
              aria-label="Toggle Navigation Options"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-brand-mahogany" /> : <Menu className="w-5 h-5 text-brand-coffee" />}
            </button>

          </div>

        </div>

        {/* --- DYNAMIC COLLAPSIBLE DRAWER ON MOBILE MENU OPEN --- */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="md:hidden border-t border-brand-beige bg-white overflow-hidden"
            >
              <div className="px-5 py-4 space-y-4">
                
                {/* Mobile Desk Booking Controller Selector */}
                <div className="p-3 bg-brand-cream/50 rounded-xl border border-brand-beige flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-saddle" />
                    <div>
                      <span className="text-[10px] font-mono text-brand-taupe font-bold block leading-none">DESK SEATING</span>
                      <span className="text-xs font-bold text-brand-coffee">Active Dining table location</span>
                    </div>
                  </div>
                  <select
                    value={tableNumber}
                    onChange={(e) => {
                      setTableNumber(e.target.value);
                      triggerIslandAlert(`Moved to Desk ${e.target.value}! 📍`);
                    }}
                    className="bg-white text-xs font-bold text-brand-coffee border border-brand-beige rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-mahogany cursor-pointer shadow-3xs"
                  >
                    <option value="Table T-1">T-1 (East Window)</option>
                    <option value="Table T-2">T-2 (The Veranda)</option>
                    <option value="Table T-3">T-3 (Velvet Alcove)</option>
                    <option value="Table T-4">T-4 (Old Oak Cozy)</option>
                    <option value="Table T-5">T-5 (Barista Desk)</option>
                    <option value="Express Pickup">Takeaway / Pickup</option>
                  </select>
                </div>

                {/* Main interactive Tab Links for Mobile with sub-labels */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "explore", label: "Explore Menu", sub: "Breakfast & Drip☕", icon: Utensils },
                    { id: "craft", label: "Craft Lab", sub: "Ratio Customization🏺", icon: Sparkles },
                    { id: "trace", label: "Trace Brew", sub: "Extraction Feed ⏱️", icon: Clock },
                    { id: "chat", label: "Ask Barista", sub: "Ramaraju Assistant 💬", icon: Coffee }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as any);
                          triggerIslandAlert(`Viewing ${tab.label}! 📁`);
                          setMobileMenuOpen(false);
                        }}
                        className={`p-3 rounded-xl flex items-start gap-2.5 transition-all text-left border cursor-pointer ${
                          isActive
                            ? "bg-brand-mahogany border-brand-mahogany text-brand-cream shadow-sm"
                            : "bg-white border-brand-beige text-[#111111] hover:bg-brand-cream/40"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${isActive ? "bg-white/10 text-brand-cream" : "bg-brand-cream text-brand-saddle"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="leading-tight">
                          <span className="text-xs font-bold block">{tab.label}</span>
                          <span className={`text-[9px] font-mono font-medium block mt-0.5 opacity-80`}>
                            {tab.sub}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Fine print or Contact coordinates */}
                <div className="pt-2 border-t border-brand-beige flex justify-between items-center text-[10px] font-mono text-brand-taupe">
                  <span className="font-semibold block">☕ Traditional Araku Coffee rituality</span>
                  <span className="bg-brand-saddle/15 text-brand-saddle px-1.5 py-0.5 rounded leading-none text-[9px] font-bold">In-House Dining</span>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </header>

      {/* --- NOTIFICATIONS BANNER DYNAMIC ISLAND (Centrally located at top) --- */}
      <div className="fixed top-24 inset-x-0 flex justify-center z-50 pointer-events-none">
        <motion.div
          animate={{
            width: islandIsActive ? 320 : 0,
            height: islandIsActive ? 40 : 0,
            opacity: islandIsActive ? 1 : 0,
            borderRadius: 20,
            backgroundColor: "#2C1B12"
          }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className="flex items-center justify-center text-white shadow-xl overflow-hidden px-4"
        >
          <AnimatePresence>
            {islandIsActive && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2.5 text-xs font-mono tracking-wide font-bold text-brand-stone"
              >
                <Coffee className="w-4 h-4 text-brand-stone animate-bounce" />
                <span>{islandMessage || "Processing Kettle..."}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* --- MAIN PAGE VIEW CONTENT CONTAINER --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 min-h-[calc(100vh-14rem)]">
        
        {/* Tab 1: Explore Workspace (Home Screen) */}
        {activeTab === "explore" && (
          <div className="space-y-8">
            
            {/* Split Top Row: Gorgeous expanded Promo Carousel + Cozy brand introduction */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Introduction Column */}
              <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
                <span className="text-xs font-mono font-bold bg-brand-stone/25 text-brand-mahogany w-max px-2.5 py-1 rounded">
                  AUTHENTIC ANDHRA COOPERATIVE
                </span>
                <h2 className="text-3xl sm:text-4.5xl font-serif font-extrabold text-[#111111] leading-tight tracking-tight">
                  Discover Rich Shade-Grown <span className="italic font-light text-brand-saddle font-text">Araku Bliss</span>
                </h2>
                <p className="text-brand-taupe text-sm leading-relaxed font-text">
                  Welcome to our digital table side portal. Hand-roasted Arabica beans paired with double gravity brass slow-filtration and blazing Guntur iron skillet spices. Order right to your active dining desk below.
                </p>

                {/* Live Seating Indicator info */}
                <div className="p-3 bg-white border border-brand-beige rounded-xl flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="font-bold text-brand-coffee">Active Dining Station:</span>
                  </div>
                  <span className="bg-brand-cream px-2 py-0.5 rounded text-brand-mahogany font-bold">{tableNumber}</span>
                </div>
              </div>

              {/* Bold Promotion Carousel Banner Slide */}
              <div className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-sm min-h-[180px] bg-brand-coffee text-brand-cream flex flex-col justify-between p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={promoSlide}
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -25 }}
                    className="space-y-4 h-full flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono bg-white/15 text-brand-cream font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                        {promos[promoSlide].badge}
                      </span>
                      <span className="text-xs text-brand-stone font-mono">⭐ Traditional Drip Since 1982</span>
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-white mb-1">
                        {promos[promoSlide].title}
                      </h3>
                      <p className="text-xs sm:text-sm text-brand-cream/80 font-text max-w-xl leading-relaxed">
                        {promos[promoSlide].desc}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Dots indicator */}
                <div className="absolute bottom-4 right-8 flex gap-1.5">
                  {promos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPromoSlide(idx)}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                        promoSlide === idx ? "bg-brand-stone w-4" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* --- FILTER CONTROL BAR: Wide Search box + Category Pills --- */}
            <div className="bg-white border border-brand-beige p-4 rounded-2xl shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Search Menu Input */}
                <div className="flex-1 max-w-xl bg-brand-cream/50 border border-brand-beige rounded-xl p-2.5 flex items-center gap-2 h-11">
                  <Search className="w-4 h-4 text-brand-taupe opacity-85" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Araku Swarna, Pesarattu upma, Idli..."
                    className="w-full bg-transparent text-sm text-brand-coffee border-none focus:outline-none placeholder-brand-taupe placeholder-opacity-60 font-semibold"
                  />
                  {searchQuery && (
                    <X
                      className="w-4 h-4 text-brand-taupe cursor-pointer hover:text-brand-mahogany"
                      onClick={() => setSearchQuery("")}
                    />
                  )}
                </div>

                {/* Traditional categories triggers */}
                <div className="flex gap-2 overflow-x-auto scrollbar-none text-[10px] font-mono font-medium tracking-wider uppercase">
                  {[
                    { id: "all", label: "Full Board", emoji: "🍛" },
                    { id: "coffee", label: "Heritage Drinks", emoji: "☕" },
                    { id: "breakfast", label: "Crispy Breakfast", emoji: "🥞" },
                    { id: "sweets", label: "Traditional Sweets", emoji: "🏺" }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id as any);
                        triggerIslandAlert(`Filtering ${cat.label}! 📁`);
                      }}
                      className={`px-4 py-2.5 rounded-lg flex items-center gap-2 flex-none transition-all cursor-pointer border ${
                        activeCategory === cat.id
                          ? "bg-brand-mahogany border-brand-mahogany text-brand-cream shadow-sm"
                          : "bg-brand-cream border-brand-beige text-brand-taupe hover:text-brand-coffee"
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* --- GRID LIST OF MENU ITEMS --- */}
            <div className="space-y-4">
              <div className="flex justify-between items-baseline border-b border-brand-beige pb-2">
                <h3 className="text-sm font-mono tracking-widest text-brand-taupe uppercase font-extrabold">
                  Barista & Chef Recommendations
                </h3>
                <span className="text-xs font-mono text-brand-saddle font-bold">
                  Showing {filteredMenu.length} available delicacies
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMenu.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    className="bg-white border border-brand-beige rounded-2xl p-3.5 relative shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group overflow-hidden"
                  >
                    {/* Media container */}
                    <div
                      onClick={() => {
                        setSelectedItem(item);
                        setCustomSweetness("Traditional");
                        setCustomTopping(item.category === "coffee" ? "Palm Jaggery" : "Extra Ghee");
                      }}
                      className="relative h-44 sm:h-48 rounded-xl overflow-hidden leading-none mb-3 cursor-pointer bg-brand-cream"
                    >
                      <img
                        src={getItemImage(item.category, item.id)}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Rating Label Overlay */}
                      <span className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded flex items-center gap-1 z-10 uppercase tracking-widest">
                        ★ 4.9
                      </span>

                      {/* Favorite item button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerIslandAlert(`Saved to Favorites! ❤️`);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-white/75 backdrop-blur-xs rounded-full text-brand-mahogany hover:scale-110 transition-transform cursor-pointer shadow-xs z-10"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-700 fill-rose-700" />
                      </button>

                      {/* Brew length badge */}
                      <span className="absolute bottom-2 left-2 text-[9px] font-mono text-brand-cream bg-brand-mahogany/85 px-1.5 py-0.5 rounded">
                        ⌛ 12m fresh brew
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div
                        onClick={() => {
                          setSelectedItem(item);
                          setCustomSweetness("Traditional");
                          setCustomTopping(item.category === "coffee" ? "Palm Jaggery" : "Extra Ghee");
                        }}
                        className="cursor-pointer space-y-1"
                      >
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-serif font-extrabold text-[#111111] leading-tight group-hover:text-brand-mahogany transition-colors text-sm sm:text-base">
                            {item.name}
                          </h4>
                          {item.badge && (
                            <span className="text-[8px] font-mono text-white bg-brand-saddle/90 uppercase px-1.5 py-0.5 rounded whitespace-nowrap">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] sm:text-xs font-serif text-brand-saddle block italic">
                          {item.teluguName}
                        </span>
                        
                        <p className="text-xs text-brand-taupe font-text leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                      {/* Card Footer: pricing & add action button */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-beam/40">
                        <span className="text-sm font-mono font-extrabold text-brand-mahogany">
                          {item.price}
                        </span>
                        <button
                          type="button"
                          onClick={() => addToCart(item)}
                          className="px-3.5 py-1.5 rounded-lg bg-brand-mahogany hover:bg-brand-saddle text-brand-cream text-xs font-mono font-bold hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </div>
            </div>

            {/* Vintage Testimonial Section added to give premium workspace vibes */}
            <div className="bg-white/50 border border-brand-beige rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-1">
                <span className="text-xs font-mono text-brand-saddle uppercase tracking-widest font-black block">Patron Testimonials</span>
                <h3 className="text-2xl font-serif font-bold text-brand-coffee">Loved Across the Plains</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {VINTAGE_TESTIMONIALS.map((t) => (
                  <div key={t.id} className="p-5 bg-white border border-brand-beige rounded-xl shadow-3xs space-y-3">
                    <span className="text-amber-500 font-bold text-sm">★★★★★</span>
                    <p className="text-xs text-brand-taupe italic font-text leading-relaxed">
                      "{t.text}"
                    </p>
                    <div className="leading-tight">
                      <span className="text-xs font-bold text-brand-coffee block">{t.name}</span>
                      <span className="text-[10px] text-brand-taupe font-mono uppercase font-semibold">{t.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Embedded AI custom blend configurator (Craft Lab) */}
        {activeTab === "craft" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-1.5">
              <span className="text-xs font-mono tracking-widest text-brand-saddle uppercase font-bold block">
                Single-Origin Craft Lab
              </span>
              <h2 className="text-3xl font-serif font-extrabold text-brand-coffee">Configure Your Custom Decoction</h2>
              <p className="text-xs text-brand-taupe max-w-xl mx-auto leading-relaxed">
                South Indian filter coffee has an organic interplay with chicory roots. Tweak your formulation below to generate a unique brewing certificate.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl border border-brand-beige shadow-sm overflow-hidden p-4 sm:p-6 md:p-8">
              <CoffeeSommelier />
            </div>
          </div>
        )}

        {/* Tab 3: Extraction visualizer cycle (Trace Brew) */}
        {activeTab === "trace" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-1.5">
              <span className="text-xs font-mono tracking-widest text-brand-saddle uppercase font-bold block">
                Gravity Drip Mechanics
              </span>
              <h2 className="text-3xl font-serif font-extrabold text-brand-coffee">Live Decoction Heat Visualizer</h2>
              <p className="text-xs text-brand-taupe max-w-xl mx-auto leading-relaxed">
                Observe the precise heating temperatures, boiler chambers, and slow copper percolation speeds required to extract dark liquid essence.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-brand-beige shadow-sm overflow-hidden p-4 sm:p-6 md:p-8">
              <FilterVisualizer />
            </div>
          </div>
        )}

        {/* Tab 4: Barista experts chat conversation (Ask Ramaraju) */}
        {activeTab === "chat" && (
          <div className="max-w-4xl mx-auto h-[600px] bg-white rounded-3xl border border-brand-beige shadow-sm overflow-hidden flex flex-col justify-between">
            <RamarajuChat embedMode={true} />
          </div>
        )}

      </main>

      {/* --- FLOATING MOBILE MENU NAVIGATION ACTION RAIL (Only visible below md screen widths) --- */}
      <div className="md:hidden fixed bottom-4 inset-x-4 h-16 bg-[#1C1411] text-brand-stone rounded-2xl flex items-center justify-between px-4 text-[9px] font-mono font-bold uppercase tracking-wider z-40 shadow-xl border border-brand-mahogany/30 bg-opacity-95 backdrop-blur-md">
        {[
          { id: "explore", label: "Explore", icon: Utensils },
          { id: "craft", label: "Craft Lab", icon: Sparkles },
          { id: "trace", label: "Trace", icon: Clock },
          { id: "chat", label: "Barista", icon: Coffee }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                triggerIslandAlert(`Exploring ${tab.label}! 📁`);
              }}
              className={`flex flex-col items-center gap-1.5 flex-1 transition-colors ${
                isActive ? "text-brand-cream font-extrabold" : "text-brand-stone/60 hover:text-brand-cream"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- FOOTER AT BOTTOM --- */}
      <footer className="bg-brand-coffee text-brand-stone/80 text-xs font-mono py-10 mt-12 border-t border-brand-mahogany">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left space-y-1">
            <span className="font-serif text-brand-cream font-bold text-base block text-[#FAF7F2]">Araku Tribal Farm Estates</span>
            <span>Est. 1982 Cooperative • Andhra Cafe • Hyderabad & Araku Valley</span>
          </div>
          <div className="flex gap-4 items-center">
            <a href="#ig" onClick={(e) => { e.preventDefault(); triggerIslandAlert("Opened Instagram! 📸"); }} className="hover:text-white flex items-center gap-1">
              <Instagram className="w-4 h-4" /> Instagram
            </a>
            <span className="opacity-30">|</span>
            <a href="#tel" onClick={(e) => { e.preventDefault(); triggerIslandAlert("Contacting Andhra Cafe! ☎️"); }} className="hover:text-white flex items-center gap-1">
              <Phone className="w-4 h-4" /> 040-2790-8260
            </a>
          </div>
        </div>
      </footer>

      {/* ========================================== */}
      {/* --- PORTABLE ITEMS CUSTOMIZATION MODAL --- */}
      {/* ========================================== */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity"
              onClick={() => setSelectedItem(null)}
            />
            
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-brand-beige"
              >
                {/* Image Header with close cross */}
                <div className="relative h-56 bg-brand-cream leading-none">
                  <img
                    src={getItemImage(selectedItem.category, selectedItem.id)}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-4 right-4 p-2 bg-white/90 rounded-full text-brand-coffee hover:bg-brand-cream transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-[10px] font-mono bg-brand-saddle px-2.5 py-0.5 rounded uppercase font-bold">
                      {selectedItem.category}
                    </span>
                    <h3 className="text-xl font-serif font-extrabold mt-1 text-[#FAF7F2]">{selectedItem.name}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <span className="text-xs italic text-brand-saddle block mb-2">{selectedItem.teluguName}</span>
                    <p className="text-xs sm:text-sm text-brand-taupe font-text leading-relaxed">{selectedItem.description}</p>
                  </div>

                  {/* Options Selections */}
                  <div className="space-y-4 border-t border-brand-cream pt-4">
                    {selectedItem.category === "coffee" ? (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-brand-taupe font-extrabold block">Sweetness Level</label>
                          <div className="grid grid-cols-3 gap-2">
                            {["Traditional", "Medium Jaggery", "No Sugar"].map((lvl) => (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => setCustomSweetness(lvl)}
                                className={`py-2 px-3 rounded-xl text-center text-xs font-mono font-medium border cursor-pointer transition-colors ${
                                  customSweetness === lvl
                                    ? "bg-brand-mahogany font-bold text-white border-brand-mahogany"
                                    : "bg-brand-cream border-brand-beige text-brand-coffee hover:bg-brand-beige"
                                }`}
                              >
                                {lvl}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-brand-taupe font-extrabold block">Boiling Base Milk Option</label>
                          <div className="grid grid-cols-3 gap-2">
                            {["Whole Cream Milk", "Organic Ghee Spurt", "Vegan Coconut"].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setCustomTopping(opt)}
                                className={`py-2 px-1 text-center text-[10px] font-mono font-semibold border cursor-pointer transition-colors ${
                                  customTopping === opt
                                    ? "bg-brand-mahogany font-bold text-white border-brand-mahogany"
                                    : "bg-brand-cream border-brand-beige text-brand-coffee hover:bg-brand-beige"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-brand-taupe font-extrabold block">Ghee Level Modifier</label>
                          <div className="grid grid-cols-3 gap-2">
                            {["Extra Ghee", "Moderate", "Dry / No Ghee"].map((g) => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => setCustomTopping(g)}
                                className={`py-2 px-3 rounded-xl text-center text-xs font-mono font-medium border cursor-pointer transition-colors ${
                                  customTopping === g
                                    ? "bg-brand-mahogany font-bold text-white border-brand-mahogany"
                                    : "bg-brand-cream border-brand-beige text-[#3C3029] hover:bg-brand-beige"
                                }`}
                              >
                                {g}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Add action */}
                  <button
                    onClick={() => {
                      addToCart(selectedItem, customSweetness, customTopping);
                      setSelectedItem(null);
                    }}
                    className="w-full py-3.5 bg-brand-mahogany hover:bg-brand-saddle text-brand-cream font-bold text-xs uppercase tracking-[0.1em] rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-brand-stone" />
                    Add Customized Selection to Tray ({selectedItem.price})
                  </button>

                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ======================================== */}
      {/* --- CART SLIDE-OUT DRAWER VIEWPORT --- */}
      {/* ======================================== */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/60 z-45"
              onClick={() => setCartOpen(false)}
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
              className="fixed top-0 right-0 h-full w-full max-w-md sm:w-[440px] bg-white z-50 flex flex-col justify-between overflow-hidden shadow-2xl border-l border-brand-beige"
            >
              
              {/* Drawer Header */}
              <div className="p-5 bg-gradient-to-r from-brand-coffee to-brand-mahogany text-brand-cream flex items-center justify-between flex-none">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-stone" />
                  <h3 className="text-base font-serif font-extrabold text-brand-cream">Dabarah Active Tray</h3>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-1 px-2 text-brand-beige bg-white/10 hover:text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items loop */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-brand-cream/20">
                {cart.length === 0 ? (
                  <div className="py-20 text-center text-brand-taupe space-y-4">
                    <Coffee className="w-12 h-12 mx-auto text-brand-stone animate-bounce" />
                    <p className="text-sm uppercase font-mono font-bold">Your Basket is Empty</p>
                    <p className="text-xs text-brand-taupe font-text max-w-xs mx-auto leading-relaxed">
                      Please select Arabica specialty coffees, Guntur podi idlis, or freshly fried Bobbatlu from the explore menu to build your basket.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-brand-cream border border-brand-beige p-3.5 rounded-xl flex justify-between items-center text-xs font-mono">
                      <span className="text-brand-taupe font-bold uppercase">BREWING KEY DIRECTIVE:</span>
                      <span className="text-brand-mahogany font-extrabold text-sm bg-white px-2.5 py-0.5 rounded border border-brand-beige">
                        {tableNumber}
                      </span>
                    </div>

                    {cart.map((crumb, idx) => (
                      <div
                        key={`${crumb.item.id}-${idx}`}
                        className="p-4 bg-white rounded-xl border border-brand-beige flex justify-between items-center gap-4 shadow-3xs"
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-mono bg-brand-saddle/15 text-brand-saddle px-1.5 py-0.5 rounded">
                            {crumb.item.category}
                          </span>
                          <span className="text-sm font-bold text-[#111111] block leading-tight pt-1">
                            {crumb.item.name}
                          </span>
                          
                          <div className="flex flex-wrap gap-1 pt-1">
                            <span className="text-[8px] sm:text-[9px] bg-brand-cream text-brand-saddle px-2 py-0.2 rounded font-mono font-bold">
                              {crumb.sweetOption || "Traditional"}
                            </span>
                            <span className="text-[8px] sm:text-[9px] bg-brand-cream text-brand-taupe px-2 py-0.2 rounded font-mono font-bold">
                              {crumb.toppingsOption || "Standard"}
                            </span>
                          </div>
                          
                          <span className="text-xs font-mono text-brand-taupe block pt-1">{crumb.item.price} each</span>
                        </div>

                        <div className="flex items-center gap-2 flex-none">
                          <button
                            onClick={() => updateQuantity(crumb.item.id, -1)}
                            className="w-6 h-6 bg-brand-cream hover:bg-brand-beige text-brand-coffee rounded flex items-center justify-center text-xs font-mono font-bold cursor-pointer transition-colors"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs text-brand-coffee text-center w-4 font-bold">{crumb.quantity}</span>
                          <button
                            onClick={() => updateQuantity(crumb.item.id, 1)}
                            className="w-6 h-6 bg-brand-cream hover:bg-brand-beige text-brand-coffee rounded flex items-center justify-center text-xs font-mono font-bold cursor-pointer transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Totals & stoke kettle button */}
              {cart.length > 0 && (
                <div className="p-5 bg-white border-t border-brand-beige space-y-4 flex-none">
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-brand-taupe">
                      <span>Dining Table coordinate:</span>
                      <span className="font-bold text-brand-coffee uppercase bg-brand-cream px-2 rounded">{tableNumber}</span>
                    </div>
                    <div className="flex justify-between text-brand-taupe">
                      <span>Barista Extraction Fee:</span>
                      <span className="font-bold text-emerald-800 uppercase">FREE SERVICE</span>
                    </div>
                    <hr className="border-brand-beam/40" />
                    <div className="flex justify-between text-sm font-extrabold text-brand-coffee pt-1">
                      <span>Total Invoice Bill:</span>
                      <span className="text-lg text-brand-mahogany">₹{subtotalPrice}</span>
                    </div>
                  </div>

                  <button
                    onClick={startCheckoutProgress}
                    className="w-full py-4 bg-brand-mahogany hover:bg-brand-saddle text-brand-cream text-xs uppercase tracking-widest font-extrabold rounded-xl shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Stoke Boiler & Send to {tableNumber}</span>
                    <ChevronRight className="w-4 h-4 text-brand-stone" />
                  </button>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ======================================== */}
      {/* --- LIVE ORDER INTERACTIVE PROGRESS --- */}
      {/* ======================================== */}
      <AnimatePresence>
        {orderProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-coffee/98 z-50 p-6 flex flex-col justify-between text-white backdrop-blur-md"
          >
            {/* Ambient warm glow in backdrop */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-saddle/15 rounded-full blur-3xl pointer-events-none" />

            {/* Title / Seeding Header */}
            <div className="text-center pt-8 space-y-2 max-w-md mx-auto">
              <span className="text-[10px] font-mono tracking-widest text-[#D4C3A3] uppercase font-bold block bg-brand-mahogany/85 px-3 py-1 rounded-full w-max mx-auto">
                Live Steam Tracker
              </span>
              <h3 className="text-2xl sm:text-3.5xl font-serif text-brand-cream font-extrabold">Preparing Your Brass Drip</h3>
              <p className="text-sm text-brand-stone font-text">Delivering right away to layout table: <span className="underline decoration-brand-stone">{tableNumber}</span></p>
            </div>

            {/* Steaming brass brewing simulation container */}
            <div className="my-auto flex flex-col justify-center items-center space-y-8">
              <div className="relative">
                {/* Simulated steam vapor rises */}
                <div className="absolute -top-16 inset-x-0 flex flex-col items-center justify-center gap-1.5">
                  <motion.div
                    animate={{ y: [0, -25], opacity: [0, 0.6, 0], scale: [0.8, 1.4, 0.8] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0 }}
                    className="w-8 h-1.5 bg-brand-beige/55 blur-xs rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -25], opacity: [0, 0.6, 0], scale: [0.8, 1.4, 0.8] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
                    className="w-6 h-1 bg-white/40 blur-xs rounded-full"
                  />
                </div>

                {/* Solid realistic copper tumbler representation */}
                <div className="w-20 h-20 bg-gradient-to-r from-amber-500 via-[#D4C3A3] to-amber-600 rounded-b-2xl relative shadow-2xl border-t border-white/20">
                  {/* Frothing texture inside cup */}
                  <div className="absolute top-1 inset-x-2.5 h-1.5 bg-[#1C1411] rounded-sm overflow-hidden flex justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.12, 1], y: [0, -1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-full h-full bg-brand-mahogany"
                    />
                  </div>
                </div>

                {/* Copper plate base bowl */}
                <div className="w-28 h-9 bg-gradient-to-r from-amber-500 via-[#D4C3A3] to-amber-600 rounded-b-lg mx-auto -mt-4 border-t border-white/25 shadow-md" />
              </div>

              {/* Progressive Extraction Timeline */}
              <div className="space-y-4 w-full max-w-md text-xs sm:text-sm font-mono px-4">
                {[
                  { title: "Stoking the Brass Boiler", desc: "Charcoal fires hit 94°C", step: 0 },
                  { title: "Slow-Dripping Extraction", desc: "Araku Valley shade essence gathers", step: 1 },
                  { title: "High-Froth Conduction Aeration", desc: "Dabarah pouring is actively stretched", step: 2 },
                  { title: "Enjoy Piping-Hot Coffee", desc: "Served steaming at your table", step: 3 }
                ].map((node) => {
                  const isActive = orderStep >= node.step;
                  const isCurrent = orderStep === node.step;
                  return (
                    <div key={node.step} className="flex gap-4 items-start bg-brand-cream/5 p-3 rounded-lg border border-white/5">
                      <div className="flex flex-col items-center flex-none">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                            isActive
                              ? "bg-brand-stone text-brand-coffee"
                              : "bg-white/10 text-white/40 border border-white/10"
                          }`}
                        >
                          {isActive ? "✓" : node.step + 1}
                        </div>
                        {node.step < 3 && (
                          <div className={`w-0.5 h-6 ${isActive ? "bg-brand-stone" : "bg-white/10"}`} />
                        )}
                      </div>
                      <div className="leading-tight">
                        <span className={`font-extrabold block text-sm ${isActive ? "text-brand-stone" : "text-white/40"}`}>
                          {node.title} {isCurrent && "• Now progress..."}
                        </span>
                        <span className="text-xs text-white/50 block font-text pt-0.5">{node.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              disabled={orderStep < 3}
              onClick={completeCheckoutOrder}
              className="w-full max-w-md mx-auto py-4 bg-brand-stone hover:bg-white text-brand-coffee disabled:opacity-40 disabled:hover:bg-brand-stone font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl mb-6"
            >
              <span>Enjoy Piping-Hot Coffee, Babji!</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
