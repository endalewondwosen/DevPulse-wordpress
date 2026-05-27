import { FormEvent } from 'react';
import { Activity, Github, Linkedin, Mail, Phone, Send, Terminal } from 'lucide-react';
import {
  CONTACT_EMAIL,
  GITHUB_URL,
  GITHUB_HANDLE,
  LINKEDIN_URL,
  LINKEDIN_HANDLE,
  PHONE_NUMBER,
  PHONE_DISPLAY,
} from '../../lib/constants';

export interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactProps {
  contactForm: ContactFormState;
  setContactForm: (next: ContactFormState) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  contactEmail?: string;
}

export function Contact({
  contactForm,
  setContactForm,
  onSubmit,
  isSubmitting,
  contactEmail,
}: ContactProps) {
  const email = contactEmail || CONTACT_EMAIL;
  return (
    <section
      id="contact"
      className="bg-emerald-500 rounded-[2rem] p-8 md:p-12 text-black relative overflow-hidden"
    >
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
            Let&apos;s talk about <br /> your project.
          </h2>
          <p className="text-black/70 text-lg mb-8 font-medium">
            Open to full-time roles and senior engineering contracts. I usually reply within a day.
          </p>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black/10 rounded-2xl flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-50">Email Me</p>
                <a href={`mailto:${email}`} className="font-bold hover:underline">{email}</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black/10 rounded-2xl flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-50">Call Me</p>
                <a href={`tel:${PHONE_NUMBER}`} className="font-bold hover:underline">{PHONE_DISPLAY}</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black/10 rounded-2xl flex items-center justify-center">
                <Linkedin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-50">LinkedIn</p>
                <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="font-bold hover:underline">
                  {LINKEDIN_HANDLE}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black/10 rounded-2xl flex items-center justify-center">
                <Github className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-50">GitHub</p>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="font-bold hover:underline">
                  {GITHUB_HANDLE}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Name</label>
                <input
                  required
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-black/30 placeholder:text-black/30"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Email</label>
                <input
                  required
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-black/30 placeholder:text-black/30"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Subject</label>
              <input
                type="text"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-black/30 placeholder:text-black/30"
                placeholder="Project Inquiry"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Message</label>
              <textarea
                required
                rows={4}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-black/30 placeholder:text-black/30"
                placeholder="Tell me about your project..."
              />
            </div>
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-zinc-900 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Activity className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send Message
            </button>
          </form>
        </div>
      </div>
      <div className="absolute right-[-10%] bottom-[-20%] opacity-10">
        <Terminal className="w-[400px] h-[400px]" />
      </div>
    </section>
  );
}
