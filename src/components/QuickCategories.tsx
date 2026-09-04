import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Sparkles } from 'lucide-react';
import { CategoryId } from '../types';
import { useApp } from '../context/AppContext';

interface QuickCategoriesProps {
  activeCategory?: CategoryId | string;
  onSelectCategory?: (categoryId: CategoryId | string) => void;
}

const CATEGORY_NAMES_MR: Record<string, string> = {
  'brochures': 'ब्रोशर्स',
  'packaging': 'पॅकेजिंग',
  'stickers': 'स्टिकर्स',
  'business-cards': 'कार्ड्स',
  'flyers': 'फ्लायर्स',
  'banners': 'बॅनर्स',
  'id-cards': 'आयडी कार्ड्स',
  'stationery': 'स्टेशनरी',
  'custom-merch': 'मर्चंडाईज',
  'apparel': 'अ‍ॅपॅरल',
  'paper-bags': 'पेपर बॅग्ज',
  'menus': 'मेनू कार्ड्स',
};

export const QuickCategories: React.FC<QuickCategoriesProps> = ({
  activeCategory: propActiveCategory,
  onSelectCategory: propOnSelectCategory,
}) => {
  const { isMarathi, selectedCategory, setSelectedCategory, categories } = useApp();
  const navigate = useNavigate();

  const currentCategory = propActiveCategory !== undefined ? propActiveCategory : selectedCategory;
  const categoryList = categories && categories.length > 0 ? categories : [];

  const handleCategoryClick = (catId: CategoryId | string) => {
    if (propOnSelectCategory) {
      propOnSelectCategory(catId);
    } else {
      setSelectedCategory(catId);
      if (catId !== 'all') {
        navigate(`/products?category=${catId}`);
      } else {
        navigate('/products');
      }
    }
  };

  return (
    <div className="w-full bg-white border-b border-slate-200/90 py-2 sm:py-2.5 lg:py-2 shadow-2xs font-marathi">
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 md:px-8">
        
        {/* Horizontal scroll container with touch snap */}
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1 scrollbar-none no-scrollbar justify-start">
          
          {/* 1. All Services Red Button */}
          <button
            id="cat-pill-all"
            onClick={() => handleCategoryClick('all')}
            className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer shadow-sm ${
              currentCategory === 'all'
                ? 'bg-[#FF0038] hover:bg-rose-600 text-white shadow-rose-600/30'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">{isMarathi ? 'सर्व सेवा' : 'All Services'}</span>
          </button>

          {/* 1.5 Special 3D Studio (Cards & Stickers) Fast Access Pill */}
          <button
            id="cat-pill-3d-studio"
            onClick={() => navigate('/design-studio')}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 shadow-sm active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="whitespace-nowrap">{isMarathi ? '३D स्टुडिओ: कार्ड्स व स्टिकर्स' : '3D Studio: Cards & Stickers'}</span>
          </button>

          {/* 2. Category Pills with Micro-Thumbnails */}
          {categoryList.map((cat) => {
            const isSelected = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-pill-${cat.id}`}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer border text-xs shadow-2xs ${
                  isSelected
                    ? 'bg-rose-50 border-rose-500 text-rose-700 font-semibold ring-1 ring-rose-400/30'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700 hover:text-slate-900 font-medium'
                }`}
              >
                {/* Micro thumbnail */}
                <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Category Label */}
                <span className="text-xs whitespace-nowrap font-medium">
                  {isMarathi ? (CATEGORY_NAMES_MR[cat.id] || cat.shortName || cat.name) : (cat.shortName || cat.name)}
                </span>

                {/* Special Highlight Badges */}
                {cat.id === 'brochures' && (
                  <span className="text-[9px] font-heading font-bold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded">
                    {isMarathi ? '१-दिवस' : '1-Day'}
                  </span>
                )}
                {cat.id === 'stickers' && (
                  <span className="text-[9px] font-heading font-bold bg-rose-600 text-white px-1.5 py-0.2 rounded">
                    ₹79
                  </span>
                )}
              </button>
            );
          })}

        </div>
      </div>
    </div>
  );
};
