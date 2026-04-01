import axios from "axios";

const api = axios.create({
  baseURL: "https://genaichat.onrender.com",
  withCredentials: true,
});

export const sendMessage = async ({ message, chatId }) => {
  const response = await api.post("/api/chats/message", { message, chat:chatId });
  return response.data;
};

export const getChats = async () => {
  const response = await api.get(`/api/chats`);
  return response.data;
};

export const getMessages = async (chatId) => {
  const response = await api.get(`/api/chats/${chatId}/messages`);
  return response.data;
};

export const deleteChat = async (chatId) => {
  const response = await api.delete(`/api/chats/delete/${chatId}`);
  return response.data;
};

export const transcribeAudio = async (audioBlob) => {
 const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    const response = await api.post("/api/chats/transcribe", formData);
    return response.data.text;  // return transcript to the component
}
