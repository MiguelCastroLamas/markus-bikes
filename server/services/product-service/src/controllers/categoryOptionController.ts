import { Router, Request, Response } from 'express';
import { CategoryOptionRepository } from '../repositories/CategoryOptionRepository';

const router = Router();
const optionRepository = new CategoryOptionRepository();

router.get('/', async (_req: Request, res: Response) => {
    try {
        const options = await optionRepository.findAll();
        return res.status(200).json(options);
    } catch (error) {
        console.error('Error in GET /category-options:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const option = await optionRepository.findById(id);
        if (!option) {
            return res.status(404).json({ message: 'Category option not found' });
        }

        return res.status(200).json(option);
    } catch (error) {
        console.error(`Error in GET /category-options/${req.params.id}:`, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id/price-modifiers', async (req: Request, res: Response) => {
    try {
        const optionId = parseInt(req.params.id);
        if (isNaN(optionId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const option = await optionRepository.findById(optionId);
        if (!option) {
            return res.status(404).json({ message: 'Category option not found' });
        }

        const priceModifiers = await optionRepository.getPriceModifiers(optionId);
        return res.status(200).json(priceModifiers);
    } catch (error) {
        console.error(`Error in GET /category-options/${req.params.id}/price-modifiers:`, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router; 