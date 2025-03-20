import React, { useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Product, ProductCategory, CategoryOption } from '../../../types/product';

interface ConfigSummaryProps {
    product: Product;
    selectedOptions: Record<number, number | null>;
    options: Record<number, CategoryOption[]>;
    categories: ProductCategory[];
    totalPrice: number;
    priceModifiers?: any[];
    onPriceCalculated?: (price: number) => void;
}

const ConfigSummary: React.FC<ConfigSummaryProps> = ({
    product,
    selectedOptions,
    options,
    categories,
    priceModifiers = [],
    onPriceCalculated
}) => {
    const getOptionName = (categoryId: number, optionId: number | null) => {
        if (optionId === null) return 'Not selected';
        const option = options[categoryId]?.find(o => o.id === optionId);
        return option ? option.name : 'Unknown option';
    };

    // Calculate original option prices
    const originalPrices = useMemo(() => {
        const prices: Record<number, number> = {};

        Object.entries(selectedOptions).forEach(([categoryId, optionId]) => {
            if (optionId !== null) {
                const option = options[parseInt(categoryId)]?.find(o => o.id === optionId);
                if (option) {
                    prices[optionId] = option.price;
                }
            }
        });

        return prices;
    }, [selectedOptions, options]);

    // Calculate adjusted prices based on modifiers
    const adjustedPrices = useMemo(() => {
        const prices = { ...originalPrices };

        if (!priceModifiers || priceModifiers.length === 0) return prices;

        // Get all selected option IDs
        const selectedIds = Object.values(selectedOptions)
            .filter(id => id !== null)
            .map(id => Number(id));

        // Apply modifiers
        for (const modifier of priceModifiers) {
            if (typeof modifier.baseOptionId === 'number' &&
                typeof modifier.triggerOptionId === 'number' &&
                typeof modifier.overridePrice === 'number') {

                // Check if both options are selected
                const baseSelected = selectedIds.includes(modifier.baseOptionId);
                const triggerSelected = selectedIds.includes(modifier.triggerOptionId);

                if (baseSelected && triggerSelected) {
                    // Apply the price override
                    prices[modifier.baseOptionId] = modifier.overridePrice;
                }
            }
        }

        return prices;
    }, [originalPrices, priceModifiers, selectedOptions]);

    const getOptionPrice = (categoryId: number, optionId: number | null) => {
        if (optionId === null) return 0;

        // If there's an adjusted price, use it
        if (adjustedPrices[optionId] !== undefined) {
            return adjustedPrices[optionId];
        }

        const option = options[categoryId]?.find(o => o.id === optionId);
        return option ? option.price : 0;
    };

    // Determine if a price is modified
    const isPriceModified = (optionId: number | null) => {
        if (optionId === null) return false;

        return adjustedPrices[optionId] !== undefined &&
            originalPrices[optionId] !== undefined &&
            adjustedPrices[optionId] !== originalPrices[optionId];
    };

    // Calculate the total price based on adjusted prices
    const calculatedTotalPrice = useMemo(() => {
        let total = product.basePrice;

        // Add all selected options with their adjusted prices
        Object.entries(selectedOptions).forEach(([categoryId, optionId]) => {
            if (optionId !== null) {
                const price = getOptionPrice(Number(categoryId), optionId);
                total += price;
            }
        });

        return total;
    }, [product.basePrice, selectedOptions, getOptionPrice]);

    // Notify parent component about the calculated price
    useEffect(() => {
        if (onPriceCalculated) {
            onPriceCalculated(calculatedTotalPrice);
        }
    }, [calculatedTotalPrice, onPriceCalculated]);

    return (
        <Card className="mt-4">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Configuration summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center pb-1 border-b border-border/50">
                        <span className="font-medium">Base price</span>
                        <span>${product.basePrice.toFixed(2)}</span>
                    </div>

                    {categories.map((category) => {
                        const optionId = selectedOptions[category.id];
                        const isModified = isPriceModified(optionId);
                        const originalPrice = optionId !== null ? originalPrices[optionId] : 0;
                        const currentPrice = getOptionPrice(category.id, optionId);

                        return (
                            <div key={category.id} className="flex justify-between items-center text-sm py-1 border-b border-border/50">
                                <div className="flex flex-col">
                                    <span className="font-medium">{category.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {getOptionName(category.id, optionId)}
                                    </span>
                                </div>
                                <div className="text-right">
                                    {optionId !== null ? (
                                        <>
                                            {isModified && (
                                                <span className="text-xs line-through text-muted-foreground mr-2">
                                                    ${originalPrice.toFixed(2)}
                                                </span>
                                            )}
                                            <span className={isModified ? "text-green-600 font-medium" : "text-muted-foreground"}>
                                                +${currentPrice.toFixed(2)}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    <div className="flex justify-between items-center pt-2 text-base font-bold">
                        <span>Total price</span>
                        <span>${calculatedTotalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ConfigSummary; 