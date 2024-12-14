"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrder = void 0;
const food_delivery_system_1 = require("./food-delivery-system");
const uuid_1 = require("uuid");
const notification_1 = require("./notification");
const calculate_discount_1 = require("./calculate-discount");
class CreateOrder {
    constructor() {
        this.system = new food_delivery_system_1.FoodDeliverySystem();
        this.notify = new notification_1.Notification();
        this.discount = new calculate_discount_1.CalculateDiscount();
    }
    createOrder(userId, itemIds, discountCode) {
        if (!this.system.userBalances.has(userId))
            throw new Error("User not found.");
        if (itemIds.length === 0)
            throw new Error("Order must have at least one item.");
        let total = 0;
        const itemsWithInsufficientInventory = [];
        itemIds.forEach(itemId => {
            const item = this.system.menu.get(itemId);
            if (!item)
                throw new Error(`Menu item ${itemId} not found.`);
            if (item.inventory <= 0) {
                itemsWithInsufficientInventory.push(itemId);
            }
            total += item.price;
        });
        if (itemsWithInsufficientInventory.length > 0) {
            throw new Error(`Insufficient inventory for items: ${itemsWithInsufficientInventory.join(', ')}`);
        }
        // Apply discount
        const discount = this.discount.calculateDiscount(total, discountCode);
        total -= discount;
        // Check user balance
        if ((this.system.userBalances.get(userId) || 0) < total) {
            throw new Error("Insufficient balance.");
        }
        // Deplete inventory
        itemIds.forEach(itemId => {
            const item = this.system.menu.get(itemId);
            const menuItem = {
                name: item.name,
                price: item.price,
                inventory: item.inventory - 1
            };
            this.system.menu.set(itemId, menuItem);
        });
        // Assign a rider
        if (this.system.riders.length === 0)
            throw new Error("No riders available.");
        const assignedRider = this.system.riders.shift();
        // Create order
        const orderId = (0, uuid_1.v4)();
        this.system.orders.set(orderId, {
            userId,
            itemIds,
            total,
            status: "Pending",
            rider: assignedRider
        });
        // Notify customer and restaurant
        this.notify.sendNotification(userId, `Your order ${orderId} has been placed successfully.`);
        this.notify.sendNotification("restaurant", `A new order ${orderId} has been received.`);
        return orderId;
    }
}
exports.CreateOrder = CreateOrder;
