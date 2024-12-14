import { v4 as uuidv4 } from 'uuid';
import { MenuItem } from './food-delivery-system.types';
let userInstance: UserService | null = null;
let menuInstance: MenuService | null = null;
let riderInstance: RiderService | null = null;
let orderInstance: OrderService | null = null;


export class NotificationService {
    sendNotification(recipient: string, message: string): void {
        console.log(`Sending notification to ${recipient}: ${message}`);
    }
}

export class UserService {

    // static #instance = null;
    constructor() {
        if (userInstance) {
            return userInstance;
        }
        userInstance = this;
    }



    private userBalances: Map<string, number> = new Map(); // userId -> balance
    addUser(userId: string, balance: number): void {
        this.userBalances.set(userId, balance);
    }

    doesUserExist(userId: string): boolean {
        return this.userBalances.has(userId);
    }

    getUserBalance(userId: string): number {
        return this.userBalances.get(userId) || 0;
    }
}

export class MenuService {

    constructor() {
        if (menuInstance) {
            return menuInstance;
        }
        menuInstance = this
    }
    private menu: Map<string, MenuItem> = new Map(); // itemId -> [name, price, inventory]
    addItem(itemId: string, name: string, price: number, inventory: number): void {
        const menuItem = {
            name,
            price,
            inventory
        }
        this.menu.set(itemId, menuItem);
    }
    removeItem(itemId: string): void {
        this.menu.delete(itemId);
    }
    getMenu(): Map<string, MenuItem> {
        return this.menu;
    }
    getMenuItem(itemId: string) {
        return this.menu.get(itemId);
    }

}

export class RiderService {
    private riders: string[] = []; // List of available riders

    constructor() {
        if (riderInstance) {
            return riderInstance;
        }
        riderInstance = this;
    }

    add(riderId: string): void {
        this.riders.push(riderId);
    }

    getAll(): string[] {
        return this.riders;
    }

    isAvailable(): boolean {
        return this.riders.length > 0;
    }

    get(): string {
        return this.riders.shift() || '';
    }
}

export class OrderService {
    private orders: Map<string, Record<string, any>> = new Map(); // orderId -> { details }
    private notificationService: NotificationService = new NotificationService()
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
        let total = 0;
        total = this.calculateTotal(itemIds, total);
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
        })
        // Notify customer and restaurant
        this.notificationService.sendNotification(userId, `Your order ${orderId} has been placed successfully.`);
        this.notificationService.sendNotification("restaurant", `A new order ${orderId} has been received.`);
        return orderId;
    }

    

    private calculateTotal(itemIds: string[], total: number) {
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


export class FoodDeliverySystem {



    private orderService: OrderService = new OrderService();

    // Delivery Operations
    getDeliveryStatus(orderId: string): string {
        const order = this.orderService.getById(orderId);
        if (!order) throw new Error(`Order ${orderId} not found.`);
        return order.status;
    }

    updateDeliveryStatus(orderId: string, status: string): void {
        const order = this.orderService.getById(orderId);
        if (!order) throw new Error(`Order ${orderId} not found.`);
        order.status = status;
    }
}
