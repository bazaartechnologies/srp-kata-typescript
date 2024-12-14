"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodDeliverySystem = void 0;
class FoodDeliverySystem {
    constructor() {
        this.menu = new Map(); // itemId -> [name, price, inventory]
        this.orders = new Map(); // orderId -> { details }
        this.userBalances = new Map(); // userId -> balance
        this.riders = []; // List of available riders
    }
    // Delivery Operations
    getDeliveryStatus(orderId) {
        const order = this.orders.get(orderId);
        if (!order)
            throw new Error(`Order ${orderId} not found.`);
        return order.status;
    }
    updateDeliveryStatus(orderId, status) {
        const order = this.orders.get(orderId);
        if (!order)
            throw new Error(`Order ${orderId} not found.`);
        order.status = status;
    }
}
exports.FoodDeliverySystem = FoodDeliverySystem;
