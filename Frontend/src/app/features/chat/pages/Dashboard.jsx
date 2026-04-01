import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactMarkdown from "react-markdown";
import {
  LuPlus,
  LuMessageCircle,
  LuPanelLeft,
  LuUser,
  LuLogOut,
  LuPaperclip,
  LuImage,
  LuMic,
  LuSend,
  LuSquare,
  LuSparkles,
  LuFileText,
  LuCode,
  LuWand,
  LuLoader,
  LuX,
} from "react-icons/lu";
import { useChat } from "../hooks/useChat";
import { setCurrentChatId } from "../chat.slice";
import remarkGfm from "remark-gfm";
import { useAuth } from "../../auth/hook/useAuth";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Good Morning";
  if (h >= 12 && h < 17) return "Good Afternoon";
  return "Good Evening";
};

const SUGGESTIONS = [
  { icon: LuSparkles, label: "Ask anything" },
  { icon: LuWand, label: "Help me write" },
  { icon: LuFileText, label: "Summarize text" },
  { icon: LuCode, label: "Debug code" },
];

export default function Dashboard() {
  const dispatch = useDispatch();
  const chat = useChat();
  const auth = useAuth();

  useEffect(() => {
    (chat.initializeSocketConnection(), chat.handleGetChats());
  }, []);

  // ── Redux state ──
  const chats = useSelector((state) => state.chat.chats); // { [chatId]: { id, title, messages: [] } }
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isLoading = useSelector((state) => state.chat.isLoading);
  const user = useSelector((state) => state.auth.user);
  const isTranscribing = useSelector((state) => state.chat.isTranscribing);

  // ── Local UI state ──
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const messagesEndRef = useRef(null);
  const avatarRef = useRef(null);
  const textareaRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  // ── Derived values ──
  // Current chat object from Redux
  const currentChat = currentChatId ? chats[currentChatId] : null;
  // Messages for the active chat; fall back to empty array
  const messages = currentChat?.messages ?? [];
  // Whether a conversation has started (chat exists and has at least one message)
  const hasStarted = Boolean(currentChat && messages.length > 0);
  // Sidebar chat list from Redux (convert object → array, sorted by lastUpdated desc)
  const chatList = Object.values(chats).sort(
    (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated),
  );

  const userObj = user?.user || user; // Fallback in case of different nesting
  const username = userObj?.username || "Guest";
  const initial = username.charAt(0).toUpperCase();
  const mail = userObj?.email || "";
  // ── Auto-scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ── Close avatar dropdown on outside click ──
  useEffect(() => {
    const fn = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target))
        setAvatarOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // ── Send message ──
  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    setInputValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // useChat dispatches: createNewChat, addNewMessage (user), addNewMessage (ai), setCurrentChatId
    await chat.handleSendMessage({ message: text, chatId: currentChatId });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── New chat: clear current chat selection ──
  const handleNewChat = () => {
    dispatch(setCurrentChatId(null));
    setInputValue("");
  };

  // ── Select existing chat from sidebar ──
  const handleSelectChat = (chatId) => {
    chat.handleOpenChat(chatId, chats);
    setInputValue("");
  };
  const handleLogout = () => {
    auth.handleLogout();
  };

  const toggleRecording = async () => {
    // ── Stop recording ──
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    // ── Start recording ──
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      streamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      // Collect audio chunks every 250ms
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      // When stopped — send to Gemini for transcription
      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        streamRef.current?.getTracks().forEach((t) => t.stop());

        const transcript = await chat.handleTranscribe(blob);
        if (transcript) {
          setInputValue((prev) =>
            prev ? prev + " " + transcript : transcript,
          );
        }
      };

      mediaRecorder.start(250);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
      alert(
        "Could not access microphone. Please allow microphone permissions.",
      );
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-card-foreground font-sans">
      {/* ══════════════════ SIDEBAR ══════════════════ */}
      <aside
        className={`flex flex-col ${
          sidebarOpen ? "w-56" : "w-0"
        } min-w-0 overflow-hidden bg-card/50  transition-all duration-300`}
      >
        {/* Top accent gradient line */}
        <div className="h-0.5 bg-gradient-to-r from-primary to-secondary flex-shrink-0" />

        {/* Brand */}
        <div className="px-4 py-3  flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md flex-shrink-0 bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/40">
            <LuMessageCircle className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm whitespace-nowrap text-card-foreground tracking-tight">
            S2 Chat
          </span>
        </div>

        {/* New chat button */}
        <div className="p-3 border-b border-foreground/20">
          <button
            onClick={handleNewChat}
            className="w-full px-3 py-2 rounded-lg text-xs font-semibold border border-secondary/30 bg-gradient-to-br from-secondary/20 to-teal-900/20 text-secondary hover:from-secondary/40 hover:to-teal-900/40 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <LuPlus className="w-3.5 h-3.5" />
            New Chat
          </button>
        </div>

        {/* Recents label */}
        <div className="px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-muted-foreground/70 whitespace-nowrap">
          Recents
        </div>

        {/* Chat list — driven by Redux */}
        <nav className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5 flex flex-col">
          {chats.length === 0 && (
            <p className="text-xs text-muted-foreground/50 px-3 py-2">
              No chats yet
            </p>
          )}
          {Object.values(chats).map((c) => {
            const active = currentChatId === c.id;
            return (
              <div
                key={c.id}
                className="relative group w-full flex items-center"
              >
                <button
                  onClick={() => handleSelectChat(c.id)}
                  className={`w-full text-left pr-8 pl-3 py-2 rounded-lg text-xs font-medium transition-all overflow-hidden whitespace-nowrap flex items-center gap-2 ${
                    active
                      ? "bg-gradient-to-r from-primary/60 to-secondary/40 text-card-foreground shadow-lg shadow-primary/30"
                      : "text-muted-foreground hover:bg-primary/10"
                  }`}
                >
                  <LuMessageCircle className="w-3 h-3 flex-shrink-0 opacity-60" />
                  <span className="overflow-hidden cursor-pointer text-ellipsis">
                    {c.title}
                  </span>
                </button>

                {/* Delete button (X) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening the chat when deleting
                    chat.handleDeleteChat(c.id);
                  }}
                  className={`absolute right-2 p-1 cursor-pointer rounded-md transition-all opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 ${
                    active
                      ? "text-card-foreground opacity-100"
                      : "text-muted-foreground"
                  }`}
                  title="Delete chat"
                >
                  <LuX className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </nav>

        {/* Bottom fade line */}
        <div className="h-px bg-gradient-to-r from-primary/20 to-secondary/20 flex-shrink-0" />
      </aside>

      {/* ══════════════════ MAIN ══════════════════ */}
      <main className="flex flex-col flex-1 overflow-hidden relative">
        {/* ── Header ── */}
        <header className="flex items-center justify-between px-5 py-3  bg-card/30 gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className="p-2 rounded-lg bg-transparent hover:bg-muted/50 transition-all text-muted-foreground flex-shrink-0"
            >
              <LuPanelLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground font-medium">
              {currentChat ? currentChat.title : "New Chat"}
            </span>
          </div>

          {/* Avatar dropdown */}
          <div ref={avatarRef} className="relative">
            <button
              onClick={() => setAvatarOpen((p) => !p)}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white transition-all flex-shrink-0 ${
                avatarOpen
                  ? "bg-gradient-to-br from-primary to-secondary ring-2 ring-offset-2 ring-primary"
                  : "bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60"
              }`}
            >
              {initial}
            </button>

            {avatarOpen && (
              <div className="absolute top-full right-0 mt-2 w-52 bg-card border border-foreground/20 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-foreground/20 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-xs text-white shadow-lg shadow-primary/40">
                    {initial}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-card-foreground">
                      {username}
                    </div>
                    <div className="text-xs text-muted-foreground">{mail}</div>
                  </div>
                </div>
                <div className="h-px bg-foreground/20" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 cursor-pointer py-2.5 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-all flex items-center gap-2 font-semibold"
                >
                  <LuLogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ── Messages / Welcome ── */}
        <div className="messages flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-4">
          {/* Welcome screen — shown when no chat is active or chat has no messages */}
          {!hasStarted && (
            <div className="flex flex-col items-center justify-center h-full gap-1.5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/40 mb-3">
                <LuMessageCircle className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-center bg-gradient-to-r from-card-foreground to-muted-foreground bg-clip-text text-transparent">
                {getGreeting()}, {username}
              </h1>
              <p className="text-sm text-muted-foreground">
                What can I help you with today?
              </p>
              <div className="grid grid-cols-2 gap-1.5 mt-5 w-full max-w-sm">
                {SUGGESTIONS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.label}
                      onClick={() => {
                        setInputValue(s.label);
                        textareaRef.current?.focus();
                      }}
                      className="px-3 py-2 rounded-lg border border-foreground/20 bg-card/50 text-muted-foreground hover:border-primary hover:bg-primary/20 hover:text-primary transition-all flex items-center gap-1.5 text-left text-xs font-medium"
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Message bubbles — sourced from Redux */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col gap-0.5 ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <span className="text-xs text-muted-foreground px-1">
                {msg.role === "user" ? username : "S2"}
              </span>

              <div
                className={`flex items-end gap-2 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {msg.role === "ai" && (
                  <div className="w-6 h-6 rounded-lg flex-shrink-0 bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/30">
                    <LuMessageCircle className="w-3 h-3 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-primary/80 to-accent/60 text-primary-foreground shadow-lg shadow-primary/40 rounded-br-sm"
                      : "bg-card text-card-foreground shadow-md shadow-black/20 rounded-bl-sm prose prose-sm dark:prose-invert max-w-none"
                  }`}
                >
                  {msg.role === "ai" ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator — shown while waiting for AI response */}
          {isLoading && (
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-lg flex-shrink-0 bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/30">
                <LuMessageCircle className="w-3 h-3 text-white" />
              </div>
              <div className="bg-card border border-foreground/20 px-4 py-3 rounded-2xl rounded-bl-sm shadow-md flex items-center gap-2">
                <LuLoader className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
                <span className="text-xs text-muted-foreground">
                  S2 is thinking…
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ══════════════════ INPUT AREA ══════════════════ */}
        <div className="px-5 py-3.5 bg-transparent  flex-shrink-0">
          <div
            className={`rounded-2xl border bg-input/50 transition-all overflow-hidden ${
              inputFocused
                ? "border-primary ring-2 ring-primary/30 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]"
                : "border-foreground/20 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]"
            }`}
          >
            {/* Top chips */}
            <div
              className={`flex items-center gap-1 overflow-x-auto no-scrollbar whitespace-nowrap px-3 pt-2.5 pb-0 border-b transition-all ${
                inputFocused ? "border-primary/20" : "border-transparent"
              }`}
            >
              {["Concise", "Detailed", "Friendly"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setInputValue((p) => `[${tag}] ${p}`)}
                  className="px-2 py-1 rounded-full border border-foreground/20 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/10 transition-all"
                >
                  {tag}
                </button>
              ))}
              <div className="flex-1" />
              <span className="text-xs text-muted-foreground font-mono">
                {inputValue.length}/4000
              </span>
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              rows={3}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Message S2 Chat…"
              disabled={isLoading}
              className="w-full px-4 py-3 resize-none bg-transparent border-none outline-none text-sm leading-relaxed text-card-foreground placeholder-muted-foreground max-h-44 block font-sans disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* Bottom toolbar */}
            <div className="flex items-center gap-1.5 px-2.5 pb-1.5">
              <div className="flex-1" />

              <span className="text-xs text-muted-foreground">
                {inputValue.trim() ? "⏎ send" : "Shift+⏎ newline"}
              </span>

              {/* Voice button */}
              <button
                onClick={toggleRecording}
                disabled={isLoading || isTranscribing}
                className={`p-2 rounded-lg flex-shrink-0 transition-all
    flex items-center justify-center disabled:opacity-40 ${
      isRecording
        ? "bg-red-500/15 text-red-500 border border-red-500/30 animate-pulse"
        : isTranscribing
          ? "bg-secondary/10 text-secondary border border-secondary/20"
          : "bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20"
    }`}
              >
                {isRecording ? (
                  <LuSquare className="w-3.5 h-3.5" />
                ) : isTranscribing ? (
                  <LuLoader className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <LuMic className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className={`p-2 rounded-lg flex-shrink-0 transition-all flex items-center justify-center ${
                  inputValue.trim() && !isLoading
                    ? "bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/40 hover:shadow-xl hover:scale-105"
                    : "bg-foreground/20 text-muted-foreground cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <LuLoader className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <LuSend className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
