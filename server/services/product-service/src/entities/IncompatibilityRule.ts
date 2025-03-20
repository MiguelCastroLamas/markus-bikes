import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Product } from './Product';
import { IncompatibilityRuleOption } from './IncompatibilityRuleOption';

@Entity('incompatibility_rules')
export class IncompatibilityRule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'product_id' })
    productId: number;

    @Column({ name: 'rule_name', length: 150 })
    ruleName: string;

    @Column({ name: 'rule_description', type: 'text', nullable: true })
    ruleDescription: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => Product, product => product.incompatibilityRules)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @OneToMany(() => IncompatibilityRuleOption, ruleOption => ruleOption.incompatibilityRule)
    ruleOptions: IncompatibilityRuleOption[];
} 