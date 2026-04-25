import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// --- Credit Scoring Algorithm ---
function calculateResilienceScore(data: any): number {
  let score = 500; // Base score

  // 1. Fuliza Repayment Velocity (Mental Bridge)
  // Quick repayments for inventory (Business Bridge) are highly valued
  if (data.fuliza_repayment_speed === 'fast') score += 120;
  if (data.fuliza_repayment_speed === 'medium') score += 50;
  if (data.fuliza_repayment_speed === 'slow') score -= 100;

  // 2. Utility Consistency (KPLC Tokens)
  if (data.utility_consistency === 'high') score += 100;
  if (data.utility_consistency === 'medium') score += 30;
  if (data.utility_consistency === 'low') score -= 50;

  // 3. Savings Behavior (M-Shwari/Chama)
  if (data.savings_frequency === 'regular') score += 80;

  // 4. Volume Multiplier
  if (data.total_income > 50000) score += 50;

  // Clamp between 300 and 850
  return Math.min(Math.max(score, 300), 850);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // AI Analysis Endpoint
  app.post("/api/analyze-finance", async (req, res) => {
    try {
      const { rawText } = req.body;
      if (!rawText) return res.status(400).json({ error: "No raw data provided" });

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: rawText,
        config: {
          systemInstruction: `
            You are a 'Kenyan Financial Data Parser'. 
            Extract data from the raw text which contains M-Pesa messages, Fuliza logs, and KPLC token SMS.
            
            Strictly extract:
            1. total_income (number)
            2. total_expenditure (number)
            3. fuliza_repayment_speed (enum: 'fast', 'medium', 'slow', 'none')
            4. utility_consistency (enum: 'high', 'medium', 'low')
            5. savings_frequency (enum: 'regular', 'occasional', 'none')
            6. top_insights (array of strings, mix of English and Sheng)
            7. behavioral_advice (string, mix of English and Sheng)
            
            Return ONLY a JSON object matching the requested schema.
          `,
          responseMimeType: "application/json",
        }
      });

      const extractedData = JSON.parse(result.text || "{}");
      
      const resilienceScore = calculateResilienceScore(extractedData);
      
      res.json({
        ...extractedData,
        resilienceScore,
        timestamp: new Date().toISOString(),
        status: 'Strategic'
      });
    } catch (error: any) {
      console.error("AI Analysis Error:", error);
      res.status(500).json({ error: "Failed to analyze data" });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
