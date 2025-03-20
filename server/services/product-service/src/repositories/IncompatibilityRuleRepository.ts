import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { IncompatibilityRule } from '../entities/IncompatibilityRule';
import { IncompatibilityRuleOption } from '../entities/IncompatibilityRuleOption';

export class IncompatibilityRuleRepository {
    private repository: Repository<IncompatibilityRule>;
    private ruleOptionRepository: Repository<IncompatibilityRuleOption>;

    constructor() {
        this.repository = AppDataSource.getRepository(IncompatibilityRule);
        this.ruleOptionRepository = AppDataSource.getRepository(IncompatibilityRuleOption);
    }

    async findAll(): Promise<IncompatibilityRule[]> {
        try {
            return await this.repository.find({
                relations: ['ruleOptions', 'ruleOptions.categoryOption']
            });
        } catch (error) {
            console.error('Error fetching all incompatibility rules:', error);
            throw error;
        }
    }

    async findById(id: number): Promise<IncompatibilityRule | null> {
        try {
            return await this.repository.findOne({
                where: { id },
                relations: ['ruleOptions', 'ruleOptions.categoryOption']
            });
        } catch (error) {
            console.error(`Error fetching incompatibility rule with id ${id}:`, error);
            throw error;
        }
    }

    async findByProductId(productId: number): Promise<IncompatibilityRule[]> {
        try {
            return await this.repository.find({
                where: { productId },
                relations: ['ruleOptions', 'ruleOptions.categoryOption']
            });
        } catch (error) {
            console.error(`Error fetching incompatibility rules for product ${productId}:`, error);
            throw error;
        }
    }

    async getRuleOptions(ruleId: number): Promise<IncompatibilityRuleOption[]> {
        try {
            return await this.ruleOptionRepository.find({
                where: { incompatibilityRuleId: ruleId },
                relations: ['categoryOption']
            });
        } catch (error) {
            console.error(`Error fetching options for incompatibility rule ${ruleId}:`, error);
            throw error;
        }
    }
} 