import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CategoryId } from '../types';
import { useApp } from '../context/AppContext';

interface CategoryGridProps {
  onSelectCategory?: (categoryId: CategoryId | 'all') => void;
}

const CATEGORY_NAMES_MR: Record<string, string> = {
  'visiting-cards': 'व्हिजिटिंग कार्ड्स',
  'letterheads': 'लेटरहेड्स व पॅम्प्लेट्स',
  'envelopes': 'पाकिटे व कव्हर्स',
  'invitation-cards': 'लग्न व समारंभ पत्रिका',
  'brochures': 'कॅटलॉग व ब्रोशर्स',
  'paper-board-files': 'पेपर बोर्ड फाईल्स',
  'project-files': 'प्रकल्प व ऑफिस फाईल्स',
  'business-cards': 'व्हिजिटिंग कार्ड्स',
  'flyers': 'मार्केटिंग पॅम्प्लेट्स',
  'packaging': 'पॅकेजिंग बॉक्सेस',
  'stickers': 'डाय-कट स्टिकर्स',
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  onSelectCategory,
}) => {
  const { isMarathi, setSelectedCategory, categories } = useApp();
  const navigate = useNavigate();
  const categoryList = categories && categories.length > 0 ? categories : [];

  const handleCategoryClick = (catId: CategoryId | 'all') => {
    if (onSelectCategory && typeof onSelectCategory === 'function') {
      onSelectCategory(catId);
    } else {
      if (setSelectedCategory) {
        setSelectedCategory(catId);
      }
      if (catId !== 'all') {
        navigate(`/products?category=${catId}`);
      } else {
        navigate('/products');
      }
    }
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 md:px-8 py-6 sm:py-8 font-marathi">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isMarathi ? 'व्यावसायिक प्रिंटिंग उपाय' : 'Commercial Print Solutions'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
            {isMarathi ? 'कॅटेगरीनुसार' : 'Shop By'}{' '}
            <span className="relative inline-block text-slate-900">
              {isMarathi ? 'निवडा' : 'Service'}
              <span className="absolute left-0 bottom-[-3px] w-full h-[3px] bg-rose-600 rounded-full"></span>
            </span>
          </h2>
        </div>

        <button
          onClick={() => handleCategoryClick('all')}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors group cursor-pointer"
        >
          <span>{isMarathi ? 'सर्व १२ सेवा पहा' : 'All 12 Services'}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Categories Grid (2-cols on mobile, 3-cols on sm, 4-cols on md, 6-cols on lg) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {categoryList.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id as CategoryId)}
            className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#FF0038] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer p-3 flex flex-col items-center justify-between text-center overflow-hidden hover:-translate-y-1 font-marathi"
          >
            {/* Visual Real Image Container */}
            <div className="w-full aspect-square bg-slate-100 rounded-xl overflow-hidden mb-2 relative">
              <img
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {cat.id === 'stickers' && (
                <div className="absolute top-1.5 left-1.5 bg-[#FF0038] text-white text-[8px] sm:text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-md">
                  ₹79/Sheet
                </div>
              )}
              {cat.id === 'brochures' && (
                <div className="absolute top-1.5 left-1.5 bg-amber-500 text-slate-950 text-[8px] sm:text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-md font-marathi">
                  {isMarathi ? '१-दिवसात डिस्पॅच' : '1-Day Delivery'}
                </div>
              )}
            </div>

            {/* Category Title */}
            <div className="w-full">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#FF0038] transition-colors truncate font-marathi">
                {isMarathi ? (CATEGORY_NAMES_MR[cat.id] || cat.name) : cat.name}
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium font-marathi">
                {cat.itemCount} {isMarathi ? 'प्रकार व फिनिशेस' : 'items & finishes'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
