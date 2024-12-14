"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuOperations = void 0;
const food_delivery_system_1 = require("./food-delivery-system");
class MenuOperations {
    constructor() {
        this.system = new food_delivery_system_1.FoodDeliverySystem();
    }
    // Menu Operations
    addMenuItem(itemId, name, price, inventory) {
        const menuItem = {
            name,
            price,
            inventory
        };
        this.system.menu.set(itemId, menuItem);
    }
    removeMenuItem(itemId) {
        this.system.menu.delete(itemId);
    }
    getMenu() {
        return this.system.menu;
    }
}
exports.MenuOperations = MenuOperations;
