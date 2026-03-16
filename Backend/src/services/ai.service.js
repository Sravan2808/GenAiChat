import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

export async function testAi(){
    model.invoke("In between these two cricketers Virat Kohli and Rohit Sharma, who is better?Give me in single sentence").then((response) => {
        console.log(response.content);
    })
}