import { FoodDeliverySystem } from "./food-delivery-system";

export class Rider {

    system: FoodDeliverySystem;
    constructor(){
        this.system = new FoodDeliverySystem();
    }
    
    // Rider Operations
    addRider(riderId: string): void {
        this.system.riders.push(riderId);
    }

    getRiders(): string[] {
        return this.system.riders;
    }
}