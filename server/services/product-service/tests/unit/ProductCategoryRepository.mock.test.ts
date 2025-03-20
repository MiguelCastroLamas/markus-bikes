import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { ProductCategoryRepository } from '../../src/repositories/ProductCategoryRepository';
import { ProductCategory } from '../../src/entities/ProductCategory';

describe('ProductCategoryRepository with Mocks', () => {
    let repository: ProductCategoryRepository;
    let mockTypeORMRepository: any;

    beforeEach(() => {
        mockTypeORMRepository = {
            find: jest.fn(),
            findOne: jest.fn()
        };

        repository = new ProductCategoryRepository();

        // Replace the internal repository with our mock
        Object.defineProperty(repository, 'repository', {
            value: mockTypeORMRepository,
            writable: true
        });
    });

    test('findByProductId should return categories for Mountain Bike Pro', async () => {
        const categories = [
            {
                id: 1,
                name: 'Frame Type',
                productId: 1,
                isRequired: true,
                sortOrder: 1
            },
            {
                id: 2,
                name: 'Frame Finish',
                productId: 1,
                isRequired: true,
                sortOrder: 2
            },
            {
                id: 3,
                name: 'Wheels',
                productId: 1,
                isRequired: true,
                sortOrder: 3
            },
            {
                id: 4,
                name: 'Rim Color',
                productId: 1,
                isRequired: true,
                sortOrder: 4
            },
            {
                id: 5,
                name: 'Chain',
                productId: 1,
                isRequired: true,
                sortOrder: 5
            }
        ];

        // Configure mock to return sample data
        mockTypeORMRepository.find.mockResolvedValue(categories);

        const result = await repository.findByProductId(1);
        expect(mockTypeORMRepository.find).toHaveBeenCalledWith({
            where: { productId: 1 },
            order: { sortOrder: 'ASC' }
        });
        expect(result).toEqual(categories);
        expect(result.length).toBe(5);
    });

    test('findByProductId should return categories for Beginner Surfboard', async () => {
        const categories = [
            {
                id: 16,
                name: 'Board Size',
                productId: 4,
                isRequired: true,
                sortOrder: 1
            },
            {
                id: 17,
                name: 'Fin Setup',
                productId: 4,
                isRequired: true,
                sortOrder: 2
            },
            {
                id: 18,
                name: 'Leash',
                productId: 4,
                isRequired: false,
                sortOrder: 3
            },
            {
                id: 19,
                name: 'Deck Grip',
                productId: 4,
                isRequired: false,
                sortOrder: 4
            }
        ];

        // Configure mock to return sample data
        mockTypeORMRepository.find.mockResolvedValue(categories);

        const result = await repository.findByProductId(4);
        expect(mockTypeORMRepository.find).toHaveBeenCalledWith({
            where: { productId: 4 },
            order: { sortOrder: 'ASC' }
        });
        expect(result).toEqual(categories);
        expect(result.length).toBe(4);
    });

    test('findByProductId should return empty array when no categories exist', async () => {
        // Configure mock to return empty array
        mockTypeORMRepository.find.mockResolvedValue([]);

        const result = await repository.findByProductId(999);
        expect(mockTypeORMRepository.find).toHaveBeenCalledWith({
            where: { productId: 999 },
            order: { sortOrder: 'ASC' }
        });
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
    });
}); 