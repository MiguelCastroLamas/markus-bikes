import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { ProductRepository } from '../../src/repositories/ProductRepository';
import { Product } from '../../src/entities/Product';

describe('ProductRepository with Mocks', () => {
    let repository: ProductRepository;
    let mockTypeORMRepository: any;

    beforeEach(() => {
        mockTypeORMRepository = {
            find: jest.fn(),
            findOne: jest.fn()
        };

        repository = new ProductRepository();

        // Replace the internal repository with our mock
        Object.defineProperty(repository, 'repository', {
            value: mockTypeORMRepository,
            writable: true
        });
    });

    test('findAll should return all products', async () => {
        const products = [
            {
                id: 1,
                name: 'Mountain Bike Pro',
                basePrice: 299.99,
                description: 'Fully customizable mountain bike with various options.',
                productTypeId: 1
            },
            {
                id: 2,
                name: 'Road Bike Elite',
                basePrice: 399.99,
                description: 'Lightweight road bike for enthusiasts.',
                productTypeId: 1
            },
            {
                id: 3,
                name: 'Kids Bike',
                basePrice: 149.99,
                description: 'Simple bike for children.',
                productTypeId: 1
            },
            {
                id: 4,
                name: 'Beginner Surfboard',
                basePrice: 249.99,
                description: 'Perfect surfboard for beginners.',
                productTypeId: 2
            },
            {
                id: 5,
                name: 'Pro Alpine Skis',
                basePrice: 499.99,
                description: 'Professional skiing equipment.',
                productTypeId: 3
            }
        ];

        // Configure mock to return sample data
        mockTypeORMRepository.find.mockResolvedValue(products);

        const result = await repository.findAll();
        expect(mockTypeORMRepository.find).toHaveBeenCalled();
        expect(result).toEqual(products);
        expect(result.length).toBe(5);
    });

    test('findById should return a specific product', async () => {
        const product = {
            id: 1,
            name: 'Mountain Bike Pro',
            basePrice: 299.99,
            description: 'Fully customizable mountain bike with various options.',
            productTypeId: 1
        };

        // Configure mock to return sample data
        mockTypeORMRepository.findOne.mockResolvedValue(product);

        const result = await repository.findById(1);
        expect(mockTypeORMRepository.findOne).toHaveBeenCalledWith({
            where: { id: 1 },
            relations: ['productType']
        });
        expect(result).toEqual(product);
    });

    test('findById should return null for non-existent ID', async () => {
        // Configure mock to return null
        mockTypeORMRepository.findOne.mockResolvedValue(null);

        const result = await repository.findById(999);
        expect(mockTypeORMRepository.findOne).toHaveBeenCalledWith({
            where: { id: 999 },
            relations: ['productType']
        });
        expect(result).toBeNull();
    });
}); 