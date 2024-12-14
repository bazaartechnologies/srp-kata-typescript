import { FoodDeliverySystem } from "./food-delivery-system";
import { MenuItem } from "./food-delivery-system.types";

    export class MenuOperations{
       system: FoodDeliverySystem;
       constructor(){
        this.system = new FoodDeliverySystem();
       } 
    // Menu Operations
  public addMenuItem(itemId: string, name: string, price: number, inventory: number): void {
        const menuItem = {
            name,
            price,
            inventory
        }

        this.system.menu.set(itemId, menuItem);
    }

    removeMenuItem(itemId: string): void {
        this.system.menu.delete(itemId);
    }

    getMenu(): Map<string, MenuItem> {
        return this.system.menu;
    }

}