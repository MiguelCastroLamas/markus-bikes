import { Router, Request, Response } from 'express';
import { ProductTypeRepository } from '../repositories/ProductTypeRepository';

const router = Router();
const productTypeRepository = new ProductTypeRepository();

router.get('/', async (_req: Request, res: Response) => {
    try {
        const productTypes = await productTypeRepository.findAll();
        return res.status(200).json(productTypes);
    } catch (error) {
        console.error('Error in GET /product-types:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const productType = await productTypeRepository.findById(id);
        if (!productType) {
            return res.status(404).json({ message: 'Product type not found' });
        }

        return res.status(200).json(productType);
    } catch (error) {
        console.error(`Error in GET /product-types/${req.params.id}:`, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router; 