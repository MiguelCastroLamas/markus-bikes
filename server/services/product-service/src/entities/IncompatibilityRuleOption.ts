import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IncompatibilityRule } from './IncompatibilityRule';
import { CategoryOption } from './CategoryOption';

@Entity('incompatibility_rule_options')
export class IncompatibilityRuleOption {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'incompatibility_rule_id' })
    incompatibilityRuleId: number;

    @Column({ name: 'category_option_id' })
    categoryOptionId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => IncompatibilityRule, rule => rule.ruleOptions)
    @JoinColumn({ name: 'incompatibility_rule_id' })
    incompatibilityRule: IncompatibilityRule;

    @ManyToOne(() => CategoryOption, option => option.incompatibilityRuleOptions)
    @JoinColumn({ name: 'category_option_id' })
    categoryOption: CategoryOption;
} 