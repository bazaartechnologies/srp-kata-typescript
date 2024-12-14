import { v4 as uuidv4 } from 'uuid';
import { MenuItem } from './food-delivery-system.types';
let userInstance: UserService | null = null;
let menuInstance: MenuService | null = null;
let riderInstance: RiderService | null = null;


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
    addMenuItem(itemId: string, name: string, price: number, inventory: number): void {
        const menuItem = {
            name,
            price,
            inventory
        }
        this.menu.set(itemId, menuItem);
    }
    removeMenuItem(itemId: string): void {
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
    
    addRider(riderId: string): void {
        this.riders.push(riderId);
    }

    getRiders(): string[] {
        return this.riders;
    }

    areRidersAvailable(): boolean {
        return this.riders.length > 0;
    }

    getRider(): string {
        return this.riders.shift() || '';
    }   
}


export class FoodDeliverySystem {
    // private menu: Map<string, MenuItem> = new Map(); // itemId -> [name, price, inventory]
    private orders: Map<string, Record<string, any>> = new Map(); // orderId -> { details }
    // private userBalances: Map<string, number> = new Map(); // userId -> balance
    // private riders: string[] = []; // List of available riders
    private notificationService: NotificationService = new NotificationService();
    private userService: UserService = new UserService();
    private menuService: MenuService = new MenuService();
    private ridersService: RiderService = new RiderService();

    // Order Operations
    createOrder(userId: string, itemIds: string[], discountCode: string | null): string {
        //if (!this.userBalances.has(userId)) throw new Error("User not found.");
        if (!this.userService.doesUserExist(userId)) throw new Error("User not found.");
        if (itemIds.length === 0) throw new Error("Order must have at least one item.");

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

        // Apply discount
        const discount = this.calculateDiscount(total, discountCode);
        total -= discount;

        // Check user balance
        if ((this.userService.getUserBalance(userId) || 0) < total) {
            throw new Error("Insufficient balance.");
        }

        // Deplete inventory
        itemIds.forEach(itemId => {
            const item = this.menuService.getMenuItem(itemId)!;
            //onst menuItem = {
            //   name: item.name,
            //   price: item.price,
            //   inventory: item.inventory - 1
            //
            this.menuService.addMenuItem(itemId, item.name, item.price, item.inventory - 1);
        });

        // Assign a rider
        if (!this.ridersService.areRidersAvailable()) throw new Error("No riders available.");
        const assignedRider = this.ridersService.getRider();

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
    // private sendNotification(recipient: string, message: string): void {
    // console.log(`Notification sent to ${recipient}: ${message}`);
    // }

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
// 
    // Rider Operations
    // addRider(riderId: string): void {
        // this.riders.push(riderId);
    // }
// 
    // getRiders(): string[] {
        // return this.riders;
    // }
}
