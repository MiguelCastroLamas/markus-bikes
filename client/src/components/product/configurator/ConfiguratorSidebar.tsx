import React, { useMemo } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { ProductCategory, CategoryOption, PriceModifier } from '../../../types/product';
import { UnavailabilityReason } from '../../../hooks/useProductConfiguration';

interface ConfiguratorSidebarProps {
    categories: ProductCategory[];
    currentStep: number;
    options: Record<number, CategoryOption[]>;
    selectedOptions: Record<number, number | null>;
    onSelectOption: (categoryId: number, optionId: number | null) => void;
    isOptionAvailable: (categoryId: number, optionId: number) => boolean;
    getUnavailabilityReason?: (categoryId: number, optionId: number) => UnavailabilityReason;
    onPrevious: () => void;
    onNext: () => void;
    canGoNext: boolean;
    canGoPrevious: boolean;
    priceModifiers?: PriceModifier[];
}

const ConfiguratorSidebar: React.FC<ConfiguratorSidebarProps> = ({
    categories,
    currentStep,
    options,
    selectedOptions,
    onSelectOption,
    isOptionAvailable,
    getUnavailabilityReason,
    onPrevious,
    onNext,
    canGoNext,
    canGoPrevious,
    priceModifiers = []
}) => {
    if (categories.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center py-8">
                        <AlertCircle className="h-8 w-8 text-amber-600 mx-auto mb-4" />
                        <p className="text-gray-700 font-medium">This product has no configuration options</p>
                        <p className="text-sm text-gray-500 mt-2">
                            You can add it directly to your cart without customization.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const currentCategory = categories[currentStep];
    const currentOptions = options[currentCategory.id] || [];
    const isCategorySelected = selectedOptions[currentCategory.id] !== null;

    // Function to get adjusted price of an option based on price modifiers
    const getAdjustedPrice = (option: CategoryOption) => {
        if (!priceModifiers || priceModifiers.length === 0) {
            return option.price;
        }

        // Get selected option IDs
        const selectedOptionIds = Object.values(selectedOptions)
            .filter(id => id !== null)
            .map(id => Number(id));

        // Find applicable price modifier
        for (const modifier of priceModifiers) {
            // If this option is the base and the trigger option is selected
            if (Number(option.id) === Number(modifier.baseOptionId) &&
                selectedOptionIds.includes(Number(modifier.triggerOptionId))) {
                return modifier.overridePrice;
            }
        }

        return option.price;
    };

    // Function to determine if a price has been modified
    const isPriceModified = (option: CategoryOption) => {
        const originalPrice = option.price;
        const adjustedPrice = getAdjustedPrice(option);
        return originalPrice !== adjustedPrice;
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle>{currentCategory.name}</CardTitle>
                {currentCategory.description && (
                    <CardDescription>{currentCategory.description}</CardDescription>
                )}
                <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">
                        Step {currentStep + 1} of {categories.length}
                    </span>
                    {currentCategory.isRequired && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                </div>
                <Progress
                    value={((currentStep) / (categories.length - 1)) * 100}
                    className="h-2 mt-2"
                />
            </CardHeader>
            <CardContent>
                {currentOptions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        {currentOptions.map((option) => {
                            const isSelected = selectedOptions[currentCategory.id] === option.id;
                            const isAvailable = isOptionAvailable(currentCategory.id, option.id);
                            const unavailabilityReason = getUnavailabilityReason?.(currentCategory.id, option.id) || null;
                            const adjustedPrice = getAdjustedPrice(option);
                            const isModified = isPriceModified(option);

                            // Define message based on unavailability reason
                            let statusMessage = null;
                            if (!isAvailable && !isSelected) {
                                if (unavailabilityReason === 'OUT_OF_STOCK') {
                                    statusMessage = "Out of stock";
                                } else if (unavailabilityReason === 'INCOMPATIBLE') {
                                    statusMessage = "Incompatible with your selection";
                                }
                            }

                            return (
                                <div
                                    key={option.id}
                                    className={`
                                        relative p-4 border-2 rounded-lg text-center transition-all
                                        ${isSelected ? 'border-primary bg-primary/5' : isAvailable ? 'border-border hover:border-muted-foreground/50' : 'border-gray-300 bg-gray-100'} 
                                        ${!isAvailable ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                                    `}
                                    onClick={() => {
                                        if (isAvailable || isSelected) {
                                            onSelectOption(currentCategory.id, isSelected ? null : option.id);
                                        }
                                    }}
                                >
                                    {isSelected && (
                                        <span className="absolute top-2 right-2 flex items-center justify-center h-5 w-5 bg-primary rounded-full">
                                            <Check className="h-3 w-3 text-primary-foreground" />
                                        </span>
                                    )}
                                    <div className="font-medium mb-1">{option.name}</div>
                                    <div className="text-sm">
                                        {isModified ? (
                                            <>
                                                <span className="line-through text-muted-foreground mr-2">
                                                    +${option.price.toFixed(2)}
                                                </span>
                                                {adjustedPrice < option.price ? (
                                                    <span className="text-green-600 font-medium">
                                                        +${adjustedPrice.toFixed(2)}
                                                    </span>
                                                ) : (
                                                    <span className="text-orange-500 font-medium">
                                                        +${adjustedPrice.toFixed(2)}
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                +${adjustedPrice.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    {statusMessage && (
                                        <div className="text-xs text-gray-500 mt-2 font-medium">
                                            {statusMessage}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center p-4 border rounded-lg bg-muted mb-6">
                        <p className="text-muted-foreground">No options available for this category</p>
                    </div>
                )}

                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={onPrevious}
                        disabled={!canGoPrevious}
                        className="flex items-center"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                    </Button>

                    <Button
                        onClick={onNext}
                        disabled={!canGoNext || (currentCategory.isRequired && !isCategorySelected)}
                        className="flex items-center"
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ConfiguratorSidebar; 