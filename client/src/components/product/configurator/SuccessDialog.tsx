import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { ShoppingCart, Check } from 'lucide-react';

interface SuccessDialogProps {
    open: boolean;
    onClose: () => void;
    onContinueShopping: () => void;
    onGoToCart: () => void;
    productName: string;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({
    open,
    onClose,
    onContinueShopping,
    onGoToCart,
    productName
}) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="bg-green-100 p-1 rounded-full">
                            <Check className="h-5 w-5 text-green-600" />
                        </div>
                        Added to cart successfully
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-gray-600">
                        Your customized <span className="font-medium">{productName}</span> has been added to your cart.
                    </p>
                </div>

                <DialogFooter className="sm:justify-start gap-2 flex-col sm:flex-row">
                    <Button
                        variant="outline"
                        onClick={onContinueShopping}
                        className="w-full sm:w-auto"
                    >
                        Continue Shopping
                    </Button>
                    <Button
                        onClick={onGoToCart}
                        className="w-full sm:w-auto flex items-center gap-2"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Go to Cart
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SuccessDialog; 