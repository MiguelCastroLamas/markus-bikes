import { Router, Request, Response } from 'express';
import { IncompatibilityRuleRepository } from '../repositories/IncompatibilityRuleRepository';
import { ProductRepository } from '../repositories/ProductRepository';

const router = Router();
const ruleRepository = new IncompatibilityRuleRepository();

router.get('/', async (_req: Request, res: Response) => {
    try {
        const rules = await ruleRepository.findAll();
        return res.status(200).json(rules);
    } catch (error) {
        console.error('Error in GET /incompatibility-rules:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const rule = await ruleRepository.findById(id);
        if (!rule) {
            return res.status(404).json({ message: 'Incompatibility rule not found' });
        }

        return res.status(200).json(rule);
    } catch (error) {
        console.error(`Error in GET /incompatibility-rules/${req.params.id}:`, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id/options', async (req: Request, res: Response) => {
    try {
        const ruleId = parseInt(req.params.id);
        if (isNaN(ruleId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const rule = await ruleRepository.findById(ruleId);
        if (!rule) {
            return res.status(404).json({ message: 'Incompatibility rule not found' });
        }

        const options = await ruleRepository.getRuleOptions(ruleId);
        const categoryOptions = options.map(option => option.categoryOption);
        return res.status(200).json(categoryOptions);
    } catch (error) {
        console.error(`Error in GET /incompatibility-rules/${req.params.id}/options:`, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router; 