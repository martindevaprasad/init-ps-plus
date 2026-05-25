import { Router } from 'express';
import { getAllInventoryLogs } from '../controllers/inventoryLogController';
import { authenticateToken, authorizeRole } from '../../../middleware/auth';
const r = Router();
r.get('/', authenticateToken, authorizeRole(['admin', 'manager']), getAllInventoryLogs);
export default r;
