import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ProductType } from './ProductType';
import { ProductCategory } from './ProductCategory';
import { IncompatibilityRule } from './IncompatibilityRule';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'product_type_id', nullable: true })
    productTypeId: number | null;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ name: 'base_price', type: 'decimal', precision: 10, scale: 2, default: 0 })
    basePrice: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => ProductType, productType => productType.products)
    @JoinColumn({ name: 'product_type_id' })
    productType: ProductType;

    @OneToMany(() => ProductCategory, category => category.product)
    categories: ProductCategory[];

    @OneToMany(() => IncompatibilityRule, rule => rule.product)
    incompatibilityRules: IncompatibilityRule[];
} 