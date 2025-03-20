import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { GET_PRODUCTS, GET_PRODUCT_TYPES } from '../../services/graphql/queries';
import ProductCard from '../../components/product/listing/ProductCard';
import { Product, ProductType } from '../../types/product';
import {
    Card,
    CardContent
} from '../../components/ui/card';
import {
    Slider
} from '../../components/ui/slider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Search } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert';

const ProductList: React.FC = () => {
    const location = useLocation();
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>("all");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [minMaxPriceRange, setMinMaxPriceRange] = useState<[number, number]>([0, 1000]);

    const { data: productsData, error: productsError } = useQuery(GET_PRODUCTS);
    const { data: typesData, error: typesError } = useQuery(GET_PRODUCT_TYPES);

    const products = productsData?.products || [];
    const productTypes = typesData?.productTypes || [];

    // Calculate price range when products change
    useEffect(() => {
        if (products.length) {
            const prices = products.map((p: Product) => p.basePrice);
            const minPrice = Math.floor(Math.min(...prices));
            const maxPrice = Math.ceil(Math.max(...prices));
            setMinMaxPriceRange([minPrice, maxPrice]);
            setPriceRange([minPrice, maxPrice]);
        }
    }, [products]);

    useEffect(() => {
        if (!products.length) return;

        let result = [...products];

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchLower) ||
                (product.description && product.description.toLowerCase().includes(searchLower))
            );
        }

        if (selectedType && selectedType !== "all") {
            const typeId = parseInt(selectedType, 10);

            result = result.filter(product => {
                if (product.productType && product.productType.id) {
                    const productTypeId = Number(product.productType.id);
                    return productTypeId === typeId;
                }
                return false;
            });
        }

        result = result.filter(product =>
            product.basePrice >= priceRange[0] &&
            product.basePrice <= priceRange[1]
        );

        setFilteredProducts(result);
    }, [products, searchTerm, selectedType, priceRange]);

    const handlePriceChange = (value: number[]) => {
        setPriceRange([value[0], value[1]] as [number, number]);
    };

    // Render errors
    if (productsError || typesError) {
        return (
            <div className="container mx-auto px-1 pt-6 pb-4">
                <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {productsError ? `Error loading products: ${productsError.message}` : ''}
                        {typesError ? `Error loading product types: ${typesError.message}` : ''}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-1 pt-6 pb-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-1">
                    <Card className="sticky top-20">
                        <CardContent className="p-3">
                            <div className="flex flex-wrap gap-2 items-center">
                                <div className="relative flex-1 min-w-[180px]">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search products..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="w-[170px]">
                                    <Select value={selectedType} onValueChange={setSelectedType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Product type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All types</SelectItem>
                                            {productTypes && productTypes.length > 0 ? (
                                                productTypes.map((type: ProductType) => (
                                                    <SelectItem key={type.id} value={type.id.toString()}>
                                                        {type.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="loading" disabled>
                                                    No product types available
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex-1 min-w-[180px] mt-1">
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Price: ${priceRange[0]} - ${priceRange[1]}
                                    </p>
                                    <Slider
                                        min={minMaxPriceRange[0]}
                                        max={minMaxPriceRange[1]}
                                        step={10}
                                        value={[priceRange[0], priceRange[1]]}
                                        onValueChange={handlePriceChange}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-3">
                    <div className="mb-4 flex justify-end items-center">
                        <span className="text-muted-foreground">
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-3">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8">
                                <p className="text-lg text-muted-foreground">No products match your filters</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;