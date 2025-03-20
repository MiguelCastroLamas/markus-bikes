import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../../types/product';
import {
    Card,
    CardContent,
    CardFooter
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
            <div className="bg-gray-100 relative overflow-hidden" style={{ height: "220px" }}>
                <img
                    src={`/images/product-images/${product.id}.jpg`}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/product-images/product-placeholder.jpg';
                    }}
                />
            </div>

            <CardContent className="p-3 flex-1">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                    {product.description ? product.description : 'No description available'}
                </p>
            </CardContent>

            <CardFooter className="p-3 pt-0 mt-auto flex items-center justify-between">
                <span className="text-lg font-semibold">
                    ${product.basePrice.toFixed(2)}
                </span>
                <Button asChild size="sm">
                    <Link to={`/products/${product.id}/configure`}>
                        Configure
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProductCard; 