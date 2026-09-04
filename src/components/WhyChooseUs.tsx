import React from 'react';
import { Printer, Sliders, Tag, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface WhyChooseUsProps {
  onOpenQuote?: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onOpenQuote }) => {
  const { isMarathi } = useApp();

  const points = [
    {
      id: 'print-tech',
      icon: Printer,
      title: isMarathi ? 'सर्वोच्च प्रिंटिंग गुणवत्ता' : 'High Quality Printing',
      description: isMarathi 
        ? 'आधुनिक हिडलबर्ग ऑफसेट आणि जपानी डिजिटल प्रिंटिंग तंत्रज्ञान.' 
        : 'We use advanced Heidelberg offset and Japanese digital printing technology for crisp results.',
    },
    {
      id: 'custom-sol',
      icon: Sliders,
      title: isMarathi ? 'कस्टम सोल्यूशन्स' : 'Customized Solutions',
      description: isMarathi
        ? 'कस्टम आकार, डाय-कट कटिंग आणि लक्झरी गोल्ड फॉइल व स्पॉट UV फिनिश.'
        : 'Personalized dimensions, custom die-cut contours, and specialty foil & UV finishes.',
    },
    {
      id: 'pricing',
      icon: Tag,
      title: isMarathi ? 'किफायतशीर कारखान्याचे दर' : 'Affordable Pricing',
      description: isMarathi
        ? 'थेट मॅन्युफॅक्चरर दर, कोणताही मध्यस्थ नाही, उत्तम घाऊक डिस्काउंट.'
        : 'Direct manufacturer pricing with zero middleman markup. Best wholesale bulk rates.',
    },
    {
      id: 'turnaround',
      icon: Clock,
      title: isMarathi ? '२४ तास जलद डिलिव्हरी' : 'Quick Turnaround',
      description: isMarathi
        ? 'सेम डे व २४ तास फास्ट डिस्पॅच व संपूर्ण महाराष्ट्रात वेळेवर डिलिव्हरी.'
        : 'Same day and 24-hour fast processing with on-time door delivery across Maharashtra.',
    },
  ];

  return (
    <section className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 md:px-8 py-8 sm:py-10 font-marathi">
      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
          {isMarathi ? 'प्रोप्रिंट का निवडावे' : 'Why Choose'}{' '}
          <span className="relative inline-block text-rose-600">
            {isMarathi ? '?' : 'Proprint?'}
            <span className="absolute left-0 bottom-[-3px] w-full h-[3px] bg-rose-600 rounded-full"></span>
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto">
          {isMarathi 
            ? '१०,००० हून अधिक व्यावसायिक व कंपन्यांचा अचूक रंग, प्रमाणित ३५०+ GSM पेपर आणि २४ तास डिलिव्हरीवर विश्वास.'
            : 'Over 10,000 businesses trust us for consistent color reproduction, certified paper GSM, and express turnaround.'}
        </p>
      </div>

      {/* 4 Feature Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {points.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 p-5 flex items-start gap-4 group hover:-translate-y-1 font-marathi"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0 text-rose-600 transition-colors group-hover:bg-rose-600 group-hover:text-white">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors font-marathi">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-marathi">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
