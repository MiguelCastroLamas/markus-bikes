export interface ProductType {
    id: number;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Product {
    id: number;
    name: string;
    description?: string;
    basePrice: number;
    imageUrl?: string;
    type?: ProductType;
    categories: ProductCategory[];
    incompatibilityRules: IncompatibilityRule[];
    priceModifiers: PriceModifier[];
}

export interface ProductCategory {
    id: number;
    name: string;
    description?: string;
    isRequired: boolean;
    options: CategoryOption[];
}

export interface CategoryOption {
    id: number;
    name: string;
    price: number;
    isAvailable: boolean;
    image?: string;
}

export interface IncompatibilityRule {
    optionId: number;
    incompatibleWithOptionId: number;
    options?: number[];
}

export interface PriceModifier {
    id?: number;
    baseOptionId: number;
    triggerOptionId: number;
    overridePrice: number;
    baseOption?: CategoryOption;
    triggerOption?: CategoryOption;
}

export interface ConfiguredProduct {
    productId: number;
    selectedOptions: number[];
    totalPrice: number;
}

export interface CartItem {
    productId: number;
    name: string;
    basePrice?: number;
    selectedOptions: number[];
    totalPrice: number;
    quantity: number;
} 