import { Router } from 'express';
import { getAllPayments, processPayment } from '../controllers/paymentController';
import { authenticateToken, authorizeRole } from '../../../middleware/auth';
const r = Router();
r.get('/', authenticateToken, authorizeRole(['admin', 'manager', 'cashier']), getAllPayments);
r.post('/process/:orderId', authenticateToken, authorizeRole(['admin', 'manager', 'cashier']), processPayment);
export default r;
