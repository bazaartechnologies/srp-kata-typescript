import { MenuItem } from './food-delivery-system.types';

export class FoodDeliverySystem {
    public menu: Map<string, MenuItem> = new Map(); // itemId -> [name, price, inventory]
    public orders: Map<string, Record<string, any>> = new Map(); // orderId -> { details }
    public userBalances: Map<string, number> = new Map(); // userId -> balance
    public riders: string[] = []; // List of available riders

    // Delivery Operations
    getDeliveryStatus(orderId: string): string {
        const order = this.orders.get(orderId);
        if (!order) throw new Error(`Order ${orderId} not found.`);
        return order.status;
    }

    updateDeliveryStatus(orderId: string, status: string): void {
        const order = this.orders.get(orderId);
        if (!order) throw new Error(`Order ${orderId} not found.`);
        order.status = status;
    }

}
