import { Router } from 'express';
import { getSalesReport, getInventoryReport } from '../controllers/reportController';
import { authenticateToken, authorizeRole } from '../../../middleware/auth';
const r = Router();
r.get('/sales', authenticateToken, authorizeRole(['admin', 'manager']), getSalesReport);
r.get('/inventory', authenticateToken, authorizeRole(['admin', 'manager']), getInventoryReport);
export default r;
