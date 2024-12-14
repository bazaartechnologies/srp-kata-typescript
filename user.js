"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const food_delivery_system_1 = require("./food-delivery-system");
class User {
    constructor() {
        this.system = new food_delivery_system_1.FoodDeliverySystem();
    }
    addUser(userId, balance) {
        this.system.userBalances.set(userId, balance);
    }
}
exports.User = User;
