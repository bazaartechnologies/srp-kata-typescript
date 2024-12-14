import { v4 as uuidv4 } from 'uuid';
import { MenuItem } from './food-delivery-system.types';
import { OrderService } from './order-system';

export class DeliverySystem {
    private orderService= new OrderService(); // orderId -> { details }
    
    // Delivery Operations
    getDeliveryStatus(orderId: string): string {
        const order = this.orderService.getOrders().get(orderId);
        if (!order) throw new Error(`Order ${orderId} not found.`);
        return order.status;
    }

    updateDeliveryStatus(orderId: string, status: string): void {
        const order = this.orderService.getOrders().get(orderId);
        if (!order) throw new Error(`Order ${orderId} not found.`);
        order.status = status;
    }
   

   
}
