import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AllProductsView } from '../components/AllProductsView';
import { Product } from '../types';

interface ProductsPageProps {
  onSelectProduct?: (product: Product) => void;
  onOpenQuoteModal?: (productName?: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  onSelectProduct,
  onOpenQuoteModal
}) => {
  const navigate = useNavigate();

  return (
    <div className="py-4">
      <AllProductsView
        onSelectProduct={(p) => {
          if (onSelectProduct) onSelectProduct(p);
          navigate(`/product/${p.id}`);
        }}
        onOpenQuoteModal={onOpenQuoteModal}
      />
    </div>
  );
};
