import express from 'express'
import { 
    getMyOrders,
    getOrders,
    updateOrderToDelivered,
    updateOrderToPaid,
    getOrderById,
    addOrderItems,
} from '../controllers/orderController.js';
import {protect, admin} from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect,admin, getOrderById);
router.route('/:id/pay').put(protect,updateOrderToPaid);
router.route('/:id/deliver').put(protect,admin,updateOrderToDelivered);




export default router;