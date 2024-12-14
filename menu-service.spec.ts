import { MenuService } from "./menu-service";
import { MenuItem } from "./food-delivery-system.types";

describe('MenuService', () => {
    let system: MenuService;

    beforeEach(() => {
        system = new MenuService();
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

});