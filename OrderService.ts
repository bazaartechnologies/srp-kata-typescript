import { v4 as uuidv4 } from 'uuid';
import { UserService } from './UserService';
import { NotificationService } from './NotificationService';
import { MenuService } from './MenuService';
import { RiderService } from './RiderService';
let orderInstance: OrderService | null = null;


export class OrderService {
    private orders: Map<string, Record<string, any>> = new Map(); // orderId -> { details }
    private notificationService: NotificationService = new NotificationService();
    private userService: UserService = new UserService();
    private menuService: MenuService = new MenuService();
    private ridersService: RiderService = new RiderService();
    constructor() {
        if (orderInstance) {
            return orderInstance;
        }
        return orderInstance = this;
    }

    create(userId: string, itemIds: string[], discountCode: string | null): string {
        if (!this.userService.doesUserExist(userId)) throw new Error("User not found.");
        if (itemIds.length === 0) throw new Error("Order must have at least one item.");
        let total = this.calculateTotal(itemIds);
        // Apply discount
        const discount = this.calculateDiscount(total, discountCode);
        total -= discount;
        // Check user balance
        if ((this.userService.getUserBalance(userId) || 0) < total) {
            throw new Error("Insufficient balance.");
        }
        // Deplete inventory
        this.depleteInventory(itemIds);
        // Assign a rider
        if (!this.ridersService.isAvailable()) throw new Error("No riders available.");
        const assignedRider = this.ridersService.get();
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
        this.notificationService.sendNotification(userId, `Your order ${orderId} has been placed successfully.`);
        this.notificationService.sendNotification("restaurant", `A new order ${orderId} has been received.`);
        return orderId;
    }



    private calculateTotal(itemIds: string[]) {
        let total = 0;
        const itemsWithInsufficientInventory: string[] = [];
        itemIds.forEach(itemId => {
            const item = this.menuService.getMenuItem(itemId);
            if (!item) throw new Error(`Menu item ${itemId} not found.`);
            if (item.inventory <= 0) {
                itemsWithInsufficientInventory.push(itemId);
            }
            total += item.price;
        });
        if (itemsWithInsufficientInventory.length > 0) {
            throw new Error(`Insufficient inventory for items: ${itemsWithInsufficientInventory.join(', ')}`);
        }
        return total;
    }

    private depleteInventory(itemIds: string[]) {
        itemIds.forEach(itemId => {
            const item = this.menuService.getMenuItem(itemId)!;
            this.menuService.addItem(itemId, item.name, item.price, item.inventory - 1);
        });
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

    getById(orderId: string): Record<string, any> | null {
        return this.orders.get(orderId) || null;
    }
}
