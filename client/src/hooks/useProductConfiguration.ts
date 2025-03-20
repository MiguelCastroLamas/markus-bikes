import { useState, useEffect, useMemo } from 'react';
import {
    Product,
    ProductCategory,
    CategoryOption,
    IncompatibilityRule,
    PriceModifier
} from '../types/product';

export type UnavailabilityReason = 'INCOMPATIBLE' | 'OUT_OF_STOCK' | null;

interface UseProductConfigurationProps {
    product: Product | null;
    categories: ProductCategory[];
    options: Record<number, CategoryOption[]>;
    incompatibilityRules: IncompatibilityRule[];
    priceModifiers: PriceModifier[];
}

interface UseProductConfigurationReturn {
    selectedOptions: Record<number, number | null>;
    selectOption: (categoryId: number, optionId: number | null) => void;
    totalPrice: number;
    isOptionAvailable: (categoryId: number, optionId: number) => boolean;
    getUnavailabilityReason: (categoryId: number, optionId: number) => UnavailabilityReason;
    isConfigurationComplete: boolean;
    resetConfiguration: () => void;
    currentStep: number;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    canGoNext: boolean;
    canGoPrevious: boolean;
}

export const useProductConfiguration = ({
    product,
    categories,
    options,
    incompatibilityRules,
    priceModifiers
}: UseProductConfigurationProps): UseProductConfigurationReturn => {
    const [selectedOptions, setSelectedOptions] = useState<Record<number, number | null>>({});
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (categories.length > 0) {
            const initialSelections: Record<number, number | null> = {};
            categories.forEach(category => {
                initialSelections[category.id] = null;
            });
            setSelectedOptions(initialSelections);
            setCurrentStep(0);
        }
    }, [categories]);

    const selectOption = (categoryId: number, optionId: number | null) => {
        // If we're deselecting (optionId is null), always allow it
        if (optionId === null) {
            setSelectedOptions(prev => ({
                ...prev,
                [categoryId]: null
            }));
            return;
        }

        if (!isOptionAvailable(categoryId, optionId)) {
            return; // Don't allow selecting incompatible options
        }

        setSelectedOptions(prev => ({
            ...prev,
            [categoryId]: optionId
        }));
    };

    const clearSubsequentSelections = (step: number) => {
        const subsequentCategories = categories.slice(step + 1);
        if (subsequentCategories.length === 0) return;

        const newSelections = { ...selectedOptions };
        subsequentCategories.forEach(category => {
            if (newSelections[category.id] !== null) {
                newSelections[category.id] = null;
            }
        });

        setSelectedOptions(newSelections);
    };

    const goToNextStep = () => {
        if (currentStep < categories.length - 1) {
            const currentCategory = categories[currentStep];
            if (!currentCategory.isRequired || selectedOptions[currentCategory.id] !== null) {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const goToPreviousStep = () => {
        if (currentStep > 0) {
            clearSubsequentSelections(currentStep - 1);
            setCurrentStep(currentStep - 1);
        }
    };

    const getUnavailabilityReason = (categoryId: number, optionId: number): UnavailabilityReason => {
        if (selectedOptions[categoryId] === optionId) {
            return null;
        }

        const option = options[categoryId]?.find(opt => opt.id === optionId);
        if (!option || !option.isAvailable || (option as any).stockQuantity <= 0) {
            return 'OUT_OF_STOCK';
        }

        if (!incompatibilityRules || incompatibilityRules.length === 0) {
            return null;
        }

        const selectedOptionIds = Object.values(selectedOptions)
            .filter(id => id !== null)
            .map(id => Number(id));

        if (selectedOptionIds.length === 0) {
            return null;
        }

        const optionIdNum = Number(optionId);
        for (const rule of incompatibilityRules) {
            if (rule.options && rule.options.includes(optionIdNum)) {
                for (const selectedId of selectedOptionIds) {
                    if (rule.options.includes(selectedId)) {
                        return 'INCOMPATIBLE';
                    }
                }
            }
        }

        return null;
    };

    const isOptionAvailable = (categoryId: number, optionId: number): boolean => {
        return getUnavailabilityReason(categoryId, optionId) === null;
    };

    // Calculate the total price based on selected options
    const totalPrice = useMemo(() => {
        if (!product) return 0;

        let price = product.basePrice;
        const optionPrices = new Map<number, number>(); // Map to track original and adjusted prices

        Object.entries(selectedOptions).forEach(([categoryId, optionId]) => {
            if (optionId !== null) {
                const option = options[parseInt(categoryId)]?.find(opt => opt.id === optionId);
                if (option) {
                    optionPrices.set(optionId, option.price);
                    price += option.price;
                }
            }
        });

        // Apply price modifiers
        if (priceModifiers && priceModifiers.length > 0) {
            const selectedIds = Object.values(selectedOptions)
                .filter(id => id !== null)
                .map(id => Number(id));

            for (const modifier of priceModifiers) {
                if ('baseOptionId' in modifier &&
                    'triggerOptionId' in modifier &&
                    'overridePrice' in modifier &&
                    typeof modifier.baseOptionId === 'number' &&
                    typeof modifier.triggerOptionId === 'number' &&
                    typeof modifier.overridePrice === 'number') {

                    // Check if both options are selected
                    const baseSelected = selectedIds.includes(modifier.baseOptionId);
                    const triggerSelected = selectedIds.includes(modifier.triggerOptionId);

                    if (baseSelected && triggerSelected) {
                        const originalPrice = optionPrices.get(modifier.baseOptionId) || 0;
                        price = price - originalPrice + modifier.overridePrice;
                        optionPrices.set(modifier.baseOptionId, modifier.overridePrice);
                    }
                }
            }
        }

        return Math.max(0, price);
    }, [product, selectedOptions, options, priceModifiers]);

    // Check if the configuration is complete (all required categories have a selection)
    const isConfigurationComplete = useMemo(() => {
        if (categories.length === 0) {
            return false;
        }

        return categories.every(category =>
            !category.isRequired || selectedOptions[category.id] !== null
        );
    }, [categories, selectedOptions]);

    const resetConfiguration = () => {
        const initialSelections: Record<number, number | null> = {};
        categories.forEach(category => {
            initialSelections[category.id] = null;
        });
        setSelectedOptions(initialSelections);
        setCurrentStep(0);
    };

    const canGoNext = currentStep < categories.length - 1;
    const canGoPrevious = currentStep > 0;

    return {
        selectedOptions,
        selectOption,
        totalPrice,
        isOptionAvailable,
        getUnavailabilityReason,
        isConfigurationComplete,
        resetConfiguration,
        currentStep,
        goToNextStep,
        goToPreviousStep,
        canGoNext,
        canGoPrevious
    };
}; 