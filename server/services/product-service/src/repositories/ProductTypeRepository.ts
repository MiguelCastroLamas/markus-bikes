import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { ProductType } from '../entities/ProductType';

export class ProductTypeRepository {
    private repository: Repository<ProductType>;

    constructor() {
        this.repository = AppDataSource.getRepository(ProductType);
    }

    async findAll(): Promise<ProductType[]> {
        try {
            return await this.repository.find();
        } catch (error) {
            console.error('Error fetching all product types:', error);
            throw error;
        }
    }

    async findById(id: number): Promise<ProductType | null> {
        try {
            return await this.repository.findOne({
                where: { id }
            });
        } catch (error) {
            console.error(`Error fetching product type with id ${id}:`, error);
            throw error;
        }
    }
} 