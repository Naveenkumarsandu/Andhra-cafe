import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Coffee, Flame, Sparkles, Sliders, CheckCircle, RefreshCw, Layers } from "lucide-react";
import { CustomBlend } from "../types";

export default function CoffeeSommelier() {
  const [chicoryPercent, setChicoryPercent] = useState<number>(15);
  const [sweetener, setSweetener] = useState<string>("jaggery");
  const [milk, setMilk] = useState<string>("rich-milk");
  const [userNote, setUserNote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPhase, setLoadingPhase] = useState<string>("");
  const [blendResult, setBlendResult] = useState<CustomBlend | null>(null);

  // Phases of drip coffee to rotate during loading for realistic sensory experience
  const loadingPhases = [
    "Measuring altitude shade-grown Araku beans...",
    "Stoking up the hot water kettle...",
    "Slow-dripping dark gold decoction through brass grates...",
    "Frothing high at arm's length into the dabarah bowl...",
  ];

  const handleBrew = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setBlendResult(null);

    // Play with phases during loading
    let currentPhase = 0;
    setLoadingPhase(loadingPhases[0]);
    const interval = setInterval(() => {
      currentPhase = (currentPhase + 1) % loadingPhases.length;
      setLoadingPhase(loadingPhases[currentPhase]);
    }, 1800);

    try {
      const res = await fetch("/api/brew-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chicoryPercent,
          sweetener,
          milk,
          userNote
        })
      });
      const data = await res.json();
      setBlendResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBlendResult(null);
    setChicoryPercent(15);
    setSweetener("jaggery");
    setMilk("rich-milk");
    setUserNote("");
  };

  return (
    <div className="bg-brand-cream border-y md:border border-brand-beige md:rounded-3xl p-6 md:p-8 lg:p-10 relative">
      <div className="absolute top-0 left-0 w-32 h-32 bg-brand-beige/25 rounded-full blur-2xl pointer-events-none" />
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 bg-brand-mahogany text-brand-cream px-3.5 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase mb-3 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-stone animate-spin" />
            Interactive Araku Sommelier
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-brand-coffee tracking-tight font-bold">
            Design Your Custom Filter Blend
          </h2>
          <p className="text-sm md:text-base text-brand-taupe mt-2 max-w-xl mx-auto font-text">
            Traditional filter coffee is highly subjective. Tweak our slow-drip parameters below to trigger our AI Roast Master to forge your personalized sensory profile.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!blendResult && !loading && (
            <motion.form
              key="blend-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              onSubmit={handleBrew}
              className="space-y-6 bg-white border border-brand-beige p-6 md:p-8 rounded-2xl shadow-sm"
            >
              {/* Chicory Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-sm font-semibold text-brand-coffee flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-brand-saddle" />
                    Chicory Roast Ratio: {chicoryPercent}%
                  </label>
                  <span className="text-xs text-brand-saddle font-mono font-medium">
                    {chicoryPercent <= 10 && "Pure & Citrusy"}
                    {chicoryPercent > 10 && chicoryPercent <= 20 && "Balanced & Sweet Caramel"}
                    {chicoryPercent > 20 && "Thick-Body & Earthy Roasted Nectar"}
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  step="5"
                  value={chicoryPercent}
                  onChange={(e) => setChicoryPercent(parseInt(e.target.value))}
                  className="w-full h-2 bg-brand-cream rounded-lg appearance-none cursor-pointer accent-brand-mahogany"
                />
                <div className="flex justify-between text-[11px] text-brand-taupe font-mono">
                  <span>5% (Light)</span>
                  <span>15% (Typical Swarna)</span>
                  <span>25% (Godavari Body)</span>
                  <span>35% (Max Bitterness)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sweetener Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-brand-coffee block">Sweetener Essence</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "jaggery", label: "Palm Jaggery", desc: "Smoky molasses" },
                      { id: "sugar", label: "Crystal Sugar", desc: "Pure sweet profile" },
                      { id: "none", label: "No Sweetener", desc: "Bitter & raw" }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSweetener(item.id)}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-between items-center h-20 cursor-pointer ${
                          sweetener === item.id
                            ? "bg-brand-mahogany text-brand-cream border-brand-mahogany shadow-sm"
                            : "bg-brand-cream/40 hover:bg-brand-cream text-brand-coffee border-brand-beige"
                        }`}
                      >
                        <span className="text-xs font-semibold block">{item.label}</span>
                        <span className={`text-[10px] ${sweetener === item.id ? "text-brand-stone" : "text-brand-taupe"}`}>
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Milk Base Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-brand-coffee block">Milk Emulsion Vibe</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "rich-milk", label: "Whole Cream", desc: "Dabarah classic" },
                      { id: "vegan-coconut", label: "Coconut Milk", desc: "Nutty vegan twist" },
                      { id: "black-decoction", label: "Pure Black", desc: "Naked aroma" }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setMilk(item.id)}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-between items-center h-20 cursor-pointer ${
                          milk === item.id
                            ? "bg-brand-mahogany text-brand-cream border-brand-mahogany shadow-sm"
                            : "bg-brand-cream/40 hover:bg-brand-cream text-brand-coffee border-brand-beige"
                        }`}
                      >
                        <span className="text-xs font-semibold block">{item.label}</span>
                        <span className={`text-[10px] ${milk === item.id ? "text-brand-stone" : "text-brand-taupe"}`}>
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Custom Sensory Note */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-coffee block">Special Sensory Requests (Optional)</label>
                <input
                  type="text"
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder="e.g., Make it intensely cardamom-focused, low-acid, or heavy aftertaste"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-beige bg-brand-cream/25 focus:bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-mahogany text-brand-coffee"
                />
              </div>

              {/* Brew Request Action */}
              <button
                type="submit"
                id="brew-blend-btn"
                className="w-full py-4 px-6 bg-brand-mahogany text-brand-cream rounded-xl font-bold uppercase text-xs tracking-[0.2em] shadow-lg hover:bg-brand-saddle hover:shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <Coffee className="w-5 h-5 text-brand-stone" />
                Forge My House Blend
              </button>
            </motion.form>
          )}

          {/* Loading Transition and Drip */}
          {loading && (
            <motion.div
              key="loading-blend"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 flex flex-col items-center justify-center text-center space-y-4 bg-white rounded-2xl border border-brand-beige shadow-sm"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="w-20 h-20 rounded-full border-t-2 border-r-2 border-brand-mahogany border-b border-l border-brand-cream"
                />
                <Coffee className="w-8 h-8 text-brand-mahogany absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-serif text-brand-coffee font-bold">Stoking the Brass Grates...</h4>
                <p className="text-xs font-mono text-brand-saddle font-semibold animate-pulse">{loadingPhase}</p>
              </div>
            </motion.div>
          )}

          {/* Sensory Blend Certificate Result */}
          {blendResult && !loading && (
            <motion.div
              key="blend-result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-cream/60 border border-brand-beige rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-lg"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-beige/25 rounded-full blur-2xl pointer-events-none" />
              
              {/* Reset Control */}
              <button
                onClick={handleReset}
                className="absolute top-4 right-4 p-2 text-brand-taupe hover:text-brand-mahogany hover:bg-brand-beige/40 rounded-full transition-all border border-brand-beige cursor-pointer"
                title="Design another blend"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <div className="text-rose-900/40 text-7xl font-serif absolute -left-4 -top-4 select-none opacity-5">
                ☕
              </div>

              {/* Title & Badge */}
              <div className="border-b border-brand-beige pb-4 mb-6">
                <span className="text-[10px] font-mono tracking-widest text-brand-saddle uppercase font-semibold block mb-1">
                  Your Formulation Certificate
                </span>
                <h3 className="text-2xl md:text-3.5xl font-serif text-brand-coffee font-extrabold tracking-tight">
                  {blendResult.blendName}
                </h3>
                <p className="text-xs md:text-sm font-sans italic text-brand-mahogany font-bold mt-1">
                  "{blendResult.tagline}"
                </p>
              </div>

              {/* Grid content detailing everything */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* Left Side: Sensory profile & Tasting descriptors */}
                <div className="space-y-4">
                  <div>
                    <h5 className="text-xs font-mono text-brand-saddle tracking-wider uppercase font-bold mb-1">
                      Sensory & Tasting Profile
                    </h5>
                    <p className="text-sm text-brand-taupe leading-relaxed font-text">
                      {blendResult.sensoryProfile}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-xs font-mono text-brand-saddle tracking-wider uppercase font-bold mb-2">
                      Deconstructed Tasting Notes
                    </h5>
                    <div className="flex flex-wrap gap-1.5 flex-row">
                      {blendResult.tastingNotes.map((note, index) => (
                        <span
                          key={index}
                          className="bg-brand-mahogany text-brand-cream text-[11px] font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-wider"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side: Brewing guide & Pairing recommendations */}
                <div className="space-y-4 border-t md:border-t-0 md:border-l border-brand-beige pt-4 md:pt-0 md:pl-6">
                  <div>
                    <h5 className="text-xs font-mono text-brand-saddle tracking-wider uppercase font-bold mb-1">
                      Gourmet Andhra Pairings
                    </h5>
                    <p className="text-sm text-brand-taupe leading-relaxed font-text">
                      {blendResult.culturalPairingStory}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-xs font-mono text-brand-saddle tracking-wider uppercase font-bold mb-2">
                      Roastmaster Pour Instructions
                    </h5>
                    <ul className="text-xs text-brand-taupe space-y-2 font-text">
                      {blendResult.brewingGuide.map((step, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                          <CheckCircle className="w-3.5 h-3.5 text-brand-saddle flex-none mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action: prompt order */}
              <div className="mt-8 pt-6 border-t border-brand-beige flex flex-col sm:flex-row gap-4 items-center justify-between">
                <p className="text-xs text-brand-taupe opacity-95">
                  Formulation is locked. Our baristas can brew this exact blend on your next table visit!
                </p>
                <button
                  onClick={() => alert(`Your blend "${blendResult.blendName}" formulation has been saved to your local session and sent to Ramaraju, the barista!`)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-brand-mahogany text-brand-cream hover:bg-brand-saddle rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Order Blend on Table
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
