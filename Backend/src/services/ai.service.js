import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage,AIMessage } from "@langchain/core/messages";
import { ChatMistralAI } from "@langchain/mistralai";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function generateResponse(messages) {
  const response = await geminiModel.invoke(messages.map((msg)=>{
    if(msg.role === "user") {
      return new HumanMessage(msg.content);
    }
    else if(msg.role === "ai") {
      return new AIMessage(msg.content);
    }
  }));
  return response.text;
}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`You are a helpful assistant that generates concise and descriptive titles for chat conversations.
            Given the following conversation, generate a title that captures the main topic and essence of the discussion. The title should be no more than 5 words and should be engaging and informative.`),
            new HumanMessage(`Generate a title for the following conversation: ${message}`),   
  ]);

  return response.text;
}
