import { FoodDeliverySystem } from "./food-delivery-system";
import { MenuItem } from "./food-delivery-system.types";
import { v4 as uuidv4 } from 'uuid';
import { Notification } from "./notification";
import { CalculateDiscount } from "./calculate-discount";

export class CreateOrder{
    
    notify: Notification;
    system: FoodDeliverySystem;
    discount: CalculateDiscount;
    constructor(){
     this.system = new FoodDeliverySystem();
     this.notify = new Notification();
     this.discount = new CalculateDiscount();
    } 

    createOrder(userId: string, itemIds: string[], discountCode: string | null): string {
        if (!this.system.userBalances.has(userId)) throw new Error("User not found.");
        if (itemIds.length === 0) throw new Error("Order must have at least one item.");

        let total = 0;
        const itemsWithInsufficientInventory: string[] = [];

        itemIds.forEach(itemId => {
            const item = this.system.menu.get(itemId);
            if (!item) throw new Error(`Menu item ${itemId} not found.`);
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
            const item = this.system.menu.get(itemId)!;
            const menuItem = {
                name: item.name,
                price: item.price,
                inventory: item.inventory - 1
            }
            this.system.menu.set(itemId, menuItem);
        });

        // Assign a rider
        if (this.system.riders.length === 0) throw new Error("No riders available.");
        const assignedRider = this.system.riders.shift()!;

        // Create order
        const orderId = uuidv4();
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