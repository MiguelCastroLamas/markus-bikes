import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { CategoryOptionRepository } from '../../src/repositories/CategoryOptionRepository';

describe('CategoryOptionRepository with Mocks', () => {
    let repository: CategoryOptionRepository;
    let mockTypeORMRepository: any;
    let mockPriceModifierRepository: any;

    beforeEach(() => {
        mockTypeORMRepository = {
            find: jest.fn(),
            findOne: jest.fn()
        };

        mockPriceModifierRepository = {
            find: jest.fn(),
            findOne: jest.fn()
        };

        repository = new CategoryOptionRepository();

        // Replace the internal repositories with our mocks
        Object.defineProperty(repository, 'repository', {
            value: mockTypeORMRepository,
            writable: true
        });

        Object.defineProperty(repository, 'priceModifierRepository', {
            value: mockPriceModifierRepository,
            writable: true
        });
    });

    test('findAll should return all category options', async () => {
        const options = [
            {
                id: 1,
                name: 'Full-suspension',
                productCategoryId: 1,
                price: 130.00,
                stockQuantity: 10,
                isAvailable: true
            },
            {
                id: 2,
                name: 'Diamond',
                productCategoryId: 1,
                price: 100.00,
                stockQuantity: 15,
                isAvailable: true
            },
            {
                id: 3,
                name: 'Step-through',
                productCategoryId: 1,
                price: 90.00,
                stockQuantity: 12,
                isAvailable: true
            },
            {
                id: 40,
                name: '6ft',
                productCategoryId: 16,
                price: 0.00,
                stockQuantity: 10,
                isAvailable: true
            },
            {
                id: 51,
                name: '190cm',
                productCategoryId: 20,
                price: 100.00,
                stockQuantity: 0,
                isAvailable: false
            }
        ];

        // Configure mock to return sample data
        mockTypeORMRepository.find.mockResolvedValue(options);

        const result = await repository.findAll();
        expect(mockTypeORMRepository.find).toHaveBeenCalled();
        expect(result).toEqual(options);
        expect(result.length).toBe(5);
    });

    test('findById should return a specific category option', async () => {
        const option = {
            id: 4,
            name: 'Matte finish',
            productCategoryId: 2,
            price: 35.00,
            stockQuantity: 20,
            isAvailable: true,
            productCategory: { id: 2, name: 'Frame Finish' }
        };

        // Configure mock to return sample data
        mockTypeORMRepository.findOne.mockResolvedValue(option);

        const result = await repository.findById(4);
        expect(mockTypeORMRepository.findOne).toHaveBeenCalledWith({
            where: { id: 4 },
            relations: ['productCategory']
        });
        expect(result).toEqual(option);
    });

    test('findById should return null for non-existent ID', async () => {
        // Configure mock to return null
        mockTypeORMRepository.findOne.mockResolvedValue(null);

        const result = await repository.findById(999);
        expect(mockTypeORMRepository.findOne).toHaveBeenCalledWith({
            where: { id: 999 },
            relations: ['productCategory']
        });
        expect(result).toBeNull();
    });

    test('findByCategoryId should return options for Frame Type category', async () => {
        const options = [
            {
                id: 1,
                name: 'Full-suspension',
                productCategoryId: 1,
                price: 130.00,
                stockQuantity: 10,
                isAvailable: true
            },
            {
                id: 2,
                name: 'Diamond',
                productCategoryId: 1,
                price: 100.00,
                stockQuantity: 15,
                isAvailable: true
            },
            {
                id: 3,
                name: 'Step-through',
                productCategoryId: 1,
                price: 90.00,
                stockQuantity: 12,
                isAvailable: true
            }
        ];

        // Configure mock to return sample data
        mockTypeORMRepository.find.mockResolvedValue(options);

        const result = await repository.findByCategoryId(1);
        expect(mockTypeORMRepository.find).toHaveBeenCalledWith({
            where: { productCategoryId: 1 }
        });
        expect(result).toEqual(options);
        expect(result.length).toBe(3);
    });

    test('findByCategoryId should return options for Board Size category', async () => {
        const options = [
            {
                id: 40,
                name: '6ft',
                productCategoryId: 16,
                price: 0.00,
                stockQuantity: 10,
                isAvailable: true
            },
            {
                id: 41,
                name: '7ft',
                productCategoryId: 16,
                price: 50.00,
                stockQuantity: 12,
                isAvailable: true
            },
            {
                id: 42,
                name: '8ft',
                productCategoryId: 16,
                price: 100.00,
                stockQuantity: 8,
                isAvailable: true
            }
        ];

        // Configure mock to return sample data
        mockTypeORMRepository.find.mockResolvedValue(options);

        const result = await repository.findByCategoryId(16);
        expect(mockTypeORMRepository.find).toHaveBeenCalledWith({
            where: { productCategoryId: 16 }
        });
        expect(result).toEqual(options);
        expect(result.length).toBe(3);
    });

    test('getPriceModifiers should return price modifiers for an option', async () => {
        const priceModifiers = [
            {
                id: 1,
                categoryOptionIdBase: 4,
                categoryOptionIdTrigger: 1,
                overridePrice: 20.00,
                baseOption: { id: 4, name: 'Matte finish' },
                triggerOption: { id: 1, name: 'Full-suspension' }
            },
            {
                id: 2,
                categoryOptionIdBase: 11,
                categoryOptionIdTrigger: 8,
                overridePrice: 35.00,
                baseOption: { id: 11, name: 'Blue' },
                triggerOption: { id: 8, name: 'Fat bike wheels' }
            }
        ];

        // Configure mock to return sample data
        mockPriceModifierRepository.find.mockResolvedValue(priceModifiers);

        const result = await repository.getPriceModifiers(4);
        expect(mockPriceModifierRepository.find).toHaveBeenCalledWith({
            where: [
                { categoryOptionIdBase: 4 },
                { categoryOptionIdTrigger: 4 }
            ],
            relations: ['baseOption', 'triggerOption']
        });
        expect(result).toEqual(priceModifiers);
        expect(result.length).toBe(2);
    });

    test('getPriceModifier should return a specific price modifier', async () => {
        const priceModifier = {
            id: 1,
            categoryOptionIdBase: 4,
            categoryOptionIdTrigger: 1,
            overridePrice: 20.00
        };

        // Configure mock to return sample data
        mockPriceModifierRepository.findOne.mockResolvedValue(priceModifier);

        const result = await repository.getPriceModifier(4, 1);
        expect(mockPriceModifierRepository.findOne).toHaveBeenCalledWith({
            where: {
                categoryOptionIdBase: 4,
                categoryOptionIdTrigger: 1
            }
        });
        expect(result).toEqual(priceModifier);
    });

    test('getPriceModifier should return null for non-existent combination', async () => {
        // Configure mock to return null
        mockPriceModifierRepository.findOne.mockResolvedValue(null);

        const result = await repository.getPriceModifier(999, 888);
        expect(mockPriceModifierRepository.findOne).toHaveBeenCalledWith({
            where: {
                categoryOptionIdBase: 999,
                categoryOptionIdTrigger: 888
            }
        });
        expect(result).toBeNull();
    });
}); 