import { useEffect, useRef, useState } from 'react';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import type { ChatMessage, ChatContext } from '@/data/types';
import { useLang } from '@/lib/lang';

interface ChatAssistantProps {
  open: boolean;
  onClose: () => void;
  context?: ChatContext;
}

function buildContextPreamble(ctx?: ChatContext): string {
  if (!ctx) return '';
  const parts: string[] = [];
  if (ctx.cropType) parts.push(`Crop: ${ctx.cropType}`);
  if (ctx.growthStage) parts.push(`Growth stage: ${ctx.growthStage}`);
  if (ctx.diagnosis) parts.push(`Diagnosed condition: ${ctx.diagnosis}`);
  if (ctx.confidenceLevel) parts.push(`Confidence: ${ctx.confidenceLevel}`);
  if (ctx.recommendation) parts.push(`Recommendation: ${ctx.recommendation}`);
  return parts.length > 0 ? `Here is my current context: ${parts.join(', ')}.` : '';
}

export function ChatAssistant({ open, onClose, context }: ChatAssistantProps) {
  const { t } = useLang();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasContext, setHasContext] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [t.chatSuggestion1, t.chatSuggestion2, t.chatSuggestion3];

  useEffect(() => {
    if (open && context && !hasContext) {
      const preamble = buildContextPreamble(context);
      if (preamble) {
        setMessages([{ id: `ctx-${Date.now()}`, role: 'assistant', text: `${t.chatWelcome} ${preamble}` }]);
        setHasContext(true);
      } else {
        setMessages([{ id: `welcome-${Date.now()}`, role: 'assistant', text: t.chatWelcomeNoCtx }]);
        setHasContext(true);
      }
    }
  }, [open, context, hasContext, t]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const conversationMessages = [
        ...messages.filter((m) => !m.id.startsWith('ctx-')).map((m) => ({ role: m.role === 'user' ? 'user' : 'model', text: m.text })),
        { role: 'user' as const, text: trimmed },
      ];

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) throw new Error('Service unavailable');

      const response = await fetch(`${supabaseUrl}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseAnonKey}`,
          apikey: supabaseAnonKey,
        },
        body: JSON.stringify({ messages: conversationMessages, context }),
      });

      if (!response.ok) throw new Error('Request failed');

      const data = await response.json();
      const assistantMsg: ChatMessage = { id: `a-${Date.now()}`, role: 'assistant', text: data.reply || t.chatErrorProcess };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = { id: `e-${Date.now()}`, role: 'assistant', text: t.chatErrorConnect };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-forest-950/30 animate-fade-in" onClick={onClose}>
      <div
        className="absolute bottom-0 left-0 right-0 mx-auto flex h-[85vh] max-w-3xl flex-col rounded-t-xl bg-forest-50 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-forest-100 bg-white px-4 py-3 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-600 text-white">
              <Bot size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-forest-900">{t.chatTitle}</h2>
              <p className="text-xs text-forest-500">{t.chatSubtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-forest-600 hover:bg-forest-50 transition-colors" aria-label={t.chatClose}>
            <X size={22} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm leading-6 ${
                  msg.role === 'user'
                    ? 'bg-forest-600 text-white'
                    : 'bg-white text-forest-800 border border-forest-100'
                }`}
              >
                {msg.text.split('\n').map((line, i) => (
                  <span key={i}>{i > 0 && <br />}{line}</span>
                ))}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-3 border border-forest-100">
                <span className="h-2 w-2 animate-bounce rounded-full bg-forest-400" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-forest-400" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-forest-400" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {messages.length === 1 && !loading && context && (
            <div className="flex flex-wrap gap-2 pt-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="flex items-center gap-1.5 rounded-lg border border-forest-200 bg-white px-3 py-2 text-xs font-semibold text-forest-700 hover:bg-forest-50 transition-colors"
                >
                  <Sparkles size={13} className="text-amber-500" />{s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-forest-100 bg-white px-4 py-3 safe-bottom">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chatPlaceholder}
              className="flex-1 rounded-lg border border-forest-200 bg-forest-50 px-4 py-3 text-sm text-forest-900 placeholder:text-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-transparent transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-forest-600 text-white hover:bg-forest-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label={t.chatSend}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
