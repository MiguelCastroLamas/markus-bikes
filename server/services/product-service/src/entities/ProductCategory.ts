import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Product } from './Product';
import { CategoryOption } from './CategoryOption';

@Entity('product_categories')
export class ProductCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'product_id' })
    productId: number;

    @Column({ length: 100 })
    name: string;

    @Column({ name: 'is_required', default: true })
    isRequired: boolean;

    @Column({ name: 'sort_order', default: 0 })
    sortOrder: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => Product, product => product.categories)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @OneToMany(() => CategoryOption, option => option.productCategory)
    options: CategoryOption[];
} 