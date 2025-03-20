import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ProductCategory } from './ProductCategory';
import { IncompatibilityRuleOption } from './IncompatibilityRuleOption';
import { CategoryPriceModifier } from './CategoryPriceModifier';

@Entity('category_options')
export class CategoryOption {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'product_category_id' })
    productCategoryId: number;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price: number;

    @Column({ name: 'stock_quantity', default: 100 })
    stockQuantity: number;

    @Column({ name: 'is_available', default: true })
    isAvailable: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => ProductCategory, category => category.options)
    @JoinColumn({ name: 'product_category_id' })
    productCategory: ProductCategory;

    @OneToMany(() => IncompatibilityRuleOption, ruleOption => ruleOption.categoryOption)
    incompatibilityRuleOptions: IncompatibilityRuleOption[];

    @OneToMany(() => CategoryPriceModifier, modifier => modifier.baseOption)
    baseModifiers: CategoryPriceModifier[];

    @OneToMany(() => CategoryPriceModifier, modifier => modifier.triggerOption)
    triggerModifiers: CategoryPriceModifier[];
} 