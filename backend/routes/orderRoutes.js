import express from 'express'
import { 
    getMyOrders,
    getOrders,
    updateOrderToDelivered,
    updateOrderToPaid,
    getOrderById,
    addOrderItems,
    cancelOrder,
    exportOrdersToCSV,
    requestReturn,
    approveReturn,
    rejectReturn,
    
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
router.route('/:id/return').post(protect, requestReturn);
router.route('/:id/return/approve').put(protect, admin, approveReturn);
router.route('/:id/return/reject').put(protect, admin, rejectReturn);

export default router;