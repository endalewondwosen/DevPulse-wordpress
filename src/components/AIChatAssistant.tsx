import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface AIChatAssistantProps {
    portfolioData: {
        projects: any[];
        experience: any[];
        skills: any[];
        certifications: any[];
        settings: any;
    };
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ portfolioData, isOpen, onOpenChange }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: `Hi! I'm Wondwosen's AI assistant. I can answer questions about his experience, technical skills, or specific projects. What would you like to know?`
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (customMessage?: string) => {
        const messageToSend = customMessage || input;
        if (!messageToSend.trim() || isLoading) return;

        const userMessage = messageToSend.trim();
        if (!customMessage) setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const apiKey = typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY 
                ? import.meta.env.VITE_GEMINI_API_KEY 
                : process.env.GEMINI_API_KEY || '';

            if (!apiKey) {
                setMessages(prev => [...prev, { role: 'assistant', content: "Error: No API key found. Please ensure VITE_GEMINI_API_KEY is set in your Vercel Environment Variables." }]);
                setIsLoading(false);
                return;
            }

            const ai = new GoogleGenAI({ apiKey });
            const model = ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: [
                    {
                        role: "user",
                        parts: [{
                            text: `
              You are a professional AI assistant for Wondwosen Endale, a Full Stack Engineer & System Architect.
              Your goal is to help recruiters and potential clients understand Wondwosen's expertise.
              
              CONTEXT ABOUT WONDWOSEN:
              - Name: Wondwosen Endale
              - Current Role: Full Stack Developer at Soft Valley Technology Group (since May 2024)
              - Expertise: React, Next.js, Node.js, Laravel, PostgreSQL, System Architecture.
              - Projects: 
                ${portfolioData.projects.map(p => `- ${p.title}: ${p.content}`).join('\n')}
              - Experience:
                ${portfolioData.experience.map(e => `- ${e.role} at ${e.company} (${e.period}): ${e.description}`).join('\n')}
              - Skills:
                ${portfolioData.skills.map(s => `- ${s.name} (${s.category})`).join('\n')}
              - Certifications:
                ${portfolioData.certifications.map(c => `- ${c.name} from ${c.issuer}`).join('\n')}
              
              INSTRUCTIONS:
              - Be professional, concise, and enthusiastic.
              - If asked about something not in the context, politely say you don't have that specific information but highlight a related skill Wondwosen has.
              - Keep responses relatively short (max 3-4 sentences) unless a detailed explanation of a project is requested.
              - Refer to Wondwosen in the third person (e.g., "Wondwosen has experience in...") or as "he".
              
              USER QUESTION: ${userMessage}
            ` }]
                    }
                ]
            });

            const response = await model;
            const text = response.text || "I'm sorry, I couldn't process that request.";

            setMessages(prev => [...prev, { role: 'assistant', content: text }]);
        } catch (error: any) {
            console.error("AI Assistant Error:", error);
            const errorMsg = error?.message || "connection error";
            setMessages(prev => [...prev, { role: 'assistant', content: `I'm having a bit of trouble connecting right now (${errorMsg}). Please try again in a moment!` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed z-[101] bottom-[5.5rem] right-3 md:bottom-6 md:right-6 md:z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-0 md:bottom-20 right-0 w-[min(100vw-1.5rem,350px)] md:w-[400px] h-[min(70vh,500px)] md:h-[500px] bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-emerald-500 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-black">
                                <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Wondwosen's Assistant</h3>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-black/40 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="p-2 hover:bg-black/10 rounded-xl transition-colors text-black"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-zinc-800' : 'bg-emerald-500/10 text-emerald-500'
                                            }`}>
                                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                        </div>
                                        <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user'
                                                ? 'bg-emerald-500 text-black font-medium'
                                                : 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                                            }`}>
                                            <div className="markdown-body">
                                                <Markdown>{msg.content}</Markdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex gap-2 max-w-[85%]">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                        <div className="p-3 rounded-2xl bg-zinc-800 text-zinc-400 border border-zinc-700 flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span className="text-xs italic">Thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about my experience..."
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 pr-12 text-sm outline-none focus:border-emerald-500 transition-all"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all disabled:opacity-50"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="mt-2 text-[10px] text-center text-zinc-500 flex items-center justify-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Powered by Gemini AI
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button — desktop only; mobile uses MobileCtaBar */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onOpenChange(!isOpen)}
                className={`hidden md:flex w-14 h-14 rounded-full items-center justify-center shadow-2xl transition-all ${isOpen ? 'bg-zinc-800 text-emerald-500 rotate-90' : 'bg-emerald-500 text-black'
                    }`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-zinc-950 animate-bounce" />
                )}
            </motion.button>
        </div>
    );
};
