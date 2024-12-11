import { FoodDeliverySystem } from "./food-delivery-system";
import { MenuItem } from "./food-delivery-system.types";

describe('FoodDeliverySystem', () => {
    let system: FoodDeliverySystem;

    beforeEach(() => {
        system = new FoodDeliverySystem();
    });

    test('add menu item and retrieve it', () => {
        system.addMenuItem('1', 'Burger', 5.99, 10);
        const menu = system.getMenu();

        const item: MenuItem = menu.get('1')!

        expect(item.name).toBe('Burger');
        expect(item.price).toBe(5.99);
        expect(item.inventory).toBe(10);
    });

    test('remove menu item', () => {
        system.addMenuItem('1', 'Burger', 5.99, 10);
        system.removeMenuItem('1');
        const menu = system.getMenu();

        expect(menu.get('1')).toBeUndefined();
    });

    // test('add user and check balance', () => {
    //     system.addUser('user1', 50.0);
    //     const balance = system.getUserBalance('user1');

    //     expect(balance).toBe(50.0);
    // });

    test('create order successfully with sufficient balance and inventory', () => {
        system.addMenuItem('1', 'Burger', 5.99, 10);
        system.addMenuItem('2', 'Pizza', 8.99, 5);
        system.addUser('user1', 50.0);
        system.addRider('rider1')

        const orderId = system.createOrder('user1', ['1', '2'], null);
        const menu = system.getMenu();

        const burger: MenuItem = menu.get('1')!
        const pizza: MenuItem = menu.get('2')!

        expect(orderId).toBeDefined();
        expect(burger.inventory).toBe(9); // Check inventory for Burger
        expect(pizza.inventory).toBe(4); // Check inventory for Pizza
    });

    test('fail to create order due to insufficient inventory', () => {
        system.addMenuItem('1', 'Burger', 5.99, 0); // No inventory
        system.addUser('user1', 50.0);

        expect(() => {
            system.createOrder('user1', ['1'], null);
        }).toThrowError('Insufficient inventory for items: 1');
    });

    test('fail to create order due to insufficient balance', () => {
        system.addMenuItem('1', 'Burger', 10.0, 5);
        system.addUser('user1', 5.0); // Insufficient balance

        expect(() => {
            system.createOrder('user1', ['1'], null);
        }).toThrowError('Insufficient balance.');
    });

    test('apply discount while creating order', () => {
        system.addMenuItem('1', 'Burger', 10.0, 5);
        system.addUser('user1', 50.0);
        system.addRider('rider1');

        const orderId = system.createOrder('user1', ['1'], 'DISCOUNT10');
        expect(orderId).toBeDefined();
    });

    test('send notifications after placing an order', () => {
        system.addMenuItem('1', 'Burger', 5.99, 10);
        system.addUser('user1', 50.0);
        system.addRider('rider1');

        const orderId = system.createOrder('user1', ['1'], null);

        // Console logs are considered notifications in this implementation.
        console.log(`Notification should be sent for order ${orderId}.`);
    });

    test('assign rider to order and check delivery status', () => {
        system.addMenuItem('1', 'Burger', 5.99, 10);
        system.addUser('user1', 50.0);
        system.addRider('rider1');

        const orderId = system.createOrder('user1', ['1'], null);
        const deliveryStatus = system.getDeliveryStatus(orderId);

        expect(deliveryStatus).toBe('Pending');
    });

    test('update delivery status of order', () => {
        system.addMenuItem('1', 'Burger', 5.99, 10);
        system.addUser('user1', 50.0);
        system.addRider('rider1');

        const orderId = system.createOrder('user1', ['1'], null);
        system.updateDeliveryStatus(orderId, 'Out for Delivery');

        const deliveryStatus = system.getDeliveryStatus(orderId);
        expect(deliveryStatus).toBe('Out for Delivery');
    });
});
