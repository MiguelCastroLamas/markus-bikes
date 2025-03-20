export const resolvers = {
    Query: {
        productTypes: async (_: any, __: any, { dataSources }: any) => {
            return dataSources.productAPI.getProductTypes();
        },
        products: async (_: any, __: any, { dataSources }: any) => {
            return dataSources.productAPI.getProducts();
        },
        product: async (_: any, { id }: { id: string }, { dataSources }: any) => {
            return dataSources.productAPI.getProductById(id);
        },
        productCategories: async (_: any, { productId }: { productId: string }, { dataSources }: any) => {
            return dataSources.productAPI.getProductCategories(productId);
        },
        categoryOptions: async (_: any, { productCategoryId }: { productCategoryId: string }, { dataSources }: any) => {
            return dataSources.productAPI.getCategoryOptions(productCategoryId);
        },
        incompatibilityRules: async (_: any, { productId }: { productId: string }, { dataSources }: any) => {
            return dataSources.productAPI.getIncompatibilityRules(productId);
        },
        pricingModifiers: async (_: any, { productId }: { productId: string }, { dataSources }: any) => {
            return dataSources.productAPI.getPricingModifiers(productId);
        },
        calculatePrice: async (_: any, { configuration }: any, { dataSources }: any) => {
            return dataSources.productAPI.calculatePrice(configuration);
        },
        validateConfiguration: async (_: any, { configuration }: any, { dataSources }: any) => {
            return dataSources.productAPI.validateConfiguration(configuration);
        },
    },
    Product: {
        productType: async (parent: any, _: any, { dataSources }: any) => {
            if (!parent.productTypeId) return null;
            return dataSources.productAPI.getProductTypeById(parent.productTypeId);
        },
        categories: async (parent: any, _: any, { dataSources }: any) => {
            return dataSources.productAPI.getProductCategories(parent.id);
        },
    },
    ProductCategory: {
        options: async (parent: any, _: any, { dataSources }: any) => {
            return dataSources.productAPI.getCategoryOptions(parent.id);
        },
    },
    IncompatibilityRule: {
        options: async (parent: any, _: any, { dataSources }: any) => {
            try {
                // If we already have options in the parent object, use those directly
                if (parent.options && Array.isArray(parent.options)) {
                    return parent.options;
                }

                // If we have ruleOptions in the parent, transform that to options
                if (parent.ruleOptions && Array.isArray(parent.ruleOptions)) {
                    return parent.ruleOptions.map((option: any) => option.categoryOption);
                }

                // As a last resort, make the specific request
                return dataSources.productAPI.getIncompatibilityRuleOptions(parent.id);
            } catch (error) {
                console.error(`Error in resolver for IncompatibilityRule.options:`, error);
                return [];
            }
        },
    },
    PriceModifier: {
        baseOption: async (parent: any, _: any, { dataSources }: any) => {
            // If we already have the base option in the parent, use it
            if (parent.baseOption) return parent.baseOption;

            // Otherwise, get the option
            try {
                return await dataSources.productAPI.getCategoryOption(parent.baseOptionId);
            } catch (error) {
                console.error(`Error in resolver for PriceModifier.baseOption:`, error);
                return null;
            }
        },
        triggerOption: async (parent: any, _: any, { dataSources }: any) => {
            // If we already have the trigger option in the parent, use it
            if (parent.triggerOption) return parent.triggerOption;

            // Otherwise, get the option
            try {
                return await dataSources.productAPI.getCategoryOption(parent.triggerOptionId);
            } catch (error) {
                console.error(`Error in resolver for PriceModifier.triggerOption:`, error);
                return null;
            }
        },
    },
}; 