import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CategoryOption } from './CategoryOption';

@Entity('category_price_modifiers')
export class CategoryPriceModifier {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'category_option_id_base' })
    categoryOptionIdBase: number;

    @Column({ name: 'category_option_id_trigger' })
    categoryOptionIdTrigger: number;

    @Column({ name: 'override_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
    overridePrice: number | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => CategoryOption, option => option.baseModifiers)
    @JoinColumn({ name: 'category_option_id_base' })
    baseOption: CategoryOption;

    @ManyToOne(() => CategoryOption, option => option.triggerModifiers)
    @JoinColumn({ name: 'category_option_id_trigger' })
    triggerOption: CategoryOption;
} 