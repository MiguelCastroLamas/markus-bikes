export const typeDefs = `#graphql
  # Root types
  type Query {
    productTypes: [ProductType!]!
    products: [Product!]!
    product(id: ID!): Product
    productCategories(productId: ID!): [ProductCategory!]!
    categoryOptions(productCategoryId: ID!): [CategoryOption!]!
    incompatibilityRules(productId: ID!): [IncompatibilityRule!]!
    pricingModifiers(productId: ID!): [PriceModifier!]!
  }

  # Product types
  type ProductType {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
  }

  # Products
  type Product {
    id: ID!
    productTypeId: ID
    name: String!
    description: String
    basePrice: Float!
    createdAt: String!
    updatedAt: String!
    productType: ProductType
    categories: [ProductCategory!]!
  }

  # Product categories
  type ProductCategory {
    id: ID!
    productId: ID!
    name: String!
    isRequired: Boolean!
    sortOrder: Int!
    createdAt: String!
    updatedAt: String!
    options: [CategoryOption!]!
  }

  # Category options
  type CategoryOption {
    id: ID!
    productCategoryId: ID!
    name: String!
    price: Float!
    stockQuantity: Int!
    isAvailable: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  # Incompatibility rules
  type IncompatibilityRule {
    id: ID!
    productId: ID!
    ruleName: String!
    ruleDescription: String
    createdAt: String!
    updatedAt: String!
    options: [CategoryOption!]!
  }

  # Price modifiers
  type PriceModifier {
    id: ID!
    baseOptionId: ID!
    triggerOptionId: ID!
    overridePrice: Float!
    baseOption: CategoryOption!
    triggerOption: CategoryOption!
  }

  # Price calculation for product configuration
  type PriceResult {
    basePrice: Float!
    optionPrices: [OptionPrice!]!
    totalPrice: Float!
  }

  type OptionPrice {
    optionId: ID!
    optionName: String!
    price: Float!
  }

  # Input types for product configuration
  input ProductConfigurationInput {
    productId: ID!
    selectedOptions: [ID!]!
  }

  # Extend Query for product configuration
  extend type Query {
    calculatePrice(configuration: ProductConfigurationInput!): PriceResult!
    validateConfiguration(configuration: ProductConfigurationInput!): ConfigurationValidationResult!
  }

  type ConfigurationValidationResult {
    isValid: Boolean!
    incompatibilities: [IncompatibilityInfo!]!
    missingRequiredCategories: [String!]!
    unavailableOptions: [ID!]!
  }

  type IncompatibilityInfo {
    ruleName: String!
    ruleDescription: String
    conflictingOptions: [CategoryOption!]!
  }
`; 