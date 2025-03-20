import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Product } from '../entities/Product';
import { ProductCategory } from '../entities/ProductCategory';
import { CategoryOption } from '../entities/CategoryOption';
import { IncompatibilityRule } from '../entities/IncompatibilityRule';

export class ProductRepository {
    private repository: Repository<Product>;
    private categoryRepository: Repository<ProductCategory>;
    private optionRepository: Repository<CategoryOption>;
    private ruleRepository: Repository<IncompatibilityRule>;

    constructor() {
        this.repository = AppDataSource.getRepository(Product);
        this.categoryRepository = AppDataSource.getRepository(ProductCategory);
        this.optionRepository = AppDataSource.getRepository(CategoryOption);
        this.ruleRepository = AppDataSource.getRepository(IncompatibilityRule);
    }

    async findAll(): Promise<Product[]> {
        try {
            return await this.repository.find({
                relations: ['productType']
            });
        } catch (error) {
            console.error('Error fetching all products:', error);
            throw error;
        }
    }

    async findById(id: number): Promise<Product | null> {
        try {
            const product = await this.repository.findOne({
                where: { id },
                relations: ['productType']
            });
            return product;
        } catch (error) {
            console.error(`Error fetching product with id ${id}:`, error);
            throw error;
        }
    }

    async getCategories(productId: number): Promise<ProductCategory[]> {
        try {
            return await this.categoryRepository.find({
                where: { productId },
                order: { sortOrder: 'ASC' }
            });
        } catch (error) {
            console.error(`Error fetching categories for product ${productId}:`, error);
            throw error;
        }
    }

    async getIncompatibilityRules(productId: number): Promise<IncompatibilityRule[]> {
        try {
            return await this.ruleRepository.find({
                where: { productId },
                relations: ['ruleOptions', 'ruleOptions.categoryOption']
            });
        } catch (error) {
            console.error(`Error fetching incompatibility rules for product ${productId}:`, error);
            throw error;
        }
    }

    async calculatePrice(productId: number, selectedOptionIds: number[]): Promise<{
        basePrice: number;
        optionPrices: Array<{ optionId: number; optionName: string; price: number }>;
        totalPrice: number;
    }> {
        try {
            // Get the product for base price
            const product = await this.findById(productId);
            if (!product) {
                throw new Error(`Product with id ${productId} not found`);
            }

            let basePrice = Number(product.basePrice);
            let optionPrices: Array<{ optionId: number; optionName: string; price: number }> = [];
            let totalPrice = basePrice;

            // Get all selected options
            const selectedOptions = await this.optionRepository
                .createQueryBuilder('option')
                .leftJoinAndSelect('option.productCategory', 'category')
                .where('option.id IN (:...ids)', { ids: selectedOptionIds })
                .getMany();

            // First, calculate base option prices
            for (const option of selectedOptions) {
                let optionPrice = Number(option.price);
                optionPrices.push({
                    optionId: option.id,
                    optionName: option.name,
                    price: optionPrice
                });
                totalPrice += optionPrice;
            }

            // Then check for price modifiers (we'll implement this later)
            // This would adjust prices based on combinations of options

            return {
                basePrice,
                optionPrices,
                totalPrice
            };
        } catch (error) {
            console.error(`Error calculating price for product ${productId}:`, error);
            throw error;
        }
    }

    async validateConfiguration(productId: number, selectedOptionIds: number[]): Promise<{
        isValid: boolean;
        incompatibilities: Array<{
            ruleName: string;
            ruleDescription: string | null;
            conflictingOptions: CategoryOption[];
        }>;
        missingRequiredCategories: string[];
        unavailableOptions: number[];
    }> {
        try {
            // Default response structure
            const response = {
                isValid: true,
                incompatibilities: [] as Array<{
                    ruleName: string;
                    ruleDescription: string | null;
                    conflictingOptions: CategoryOption[];
                }>,
                missingRequiredCategories: [] as string[],
                unavailableOptions: [] as number[]
            };

            // Get all categories for the product, including required ones
            const categories = await this.getCategories(productId);

            // Get all incompatibility rules for this product
            const incompatibilityRules = await this.getIncompatibilityRules(productId);

            // Get selected options with their categories
            const selectedOptions = await this.optionRepository
                .createQueryBuilder('option')
                .leftJoinAndSelect('option.productCategory', 'category')
                .where('option.id IN (:...ids)', { ids: selectedOptionIds })
                .getMany();

            // Check for unavailable options
            const unavailableOptions = selectedOptions.filter(option => !option.isAvailable);
            if (unavailableOptions.length > 0) {
                response.isValid = false;
                response.unavailableOptions = unavailableOptions.map(option => option.id);
            }

            // Check for missing required categories
            const requiredCategories = categories.filter(cat => cat.isRequired);
            const selectedCategoryIds = new Set(selectedOptions.map(opt => opt.productCategory.id));

            for (const requiredCategory of requiredCategories) {
                if (!selectedCategoryIds.has(requiredCategory.id)) {
                    response.isValid = false;
                    response.missingRequiredCategories.push(requiredCategory.name);
                }
            }

            // Check for incompatibility rule violations
            for (const rule of incompatibilityRules) {
                const ruleOptionIds = rule.ruleOptions.map(ro => ro.categoryOption.id);
                // If all options in a rule are selected, it's a violation
                if (ruleOptionIds.every(id => selectedOptionIds.includes(id))) {
                    response.isValid = false;
                    response.incompatibilities.push({
                        ruleName: rule.ruleName,
                        ruleDescription: rule.ruleDescription,
                        conflictingOptions: rule.ruleOptions.map(ro => ro.categoryOption)
                    });
                }
            }

            return response;
        } catch (error) {
            console.error(`Error validating configuration for product ${productId}:`, error);
            throw error;
        }
    }
} 