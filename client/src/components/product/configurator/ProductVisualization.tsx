import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Product } from '../../../types/product';

interface ProductVisualizationProps {
    product: Product;
    selectedOptions: Record<number, number | null>;
}

const ProductVisualization: React.FC<ProductVisualizationProps> = ({ product }) => {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="bg-gray-100 rounded-md overflow-hidden" style={{ aspectRatio: '4/3', maxHeight: '300px' }}>
                    <img
                        src={`/images/product-images/${product.id}.jpg`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/product-images/product-placeholder.jpg';
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductVisualization; 