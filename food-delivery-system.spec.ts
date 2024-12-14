import { FoodDeliverySystem } from "./food-delivery-system";
import { UserService } from './UserService';
import { MenuService } from './MenuService';
import { RiderService } from './RiderService';
import { OrderService } from './OrderService';
import { MenuItem } from "./food-delivery-system.types";

describe('FoodDeliverySystem', () => {
    let system: FoodDeliverySystem;
    let userService: UserService;
    let menuService : MenuService;
    let riderSerivce: RiderService
    let orderService: OrderService;

    beforeEach(() => {
        system = new FoodDeliverySystem();
        userService = new UserService();
        menuService = new MenuService();
        riderSerivce = new RiderService();
        orderService = new OrderService();
    });

    test('add menu item and retrieve it', () => {
        menuService.addItem('1', 'Burger', 5.99, 10);
        const menu = menuService.getMenu();

        const item: MenuItem = menu.get('1')!

        expect(item.name).toBe('Burger');
        expect(item.price).toBe(5.99);
        expect(item.inventory).toBe(10);
    });

    test('remove menu item', () => {
        menuService.addItem('1', 'Burger', 5.99, 10);
        menuService.removeItem('1');
        const menu = menuService.getMenu();

        expect(menu.get('1')).toBeUndefined();
    });

    // test('add user and check balance', () => {
    //     system.addUser('user1', 50.0);
    //     const balance = system.getUserBalance('user1');

    //     expect(balance).toBe(50.0);
    // });

    test('create order successfully with sufficient balance and inventory', () => {
        menuService.addItem('1', 'Burger', 5.99, 10);
        menuService.addItem('2', 'Pizza', 8.99, 5);
        userService.addUser('user1', 50.0);
        riderSerivce.add('rider1')

        const orderId = orderService.create('user1', ['1', '2'], null);
        const menu = menuService.getMenu();

        const burger: MenuItem = menu.get('1')!
        const pizza: MenuItem = menu.get('2')!

        expect(orderId).toBeDefined();
        expect(burger.inventory).toBe(9); // Check inventory for Burger
        expect(pizza.inventory).toBe(4); // Check inventory for Pizza
    });

    test('fail to create order due to insufficient inventory', () => {
        menuService.addItem('1', 'Burger', 5.99, 0); // No inventory
        userService.addUser('user1', 50.0);

        expect(() => {
            orderService.create('user1', ['1'], null);
        }).toThrowError('Insufficient inventory for items: 1');
    });

    test('fail to create order due to insufficient balance', () => {
        menuService.addItem('1', 'Burger', 10.0, 5);
        userService.addUser('user1', 5.0); // Insufficient balance

        expect(() => {
            orderService.create('user1', ['1'], null);
        }).toThrowError('Insufficient balance.');
    });

    test('apply discount while creating order', () => {
        menuService.addItem('1', 'Burger', 10.0, 5);
        userService.addUser('user1', 50.0);
        riderSerivce.add('rider1');

        const orderId = orderService.create('user1', ['1'], 'DISCOUNT10');
        expect(orderId).toBeDefined();
    });

    test('send notifications after placing an order', () => {
        menuService.addItem('1', 'Burger', 5.99, 10);
        userService.addUser('user1', 50.0);
        riderSerivce.add('rider1');

        const orderId = orderService.create('user1', ['1'], null);

        // Console logs are considered notifications in this implementation.
        console.log(`Notification should be sent for order ${orderId}.`);
    });

    test('assign rider to order and check delivery status', () => {
        menuService.addItem('1', 'Burger', 5.99, 10);
        userService.addUser('user1', 50.0);
        riderSerivce.add('rider1');

        const orderId = orderService.create('user1', ['1'], null);
        const deliveryStatus = system.getDeliveryStatus(orderId);

        expect(deliveryStatus).toBe('Pending');
    });

    test('update delivery status of order', () => {
        menuService.addItem('1', 'Burger', 5.99, 10);
        userService.addUser('user1', 50.0);
        riderSerivce.add('rider1');

        const orderId = orderService.create('user1', ['1'], null);
        system.updateDeliveryStatus(orderId, 'Out for Delivery');

        const deliveryStatus = system.getDeliveryStatus(orderId);
        expect(deliveryStatus).toBe('Out for Delivery');
    });
});
