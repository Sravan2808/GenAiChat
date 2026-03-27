import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage,getChats,getMessages,deleteChat} from "../service/chat.api";
import {setChats, setError,setCurrentChatId,setLoading,createNewChat,addNewMessage,addMessages} from "../chat.slice";
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

  async function handleGetChats() {
    dispatch(setLoading(true));
    const data = await getChats();
    const {chats} = data;
    dispatch(setChats(chats.reduce((acc, chat) => {
      acc[chat._id] = {
        id: chat._id,
        title: chat.title,
        messages: [],
        lastUpdated: new Date().toISOString(),
      };
      return acc;
    }, {})));
    dispatch(setLoading(false));
  }

  async function handleOpenChat(chatId) {
    const data = await getMessages(chatId);
    const { messages } = data;
    const formattedMessages = messages.map((msg) => ({
      content: msg.content,
      role: msg.role,
    }));
    dispatch(addMessages({ chatId, messages }));
    dispatch(setCurrentChatId(chatId));
  }
  
  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat
  };
};
