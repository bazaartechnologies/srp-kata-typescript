import { FoodDeliverySystem } from "./food-delivery-system";
import { MenuOperations } from "./menu-operations";
import { CreateOrder } from "./create-order";
import { CalculateDiscount } from "./calculate-discount";
import { Notification } from "./notification";
import { Rider } from "./rider";
import { User } from "./user";



import { MenuItem } from "./food-delivery-system.types";

describe('FoodDeliverySystem', () => {
    let system: FoodDeliverySystem;
    let menu: MenuOperations;
    let order: CreateOrder;
    let discount: CalculateDiscount;
    let notify: Notification;
    let rider: Rider;
    let user: User;



    beforeEach(() => {
        system = new FoodDeliverySystem();
        menu = new MenuOperations();
        order = new CreateOrder();
        discount = new CalculateDiscount();
        notify = new Notification();
        rider = new Rider();
        user = new User();

    });

    test('add menu item and retrieve it', () => {
        menu.addMenuItem('1', 'Burger', 5.99, 10);
        const menuItem = menu.getMenu();

        const item: MenuItem = menuItem.get('1')!

        expect(item.name).toBe('Burger');
        expect(item.price).toBe(5.99);
        expect(item.inventory).toBe(10);
    });

    test('remove menu item', () => {
        menu.addMenuItem('1', 'Burger', 5.99, 10);
        menu.removeMenuItem('1');
        const menuItem = menu.getMenu();

        expect(menuItem.get('1')).toBeUndefined();
    });

    // test('add user and check balance', () => {
    //     system.addUser('user1', 50.0);
    //     const balance = system.getUserBalance('user1');

    //     expect(balance).toBe(50.0);
    // });

    test('create order successfully with sufficient balance and inventory', () => {
        menu.addMenuItem('1', 'Burger', 5.99, 10);
        menu.addMenuItem('2', 'Pizza', 8.99, 5);
        user.addUser('user1', 50.0);
        rider.addRider('rider1')

        const orderId = order.createOrder('user1', ['1', '2'], null);
        const menuItem = menu.getMenu();

        const burger: MenuItem = menuItem.get('1')!
        const pizza: MenuItem = menuItem.get('2')!

        expect(orderId).toBeDefined();
        expect(burger.inventory).toBe(9); // Check inventory for Burger
        expect(pizza.inventory).toBe(4); // Check inventory for Pizza
    });

    test('fail to create order due to insufficient inventory', () => {
        menu.addMenuItem('1', 'Burger', 5.99, 0); // No inventory
        user.addUser('user1', 50.0);

        expect(() => {
            order.createOrder('user1', ['1'], null);
        }).toThrowError('Insufficient inventory for items: 1');
    });

    test('fail to create order due to insufficient balance', () => {
        menu.addMenuItem('1', 'Burger', 10.0, 5);
        user.addUser('user1', 5.0); // Insufficient balance

        expect(() => {
            order.createOrder('user1', ['1'], null);
        }).toThrowError('Insufficient balance.');
    });

    test('apply discount while creating order', () => {
        menu.addMenuItem('1', 'Burger', 10.0, 5);
        user.addUser('user1', 50.0);
        rider.addRider('rider1');

        const orderId = order.createOrder('user1', ['1'], 'DISCOUNT10');
        expect(orderId).toBeDefined();
    });

    test('send notifications after placing an order', () => {
        menu.addMenuItem('1', 'Burger', 5.99, 10);
        user.addUser('user1', 50.0);
        rider.addRider('rider1');

        const orderId = order.createOrder('user1', ['1'], null);

        // Console logs are considered notifications in this implementation.
        console.log(`Notification should be sent for order ${orderId}.`);
    });

    test('assign rider to order and check delivery status', () => {
        menu.addMenuItem('1', 'Burger', 5.99, 10);
        user.addUser('user1', 50.0);
        rider.addRider('rider1');

        const orderId = order.createOrder('user1', ['1'], null);
        const deliveryStatus = system.getDeliveryStatus(orderId);

        expect(deliveryStatus).toBe('Pending');
    });

    test('update delivery status of order', () => {
        menu.addMenuItem('1', 'Burger', 5.99, 10);
        user.addUser('user1', 50.0);
        rider.addRider('rider1');

        const orderId = order.createOrder('user1', ['1'], null);
        system.updateDeliveryStatus(orderId, 'Out for Delivery');

        const deliveryStatus = system.getDeliveryStatus(orderId);
        expect(deliveryStatus).toBe('Out for Delivery');
    });
});
