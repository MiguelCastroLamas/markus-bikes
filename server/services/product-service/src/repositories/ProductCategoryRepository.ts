import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { ProductCategory } from '../entities/ProductCategory';
import { CategoryOption } from '../entities/CategoryOption';

export class ProductCategoryRepository {
    private repository: Repository<ProductCategory>;
    private optionRepository: Repository<CategoryOption>;

    constructor() {
        this.repository = AppDataSource.getRepository(ProductCategory);
        this.optionRepository = AppDataSource.getRepository(CategoryOption);
    }

    async findAll(): Promise<ProductCategory[]> {
        try {
            return await this.repository.find({
                order: { sortOrder: 'ASC' }
            });
        } catch (error) {
            console.error('Error fetching all product categories:', error);
            throw error;
        }
    }

    async findById(id: number): Promise<ProductCategory | null> {
        try {
            const category = await this.repository.findOne({
                where: { id },
                relations: ['product']
            });
            return category;
        } catch (error) {
            console.error(`Error fetching product category with id ${id}:`, error);
            throw error;
        }
    }

    async findByProductId(productId: number): Promise<ProductCategory[]> {
        try {
            return await this.repository.find({
                where: { productId },
                order: { sortOrder: 'ASC' }
            });
        } catch (error) {
            console.error(`Error fetching categories for product ${productId}:`, error);
            throw error;
        }
    }

    async getOptions(categoryId: number): Promise<CategoryOption[]> {
        try {
            return await this.optionRepository.find({
                where: { productCategoryId: categoryId }
            });
        } catch (error) {
            console.error(`Error fetching options for category ${categoryId}:`, error);
            throw error;
        }
    }
} 