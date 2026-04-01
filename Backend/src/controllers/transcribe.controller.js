import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from "multer";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const transcribeMiddleware = multer().single("audio");

export const transcribeRoute = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No audio file uploaded" });
  }
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite", 
    });
    const base64Audio = req.file.buffer.toString("base64");

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: req.file.mimetype || "audio/webm",
          data: base64Audio,
        },
      },
      {
        text: "Transcribe this audio exactly. Return only the transcript text, nothing else.",
      },
    ]);
    const transcript = result.response.text();
    res.json({ text: transcript });
  } catch (error) {
    console.error("Transcription error:", error);
    res.status(500).json({ error: "Transcription failed" });
  }
};
