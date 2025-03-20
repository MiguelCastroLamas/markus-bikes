import { gql } from '@apollo/client';

export const GET_PRODUCT_TYPES = gql`
  query GetProductTypes {
    productTypes {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      basePrice
      productTypeId
      productType {
        id
        name
      }
      categories {
        id
        name
        isRequired
        sortOrder
        options {
          id
          name
          price
          isAvailable
          stockQuantity
        }
      }
    }
  }
`;

export const GET_PRODUCT_DETAILS = gql`
  query GetProductDetails($id: ID!) {
    product(id: $id) {
      id
      name
      description
      basePrice
      productTypeId
      categories {
        id
        name
        isRequired
        sortOrder
        options {
          id
          name
          price
          stockQuantity
          isAvailable
        }
      }
    }
  }
`;

export const GET_PRODUCT_CATEGORIES = gql`
  query GetProductCategories($productTypeId: Int!) {
    productCategories(productTypeId: $productTypeId) {
      id
      name
      options {
        id
        name
      }
    }
  }
`;

export const GET_INCOMPATIBILITY_RULES = gql`
  query GetIncompatibilityRules($productId: ID!) {
    incompatibilityRules(productId: $productId) {
      id
      ruleName
      ruleDescription
      options {
        id
        name
        productCategoryId
      }
    }
  }
`;

export const GET_PRICE_MODIFIERS = gql`
  query GetPriceModifiers($productId: ID!) {
    pricingModifiers(productId: $productId) {
      id
      baseOptionId
      triggerOptionId
      overridePrice
      baseOption {
        id
        name
        productCategoryId
      }
      triggerOption {
        id
        name
        productCategoryId
      }
    }
  }
`; 