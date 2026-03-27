import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
} from 'react-icons/lu';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Good Morning';
  if (h >= 12 && h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const CHATS = [
  { id: 1, title: 'Design System Review' },
  { id: 2, title: 'API Integration Help' },
  { id: 3, title: 'React Performance' },
  { id: 4, title: 'Dark Mode Tokens' },
  { id: 5, title: 'Component Library' },
];

const SUGGESTIONS = [
  { icon: LuSparkles, label: 'Ask anything' },
  { icon: LuWand, label: 'Help me write' },
  { icon: LuFileText, label: 'Summarize text' },
  { icon: LuCode, label: 'Debug code' },
];

export default function Dashboard() {
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const messagesEndRef = useRef(null);
  const avatarRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const fn = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target))
        setAvatarOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    if (!hasStarted) setHasStarted(true);
    setMessages((p) => [...p, { id: Date.now(), role: 'user', text }]);
    setInputValue('');

    setTimeout(() => {
      setMessages((p) => [
        ...p,
        {
          id: Date.now() + 1,
          role: 'ai',
          text: 'Hello! How can I help you today?',
        },
      ]);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setInputValue('');
    setHasStarted(false);
  };

  const username = 'John Doe';
  const initial = username.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-card-foreground font-sans">
      {/* ══ SIDEBAR ══ */}
      <aside
        className={`flex flex-col ${
          sidebarOpen ? 'w-56' : 'w-0'
        } min-w-0 overflow-hidden bg-card/50 border-r border-foreground/20 transition-all duration-300`}
      >
        {/* Top accent gradient line */}
        <div className="h-0.5 bg-gradient-to-r from-primary to-secondary flex-shrink-0" />

        {/* Brand */}
        <div className="px-4 py-3 border-b border-foreground/20 flex items-center gap-2.5">
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

        {/* Chat list */}
        <nav className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5 flex flex-col">
          {CHATS.map((chat) => {
            const active = activeChatId === chat.id;
            return (
              <button
                key={chat.id}
                onClick={() => {
                  setActiveChatId(chat.id);
                  setHasStarted(false);
                  setMessages([]);
                  setInputValue('');
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2 ${
                  active
                    ? 'bg-gradient-to-r from-primary/60 to-secondary/40 text-card-foreground shadow-lg shadow-primary/30'
                    : 'text-muted-foreground hover:bg-primary/10'
                }`}
              >
                <LuMessageCircle className="w-3 h-3 flex-shrink-0 opacity-60" />
                <span className="overflow-hidden text-ellipsis">{chat.title}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom fade line */}
        <div className="h-px bg-gradient-to-r from-primary/20 to-secondary/20 flex-shrink-0" />
      </aside>

      {/* ══ MAIN ══ */}
      <main className="flex flex-col flex-1 overflow-hidden relative">
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-3 border-b border-foreground/20 bg-card/30 gap-3 flex-shrink-0">
          {/* Left */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className="p-2 rounded-lg bg-transparent hover:bg-muted/50 transition-all text-muted-foreground flex-shrink-0"
            >
              <LuPanelLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground font-medium">
              {activeChatId
                ? CHATS.find((c) => c.id === activeChatId)?.title
                : 'New Chat'}
            </span>
          </div>

          {/* Right: Avatar menu */}
          <div ref={avatarRef} className="relative">
            <button
              onClick={() => setAvatarOpen((p) => !p)}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white transition-all flex-shrink-0 ${
                avatarOpen
                  ? 'bg-gradient-to-br from-primary to-secondary ring-2 ring-offset-2 ring-primary'
                  : 'bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60'
              }`}
            >
              {initial}
            </button>

            {avatarOpen && (
              <div className="absolute top-full right-0 mt-2 w-52 bg-card border border-foreground/20 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                {/* User info */}
                <div className="px-4 py-3 border-b border-foreground/20 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-xs text-white shadow-lg shadow-primary/40">
                    {initial}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-card-foreground">
                      {username}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      user@s2chat.ai
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <button className="w-full text-left px-4 py-2.5 text-xs text-muted-foreground hover:text-card-foreground hover:bg-muted/50 transition-all flex items-center gap-2">
                  <LuUser className="w-3.5 h-3.5" />
                  Profile
                </button>

                <div className="h-px bg-foreground/20" />
                <button className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-all flex items-center gap-2 font-semibold">
                  <LuLogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-4">
          {!hasStarted && (
            <div className="flex flex-col items-center justify-center h-full gap-1.5">
              {/* Hero icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/40 shadow-secondary/40 mb-3">
                <LuMessageCircle className="w-7 h-7 text-white" />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-center bg-gradient-to-r from-card-foreground to-muted-foreground bg-clip-text text-transparent">
                {getGreeting()}, {username}
              </h1>
              <p className="text-sm text-muted-foreground">
                What can I help you with today?
              </p>

              {/* Suggestion chips */}
              <div className="grid grid-cols-2 gap-1.5 mt-5 w-full max-w-sm">
                {SUGGESTIONS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.label}
                      onClick={() => setInputValue(s.label)}
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

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col gap-0.75 animate-in fade-in slide-in-from-top-1 ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {/* Role label */}
              <span className="text-xs text-muted-foreground">
                {msg.role === 'user' ? username : 'S2'}
              </span>

              <div
                className={`flex items-end gap-2 ${
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* AI avatar */}
                {msg.role === 'ai' && (
                  <div className="w-6 h-6 rounded-lg flex-shrink-0 bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/30">
                    <LuMessageCircle className="w-3 h-3 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-sm px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-primary/80 to-accent/60 text-primary-foreground shadow-lg shadow-primary/40 rounded-br-sm'
                      : 'bg-card border border-foreground/20 text-card-foreground shadow-md shadow-black/20 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* ══ INPUT AREA ══ */}
        <div className="px-5 py-3.5 bg-card border-t border-foreground/20 flex-shrink-0">
          {/* Input wrapper */}
          <div
            className={`rounded-2xl border bg-input/50 transition-all overflow-hidden ${
              inputFocused
                ? 'border-primary ring-3 ring-primary/30 shadow-2xl shadow-primary/40'
                : 'border-foreground/20 shadow-lg shadow-black/25'
            }`}
          >
            {/* Top bar with action chips */}
            <div
              className={`flex items-center gap-1 px-3 pt-2.5 pb-0 border-b transition-all ${
                inputFocused
                  ? 'border-primary/20'
                  : 'border-transparent'
              }`}
            >
              {['Concise', 'Detailed', 'Friendly'].map((tag) => (
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
              className="w-full px-4 py-3 resize-none bg-transparent border-none outline-none text-sm leading-relaxed text-card-foreground placeholder-muted-foreground max-h-44 block font-sans"
            />

            {/* Bottom toolbar */}
            <div className="flex items-center gap-1.5 px-2.5 pb-1.5">
              {/* Attach */}
              <button className="p-2 rounded-lg hover:bg-muted/50 transition-all text-muted-foreground hover:text-primary flex-shrink-0">
                <LuPaperclip className="w-3.5 h-3.5" />
              </button>

              {/* Image */}
              <button className="p-2 rounded-lg hover:bg-muted/50 transition-all text-muted-foreground hover:text-primary flex-shrink-0">
                <LuImage className="w-3.5 h-3.5" />
              </button>

              {/* Divider */}
              <div className="w-px h-4 bg-foreground/20" />

              <div className="flex-1" />

              {/* Char hint */}
              <span className="text-xs text-muted-foreground">
                {inputValue.trim() ? '⏎ send' : 'Shift+⏎ newline'}
              </span>

              {/* Voice */}
              <button
                onClick={() => setIsRecording((p) => !p)}
                className={`p-2 rounded-lg flex-shrink-0 transition-all flex items-center justify-center ${
                  isRecording
                    ? 'bg-red-500/15 text-red-500 border border-red-500/30 animate-pulse'
                    : 'bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20'
                }`}
              >
                {isRecording ? (
                  <LuSquare className="w-3.5 h-3.5" />
                ) : (
                  <LuMic className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Send */}
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className={`p-2 rounded-lg flex-shrink-0 transition-all flex items-center justify-center ${
                  inputValue.trim()
                    ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/40 hover:shadow-xl hover:scale-105'
                    : 'bg-foreground/20 text-muted-foreground cursor-not-allowed'
                }`}
              >
                <LuSend className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground/50 mt-1.5">
            S2 Chat can make mistakes. Verify important information.
          </p>
        </div>
      </main>
    </div>
  );
}
