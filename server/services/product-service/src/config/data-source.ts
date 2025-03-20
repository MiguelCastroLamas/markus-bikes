import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';
import { ProductType } from '../entities/ProductType';
import { Product } from '../entities/Product';
import { ProductCategory } from '../entities/ProductCategory';
import { CategoryOption } from '../entities/CategoryOption';
import { IncompatibilityRule } from '../entities/IncompatibilityRule';
import { IncompatibilityRuleOption } from '../entities/IncompatibilityRuleOption';
import { CategoryPriceModifier } from '../entities/CategoryPriceModifier';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'user',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_DATABASE || 'test',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    entities: [
        ProductType,
        Product,
        ProductCategory,
        CategoryOption,
        IncompatibilityRule,
        IncompatibilityRuleOption,
        CategoryPriceModifier,
    ],
    migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
}); 