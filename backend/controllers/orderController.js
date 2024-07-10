import asyncHandler from "../middleware/asyncHandler.js";
import Order from '../models/orderModel.js';
import { parse } from "json2csv";
import fs from 'fs';
//Description : Create new order
//Route : POST /api/orders
//access : Private

const addOrderItems = asyncHandler(async (req,res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if(orderItems && orderItems.length === 0){
        res.status(400);
        throw new Error('No Order Items');
    }

    else{
        const order = new Order({
            orderItems: orderItems?.map((x) => ({
                ...x, 
                product: x._id,
                _id : undefined
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,


        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    }
});

//Description : Get Logged in users orders
//Route : GET /api/orders/myorders
//access : Private

const getMyOrders = asyncHandler(async (req,res) => {
    const orders = await Order.find({user : req.user._id});
    res.status(200).json(orders);
});

//Description : Get order by id 
//Route : GET /api/orders/:id
//access : Private

const getOrderById = asyncHandler(async (req,res) => {
    const order = await Order.findById(req.params.id).populate('user','name email');
    if(order){
        res.status(200).json(order);
    }
    else{
        res.status(404);
        throw new Error('Order not Found');
    }
});

//Description : Update order to paid
//Route : PUT /api/orders/:id/pay
//access : Private

const updateOrderToPaid = asyncHandler(async (req,res) => {
    const order = await Order.findById(req.params.id);
    if(order){
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id : req.body.id,
            status : req.body.status,
            update_time : req.body.update_time,
            email_address : req.body.payer.email_address,
        };
        // saving the data into the database
        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    }
    else
    {
        res.status(404);
        throw new Error('Order not Found');
    }
});

//Description : Update to delivered
//Route : PUT /api/orders/:id/deliver
//access : Private/Admin

const updateOrderToDelivered = asyncHandler(async (req,res) => {
    const order = await Order.findById(req.params.id);

    if(order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    }
    else {
        res.status(404);
        throw new Error('Order not Found');
    }
});

//Description : Get all orders 
//Route : GET /api/orders
//access : Private/Admin

const getOrders = asyncHandler(async (req,res) => {
    const orders = await Order.find().populate('user', ' id name ');
    res.status(200).json(orders);
});

// Description: Cancel an order
// Route: PUT /api/orders/:id/cancel
// Access: Private
const cancelOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isCancelled = true;
        order.cancelledAt = Date.now();
        order.cancellationReason = req.body.cancellationReason || ''; // Optional: Capture cancellation reason

        const cancelledOrder = await order.save();

        res.status(200).json(cancelledOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Export all orders to CSV
// @route   GET /api/orders/export/csv
// @access  Private/Admin
const exportOrdersToCSV = asyncHandler(async (req, res) => {
    const fields = [
        'id',
        { label: 'User ID', value: 'user._id' },
        'shippingAddress',
        'paymentMethod',
        'itemsPrice',
        'taxPrice',
        'shippingPrice',
        'totalPrice',
        'createdAt',
        'updatedAt',
        'isPaid',
        'paidAt',
        'isDelivered',
        'deliveredAt',
        'isCancelled',
        'cancelledAt',
        'cancellationReason',
        'isReturned',
        'returnedAt',
        'returnReason',
        'returnRequestedBy',
        'returnRequestedAt',
        'returnStatus',
        'returnProcessedBy',
        'returnProcessedAt',
        'returnProcessedNotes',
    ];

    try {
        const orders = await Order.find().populate('user', 'id name').exec();

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        const jsonOrders = orders.map(order => ({
            id: order._id,
            user: order.user,
            shippingAddress: order.shippingAddress,
            paymentMethod: order.paymentMethod,
            itemsPrice: order.itemsPrice,
            taxPrice: order.taxPrice,
            shippingPrice: order.shippingPrice,
            totalPrice: order.totalPrice,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            isPaid: order.isPaid,
            paidAt: order.paidAt,
            isDelivered: order.isDelivered,
            deliveredAt: order.deliveredAt,
            isCancelled: order.isCancelled,
            cancelledAt: order.cancelledAt,
            cancellationReason: order.cancellationReason,
            isReturned: order.isReturned,
            returnedAt: order.returnedAt,
            returnReason: order.returnReason,
            returnRequestedBy: order.returnRequestedBy,
            returnRequestedAt: order.returnRequestedAt,
            returnStatus: order.returnStatus,
            returnProcessedBy: order.returnProcessedBy,
            returnProcessedAt: order.returnProcessedAt,
            returnProcessedNotes: order.returnProcessedNotes,

        }));

        const csv = parse(jsonOrders, { fields });

        fs.writeFileSync('orders.csv', csv);
        res.download('orders.csv'); // Automatically download the CSV file
    } catch (error) {
        console.error('Error exporting orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Description: Request return for an order
// Route: POST /api/orders/:id/return
// Access: Private
const requestReturn = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (order.isReturned) {
            res.status(400);
            throw new Error('Order is already returned');
        }

        if (!order.isDelivered) {
            res.status(400);
            throw new Error('Order has not been delivered yet');
        }

        order.isReturned = true;
        order.returnedAt = Date.now();
        order.returnReason = req.body.returnReason || '';
        order.returnRequestedBy = req.user._id;
        order.returnRequestedAt = Date.now();
        order.returnStatus = 'pending'; // Initial status when return request is made

        const returnedOrder = await order.save();

        res.status(200).json(returnedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// Description: Approve return for an order
// Route: PUT /api/orders/:id/return/approve
// Access: Private/Admin
const approveReturn = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (!order.isReturned || order.returnStatus !== 'pending') {
            res.status(400);
            throw new Error('Order return cannot be approved');
        }

        order.returnStatus = 'approved';
        order.returnProcessedBy = req.user._id;
        order.returnProcessedAt = Date.now();
        order.returnProcessedNotes = req.body.returnProcessedNotes || '';

        const approvedOrder = await order.save();

        res.status(200).json(approvedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// Description: Reject return for an order
// Route: PUT /api/orders/:id/return/reject
// Access: Private/Admin
const rejectReturn = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (!order.isReturned || order.returnStatus !== 'pending') {
            res.status(400);
            throw new Error('Order return cannot be rejected');
        }

        order.returnStatus = 'rejected';
        order.returnProcessedBy = req.user._id;
        order.returnProcessedAt = Date.now();
        order.returnProcessedNotes = req.body.returnProcessedNotes || '';

        const rejectedOrder = await order.save();

        res.status(200).json(rejectedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders,
    cancelOrder,
    exportOrdersToCSV,
    requestReturn,
    approveReturn,
    rejectReturn,
}