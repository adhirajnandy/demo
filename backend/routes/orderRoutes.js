import express from 'express'
import { 
    getMyOrders,
    getOrders,
    updateOrderToDelivered,
    updateOrderToPaid,
    getOrderById,
    addOrderItems,
    cancelOrder,
    exportOrdersToCSV
} from '../controllers/orderController.js';
import {protect, admin} from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect,updateOrderToPaid);
router.route('/:id/deliver').put(protect,admin,updateOrderToDelivered);
router.route('/:id/cancel').put(protect,cancelOrder);
router.route('/export/csv').get(protect,admin, exportOrdersToCSV);

export default router;