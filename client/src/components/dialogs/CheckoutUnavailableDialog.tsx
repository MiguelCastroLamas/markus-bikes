import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

interface CheckoutUnavailableDialogProps {
    open: boolean;
    onClose: () => void;
}

const CheckoutUnavailableDialog: React.FC<CheckoutUnavailableDialogProps> = ({ open, onClose }) => {
    const navigate = useNavigate();

    const handleContinueShopping = () => {
        onClose();
        navigate('/products');
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">Checkout not available</DialogTitle>
                    <DialogDescription className="text-center">
                        This is a demo application. The checkout functionality is not implemented.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-center my-6">
                    <div className="bg-muted/50 rounded-full p-6">
                        <ShoppingBag className="h-12 w-12 text-primary" />
                    </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                    <Button className="flex-1" onClick={handleContinueShopping}>
                        Continue shopping
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={onClose}>
                        Return to cart
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CheckoutUnavailableDialog; 