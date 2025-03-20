import { Router, Request, Response } from 'express';
import { ProductRepository } from '../repositories/ProductRepository';
import { ProductCategoryRepository } from '../repositories/ProductCategoryRepository';
import { IncompatibilityRuleRepository } from '../repositories/IncompatibilityRuleRepository';

const router = Router();
const productRepository = new ProductRepository();
const categoryRepository = new ProductCategoryRepository();
const ruleRepository = new IncompatibilityRuleRepository();

router.get('/', async (_req: Request, res: Response) => {
    try {
        const products = await productRepository.findAll();
        return res.status(200).json(products);
    } catch (error) {
        console.error('Error in GET /products:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const product = await productRepository.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json(product);
    } catch (error) {
        console.error(`Error in GET /products/${req.params.id}:`, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id/categories', async (req: Request, res: Response) => {
    try {
        const productId = parseInt(req.params.id);
        if (isNaN(productId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const product = await productRepository.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const categories = await categoryRepository.findByProductId(productId);
        return res.status(200).json(categories);
    } catch (error) {
        console.error(`Error in GET /products/${req.params.id}/categories:`, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id/incompatibility-rules', async (req: Request, res: Response) => {
    try {
        const productId = parseInt(req.params.id);
        if (isNaN(productId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const product = await productRepository.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const rules = await ruleRepository.findByProductId(productId);

        const rulesWithOptions = rules.map((rule) => ({
            ...rule,
            options: rule.ruleOptions?.map(option => option.categoryOption).filter(Boolean) || []
        }));

        return res.status(200).json(rulesWithOptions);
    } catch (error) {
        console.error(`Error in GET /products/${req.params.id}/incompatibility-rules:`, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router; 