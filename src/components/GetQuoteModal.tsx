import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2, MessageSquare, Phone, Mail, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface GetQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceOrProduct?: string;
}

export const GetQuoteModal: React.FC<GetQuoteModalProps> = ({
  isOpen,
  onClose,
  initialServiceOrProduct = ''
}) => {
  const { addQuote, isMarathi } = useApp();

  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceRequired, setServiceRequired] = useState(initialServiceOrProduct || 'Commercial Printing');
  const [estimatedQuantity, setEstimatedQuantity] = useState('500');
  const [projectDescription, setProjectDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !phone) return;

    addQuote({
      clientName,
      phone,
      email,
      serviceRequired,
      estimatedQuantity,
      projectDescription
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  const handleSendOnWhatsApp = () => {
    addQuote({
      clientName: clientName || 'Client',
      phone: phone || 'WhatsApp Desk',
      email,
      serviceRequired,
      estimatedQuantity,
      projectDescription
    });
    setSubmitted(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-marathi"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 my-auto text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-rose-600/30 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              <span>{isMarathi ? 'थेट कारखाना दर' : 'Instant Factory Estimate'}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              {isMarathi ? 'मोफत दरपत्रक / कोटेशन मिळवा' : 'Request a Custom Wholesale Quote'}
            </h2>
            <p className="text-xs text-slate-400">
              {isMarathi ? 'आम्हाला आपल्या प्रिंटिंग कामाची माहिती द्या, १० मिनिटांत अचूक दर मिळवा.' : 'Tell us your specs. We deliver factory-direct estimates in minutes.'}
            </p>
          </div>
        </div>

        {/* Body Form */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isMarathi ? 'कोटेशन मागणी यशस्वीरीत्या पाठवली!' : 'Quote Request Received!'}
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {isMarathi ? 'आशिष कोथाळे व प्रोप्रींट टीम लवकरच आपल्याशी फोन किंवा व्हॉट्सॲपवर संपर्क करेल.' : 'Our print team will review your specifications and send you a GST quotation on WhatsApp.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">{isMarathi ? 'आपले नाव *' : 'Your Name *'}</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">{isMarathi ? 'मोबाईल नंबर *' : 'Phone Number *'}</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9322126863"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">{isMarathi ? 'प्रिंट उत्पादन / सेवा' : 'Service / Product'}</label>
                <input
                  type="text"
                  value={serviceRequired}
                  onChange={(e) => setServiceRequired(e.target.value)}
                  placeholder="e.g. Visiting Cards, Packaging Boxes, Banners"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">{isMarathi ? 'अपेक्षित संख्या' : 'Estimated Quantity'}</label>
                <input
                  type="text"
                  value={estimatedQuantity}
                  onChange={(e) => setEstimatedQuantity(e.target.value)}
                  placeholder="e.g. 500, 1000, 5000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">{isMarathi ? 'कामाचे तपशील व आकार' : 'Project Specifications / Dimensions'}</label>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={2}
                placeholder="e.g. 350 GSM matte finish, spot UV logo, need delivery in Sambhajinagar..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 bg-slate-900 hover:bg-rose-600 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isMarathi ? 'कोटेशन पाठवा' : 'Submit Quote Request'}</span>
              </button>

              <button
                type="button"
                onClick={handleSendOnWhatsApp}
                className="bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-extrabold py-2.5 px-3.5 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-md"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
