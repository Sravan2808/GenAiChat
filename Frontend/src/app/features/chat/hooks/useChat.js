import { initializeSocketConnection } from "../service/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
  transcribeAudio,
} from "../service/chat.api";
import {
  setChats,
  setError,
  setCurrentChatId,
  setLoading,
  createNewChat,
  addNewMessage,
  addMessages,
  setTranscribing,
  removeChat,
} from "../chat.slice";
import { useDispatch, useSelector } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();
  const {currentChatId,chats} = useSelector((state) => state.chat);

  async function handleSendMessage({ message, chatId }) {
    dispatch(setLoading(true));
    try {
      const data = await sendMessage({ message, chatId });
      const { chat, aiMessage } = data;
      const targetChatId = chat ? chat._id : chatId;

      if (!chatId && chat) {
        dispatch(
          createNewChat({
            chatId: targetChatId,
            title: chat.title || data.title,
          }),
        );
      }
      dispatch(
        addNewMessage({ chatId: targetChatId, content: message, role: "user" }),
      );
      dispatch(
        addNewMessage({
          chatId: targetChatId,
          content: aiMessage.content,
          role: aiMessage.role,
        }),
      );
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
    const { chats } = data;
    dispatch(
      setChats(
        chats.reduce((acc, chat) => {
          acc[chat._id] = {
            id: chat._id,
            title: chat.title,
            messages: [],
            lastUpdated: new Date().toISOString(),
          };
          return acc;
        }, {}),
      ),
    );
    dispatch(setLoading(false));
  }

  async function handleOpenChat(chatId, chats) {
    if (chats[chatId] && chats[chatId].messages.length == 0) {
      const data = await getMessages(chatId);
      const { messages } = data;
      const formattedMessages = messages.map((msg) => ({
        content: msg.content,
        role: msg.role,
      }));
      dispatch(addMessages({ chatId, messages: formattedMessages }));
    }
    dispatch(setCurrentChatId(chatId));
  }

async function handleDeleteChat(chatId) {
    // 1. Remove from UI instantly (makes it super fast)
    dispatch(removeChat(chatId));
    dispatch(setCurrentChatId(null));
    
    // 2. Perform DB deletion in background
    try {
      await deleteChat(chatId);
    } catch (error) {
      dispatch(setError(error.message));
    }
  }

  async function handleTranscribe(audioBlob) {
    dispatch(setTranscribing(true));
    try {
      const text = await transcribeAudio(audioBlob);
      return text;
    } catch (error) {
      dispatch(setError(error.message));
      return null;
    } finally {
      dispatch(setTranscribing(false)); // always resets
    }
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleDeleteChat,
    handleTranscribe,
  };
};
