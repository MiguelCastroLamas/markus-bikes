import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import CartItemWithDetails from '../../components/cart/CartItemWithDetails';
import { Button } from '../../components/ui/button';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CheckoutUnavailableDialog from '../../components/dialogs/CheckoutUnavailableDialog';

const Cart: React.FC = () => {
    const cartContext = useCart();
    const [showDialog, setShowDialog] = useState(false);
    const [correctedPrices, setCorrectedPrices] = useState<Record<string, number>>({});

    const items = cartContext.state.items;

    const registerCalculatedPrice = (itemKey: string, price: number) => {
        setCorrectedPrices(prev => ({
            ...prev,
            [itemKey]: price
        }));
    };

    const cartSummary = useMemo(() => {
        const totalItems = items.reduce((total, item) => total + item.quantity, 0);

        const subtotal = items.reduce((total, item) => {
            const itemKey = `${item.productId}-${JSON.stringify(item.selectedOptions)}`;
            const itemPrice = correctedPrices[itemKey] !== undefined ? correctedPrices[itemKey] : item.totalPrice;
            return total + (itemPrice * item.quantity);
        }, 0);

        return {
            totalItems,
            subtotal
        };
    }, [items, correctedPrices]);

    if (items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center py-16">
                    <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-primary/10">
                        <ShoppingCart className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                    <p className="text-muted-foreground mb-6">Looks like you haven't added any products to your cart yet.</p>
                    <Button asChild>
                        <Link to="/products">Start Shopping</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-3 py-4">
            <div className="mb-3">
                <Link to="/products" className="inline-flex items-center text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue shopping
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    {items.map((item) => {
                        const itemKey = `${item.productId}-${JSON.stringify(item.selectedOptions)}`;
                        return (
                            <CartItemWithDetails
                                key={itemKey}
                                item={item}
                                updateQuantity={cartContext.updateQuantity}
                                removeItem={cartContext.removeItem}
                                onPriceCalculated={(price) => registerCalculatedPrice(itemKey, price)}
                            />
                        );
                    })}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-card rounded-lg border p-4 sticky top-16">
                        <h2 className="font-semibold text-xl mb-3">Order summary</h2>

                        <div className="space-y-2 mb-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Items ({cartSummary.totalItems})</span>
                                <span>${cartSummary.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>Free</span>
                            </div>
                        </div>

                        <div className="border-t pt-3 mb-4">
                            <div className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>${cartSummary.subtotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <Button
                            className="w-full"
                            onClick={() => setShowDialog(true)}
                        >
                            Proceed to checkout
                        </Button>
                    </div>
                </div>
            </div>

            <CheckoutUnavailableDialog
                open={showDialog}
                onClose={() => setShowDialog(false)}
            />
        </div>
    );
};

export default Cart; 