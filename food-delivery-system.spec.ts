import { FoodDeliverySystem } from "./food-delivery-system";
import { MenuItem } from "./food-delivery-system.types";
import { MenuService } from "./menu-service";
import { RiderService } from "./riders-servies";
import { UserBalanceService } from "./user-balance-service";
import { DeliveryService } from "./delivery-service";

describe('FoodDeliverySystem', () => {
    let system: FoodDeliverySystem;
    let menuSystem: MenuService;
    let riderSystem: RiderService;
    let userBalanceSystem: UserBalanceService;
    let deliverySystem: DeliveryService;



    beforeEach(() => {
        system = new FoodDeliverySystem();
        menuSystem = new MenuService();
        riderSystem = new RiderService();
        userBalanceSystem = new UserBalanceService();
        deliverySystem = new DeliveryService(system.getOrders());
    });




    // test('add user and check balance', () => {
    //     system.addUser('user1', 50.0);
    //     const balance = system.getUserBalance('user1');

    //     expect(balance).toBe(50.0);
    // });

    test('create order successfully with sufficient balance and inventory', () => {
        menuSystem.addMenuItem('1', 'Burger', 5.99, 10);
        menuSystem.addMenuItem('2', 'Pizza', 8.99, 5);
        userBalanceSystem.addUserBalance('user1', 50.0);
        riderSystem.addRider('rider1')

        const orderId = system.createOrder('user1', ['1', '2'], null, menuSystem, riderSystem, userBalanceSystem);
        const menu = menuSystem.getMenu();

        const burger: MenuItem = menu.get('1')!
        const pizza: MenuItem = menu.get('2')!

        expect(orderId).toBeDefined();
        expect(burger.inventory).toBe(9); // Check inventory for Burger
        expect(pizza.inventory).toBe(4); // Check inventory for Pizza
    });

    test('fail to create order due to insufficient inventory', () => {
        menuSystem.addMenuItem('1', 'Burger', 5.99, 0); // No inventory
        userBalanceSystem.addUserBalance('user1', 50.0);

        expect(() => {
            system.createOrder('user1', ['1'], null, menuSystem, riderSystem, userBalanceSystem);
        }).toThrowError('Insufficient inventory for items: 1');
    });

    test('fail to create order due to insufficient balance', () => {
        menuSystem.addMenuItem('1', 'Burger', 10.0, 5);
        userBalanceSystem.addUserBalance('user1', 5.0); // Insufficient balance

        expect(() => {
            system.createOrder('user1', ['1'], null, menuSystem, riderSystem, userBalanceSystem);
        }).toThrowError('Insufficient balance.');
    });

    test('apply discount while creating order', () => {
        menuSystem.addMenuItem('1', 'Burger', 10.0, 5);
        userBalanceSystem.addUserBalance('user1', 50.0);
        riderSystem.addRider('rider1');

        const orderId = system.createOrder('user1', ['1'], 'DISCOUNT10', menuSystem, riderSystem, userBalanceSystem);
        expect(orderId).toBeDefined();
    });

    test('send notifications after placing an order', () => {
        menuSystem.addMenuItem('1', 'Burger', 5.99, 10);
        userBalanceSystem.addUserBalance('user1', 50.0);
        riderSystem.addRider('rider1');

        const orderId = system.createOrder('user1', ['1'], null, menuSystem, riderSystem, userBalanceSystem);

        // Console logs are considered notifications in this implementation.
        console.log(`Notification should be sent for order ${orderId}.`);
    });

    test('assign rider to order and check delivery status', () => {
        menuSystem.addMenuItem('1', 'Burger', 5.99, 10);
        userBalanceSystem.addUserBalance('user1', 50.0);
        riderSystem.addRider('rider1');

        const orderId = system.createOrder('user1', ['1'], null, menuSystem, riderSystem, userBalanceSystem);
        const deliveryStatus = deliverySystem.getDeliveryStatus(orderId);

        expect(deliveryStatus).toBe('Pending');
    });

    test('update delivery status of order', () => {
        menuSystem.addMenuItem('1', 'Burger', 5.99, 10);
        userBalanceSystem.addUserBalance('user1', 50.0);
        riderSystem.addRider('rider1');

        const orderId = system.createOrder('user1', ['1'], null, menuSystem, riderSystem, userBalanceSystem);
        deliverySystem.updateDeliveryStatus(orderId, 'Out for Delivery');

        const deliveryStatus = deliverySystem.getDeliveryStatus(orderId);
        expect(deliveryStatus).toBe('Out for Delivery');
    });
});
