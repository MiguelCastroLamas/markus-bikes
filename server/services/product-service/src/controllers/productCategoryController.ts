import { Router, Request, Response } from 'express';
import { ProductCategoryRepository } from '../repositories/ProductCategoryRepository';

const router = Router();
const categoryRepository = new ProductCategoryRepository();

router.get('/', async (_req: Request, res: Response) => {
    try {
        const categories = await categoryRepository.findAll();
        return res.status(200).json(categories);
    } catch (error) {
        console.error('Error in GET /product-categories:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const category = await categoryRepository.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Product category not found' });
        }

        return res.status(200).json(category);
    } catch (error) {
        console.error(`Error in GET /product-categories/${req.params.id}:`, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id/options', async (req: Request, res: Response) => {
    try {
        const categoryId = parseInt(req.params.id);
        if (isNaN(categoryId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const category = await categoryRepository.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Product category not found' });
        }

        const options = await categoryRepository.getOptions(categoryId);
        return res.status(200).json(options);
    } catch (error) {
        console.error(`Error in GET /product-categories/${req.params.id}/options:`, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router; 