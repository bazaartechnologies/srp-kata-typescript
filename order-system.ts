import { v4 as uuidv4 } from 'uuid';
import { MenuService } from './menu-system';
import { UserService } from './user-service';
import { RiderService } from './rider-system';

export class OrderService {
    private orders: Map<string, Record<string, any>> = new Map(); // orderId -> { details }
    // Services
    private menuService: MenuService = new MenuService();
    private userBalances = new UserService();
    private riders = new RiderService();

    
    // Order Operations
    getOrders() {
        return this.orders;
    }
    createOrder(userId: string, itemIds: string[], discountCode: string | null): string {
        if (!this.userBalances.getUserBalances().has(userId)) throw new Error("User not found.");
        if (itemIds.length === 0) throw new Error("Order must have at least one item.");

        let total = 0;
        const itemsWithInsufficientInventory: string[] = [];

        itemIds.forEach(itemId => {
            const item = this.menuService.getMenu().get(itemId);
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
        const discount = this.calculateDiscount(total, discountCode);
        total -= discount;

        // Check user balance
        if ((this.userBalances.getUserBalances().get(userId) || 0) < total) {
            throw new Error("Insufficient balance.");
        }

        // Deplete inventory
        itemIds.forEach(itemId => {
            const item = this.menuService.getMenu().get(itemId)!;
            const menuItem = {
                name: item.name,
                price: item.price,
                inventory: item.inventory - 1
            }
            this.menuService.getMenu().set(itemId, menuItem);
        });

        // Assign a rider
        if (this.riders.getRiders().length === 0) throw new Error("No riders available.");
        const assignedRider = this.riders.shiftRider()!;

        // Create order
        const orderId = uuidv4();
        this.orders.set(orderId, {
            userId,
            itemIds,
            total,
            status: "Pending",
            rider: assignedRider
        });

        // Notify customer and restaurant
        this.sendNotification(userId, `Your order ${orderId} has been placed successfully.`);
        this.sendNotification("restaurant", `A new order ${orderId} has been received.`);

        return orderId;
    }

    private calculateDiscount(total: number, discountCode: string | null): number {
        switch (discountCode) {
            case "DISCOUNT10":
                return total * 0.10;
            case "DISCOUNT20":
                return total * 0.20;
            default:
                return 0;
        }
    }
     // Notification
    private sendNotification(recipient: string, message: string): void {
        console.log(`Notification sent to ${recipient}: ${message}`);
    }

}
