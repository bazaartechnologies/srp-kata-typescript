import { MenuItem } from "./food-delivery-system.types";
let menuInstance: MenuService | null = null;


export class MenuService {

    constructor() {
        if (menuInstance) {
            return menuInstance;
        }
        menuInstance = this;
    }
    private menu: Map<string, MenuItem> = new Map(); // itemId -> [name, price, inventory]
    addItem(itemId: string, name: string, price: number, inventory: number): void {
        const menuItem = {
            name,
            price,
            inventory
        };
        this.menu.set(itemId, menuItem);
    }
    removeItem(itemId: string): void {
        this.menu.delete(itemId);
    }
    getMenu(): Map<string, MenuItem> {
        return this.menu;
    }
    getMenuItem(itemId: string) {
        return this.menu.get(itemId);
    }

}
