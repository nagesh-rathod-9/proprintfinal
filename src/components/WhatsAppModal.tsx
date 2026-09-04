import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Phone, Send, CheckCircle2, Clock, MapPin, Sparkles, Copy, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMessage?: string;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  defaultMessage = ''
}) => {
  const { isMarathi, showToast } = useApp();
  const [selectedTopic, setSelectedTopic] = useState<string>('general');
  const [userCustomText, setUserCustomText] = useState(defaultMessage);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (defaultMessage) {
      setUserCustomText(defaultMessage);
    }
  }, [defaultMessage]);

  if (!isOpen) return null;

  const topics = [
    { id: 'general', label: 'General Commercial Print Inquiry', text: 'Hello Proprint! I would like to inquire about commercial offset printing rates.' },
    { id: 'packaging', label: 'Custom Packaging Boxes & Labels', text: 'Hello Proprint! I need custom mono-carton packaging boxes & waterproof stickers.' },
    { id: 'cards', label: 'Visiting Cards & Corporate ID', text: 'Hello Proprint! I need luxury visiting cards / RFID employee smart cards.' },
    { id: 'design', label: 'Graphic Design & Brand Identity', text: 'Hello Proprint! I need original graphic design & logo branding for my business.' },
    { id: 'express', label: 'Urgent 24-Hour Production Job', text: 'Hello Proprint! I have an urgent printing requirement needed within 24 hours.' }
  ];

  const handleSubmitInquiry = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitted(true);
    showToast('Inquiry sent to Proprint desk! Our team will connect shortly.', 'success');
  };

  const handleCopyMessage = () => {
    const textToCopy = `To Proprint Commercial Press:\n${userCustomText || topics.find((t) => t.id === selectedTopic)?.text}\nFrom: ${userName || 'Client'} (${userPhone || 'Not specified'})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast('Inquiry message copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-marathi animate-in fade-in duration-200"
      onClick={handleResetAndClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 my-auto text-slate-900 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-[#128C7E] text-white p-5 sm:p-6 relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white text-[#128C7E] flex items-center justify-center shadow-xs">
                <MessageSquare className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold leading-tight">
                  {isMarathi ? 'थेट व्हॉट्सॲप चौकशी' : 'Proprint Instant Support Desk'}
                </h2>
                <p className="text-xs text-emerald-100">
                  {isMarathi ? 'आशिष कोथाळे व डिझाईन टीम थेट ऑनलाइन' : 'Ashish Kothale & Pre-Press Design Team'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          
          {isSubmitted ? (
            /* Submission Confirmation Pop-up View */
            <div className="py-4 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-black text-slate-900">
                  {isMarathi ? 'चौकशी यशस्वीरीत्या पाठवली!' : 'Inquiry Submitted Successfully!'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed px-2">
                  {isMarathi
                    ? 'धन्यवाद! आमची प्रिंटिंग व कोटेशन टीम आपल्याशी लवकरच संपर्क करेल.'
                    : 'Thank you! Our Pre-Press & Estimations Desk at Chikalthana MIDC has received your request and will reach out shortly.'}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/90 text-left space-y-2 text-[11px]">
                <div className="flex items-center justify-between text-slate-500 font-medium">
                  <span>Desk Helpline:</span>
                  <strong className="text-slate-900 font-bold">+91 93221 26863</strong>
                </div>
                <div className="flex items-center justify-between text-slate-500 font-medium">
                  <span>Response Time:</span>
                  <span className="text-emerald-600 font-bold">Within 15 Minutes</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copied ? 'Copied' : 'Copy Details'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {isMarathi ? 'बंद करा' : 'Done'}
                </button>
              </div>
            </div>
          ) : (
            /* Inquiry Form View */
            <form onSubmit={handleSubmitInquiry} className="space-y-4">
              
              {/* Quick Select Topics */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 block">
                  {isMarathi ? 'विषय निवडा (Quick Topics):' : 'Select Inquiry Topic:'}
                </label>
                <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {topics.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelectedTopic(t.id);
                        setUserCustomText(t.text);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        selectedTopic === t.id
                          ? 'border-[#128C7E] bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="truncate">{t.label}</span>
                      {selectedTopic === t.id && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Info (Optional) */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Joshi"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">WhatsApp Phone</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Custom Message Area */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  {isMarathi ? 'संदेश तपशील (Message):' : 'Inquiry Message:'}
                </label>
                <textarea
                  value={userCustomText}
                  onChange={(e) => setUserCustomText(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Direct In-App Submit CTA (Does NOT redirect) */}
              <button
                type="submit"
                className="w-full bg-[#128C7E] hover:bg-[#0e7468] text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <Send className="w-4 h-4" />
                <span>{isMarathi ? 'चौकशी पाठवा (Send Inquiry)' : 'Send Instant Inquiry'}</span>
              </button>

              {/* Business Hours Info */}
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>9:30 AM - 8:30 PM (Mon-Sat)</span>
                </span>
                <span className="text-emerald-600 font-bold">● Live Support Online</span>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
