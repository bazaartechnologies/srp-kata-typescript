import { v4 as uuidv4 } from 'uuid';
import { MenuItem } from './food-delivery-system.types';

export class MenuService {
    private menu: Map<string, MenuItem> = new Map(); // itemId -> [name, price, inventory]
    // Menu Operations
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


}
