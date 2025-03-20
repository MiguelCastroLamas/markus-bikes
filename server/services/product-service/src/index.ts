import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/data-source';

// Import controllers
import productController from './controllers/productController';
import productTypeController from './controllers/productTypeController';
import productCategoryController from './controllers/productCategoryController';
import categoryOptionController from './controllers/categoryOptionController';
import incompatibilityRuleController from './controllers/incompatibilityRuleController';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3001');

// Initialize database connection
AppDataSource.initialize()
    .then(() => {
        console.info('Database connection established successfully');

        const app = express();

        app.use(cors());
        app.use(express.json());

        app.use('/products', productController);
        app.use('/product-types', productTypeController);
        app.use('/product-categories', productCategoryController);
        app.use('/category-options', categoryOptionController);
        app.use('/incompatibility-rules', incompatibilityRuleController);

        app.listen(PORT, () => {
            console.info(`Product service running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to start product service:', error);
        process.exit(1);
    }); 