import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Droplet, Flame, Compass, ChevronRight, HelpCircle } from "lucide-react";

interface Step {
  title: string;
  telugu: string;
  description: string;
  icon: React.ReactNode;
}

export default function FilterVisualizer() {
  const [activeStep, setActiveStep] = useState(0);

  const steps: Step[] = [
    {
      title: "The Brass Bed",
      telugu: "కాఫీ పొడి వేయుట",
      description: "Organic, fine-medium ground Araku Valley Arabica & Robusta beans are tightly packed into the upper perforated chamber of our heavy-gauge brass filter.",
      icon: <Compass className="w-5 h-5 text-amber-600" />
    },
    {
      title: "Gently Tamped",
      telugu: "పిల్లా ఒత్తడం",
      description: "A brass plunger disk (umbrella tamper) is placed lightly over the coffee bed. It ensures the water percolates evenly without drilling channels through the grinds.",
      icon: <Flame className="w-5 h-5 text-amber-600" />
    },
    {
      title: "The Boiling Pour",
      telugu: "వేడి నీళ్ళు పోయుట",
      description: "Freshly boiled mineral water is poured into the upper cylinder. The brass retains intense heat, drawing the oils out of the slow-roast chicory-infused blend.",
      icon: <Flame className="w-5 h-5 text-red-500 animate-pulse" />
    },
    {
      title: "The Golden Drip",
      telugu: "చిక్కటి డికాషన్",
      description: "Over 15 thick, magical minutes, gravity pulls the hot water through. It slowly drips down as a near-opaque, highly-aromatic 'Decoction' in the lower cup.",
      icon: <Droplet className="w-5 h-5 text-yellow-600 animate-bounce" />
    },
    {
      title: "The High-Air Froth",
      telugu: "నురుగు పెట్టడం",
      description: "The decoction is mixed with boiling hot rich milk and sugar, then poured in long, aerodynamic arches between the brass Tumbler and Dabarah bowl (releasing steam & creating micro-bubbles).",
      icon: <Droplet className="w-5 h-5 text-amber-700 font-bold" />
    }
  ];

  return (
    <div className="bg-brand-cream/80 rounded-3xl p-6 md:p-8 border border-brand-beige shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-radial from-brand-beige/30 to-transparent -mr-20 -mt-20 rounded-full pointer-events-none" />
      
      <div className="mb-6">
        <span className="text-xs font-mono font-bold tracking-wider text-brand-saddle bg-brand-beige px-3 py-1 rounded-full">
          Heritage Brewing Craft
        </span>
        <h3 className="text-3xl font-serif text-brand-coffee mt-3 tracking-tight font-bold">
          Secrets of the Brass Drip Filter
        </h3>
        <p className="text-sm text-brand-taupe mt-1">
          Unlike high-pressure modern espresso, classic filter coffee relies on gentle gravity and brass thermal conduction. Follow the slow-extraction cycle below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
        {/* Step List Controller */}
        <div className="lg:col-span-4 space-y-3">
          {steps.map((step, index) => {
            const isSelected = activeStep === index;
            return (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                id={`visualizer-step-${index}`}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex gap-4 items-start cursor-pointer ${
                  isSelected
                    ? "bg-brand-mahogany border-brand-mahogany text-brand-cream shadow-md translate-x-1"
                    : "bg-white border-brand-beige hover:border-brand-saddle/40 hover:bg-brand-beige/25 text-[#4E3629]"
                }`}
              >
                <div
                  className={`flex-none w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    isSelected ? "bg-brand-cream text-brand-mahogany" : "bg-brand-beige text-brand-saddle"
                  }`}
                >
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-sm">{step.title}</span>
                    <span className={`text-[10px] font-sans opacity-70 ${isSelected ? "text-brand-stone" : "text-brand-saddle"}`}>
                      {step.telugu}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${isSelected ? "text-brand-beige/90" : "text-brand-taupe"}`}>
                    {step.description.substring(0, 95)}...
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Interactive Filter Visualizer Panel */}
        <div className="lg:col-span-8 bg-brand-coffee text-brand-cream rounded-3xl h-[420px] relative p-6 flex flex-col justify-between overflow-hidden shadow-xl border border-brand-mahogany">
          {/* Gritty overlay to mimic rust/terracotta atmosphere */}
          <div className="absolute inset-0 bg-stone-950/10 mix-blend-overlay pointer-events-none" />
          
          <div className="flex justify-between items-center relative z-10 border-b border-brand-mahogany/50 pb-3">
            <span className="text-xs font-mono text-brand-stone font-bold tracking-widest uppercase">
              Phase {activeStep + 1}: {steps[activeStep].title}
            </span>
            <span className="text-xs font-serif italic text-brand-beige">
              {steps[activeStep].telugu}
            </span>
          </div>

          {/* Interactive Core Graphic Container */}
          <div className="flex-1 flex items-center justify-center relative p-4 h-full">
            {/* Ambient hot vapor or aroma rings */}
            <AnimatePresence mode="wait">
              {activeStep >= 2 && (
                <motion.div
                  key="aroma-vapor"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 0.35, y: -20, scale: [1, 1.12, 1] }}
                  exit={{ opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute top-12 flex flex-col justify-center items-center pointer-events-none"
                >
                  <div className="w-16 h-1 bg-brand-stone blur-sm rounded-full mb-2" />
                  <div className="w-10 h-1 bg-brand-beige blur-xs rounded-full" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* The Brass Filter Body Stack */}
            <div className="relative w-44 flex flex-col items-centerScale">
              <div className="relative w-44 flex flex-col items-center">
                {/* Top Lid */}
                <div className="w-24 h-2 bg-brand-stone rounded-full shadow-md z-30 opacity-90 border-b border-brand-saddle" />

                {/* Upper Chamber container */}
                <div className="w-28 h-28 bg-gradient-to-r from-amber-600 via-brand-stone to-amber-700 rounded-b-md relative flex flex-col justify-between py-2 border-r border-brand-mahogany shadow-md">
                  {/* Horizontal metal accent lines */}
                  <div className="absolute inset-x-0 top-3 h-0.5 bg-brand-mahogany/30" />
                  <div className="absolute inset-x-0 bottom-3 h-0.5 bg-brand-mahogany/30" />

                  {/* Internal Layer representation based on steps */}
                  <div className="px-3 flex-1 flex flex-col justify-end">
                    {/* Step 1 & 2: Coffee powder layered inside */}
                    {activeStep >= 0 && (
                      <motion.div
                        layout
                        className={`h-10 mx-auto rounded-md relative flex items-center justify-center overflow-hidden w-full ${
                          activeStep === 0
                            ? "bg-brand-coffee border border-brand-mahogany"
                            : "bg-brand-mahogany border-t-2 border-brand-stone shadow-inner"
                        }`}
                      >
                        <span className="text-[10px] font-mono tracking-wider text-brand-beige font-bold uppercase z-10 text-center">
                          {activeStep === 0 ? "Araku Grind Bed (Loose)" : "Tamp Ground Bed (Dense)"}
                        </span>
                        {/* Chicory spots */}
                        <div className="absolute inset-x-0 bottom-1 h-3 bg-stone-900/40 pattern" />
                      </motion.div>
                    )}

                    {/* Step 2: Tamper plunger appearing */}
                    {activeStep >= 1 && (
                      <motion.div
                        initial={{ y: -40, opacity: 0 }}
                        animate={{ y: -3, opacity: 1 }}
                        className="h-1 bg-[#FAF8F5] w-22 mx-auto rounded-full z-20 shadow-sm border-b border-brand-beige"
                      />
                    )}

                    {/* Step 3: Hot Water flooding */}
                    {activeStep >= 2 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 0.8, height: activeStep >= 3 ? 12 : 36 }}
                        className="bg-teal-500/35 border-t border-teal-400 w-full rounded-md mt-1 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-teal-400/35 to-transparent animate-pulse" />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Connecting metal narrow neck */}
                <div className="w-10 h-2 bg-gradient-to-r from-amber-700 via-brand-stone to-amber-800 relative z-20 shadow-xs" />

                {/* Step 3-4: Drip action */}
                <div className="h-14 w-12 relative flex items-center justify-center pb-2">
                  {activeStep === 3 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.div
                        animate={{ y: [0, 48], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeIn" }}
                        className="w-1.5 h-1.5 rounded-full bg-brand-mahogany border border-brand-stone shadow-sm"
                      />
                      <motion.div
                        animate={{ y: [0, 48], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, delay: 0.7, repeat: Infinity, ease: "easeIn" }}
                        className="w-1.5 h-1.5 rounded-full bg-brand-mahogany border border-brand-stone shadow-sm"
                      />
                    </div>
                  )}
                  {activeStep === 4 && (
                    <div className="absolute bottom-2 font-mono text-[9px] text-[#FAF8F5]/80 uppercase">Ready!</div>
                  )}
                </div>

                {/* Bottom Chamber container */}
                <div className="w-24 h-24 bg-gradient-to-r from-amber-600 via-brand-stone to-amber-700 rounded-b-lg relative flex flex-col justify-end p-1 border-r border-[#8B5E3C] shadow-lg">
                  {/* Collected dark decoction */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{
                      height: activeStep >= 3 ? "60%" : "0%"
                    }}
                    className="bg-gradient-to-t from-stone-950 to-brand-coffee w-full rounded-b-md relative overflow-hidden"
                  >
                    {/* Subtle steam light reflection inside bottom container */}
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-brand-stone/50 animate-pulse" />
                    <div className="absolute inset-0 bg-radial from-brand-saddle/10 to-transparent" />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Quick explanation bubble overlay */}
            <div className="absolute bottom-4 right-4 bg-brand-mahogany/95 backdrop-blur-md text-[11px] text-[#FAF8F5] max-w-[190px] p-2.5 rounded-xl border border-brand-saddle/65 shadow-lg z-20">
              <span className="font-semibold block text-brand-stone mb-0.5">Brewmaster Tip:</span>
              {activeStep === 0 && "We ground the Araku beans roasted medium-dark. Too fine, it chokes the drip; too coarse, the flavor remains locked."}
              {activeStep === 1 && "The tamper creates uniform resistance. This causes water to flow slowly, capturing rich tannins and chocolaty notes."}
              {activeStep === 2 && "The water should be 94°C (just off the boil). Bubbling boiling water will scorch the fragile chicory notes."}
              {activeStep === 3 && "Notice the dark, slow, rhythmic drip. No machinery, just gravity capturing the thickest essence of the bean."}
              {activeStep === 4 && "Pouring coffee at arm's length stretches the liquid, cooling it slightly to drinking-sweetness and mixing in rich air bubble textures."}
            </div>
          </div>

          {/* Description footer detail */}
          <div className="bg-brand-mahogany/45 rounded-xl p-3 border border-brand-saddle/40 flex gap-3 items-center z-10">
            <span className="text-brand-stone flex-none bg-brand-coffee rounded-lg p-1.5">
              <Compass className="w-5 h-5" />
            </span>
            <p className="text-xs text-brand-cream/90 leading-relaxed">
              {steps[activeStep].description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
