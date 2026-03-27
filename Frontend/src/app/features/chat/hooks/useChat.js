import { initializeSocketConnection } from "../service/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
} from "../service/chat.api";
import {
  setChats,
  setError,
  setCurrentChatId,
  setLoading,
  createNewChat,
  addNewMessage,
} from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();

async function handleSendMessage({ message, chatId }) {
    dispatch(setLoading(true));
    try {
      const data = await sendMessage({ message, chatId });
      const { chat, aiMessage } = data;
      const targetChatId = chat ? chat._id : chatId;

      if (!chatId && chat) {
        dispatch(createNewChat({ chatId: targetChatId, title: chat.title || data.title }));
      }
      dispatch(addNewMessage({chatId: targetChatId, content: message, role: "user" }));
      dispatch(addNewMessage({chatId: targetChatId, content: aiMessage.content, role: aiMessage.role }));
      dispatch(setCurrentChatId(targetChatId));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }
  
  return {
    initializeSocketConnection,
    handleSendMessage,
  };
};
