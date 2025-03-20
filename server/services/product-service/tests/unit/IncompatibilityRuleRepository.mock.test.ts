import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { IncompatibilityRuleRepository } from '../../src/repositories/IncompatibilityRuleRepository';
import { IncompatibilityRule } from '../../src/entities/IncompatibilityRule';
import { IncompatibilityRuleOption } from '../../src/entities/IncompatibilityRuleOption';

describe('IncompatibilityRuleRepository with Mocks', () => {
    let repository: IncompatibilityRuleRepository;
    let mockTypeORMRepository: any;
    let mockRuleOptionRepository: any;

    beforeEach(() => {
        mockTypeORMRepository = {
            find: jest.fn(),
            findOne: jest.fn()
        };

        mockRuleOptionRepository = {
            find: jest.fn(),
            findOne: jest.fn()
        };

        repository = new IncompatibilityRuleRepository();

        // Replace the internal repositories with our mocks
        Object.defineProperty(repository, 'repository', {
            value: mockTypeORMRepository,
            writable: true
        });

        Object.defineProperty(repository, 'ruleOptionRepository', {
            value: mockRuleOptionRepository,
            writable: true
        });
    });

    test('findAll should return all incompatibility rules', async () => {
        const rules = [
            {
                id: 1,
                productId: 1,
                ruleName: 'FatBikeRedRimConflict',
                ruleDescription: 'Fat bike wheels are not available with red rim color',
                ruleOptions: []
            },
            {
                id: 2,
                productId: 1,
                ruleName: 'ShinyFinishSingleChainConflict',
                ruleDescription: 'Shiny finish is incompatible with single-speed chain',
                ruleOptions: []
            },
            {
                id: 3,
                productId: 2,
                ruleName: 'FatBikeRedRimConflict',
                ruleDescription: 'Fat bike wheels are not available with red rim color',
                ruleOptions: []
            },
            {
                id: 4,
                productId: 2,
                ruleName: 'ShinyFinishSingleChainConflict',
                ruleDescription: 'Shiny finish is incompatible with single-speed chain',
                ruleOptions: []
            },
            {
                id: 5,
                productId: 4,
                ruleName: 'SmallBoardThreeFinConflict',
                ruleDescription: '6ft board is not compatible with Three Fin setup',
                ruleOptions: []
            }
        ];

        // Configure mock to return sample data
        mockTypeORMRepository.find.mockResolvedValue(rules);

        const result = await repository.findAll();
        expect(mockTypeORMRepository.find).toHaveBeenCalledWith({
            relations: ['ruleOptions', 'ruleOptions.categoryOption']
        });
        expect(result).toEqual(rules);
        expect(result.length).toBe(5);
    });

    test('findById should return a specific incompatibility rule', async () => {
        const rule = {
            id: 1,
            productId: 1,
            ruleName: 'FatBikeRedRimConflict',
            ruleDescription: 'Fat bike wheels are not available with red rim color',
            ruleOptions: []
        };

        // Configure mock to return sample data
        mockTypeORMRepository.findOne.mockResolvedValue(rule);

        const result = await repository.findById(1);
        expect(mockTypeORMRepository.findOne).toHaveBeenCalledWith({
            where: { id: 1 },
            relations: ['ruleOptions', 'ruleOptions.categoryOption']
        });
        expect(result).toEqual(rule);
    });

    test('findById should return null for non-existent ID', async () => {
        // Configure mock to return null
        mockTypeORMRepository.findOne.mockResolvedValue(null);

        const result = await repository.findById(999);
        expect(mockTypeORMRepository.findOne).toHaveBeenCalledWith({
            where: { id: 999 },
            relations: ['ruleOptions', 'ruleOptions.categoryOption']
        });
        expect(result).toBeNull();
    });

    test('findByProductId should return incompatibility rules for Mountain Bike Pro', async () => {
        const rules = [
            {
                id: 1,
                productId: 1,
                ruleName: 'FatBikeRedRimConflict',
                ruleDescription: 'Fat bike wheels are not available with red rim color',
                ruleOptions: []
            },
            {
                id: 2,
                productId: 1,
                ruleName: 'ShinyFinishSingleChainConflict',
                ruleDescription: 'Shiny finish is incompatible with single-speed chain',
                ruleOptions: []
            }
        ];

        // Configure mock to return sample data
        mockTypeORMRepository.find.mockResolvedValue(rules);

        const result = await repository.findByProductId(1);
        expect(mockTypeORMRepository.find).toHaveBeenCalledWith({
            where: { productId: 1 },
            relations: ['ruleOptions', 'ruleOptions.categoryOption']
        });
        expect(result).toEqual(rules);
        expect(result.length).toBe(2);
    });

    test('findByProductId should return incompatibility rules for Beginner Surfboard', async () => {
        const rules = [
            {
                id: 5,
                productId: 4,
                ruleName: 'SmallBoardThreeFinConflict',
                ruleDescription: '6ft board is not compatible with Three Fin setup',
                ruleOptions: []
            }
        ];

        // Configure mock to return sample data
        mockTypeORMRepository.find.mockResolvedValue(rules);

        const result = await repository.findByProductId(4);
        expect(mockTypeORMRepository.find).toHaveBeenCalledWith({
            where: { productId: 4 },
            relations: ['ruleOptions', 'ruleOptions.categoryOption']
        });
        expect(result).toEqual(rules);
        expect(result.length).toBe(1);
    });

    test('getRuleOptions should return options for Fat Bike Red Rim Conflict rule', async () => {
        const ruleOptions = [
            {
                id: 1,
                incompatibilityRuleId: 1,
                categoryOptionId: 8,
                categoryOption: { id: 8, name: 'Fat bike wheels' }
            },
            {
                id: 2,
                incompatibilityRuleId: 1,
                categoryOptionId: 9,
                categoryOption: { id: 9, name: 'Red' }
            }
        ];

        // Configure mock to return sample data
        mockRuleOptionRepository.find.mockResolvedValue(ruleOptions);

        const result = await repository.getRuleOptions(1);
        expect(mockRuleOptionRepository.find).toHaveBeenCalledWith({
            where: { incompatibilityRuleId: 1 },
            relations: ['categoryOption']
        });
        expect(result).toEqual(ruleOptions);
        expect(result.length).toBe(2);
    });

    test('getRuleOptions should return options for Small Board Three Fin Conflict rule', async () => {
        const ruleOptions = [
            {
                id: 9,
                incompatibilityRuleId: 5,
                categoryOptionId: 40,
                categoryOption: { id: 40, name: '6ft' }
            },
            {
                id: 10,
                incompatibilityRuleId: 5,
                categoryOptionId: 44,
                categoryOption: { id: 44, name: 'Three Fin' }
            }
        ];

        // Configure mock to return sample data
        mockRuleOptionRepository.find.mockResolvedValue(ruleOptions);

        const result = await repository.getRuleOptions(5);
        expect(mockRuleOptionRepository.find).toHaveBeenCalledWith({
            where: { incompatibilityRuleId: 5 },
            relations: ['categoryOption']
        });
        expect(result).toEqual(ruleOptions);
        expect(result.length).toBe(2);
    });
}); 