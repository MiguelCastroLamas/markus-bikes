import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { CategoryOption } from '../entities/CategoryOption';
import { CategoryPriceModifier } from '../entities/CategoryPriceModifier';

export class CategoryOptionRepository {
    private repository: Repository<CategoryOption>;
    private priceModifierRepository: Repository<CategoryPriceModifier>;

    constructor() {
        this.repository = AppDataSource.getRepository(CategoryOption);
        this.priceModifierRepository = AppDataSource.getRepository(CategoryPriceModifier);
    }

    async findAll(): Promise<CategoryOption[]> {
        try {
            return await this.repository.find();
        } catch (error) {
            console.error('Error fetching all category options:', error);
            throw error;
        }
    }

    async findById(id: number): Promise<CategoryOption | null> {
        try {
            return await this.repository.findOne({
                where: { id },
                relations: ['productCategory']
            });
        } catch (error) {
            console.error(`Error fetching category option with id ${id}:`, error);
            throw error;
        }
    }

    async findByCategoryId(categoryId: number): Promise<CategoryOption[]> {
        try {
            return await this.repository.find({
                where: { productCategoryId: categoryId }
            });
        } catch (error) {
            console.error(`Error fetching options for category ${categoryId}:`, error);
            throw error;
        }
    }

    async getPriceModifiers(optionId: number): Promise<CategoryPriceModifier[]> {
        try {
            return await this.priceModifierRepository.find({
                where: [
                    { categoryOptionIdBase: optionId },
                    { categoryOptionIdTrigger: optionId }
                ],
                relations: ['baseOption', 'triggerOption']
            });
        } catch (error) {
            console.error(`Error fetching price modifiers for option ${optionId}:`, error);
            throw error;
        }
    }

    async getPriceModifier(baseOptionId: number, triggerOptionId: number): Promise<CategoryPriceModifier | null> {
        try {
            return await this.priceModifierRepository.findOne({
                where: {
                    categoryOptionIdBase: baseOptionId,
                    categoryOptionIdTrigger: triggerOptionId
                }
            });
        } catch (error) {
            console.error(`Error fetching price modifier for options ${baseOptionId} and ${triggerOptionId}:`, error);
            throw error;
        }
    }
} 