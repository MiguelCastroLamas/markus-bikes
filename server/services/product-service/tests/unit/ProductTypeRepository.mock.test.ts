import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { ProductTypeRepository } from '../../src/repositories/ProductTypeRepository';
import { ProductType } from '../../src/entities/ProductType';

describe('ProductTypeRepository with Mocks', () => {
    let repository: ProductTypeRepository;
    let mockTypeORMRepository: any;

    beforeEach(() => {
        mockTypeORMRepository = {
            find: jest.fn(),
            findOne: jest.fn()
        };

        repository = new ProductTypeRepository();

        // Replace the internal repository with our mock
        Object.defineProperty(repository, 'repository', {
            value: mockTypeORMRepository,
            writable: true
        });
    });

    test('findAll should return all product types', async () => {
        const productTypes = [
            { id: 1, name: 'Bicycle' },
            { id: 2, name: 'Surfboard' },
            { id: 3, name: 'Skis' }
        ];

        // Configure mock to return sample data
        mockTypeORMRepository.find.mockResolvedValue(productTypes);

        const result = await repository.findAll();
        expect(mockTypeORMRepository.find).toHaveBeenCalled();
        expect(result).toEqual(productTypes);
        expect(result.length).toBe(3);
    });

    test('findById should return a specific product type', async () => {
        const productType = { id: 1, name: 'Bicycle' };

        // Configure mock to return sample data
        mockTypeORMRepository.findOne.mockResolvedValue(productType);

        const result = await repository.findById(1);
        expect(mockTypeORMRepository.findOne).toHaveBeenCalledWith({
            where: { id: 1 }
        });
        expect(result).toEqual(productType);
    });

    test('findById should return null for non-existent ID', async () => {
        // Configure mock to return null
        mockTypeORMRepository.findOne.mockResolvedValue(null);

        const result = await repository.findById(999);
        expect(mockTypeORMRepository.findOne).toHaveBeenCalledWith({
            where: { id: 999 }
        });
        expect(result).toBeNull();
    });
}); 