import { OrderService } from './OrderService';


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
