"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rider = void 0;
const food_delivery_system_1 = require("./food-delivery-system");
class Rider {
    constructor() {
        this.system = new food_delivery_system_1.FoodDeliverySystem();
    }
    // Rider Operations
    addRider(riderId) {
        this.system.riders.push(riderId);
    }
    getRiders() {
        return this.system.riders;
    }
}
exports.Rider = Rider;
