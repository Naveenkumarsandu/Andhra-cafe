import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. API: Custom Coffee Blend Sommelier Configurator
app.post("/api/brew-ai", async (req, res) => {
  try {
    const { chicoryPercent, sweetener, milk, pairingChoice, userNote } = req.body;

    const ai = getAiClient();
    const prompt = `
      Create a customized authentic South Indian Filter Coffee sensory profile based on these parameters:
      - Chicory percentage: ${chicoryPercent}% (Typically: 10% is bright & pure, 20% is traditional & robust, 30% is heavy-bodied & nutty)
      - Sweetener option: ${sweetener} (jaggery, sugar, none)
      - Milk styled: ${milk} (rich milk, light milk, vegan coconut milk, black decoction)
      - Selected food pairing choice: ${pairingChoice || "none"}
      - Custom sensory request notes: ${userNote || "none"}

      Design a cohesive, beautifully described tasting response. Set a high-quality traditional tone. Make the blend name look rustic and beautiful (incorporate Telugu or Telugu-adjacent words like 'Araku Swarna', 'Godavari Madhuram', 'Kona Seema', 'Guntur Agni', 'Visakha Vibe', etc.).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the Head Coffee Sommelier and Master Brewer at Andhra Cafe—a warm, heritage-filled rustic coffee house. Speak with deep poetic appreciation for traditional brass filter coffee, Araku Valley plantation growers, and Andhra's delicious culinary pairings. Provide responses in strict JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            blendName: {
              type: Type.STRING,
              description: "A gorgeous, rustic Telugu-inspired coffee blend name."
            },
            tagline: {
              type: Type.STRING,
              description: "A short, beautiful marketing tagline for this blend."
            },
            sensoryProfile: {
              type: Type.STRING,
              description: "A paragraph detailing the aroma, body, flavor notes, and the sensory experience of drinking this particular combination."
            },
            tastingNotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 to 4 distinct flavor tasting descriptors (e.g., 'Toasted Cocoa', 'Creamy Cardamom', 'Earthy Chicory Bitterness', 'Jaggery Melasse')."
            },
            brewingGuide: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 to 4 short rustic instructions on how to brew this decoction with traditional South Indian brass filter and froth high between tumbler and dabarah."
            },
            culturalPairingStory: {
              type: Type.STRING,
              description: "A delightful 2-3 sentence narrative describing how this blend matches or balances out Guntur Karam podi idlis, MLA pesarattu, or local Andhra breakfasts."
            }
          },
          required: ["blendName", "tagline", "sensoryProfile", "tastingNotes", "brewingGuide", "culturalPairingStory"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Error in /api/brew-ai:", err);
    res.status(500).json({
      error: "Could not create custom blend: " + err.message,
      fallback: {
        blendName: "Araku Swarna Blend",
        tagline: "Golden mornings in a brass tumbler",
        sensoryProfile: "A rich, velvety infusion boasting deep notes of toasted cocoa and wild chicory bitterness, rounded by a soothing, buttery warmth.",
        tastingNotes: ["Toasted Cocoa", "Earthy Chicory", "Jaggery Caramel", "Velvety Body"],
        brewingGuide: [
          "Pack 3 tablespoons into the top chamber of your brass filter.",
          "Add boiled water gently and let the dark red decoction slow-drip for 15 minutes.",
          "Pour high between tumbler and dabarah to create our signature aerated froth."
        ],
        culturalPairingStory: "The deep, earthy sweetness of Araku Valley coffee matches majestically with the high-key fire of Guntur Karam Idlis, quenching the spice while prolonging the roasted richness."
      }
    });
  }
});

// 2. API: Chat with Coffee Master "Ramaraju"
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body; // Array of { role: 'user' | 'model', content: string }
    const ai = getAiClient();

    // Map conversation formatted messages to Gemini format
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: `You are Ramaraju, the seasoned 62-year-old master brewer at Andhra Cafe. Underneath your friendly, down-to-earth exterior lies a treasure trove of coffee lore and culinary passion.
        You speak with a warm, caring, authentic South Indian tone. You often use endearing Telugu terms like 'Sreenu', 'Nanna', 'Amma', or 'Babji' where relevant to make guests feel at home, but keep it readable and highly hospitable.
        Explain the magic of Araku Valley coffee beans (grown organically by tribes in high altitude, misty hills under forest shades), the secret of slow brass filtration, and why adding a bit of roasted chicory root brings out the perfect body and golden foam of traditional filter coffee.
        If asked about dishes, describe Guntur Podi Idli (steamed pillows drenched in hot ghee and handmade spicy garlic lentils podi), the MLA Pesarattu (golden, thin crepe of whole green gram stuffed with aromatic upma), and crispy vadas.
        Keep answers cozy and reasonably concise (1-2 paragraphs max). Answer all questions with grandfatherly warmth.`
      }
    });

    res.json({ content: response.text });
  } catch (err: any) {
    console.error("Error in /api/chat:", err);
    res.status(500).json({
      error: "Error from coffee master: " + err.message,
      fallback: "Ayyoo Babji! It looks like our drip filter got a bit clogged up today. Let me clean the brass grates and get back to you! In the meantime, tell me: how do you take your milk?"
    });
  }
});

// 3. Mount Vite server middleware in dev mode, static folder in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Andhra Cafe Server] cozy fires stoked on http://0.0.0.0:${PORT}`);
  });
}

startServer();
