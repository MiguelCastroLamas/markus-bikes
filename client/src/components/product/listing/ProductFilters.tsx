import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCT_TYPES } from '../../../services/graphql/queries';
import { Product, ProductType } from '../../../types/product';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Slider } from "../../ui/slider";

interface ProductFiltersProps {
    onFilterChange: (filters: FilterOptions) => void;
    products: Product[];
}

export interface FilterOptions {
    productTypeId: number | null;
    priceRange: [number, number];
    searchTerm: string;
    categoryOptions: Record<number, number[]>;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilterChange, products }) => {
    const [filters, setFilters] = useState<FilterOptions>({
        productTypeId: null,
        priceRange: [0, 1000],
        searchTerm: '',
        categoryOptions: {},
    });

    const { data: productTypesData } = useQuery(GET_PRODUCT_TYPES);
    const productTypes = productTypesData?.productTypes || [];

    // Determine the maximum price based on the most expensive product
    const maxPrice = React.useMemo(() => {
        if (!products || products.length === 0) return 2000;
        return Math.max(...products.map(p => p.basePrice));
    }, [products]);

    // Handle filter changes
    const handleProductTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value === "all" ? null : parseInt(e.target.value, 10);
        setFilters(prev => ({
            ...prev,
            productTypeId: value,
            categoryOptions: {}
        }));
    };

    const handlePriceRangeChange = (values: [number, number]) => {
        setFilters(prev => ({ ...prev, priceRange: values }));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
    };

    // Update parent component when filters change
    useEffect(() => {
        onFilterChange(filters);
    }, [filters, onFilterChange]);

    // Inicializar con el precio máximo basado en productos
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            priceRange: [0, maxPrice]
        }));
    }, [maxPrice]);

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="product-type">Product Type</Label>
                        <Select
                            onValueChange={(value: string) => handleProductTypeChange({
                                target: { value }
                            } as React.ChangeEvent<HTMLSelectElement>)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select product type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Products</SelectItem>
                                {productTypes.map((type: ProductType) => (
                                    <SelectItem key={type.id} value={type.id.toString()}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 mb-4">
                        <Label htmlFor="price-range">Price Range</Label>
                        <div className="pt-4 px-1">
                            <Slider
                                id="price-range"
                                defaultValue={[0, maxPrice]}
                                max={maxPrice}
                                step={10}
                                value={filters.priceRange}
                                onValueChange={handlePriceRangeChange}
                            />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span>${filters.priceRange[0]}</span>
                            <span>${filters.priceRange[1]}</span>
                        </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="search">Search</Label>
                        <Input
                            id="search"
                            type="text"
                            placeholder="Search products..."
                            value={filters.searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductFilters; 