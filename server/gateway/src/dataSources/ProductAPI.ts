import fetch from 'node-fetch';
import { RequestInit } from 'node-fetch';

interface ProductAPIConfig {
    baseURL: string;
}

export class ProductAPI {
    private baseURL: string;

    constructor(config: ProductAPIConfig) {
        this.baseURL = config.baseURL;
    }

    private async fetchAPI(path: string, options: RequestInit = {}) {
        const url = `${this.baseURL}${path}`;
        try {
            console.log(`Fetching from ${url}`);
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching from ${url}:`, error);
            throw error;
        }
    }

    async getProductTypes() {
        return this.fetchAPI('/product-types');
    }

    async getProductTypeById(id: string) {
        return this.fetchAPI(`/product-types/${id}`);
    }

    async getProducts() {
        console.log(`Getting all products`);
        return this.fetchAPI('/products');
    }

    async getProductById(id: string) {
        console.log(`Fetching product ${id} from microservice`);
        return this.fetchAPI(`/products/${id}`);
    }

    async getProductCategories(productId: string) {
        return this.fetchAPI(`/products/${productId}/categories`);
    }

    async getCategoryOptions(categoryId: string) {
        return this.fetchAPI(`/product-categories/${categoryId}/options`);
    }

    async getCategoryOption(optionId: string) {
        return this.fetchAPI(`/category-options/${optionId}`);
    }

    async getIncompatibilityRules(productId: string) {
        const rules = await this.fetchAPI(`/products/${productId}/incompatibility-rules`);

        // Verify if rules is an array
        if (!rules || !Array.isArray(rules)) {
            console.error(`Unexpected response format for incompatibility rules. Expected array, got: ${typeof rules}`);
            return [];
        }

        // Ensure each rule has an array of options
        return rules.map((rule: any) => ({
            ...rule,
            options: rule.options || []
        }));
    }

    async getIncompatibilityRuleOptions(ruleId: string) {
        return this.fetchAPI(`/incompatibility-rules/${ruleId}/options`);
    }

    async getPricingModifiers(productId: string) {
        console.log(`Getting price modifiers for product ${productId}`);

        // Get all categories for the product
        const categories = await this.getProductCategories(productId);
        if (!categories || !Array.isArray(categories)) {
            console.error(`Failed to fetch categories for product ${productId}`);
            return [];
        }

        // Get all options for each category
        const optionsPromises = categories.map(category =>
            this.getCategoryOptions(category.id)
        );
        const optionsByCategory = await Promise.all(optionsPromises);

        // Flatten options
        const allOptions = optionsByCategory.flat();
        if (!allOptions.length) {
            console.log(`No options found for product ${productId}`);
            return [];
        }

        // For each option, find its price modifiers
        const priceModifiersPromises = allOptions.map(async option => {
            try {
                const modifiers = await this.fetchAPI(`/category-options/${option.id}/price-modifiers`);
                return modifiers || [];
            } catch (error) {
                console.error(`Error fetching price modifiers for option ${option.id}:`, error);
                return [];
            }
        });

        const allModifiers = (await Promise.all(priceModifiersPromises)).flat();

        // Transform data to match GraphQL schema
        return allModifiers.map(modifier => ({
            id: modifier.id,
            baseOptionId: modifier.categoryOptionIdBase,
            triggerOptionId: modifier.categoryOptionIdTrigger,
            overridePrice: modifier.overridePrice,
            // Find complete options
            baseOption: allOptions.find(opt => opt.id === modifier.categoryOptionIdBase) || null,
            triggerOption: allOptions.find(opt => opt.id === modifier.categoryOptionIdTrigger) || null
        })).filter(modifier => modifier.baseOption && modifier.triggerOption);
    }

    async calculatePrice(configuration: { productId: string; selectedOptions: string[] }) {
        return this.fetchAPI('/products/calculate-price', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(configuration)
        });
    }

    async validateConfiguration(configuration: { productId: string; selectedOptions: string[] }) {
        return this.fetchAPI('/products/validate-configuration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(configuration)
        });
    }
} 