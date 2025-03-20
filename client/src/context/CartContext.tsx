import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ConfiguredProduct } from '../types/product';

export interface CartItem {
    productId: number;
    name: string;
    basePrice?: number;
    selectedOptions: number[];
    totalPrice: number;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    total: number;
}

type CartAction =
    | { type: 'ADD_ITEM'; payload: CartItem }
    | { type: 'REMOVE_ITEM'; payload: { productId: number, selectedOptions: number[] } }
    | { type: 'UPDATE_QUANTITY'; payload: { productId: number, selectedOptions: number[], quantity: number } }
    | { type: 'CLEAR_CART' };

const initialState: CartState = {
    items: [],
    total: 0
};

const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_ITEM': {
            // Check if the item already exists with the same options
            const existingItemIndex = state.items.findIndex(
                item =>
                    item.productId === action.payload.productId &&
                    JSON.stringify(item.selectedOptions.sort()) === JSON.stringify(action.payload.selectedOptions.sort())
            );

            let newItems;
            if (existingItemIndex >= 0) {
                // Update quantity if item exists
                newItems = [...state.items];
                newItems[existingItemIndex] = {
                    ...newItems[existingItemIndex],
                    quantity: newItems[existingItemIndex].quantity + action.payload.quantity
                };
            } else {
                // Add new item
                newItems = [...state.items, action.payload];
            }

            return {
                items: newItems,
                total: calculateTotal(newItems)
            };
        }
        case 'REMOVE_ITEM': {
            const newItems = state.items.filter(
                item =>
                    !(item.productId === action.payload.productId &&
                        JSON.stringify(item.selectedOptions.sort()) === JSON.stringify(action.payload.selectedOptions.sort()))
            );

            return {
                items: newItems,
                total: calculateTotal(newItems)
            };
        }
        case 'UPDATE_QUANTITY': {
            const existingItemIndex = state.items.findIndex(
                item =>
                    item.productId === action.payload.productId &&
                    JSON.stringify(item.selectedOptions.sort()) === JSON.stringify(action.payload.selectedOptions.sort())
            );

            if (existingItemIndex >= 0) {
                const newItems = [...state.items];
                newItems[existingItemIndex] = {
                    ...newItems[existingItemIndex],
                    quantity: action.payload.quantity
                };

                return {
                    items: newItems,
                    total: calculateTotal(newItems)
                };
            }
            return state;
        }
        case 'CLEAR_CART':
            return initialState;
        default:
            return state;
    }
};

interface CartContextType {
    state: CartState;
    addItem: (item: CartItem) => void;
    removeItem: (productId: number, selectedOptions: number[]) => void;
    updateQuantity: (productId: number, selectedOptions: number[], quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    const addItem = (item: CartItem) => {
        dispatch({ type: 'ADD_ITEM', payload: item });
    };

    const removeItem = (productId: number, selectedOptions: number[]) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { productId, selectedOptions } });
    };

    const updateQuantity = (productId: number, selectedOptions: number[], quantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, selectedOptions, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    return (
        <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}; 