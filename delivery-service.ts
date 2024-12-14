import { v4 as uuidv4 } from 'uuid';
import { MenuItem } from './food-delivery-system.types';
import { MenuService } from './menu-service';
import { RiderService } from './riders-servies';
import { UserBalanceService } from './user-balance-service';

export class DeliveryService {

    private orders: Map<string, Record<string, any>>; // orderId -> { details }

    constructor(orders: Map<string, Record<string, any>> = new Map()) {
        this.orders = orders;
    }


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
