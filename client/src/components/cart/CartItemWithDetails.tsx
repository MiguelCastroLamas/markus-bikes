import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Button } from '../../components/ui/button';
import { MinusCircle, PlusCircle, Trash2 } from 'lucide-react';
import { GET_PRODUCT_DETAILS, GET_PRICE_MODIFIERS } from '../../services/graphql/queries';
import { CartItem as CartItemType } from '../../context/CartContext';
import { CategoryOption } from '../../types/product';

interface CartItemProps {
    item: CartItemType;
    updateQuantity: (productId: number, selectedOptions: number[], quantity: number) => void;
    removeItem: (productId: number, selectedOptions: number[]) => void;
    onPriceCalculated?: (price: number) => void;
}

const CartItemWithDetails: React.FC<CartItemProps> = ({ item, updateQuantity, removeItem, onPriceCalculated }) => {
    const { loading, error, data } = useQuery(GET_PRODUCT_DETAILS, {
        variables: { id: item.productId.toString() },
        fetchPolicy: 'cache-first'
    });

    // Fetch price modifiers to display modified prices correctly
    const { data: modifiersData } = useQuery(GET_PRICE_MODIFIERS, {
        variables: { productId: item.productId.toString() },
        fetchPolicy: 'cache-first'
    });

    // Get adjusted price based on modifiers
    const getAdjustedPrice = (optionId: number, originalPrice: number) => {
        if (!modifiersData?.pricingModifiers || !item.selectedOptions) return originalPrice;

        const selectedOptionIds = item.selectedOptions.map(id => Number(id));

        // Check if this option has any applicable price modifiers
        for (const modifier of modifiersData.pricingModifiers) {
            const baseOptionId = Number(modifier.baseOptionId);
            const triggerOptionId = Number(modifier.triggerOptionId);

            // If this option is the base option and the trigger option is also selected
            if (Number(optionId) === baseOptionId && selectedOptionIds.includes(triggerOptionId)) {
                return Number(modifier.overridePrice);
            }
        }

        return originalPrice;
    };

    const findOptionDetails = (optionId: number) => {
        for (const category of data.product.categories) {
            const option = category.options.find((opt: CategoryOption) => opt.id === optionId);
            if (option) {
                const originalPrice = option.price;
                const adjustedPrice = getAdjustedPrice(optionId, originalPrice);

                return {
                    name: option.name,
                    price: adjustedPrice,
                    originalPrice: originalPrice,
                    isModified: originalPrice !== adjustedPrice,
                    categoryName: category.name
                };
            }
        }

        return {
            name: `Option ${optionId}`,
            price: 0,
            originalPrice: 0,
            isModified: false,
            categoryName: 'Unknown Category'
        };
    };

    // Calculate the total price correctly
    const correctTotalPrice = React.useMemo(() => {
        if (!data?.product) return item.totalPrice;

        let calculatedTotal = data.product.basePrice;

        // Add adjusted prices of all selected options
        if (item.selectedOptions && item.selectedOptions.length > 0 && data.product.categories) {
            for (const optionId of item.selectedOptions) {
                const optionDetails = findOptionDetails(optionId);
                calculatedTotal += optionDetails.price;
            }
        }

        return calculatedTotal;
    }, [data, modifiersData, item.selectedOptions]);

    // Notify parent component about the calculated price
    useEffect(() => {
        if (onPriceCalculated && correctTotalPrice !== item.totalPrice) {
            onPriceCalculated(correctTotalPrice);
        }
    }, [correctTotalPrice, item.totalPrice, onPriceCalculated]);

    if (loading) {
        return (
            <div className="flex flex-col sm:flex-row border-b py-4 last:border-0 animate-pulse">
                <div className="w-full sm:w-36 h-36 bg-gray-200 rounded-md"></div>
                <div className="flex-1 ml-4 space-y-3 py-2">
                    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (error || !data || !data.product) {
        return (
            <div className="flex flex-col sm:flex-row border-b py-4 last:border-0">
                <div className="w-full sm:w-36 h-auto mb-3 sm:mb-0 sm:mr-4">
                    <div className="aspect-square w-full bg-gray-100 rounded-md overflow-hidden">
                        <img
                            src={`/images/product-images/product-placeholder.jpg`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="font-semibold text-right">${(item.totalPrice * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="my-2 text-sm text-red-500">
                        Error loading product details
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                            <button
                                onClick={() => updateQuantity(item.productId, item.selectedOptions || [], item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="text-gray-500 disabled:text-gray-300"
                                aria-label="Decrease quantity"
                            >
                                <MinusCircle className="h-5 w-5" />
                            </button>
                            <span className="mx-3 w-6 text-center">{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item.productId, item.selectedOptions || [], item.quantity + 1)}
                                className="text-gray-500"
                                aria-label="Increase quantity"
                            >
                                <PlusCircle className="h-5 w-5" />
                            </button>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.productId, item.selectedOptions || [])}
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        >
                            <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row border-b py-4 last:border-0">
            <div className="w-full sm:w-36 h-auto mb-3 sm:mb-0 sm:mr-4">
                <div className="aspect-square w-full bg-gray-100 rounded-md overflow-hidden">
                    <img
                        src={`/images/product-images/${item.productId}.jpg`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/product-images/product-placeholder.jpg';
                        }}
                    />
                </div>
            </div>

            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{data.product.name}</h3>
                    <p className="font-semibold text-right">${(correctTotalPrice * item.quantity).toFixed(2)}</p>
                </div>

                <div className="my-2">
                    <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                        {/* Show base price first */}
                        <li className="flex justify-between items-baseline">
                            <span>Base price</span>
                            <span>${data.product.basePrice.toFixed(2)}</span>
                        </li>

                        {/* Show selected options with proper names and prices */}
                        {item.selectedOptions && item.selectedOptions.length > 0 &&
                            item.selectedOptions.map((optionId: number) => {
                                const optionDetails = findOptionDetails(optionId);

                                return (
                                    <li key={optionId} className="flex justify-between items-baseline">
                                        <span className="mr-4">{optionDetails.categoryName}: {optionDetails.name}</span>
                                        <span className="text-right">
                                            {optionDetails.price > 0
                                                ? `+$${optionDetails.price.toFixed(2)}`
                                                : '$0.00'
                                            }
                                        </span>
                                    </li>
                                );
                            })
                        }

                        {/* Show quantity if more than 1 unit */}
                        {item.quantity > 1 && (
                            <li className="flex justify-between items-baseline font-medium pt-1">
                                <span>Quantity:</span>
                                <span>x{item.quantity}</span>
                            </li>
                        )}
                    </ul>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                        <button
                            onClick={() => updateQuantity(item.productId, item.selectedOptions || [], item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="text-gray-500 disabled:text-gray-300"
                            aria-label="Decrease quantity"
                        >
                            <MinusCircle className="h-5 w-5" />
                        </button>
                        <span className="mx-3 w-6 text-center">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.productId, item.selectedOptions || [], item.quantity + 1)}
                            className="text-gray-500"
                            aria-label="Increase quantity"
                        >
                            <PlusCircle className="h-5 w-5" />
                        </button>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.productId, item.selectedOptions || [])}
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CartItemWithDetails; 