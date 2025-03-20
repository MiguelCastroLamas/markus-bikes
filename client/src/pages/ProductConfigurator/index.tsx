import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PRODUCT_DETAILS, GET_INCOMPATIBILITY_RULES, GET_PRICE_MODIFIERS } from '../../services/graphql/queries';
import { useProductConfiguration } from '../../hooks/useProductConfiguration';
import ConfiguratorSidebar from '../../components/product/configurator/ConfiguratorSidebar';
import ProductVisualization from '../../components/product/configurator/ProductVisualization';
import ConfigSummary from '../../components/product/configurator/ConfigSummary';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { AlertCircle, ArrowLeft, Loader2, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import SuccessDialog from '../../components/product/configurator/SuccessDialog';
import { Link } from 'react-router-dom';

const ProductConfigurator: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [showSuccess, setShowSuccess] = React.useState(false);

    // Ensure productId is a valid number for internal use, but pass as string to GraphQL
    const productIdNum = productId ? parseInt(productId, 10) : 0;
    const isValidProductId = !isNaN(productIdNum) && productIdNum > 0;

    // Fetch product details
    const { loading: loadingProduct, error, data } = useQuery(GET_PRODUCT_DETAILS, {
        variables: { id: productId },
        skip: !isValidProductId,
        onError: (err) => {
            console.error("GraphQL error:", err);
        }
    });

    const product = data?.product || null;

    // Fetch incompatibility rules (only after we have a product)
    const { loading: loadingRules, data: rulesData } = useQuery(GET_INCOMPATIBILITY_RULES, {
        variables: { productId },
        skip: !isValidProductId || !product?.id,
    });

    // Fetch price modifiers (only after we have a product)
    const { loading: loadingPriceModifiers, data: priceModifiersData } = useQuery(GET_PRICE_MODIFIERS, {
        variables: { productId },
        skip: !isValidProductId || !product?.id,
    });

    // Extract incompatibility rules and transform them to the format expected by the hook
    const incompatibilityRules = useMemo(() => {
        if (!rulesData?.incompatibilityRules || rulesData.incompatibilityRules.length === 0) {
            return [];
        }

        return rulesData.incompatibilityRules
            .filter((rule: any) => rule.options && rule.options.length >= 2)
            .map((rule: any) => {
                const optionIds = rule.options.map((option: any) => Number(option.id));

                return {
                    id: rule.id,
                    name: rule.ruleName,
                    description: rule.ruleDescription,
                    options: optionIds
                };
            });
    }, [rulesData]);

    // Extract price modifiers and transform them to the format expected by the hook
    const priceModifiers = useMemo(() => {
        if (!priceModifiersData?.pricingModifiers || priceModifiersData.pricingModifiers.length === 0) {
            return [];
        }

        return priceModifiersData.pricingModifiers.map((modifier: any) => ({
            baseOptionId: Number(modifier.baseOption.id),
            triggerOptionId: Number(modifier.triggerOption.id),
            overridePrice: Number(modifier.overridePrice)
        }));
    }, [priceModifiersData]);

    const categories = product?.categories || [];
    const options = React.useMemo(() => {
        const opts: Record<number, any[]> = {};
        if (categories) {
            categories.forEach((category: any) => {
                opts[category.id] = category.options || [];
            });
        }
        return opts;
    }, [categories]);

    // Use the hook to manage product configuration
    const {
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
    } = useProductConfiguration({
        product,
        categories,
        options,
        incompatibilityRules,
        priceModifiers
    });

    const hasNoConfigOptions = categories.length === 0;

    const canAddToCart = useMemo(() => {
        if (hasNoConfigOptions) return true;
        return isConfigurationComplete;
    }, [hasNoConfigOptions, isConfigurationComplete]);

    const [summaryPrice, setSummaryPrice] = useState(0);

    const handleSummaryPrice = useCallback((price: number) => {
        setSummaryPrice(price);
    }, []);

    const handleAddToCart = () => {
        if (!product) return;

        const selectedOptionArray = Object.values(selectedOptions).filter(
            (value): value is number => value !== null
        );

        // Use the summary price for adding to cart
        const finalPrice = summaryPrice > 0 ? summaryPrice : totalPrice;

        addItem({
            productId: product.id,
            name: product.name,
            basePrice: product.basePrice,
            selectedOptions: selectedOptionArray,
            totalPrice: finalPrice,
            quantity: 1
        });

        setShowSuccess(true);
    };

    const handleContinueShopping = () => {
        setShowSuccess(false);
        navigate('/products');
    };

    const handleGoToCart = () => {
        setShowSuccess(false);
        navigate('/cart');
    };

    // Loading state for all queries
    const isLoading = loadingProduct || loadingRules || loadingPriceModifiers;

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="text-lg text-muted-foreground">Loading product details...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <Card className="bg-destructive/10 border-destructive/30">
                    <CardContent className="p-6 flex items-start">
                        <AlertCircle className="h-6 w-6 text-destructive mr-4 mt-0.5" />
                        <div>
                            <h2 className="text-lg font-semibold text-destructive mb-2">
                                Error loading product
                            </h2>
                            <p className="text-destructive/80 mb-4">
                                {error ? error.message : !isValidProductId ? "Invalid product ID." : "Product not found or unavailable."}
                            </p>
                            <Button onClick={() => navigate('/products')}>
                                Return to products
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
                <Link to="/products" className="text-muted-foreground hover:text-foreground flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to products
                </Link>
            </div>

            <h1 className="text-3xl font-bold mb-6">{product.name}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left column: Configuration options and actions */}
                <div>
                    {hasNoConfigOptions ? (
                        <Card className="mb-6">
                            <CardContent className="p-6">
                                <div className="flex items-start">
                                    <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                                    <div>
                                        <h3 className="text-lg font-medium mb-1">No configuration needed</h3>
                                        <p className="text-muted-foreground">
                                            This product doesn't have any configuration options.
                                            You can add it directly to your cart.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <ConfiguratorSidebar
                            categories={categories}
                            currentStep={currentStep}
                            options={options}
                            selectedOptions={selectedOptions}
                            onSelectOption={selectOption}
                            isOptionAvailable={isOptionAvailable}
                                getUnavailabilityReason={getUnavailabilityReason}
                            onPrevious={goToPreviousStep}
                            onNext={goToNextStep}
                            canGoNext={canGoNext}
                            canGoPrevious={canGoPrevious}
                                priceModifiers={priceModifiers}
                        />
                    )}

                    <div className="mt-6 flex justify-end">
                        <Button
                            onClick={handleAddToCart}
                            disabled={!canAddToCart}
                        >
                            Add to cart - ${(summaryPrice > 0 ? summaryPrice : totalPrice).toFixed(2)}
                        </Button>
                    </div>
                </div>

                {/* Right column: Visualization and Summary */}
                <div className="flex flex-col">
                    <ProductVisualization
                        product={product}
                        selectedOptions={selectedOptions}
                    />

                    <ConfigSummary
                        product={product}
                        selectedOptions={selectedOptions}
                        options={options}
                        categories={categories}
                        totalPrice={totalPrice}
                        priceModifiers={priceModifiers}
                        onPriceCalculated={handleSummaryPrice}
                    />
                </div>
            </div>

            {/* Success Dialog */}
            <SuccessDialog
                open={showSuccess}
                onClose={() => setShowSuccess(false)}
                onContinueShopping={handleContinueShopping}
                onGoToCart={handleGoToCart}
                productName={product.name}
            />
        </div>
    );
};

export default ProductConfigurator; 