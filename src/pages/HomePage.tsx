import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroBanner } from '../components/HeroBanner';
import { QuickCategories } from '../components/QuickCategories';
import { CategoryGrid } from '../components/CategoryGrid';
import { BestSellingGrid } from '../components/BestSellingGrid';
import { OurServicesShowcase } from '../components/OurServicesShowcase';
import { ClientReviewsSection } from '../components/ClientReviewsSection';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { Product } from '../types';

interface HomePageProps {
  onSelectProduct: (product: Product) => void;
  onOpenQuoteModal: (serviceName?: string) => void;
  onOpenWhatsApp: (message?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectProduct,
  onOpenQuoteModal,
  onOpenWhatsApp
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      
      {/* 1 & 2. Compact Top Deck: Quick Categories + Hero Carousel */}
      <div className="space-y-2 sm:space-y-3 lg:space-y-2.5">
        <QuickCategories />
        <HeroBanner onOpenQuote={() => onOpenQuoteModal()} />
      </div>

      {/* 3. Visual 6-Box Category Grid */}
      <CategoryGrid />

      {/* 4. Best Selling Products */}
      <BestSellingGrid 
        onSelectProduct={(p) => {
          if (onSelectProduct) onSelectProduct(p);
          navigate(`/product/${p.id}`);
        }}
        onOpenQuoteModal={onOpenQuoteModal}
      />

      {/* 5. Complete In-House Services & Graphic Design Works */}
      <OurServicesShowcase
        onOpenQuoteModal={onOpenQuoteModal}
        onOpenWhatsApp={onOpenWhatsApp}
      />

      {/* 7. Real Verified Client Reviews */}
      <ClientReviewsSection />

      {/* 8. Why Choose Proprint 4 Key Pillars */}
      <WhyChooseUs />

    </div>
  );
};
