const Order = require('../models/Order');
const mongoose = require('mongoose');

const fetchOrder = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: `No such order!` });
    }

    const filter = {
        _id: id,
        deletedByUser: { $ne: true }
    };

    if (req.user.role !== 1) {
        filter.customerId = req.user._id;
        const order = await Order.findOne(filter).populate('customerId');
        if (!order) {
            return res.status(400).json({ error: `Order not found!` });
        }
    }

    if (req.user.role === 1) {
        const order = await Order.findById(id).populate('customerId');
        return res.status(200).json(order);
    }
}

const placeOrder = async (req, res) => {

    try {
        const id = req.user._id;
        const { items, totalAmount, shippingAddress, paymentInfo } = req.body;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "User not found" });
        }

        if (!items || !totalAmount || !shippingAddress) {
            return res.status(400).json({ error: "Missing required fields!" });
        }

        const order = new Order({
            customerId: id,
            items,
            totalAmount,
            shippingAddress,
        });

        if (paymentInfo) {
            order.paymentInfo = paymentInfo;
        }

        await order.save();
        return res.status(201).json({ msg: "Order placed successfully!", orderId: order._id });
    } catch (error) {
        return res.status(400).json({ msg: "An error occured!", error });
    }
}

const changeStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'processing', 'shipped', 'delivered'].includes(status)) {
        return res.status(400).json({ error: `Invalid status: ${status}` });
    }

    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: `Order not found ${id}` });
        }

        order.status = status;
        await order.save();
        return res.status(200).json({ msg: `Order status updated to ${status}` });
    } catch (error) {
        return res.status(400).json({ error: `An error occured: ${error}` });
    }
}

const removeOrder = async (req, res) => {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
        return res.status(404).json({ error: `Order not found: ${id}` });
    }

    if (req.user.role === 1 || req.user._id.equals(order.customerId)) {
        try {
            order.deletedByUser = true;
            order.deletedAt = Date.now();
            await order.save();
            return res.status(200).json({ msg: `Order removed successfully!` });
        } catch (error) {
            return res.status(500).json({ error: `An error occurred: ${error.message}` });
        }
    } else {
        return res.status(400).json({ error: `Unauthorized!` });
    }
};

module.exports = {
    fetchOrder,
    placeOrder,
    changeStatus,
    removeOrder
}